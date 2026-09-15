"""RSVP backend: appends form submissions to a Google Sheet.

Cloudflare Python Worker serving a FastAPI app (ASGI via the `asgi`
module of the Workers Python SDK). Google auth = OAuth refresh-token
flow, because Python Workers can't run the `cryptography` package
needed for service-account JWT signing.
"""

import json
import time
import urllib.parse

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
try:
    from workers import WorkerEntrypoint
except ImportError:  # outside the Workers runtime (local tests)

    class WorkerEntrypoint:
        pass

TOKEN_URL = "https://oauth2.googleapis.com/token"
SHEETS_API = "https://sheets.googleapis.com/v4/spreadsheets"

_token_cache = {"token": None, "expires": 0.0}

app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["Content-Type"],
    max_age=86400,
)


def env_get(env, key, default=None):
    for access in (lambda: env.get(key), lambda: env[key], lambda: getattr(env, key)):
        try:
            value = access()
        except Exception:
            continue
        if value is not None:
            return value
    return default


def validate(data):
    errors = []
    first = str(data.get("firstName", "")).strip()
    last = str(data.get("lastName", "")).strip()
    attending = data.get("attending")
    guests = data.get("guests", 0)

    if not first or len(first) > 100:
        errors.append("Nome mancante o troppo lungo.")
    if not last or len(last) > 100:
        errors.append("Cognome mancante o troppo lungo.")
    if attending not in ("yes", "no"):
        errors.append("Presenza non valida.")
    if attending == "yes" and (
        not isinstance(guests, int) or guests < 1 or guests > 20
    ):
        errors.append("Numero ospiti non valido (1-20).")
    if len(str(data.get("notes", "") or "")) > 1000:
        errors.append("Note troppo lunghe.")
    return errors


def build_row(data):
    attending = data.get("attending")
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime())
    return [
        timestamp,
        str(data.get("firstName", "")).strip(),
        str(data.get("lastName", "")).strip(),
        "Sì" if attending == "yes" else "No",
        data.get("guests", 0) if attending == "yes" else 0,
        str(data.get("notes", "") or "").strip(),
    ]


async def get_access_token(fetch, client_id, client_secret, refresh_token):
    now = time.time()
    if _token_cache["token"] and now < _token_cache["expires"] - 60:
        return _token_cache["token"]

    body = urllib.parse.urlencode(
        {
            "client_id": client_id,
            "client_secret": client_secret,
            "refresh_token": refresh_token,
            "grant_type": "refresh_token",
        }
    )
    resp = await fetch(
        TOKEN_URL,
        {
            "method": "POST",
            "headers": {"Content-Type": "application/x-www-form-urlencoded"},
            "body": body,
        },
    )
    payload = await resp.json()
    token = payload.get("access_token")
    if resp.status != 200 or not token:
        raise RuntimeError(f"token endpoint error: {resp.status}")
    _token_cache["token"] = token
    _token_cache["expires"] = now + int(payload.get("expires_in", 3600))
    return token


async def append_row(fetch, env, row):
    token = await get_access_token(
        fetch,
        env_get(env, "GOOGLE_CLIENT_ID"),
        env_get(env, "GOOGLE_CLIENT_SECRET"),
        env_get(env, "GOOGLE_REFRESH_TOKEN"),
    )
    sheet_id = env_get(env, "SPREADSHEET_ID")
    sheet_range = env_get(env, "SHEET_RANGE", "Foglio1!A:A")
    url = (
        f"{SHEETS_API}/{sheet_id}/values/"
        f"{urllib.parse.quote(sheet_range, safe='')}:append"
        "?valueInputOption=RAW&insertDataOption=INSERT_ROWS"
    )
    resp = await fetch(
        url,
        {
            "method": "POST",
            "headers": {
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
            },
            "body": json.dumps({"values": [row]}),
        },
    )
    if resp.status >= 400:
        detail = await resp.text()
        raise RuntimeError(f"sheets append failed: {resp.status} {detail}")


@app.post("/rsvp")
async def rsvp(request: Request):
    try:
        data = await request.json()
    except Exception:
        return JSONResponse({"error": "JSON non valido"}, status_code=400)
    if not isinstance(data, dict):
        return JSONResponse({"error": "JSON non valido"}, status_code=400)
    errors = validate(data)
    if errors:
        return JSONResponse({"error": " ".join(errors)}, status_code=400)
    try:
        await append_row(fetch, request.scope["env"], build_row(data))
    except Exception:
        return JSONResponse({"error": "invio non riuscito"}, status_code=502)
    return JSONResponse({"ok": True})


class Default(WorkerEntrypoint):
    async def fetch(self, request):
        import asgi

        return await asgi.fetch(app, request.js_object, self.env)
