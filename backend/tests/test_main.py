"""Unit tests for the RSVP worker: pure stdlib ASGI harness, no network."""

import json

import pytest

import main

pytestmark = pytest.mark.anyio

ENV = {
    "GOOGLE_CLIENT_ID": "id",
    "GOOGLE_CLIENT_SECRET": "secret",
    "GOOGLE_REFRESH_TOKEN": "refresh",
    "SPREADSHEET_ID": "SHEET123",
    "SHEET_RANGE": "Foglio1!A:A",
}


class FakeResponse:
    def __init__(self, payload, status=200):
        self.payload = payload
        self.status = status

    async def json(self):
        if isinstance(self.payload, (dict, list)):
            return self.payload
        raise ValueError("no json")

    async def text(self):
        return json.dumps(self.payload)


def make_fetch(calls, token_status=200, sheet_status=200):
    async def fetch(url, **init):
        calls.append({"url": url, **init})
        if "oauth2.googleapis.com/token" in url:
            if token_status != 200:
                return FakeResponse({"error": "bad"}, status=token_status)
            return FakeResponse({"access_token": "tok", "expires_in": 3600})
        return FakeResponse({"ok": True}, status=sheet_status)

    return fetch


async def asgi_call(method, path, body=None, extra_headers=()):
    """Minimal stdlib ASGI client: run the app, return (status, headers, body)."""
    raw = body if isinstance(body, bytes) else json.dumps(body or {}).encode()
    scope = {
        "type": "http",
        "asgi": {"version": "3.0"},
        "http_version": "1.1",
        "method": method,
        "scheme": "http",
        "path": path,
        "raw_path": path.encode(),
        "query_string": b"",
        "root_path": "",
        "headers": [
            (b"content-type", b"application/json"),
            (b"origin", b"http://localhost:5173"),
            *extra_headers,
        ],
        "client": ("test", 123),
        "server": ("test", 80),
        "env": ENV,
    }
    messages = []

    async def receive():
        return {"type": "http.request", "body": raw, "more_body": False}

    async def send(message):
        messages.append(message)

    await main.app(scope, receive, send)
    status = messages[0]["status"]
    headers = {
        k.decode().lower(): v.decode() for k, v in messages[0].get("headers", [])
    }
    body_out = b"".join(m.get("body", b"") for m in messages[1:])
    return status, headers, body_out


@pytest.fixture(autouse=True)
def reset_token_cache():
    main._token_cache.update({"token": None, "expires": 0.0})


def test_validate_ok():
    assert main.validate({"firstName": "A", "lastName": "B", "attending": "yes", "guests": 2}) == []
    assert main.validate({"firstName": "A", "lastName": "B", "attending": "no", "guests": 0}) == []


def test_validate_errors():
    assert main.validate({"firstName": "", "lastName": "B", "attending": "yes", "guests": 2})
    assert main.validate({"firstName": "A", "lastName": "B", "attending": "maybe", "guests": 2})
    assert main.validate({"firstName": "A", "lastName": "B", "attending": "yes", "guests": 0})


def test_build_row():
    row = main.build_row({"firstName": " A ", "lastName": "B", "attending": "yes", "guests": 2, "notes": " veg "})
    assert row[1] == "A" and row[2] == "B" and row[3] == "Sì" and row[4] == 2 and row[5] == "veg"
    assert main.build_row({"firstName": "A", "lastName": "B", "attending": "no"})[3] == "No"


def test_env_get():
    assert main.env_get(ENV, "SPREADSHEET_ID") == "SHEET123"
    assert main.env_get(ENV, "MISSING", "dflt") == "dflt"


async def test_cors_preflight():
    status, headers, _ = await asgi_call(
        "OPTIONS", "/rsvp",
        extra_headers=[(b"access-control-request-method", b"POST")],
    )
    assert status in (200, 204)
    assert headers["access-control-allow-origin"] == "*"
    assert "POST" in headers["access-control-allow-methods"]


async def test_unknown_path_404():
    status, _, _ = await asgi_call("POST", "/other")
    assert status == 404


async def test_bad_json_400():
    status, _, body = await asgi_call("POST", "/rsvp", body=b"not json")
    assert status == 400 and "JSON non valido" in body.decode()


async def test_non_dict_json_400():
    status, _, _ = await asgi_call("POST", "/rsvp", body=[1, 2])
    assert status == 400


async def test_validation_error_400():
    status, headers, body = await asgi_call(
        "POST", "/rsvp",
        body={"firstName": "", "lastName": "", "attending": ""},
    )
    assert status == 400
    assert "Nome mancante" in body.decode()
    assert headers["access-control-allow-origin"] == "*"


async def test_happy_path(monkeypatch):
    calls = []
    monkeypatch.setattr(main, "fetch", make_fetch(calls), raising=False)
    status, _, body = await asgi_call(
        "POST", "/rsvp",
        body={"firstName": "Mario", "lastName": "Rossi", "attending": "yes", "guests": 2, "notes": ""},
    )
    assert status == 200 and json.loads(body) == {"ok": True}, body
    token_call, sheet_call = calls
    assert "refresh_token=refresh" in token_call["body"]
    assert "SHEET123" in sheet_call["url"] and "append" in sheet_call["url"]
    assert sheet_call["headers"]["Authorization"] == "Bearer tok"
    values = json.loads(sheet_call["body"])["values"]
    assert len(values[0]) == 6 and values[0][3] == "Sì"


async def test_token_cache_reused(monkeypatch):
    calls = []
    monkeypatch.setattr(main, "fetch", make_fetch(calls), raising=False)
    status, _, _ = await asgi_call(
        "POST", "/rsvp",
        body={"firstName": "Mario", "lastName": "Rossi", "attending": "yes", "guests": 2},
    )
    assert status == 200
    status, _, _ = await asgi_call(
        "POST", "/rsvp",
        body={"firstName": "Anna", "lastName": "Bianchi", "attending": "no", "guests": 0},
    )
    assert status == 200
    assert len([c for c in calls if "token" in c["url"]]) == 1


async def test_sheet_failure_502(monkeypatch):
    monkeypatch.setattr(main, "fetch", make_fetch([], sheet_status=500), raising=False)
    status, _, body = await asgi_call(
        "POST", "/rsvp",
        body={"firstName": "A", "lastName": "B", "attending": "no"},
    )
    assert status == 502 and "invio non riuscito" in body.decode()


async def test_token_failure_502(monkeypatch):
    monkeypatch.setattr(main, "fetch", make_fetch([], token_status=400), raising=False)
    status, _, _ = await asgi_call(
        "POST", "/rsvp",
        body={"firstName": "A", "lastName": "B", "attending": "no"},
    )
    assert status == 502
