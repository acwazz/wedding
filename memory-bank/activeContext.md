# Active Context

> Last updated: 2026-09-16

## Current state
**ALL THREE PIPELINES GREEN (2026-09-16)** — workers + infra deployed live:
`infra-0.1.1`, `backend-0.1.1`, `website-0.1.0` tags all `completed success`.

- **Zone `emanuelelicia.it` was added manually to CF** (before pipeline ran) →
  `pulumi up` failed (error 1061 zone exists) → fixed via
  `pulumi import cloudflare:index/zone:Zone wedding e767a985d5eb48d7237584bf7f0e4217`
  (zone id e767a985d5eb48d7237584bf7f0e4217). Zone in state now, protected.
- **WorkersCustomDomain**: blocked by parking-era DNS (domain was parked:
  parkingcrew NS junk, A records → 104.247.81.99). Deleted apex + api A
  records (ids 350882c2…, fc1033a6…, re-creatable) → domains created.
  Parking junk (subdomain NS/MX/TXT/CAA, www) left as-is, harmless.
- **Backend wrangler.jsonc**: `compatibility_date: 2026-09-15` → py3.14
  runtime; `python_dedicated_snapshot` RESTORED (unsupported only on old
  0.26.0a2/py312; needed — FastAPI startup 1387ms > 1000ms baseline limit).
  Vendor tree re-synced for py3.14: `uv python install
  cpython-3.14.2-emscripten-wasm32-musl` + `uv run pywrangler sync --force`
  (timestamp check skips otherwise) → cp314 pydantic_core wheel. Deployed:
  8.59 MiB / gzip 2.13 MiB, startup 1804ms (dedicated snapshot OK).
- **workers_dev: false** both configs (no workers.dev subdomain on account;
  "backend" unavailable; custom domains are the targets).
- Deployed: `wedding-backend` (version 603d53f0…), `wedding-website`
  (df60c867…), custom domains apex→website + api→backend. Zone `pending`
  until registrar NS switch → **kenia.ns.cloudflare.com / sevki.ns.cloudflare.com**.
- Backend Google secrets still NOT set (`wrangler secret put` ×3 per
  backend/README.md) → RSVP POST → 502 until then.
- 2026-09-15 verify notes below remain valid for dev flow; live `wrangler dev`
  + pywrangler claims were pre-py314 — dev now runs py314 runtime too.

## Repo layout
```
/               → AGENTS.md, README.md, justfile, memory-bank/, website/, backend/
website/        → landing page: src/, e2e/, configs, own justfile + wrangler.jsonc
backend/        → CF Python Worker: src/main.py, tests/ (pytest), pyproject.toml, wrangler.jsonc
```

## Known gaps / decisions pending
- **RSVP backend live but no Google creds** → 502 on valid RSVP POST until
  secrets set (unit tests cover auth+append flow with mocks).
- No `.dev.vars` → live Google Sheets round-trip untested; e2e covers the
  website↔backend POST contract via mocks, unit tests cover Google auth+append flow.
- Unused deps removed (react-hook-form, zod, shadcn ui kit, sonner, React Query all
  gone from package.json; lucide-react kept, used in index.tsx).
- `ALLOWED_ORIGIN` var in backend wrangler.jsonc is dead — CORS hardcoded
  `allow_origins=["*"]` in main.py. Wire it or delete var.
- API behavior change (accepted): bare OPTIONS (non-preflight) now 405 (starlette)
  instead of 204; browser preflights unaffected. Preflight = 200 (starlette 1.6),
  was 204 pre-FastAPI. Website unaffected (only preflight + POST used).

## Next likely steps
1. **Registrar NS switch**: kenia.ns.cloudflare.com + sevki.ns.cloudflare.com → zone active → domains live
2. Google OAuth setup + `wrangler secret put` ×3 (`just backend deploy` re-deploy after secrets; steps in backend/README.md)
3. Verify live: `https://emanuelelicia.it` + `https://api.emanuelelicia.it/rsvp` POST
4. Optional: clean parking DNS junk (subdomain NS records, www A, MX/TXT/CAA)

## CI/CD
- `.github/workflows/release-{infra,backend,website}.yml`: deploy on tag push
  `{component}-{semver}` (glob `{component}-*`). Infra: uv + Pulumi CLI (latest,
  ≥3.142 needed for uv toolchain) + `pulumi up --stack dev --yes`. Backend:
  pytest gate + `uv run pywrangler deploy`. Website: bun install + build
  (VITE_RSVP_ENDPOINT hardcoded api.emanuelelicia.it) + `bunx wrangler deploy`.
- **Infra state = Pulumi local (file://) backend, git-backed**: `pulumi login
  file://$PWD` in `infra/` → state in `infra/.pulumi/` (committed to git;
  `.attrs`/`.bak` churn gitignored via `infra/.gitignore`). Release-infra
  commits state back to default branch after `pulumi up` (poor-man's remote
  backend). No PULUMI_ACCESS_TOKEN needed. Only repo secret: `CLOUDFLARE_API_TOKEN`.
- `PULUMI_CONFIG_PASSPHRASE=local` hardcoded (justfile export + CI env) —
  state/config hold no secrets. Rotate if real secrets ever added.
- Ceiling: concurrent infra releases race on state push (non-ff push fails
  loudly, rerun). Fine for solo project.
- `infra/justfile`: `login` recipe + deps on up/preview/destroy, `--stack dev`
  explicit. Stack `dev` bootstrapped 2026-09-16 (preview diff clean: 4 creates).

