# wedding-backend

RSVP backend for the wedding site. Cloudflare **Python Worker** serving a
**FastAPI** app (`POST /rsvp` → appends a row to the couple's Google Sheet),
managed with **pywrangler** (uv-based CLI for Python Workers).

## Why refresh-token flow

Python Workers can't run `cryptography` (C extension), so service-account JWT
signing is out. Instead: a one-time-generated OAuth **refresh token** is
exchanged for short-lived access tokens at runtime.

Sheet: `1EupJfXYfzT2x_XTN3hlIePJQrpxVOmJGJ59Mq3_Mst0` (set in `wrangler.jsonc`).

## Structure

- `src/main.py` — FastAPI app + `Default(WorkerEntrypoint)` fetch adapter
  (`asgi.fetch(app, ...)`, from the Workers Python SDK). Official pattern from
  cloudflare/python-workers-examples.
- `pyproject.toml` — uv manifest; runtime deps (fastapi) are vendored into
  `python_modules/` by `pywrangler sync` (auto-run by dev/deploy).
- `tests/` — pytest suite (`uv run pytest`): hits the FastAPI app through a
  minimal stdlib ASGI client, no network, <1s.
- `wrangler.jsonc` — `python_workers` + `python_dedicated_snapshot` flags,
  `main: src/main.py`.

## Google setup (one time)

1. [Google Cloud console](https://console.cloud.google.com) → create project →
   enable **Google Sheets API** → create **OAuth client ID** (any type,
   "Desktop app" works) → note client ID + secret.
2. [OAuth Playground](https://developers.google.com/oauthplayground) →
   gear icon → *Use your own OAuth credentials* → paste client ID/secret →
   scope `https://www.googleapis.com/auth/spreadsheets` → Authorize →
   Exchange authorization code → note the **refresh token**.
   Use the Google account that owns the sheet.
3. Secrets:
   ```sh
   cp .dev.vars.example .dev.vars   # local dev
   bunx wrangler secret put GOOGLE_CLIENT_ID      # production
   bunx wrangler secret put GOOGLE_CLIENT_SECRET
   bunx wrangler secret put GOOGLE_REFRESH_TOKEN
   ```

## Commands

- `just backend test` — pytest via `uv run pytest` (no network)
- `just backend dev` — pywrangler dev on `http://localhost:8787/rsvp`
- `just backend deploy` — vendor deps + deploy; final URL
  `https://wedding-backend.<account>.workers.dev/rsvp`

## Environment note (pyodide launcher)

uv's pyodide launcher (`~/.local/share/uv/python/pyodide-*/python`) passes
`--experimental-wasm-stack-switching` to Node for every version ≥ 20, but the
flag was removed in Node 24+. Patched locally to only apply it on Node 20–23;
`pywrangler sync` fails with `bad option` if uv reinstalls the launcher. Re-apply:

```sh
sed -i 's|if (major_version >= 20) {|if (major_version >= 20 \&\& major_version < 24) {|' \
  ~/.local/share/uv/python/pyodide-*/python
```

## API

`POST /rsvp` — JSON body:

```json
{ "firstName": "Mario", "lastName": "Rossi", "attending": "yes", "guests": 2, "notes": "veg" }
```

Row appended: `timestamp | nome | cognome | Sì/No | ospiti | note`.
Responses: `200 {"ok":true}` / `400 {"error":...}` (validation) / `502` (Google API failure).
CORS: handled by FastAPI `CORSMiddleware` (open `*`, POST/OPTIONS, preflight
answered 200 by starlette ≥ 1.6).

## Wiring the website

Set `VITE_RSVP_ENDPOINT` before building the site (defaults to
`http://localhost:8787/rsvp` for local dev):

```sh
VITE_RSVP_ENDPOINT=https://wedding-backend.<account>.workers.dev/rsvp bun run build
```
