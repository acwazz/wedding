# Progress

## Done
- [x] Hero placeholder generated → replaced with user illustration
- [x] Palette, typography, layout set (Coolors palette applied via Tailwind tokens)
- [x] Header, Hero, Program (vertical timeline), RSVP form, Footer built
- [x] Build + visual verification passed
- [x] Monorepo restructure: app → `website/`, root = AGENTS.md + justfile + memory-bank + README; just modules (`just website <cmd>`); `just website test` green
- [x] Audit fixes: projectbrief stale date/venue corrected (10 aprile 2027, Villa Grant Roma — source `index.tsx`), package.json renamed `website`, Playwright suite added (7 tests, `just website e2e` green ×3)
- [x] RSVP backend: `backend/` CF Python Worker → Google Sheets append (refresh-token flow), unit tests green, form wired via `VITE_RSVP_ENDPOINT`, e2e 8 tests (mocked POST) green ×4
- [x] CF Workers release-readiness verified (2026-09-15): backend entry modernized + `python_workers` flag + live `wrangler dev` smoke green; website wired with `@cloudflare/vite-plugin` + own `wrangler.jsonc`, deploy dry-run (983 KiB) + live workerd SSR (200, full HTML) + e2e 8/8 green
- [x] Backend migrated to FastAPI on pywrangler (2026-09-15, session 2): `src/worker.py` FastAPI app + `Default(WorkerEntrypoint)`/asgi adapter (official pattern); deps via `pyproject.toml` → `pywrangler sync` → `python_modules/` vendored (365 modules, 8.46 MiB / gzip 2.16 MiB dry-run); tests rewritten as stdlib ASGI harness (TDD red→green); `pywrangler dev` live smoke green (preflight 200, bad JSON 400, valid 502-no-creds); justfile dev/deploy → `uv run pywrangler`; uv 0.12.15 (user-upgraded) + one-line patch to uv's pyodide launcher for Node 26

- [x] Dep/component cleanup done (before 2026-09-15 verify): react-hook-form, zod, React Query, sonner, shadcn ui kit, components.json removed; lucide-react kept
- [x] Memory-bank verified against repo (2026-09-15): backend pytest 13/13 (0.36s), website typecheck+lint clean, e2e 8/8 (14s) — all green; stale entries fixed (src/worker.py→src/main.py, test_worker.py→tests/, removed-deps claims)
- [x] infra/ Pulumi scaffold (2026-09-15): Zone `emanuelelicia.it` (free) + WorkersCustomDomain apex→wedding-website, api.→wedding-backend; SSL auto (Universal SSL + custom-domain certs), no cert resources; `just infra up/preview/destroy`
- [x] infra/ migrated TS → Python/uv (2026-09-16): `@pulumi/cloudflare` JS stack deleted (index.ts/package.json/bun.lock/node_modules); now `__main__.py` + `pyproject.toml` (`pulumi-cloudflare>=6,<7` → 6.20.0) + `uv.lock`, `Pulumi.yaml` runtime `python` + `toolchain: uv`; args verified against SDK (Zone: account/name/type; WorkersCustomDomain: account_id/zone_id/hostname/service); py_compile + `uv lock --check` green; justfile install recipe dropped (Pulumi's uv toolchain self-installs deps)
- [x] Release pipelines (2026-09-16): `.github/workflows/release-{infra,backend,website}.yml` on tag `{component}-{semver}`; YAML lint green; needs `CLOUDFLARE_API_TOKEN` + `PULUMI_ACCESS_TOKEN` repo secrets
- [x] Pulumi state moved to local file:// backend, git-backed (2026-09-16): `pulumi login file://$PWD` (infra/justfile `login` recipe + CI step), state in `infra/.pulumi/` committed (attrs/bak ignored), `PULUMI_CONFIG_PASSPHRASE=local` (no secrets in state), stack `dev` bootstrapped, `just infra preview` green (4 creates), PULUMI_ACCESS_TOKEN dropped from CI
- [x] Pre-push audit (2026-09-16): secret scan of staged diff + tracked files clean (no cred files tracked; backend creds live in wrangler secrets, main.py reads env only; GHAS scan unavailable — manual grep patterns); full suite green (backend 13/13 0.24s, typecheck+lint clean, e2e 8/8 12.9s); README updated (CI releases section, local-state note replaces stale stack-init line)
- [x] Full deploy + pipeline fix (2026-09-16): zone import (error 1061 — zone existed), backend re-vendored for py314 (compat_date 2026-09-15 + dedicated snapshot restored + `uv python install cpython-3.14.2…` + `sync --force`; old 3.12 wheels ImportError, old runtime startup 1387ms>1000ms), workers_dev false both, parking A records (apex/api) deleted → custom domains created; workers wedding-backend + wedding-website live; tags infra-0.1.1 / backend-0.1.1 / website-0.1.0 ALL GREEN; registrar NS switch pending
- [x] RSVP end-to-end LIVE (2026-09-16, session 2): zone active (NS switched), Google OAuth secrets set, fixed py3.14 fetch breakage (SDK import + kwargs call style, `rsvp failed:` tail logging), live `POST /rsvp` → 200 → Sheet row; commit ab7c225, tag backend-0.1.2 green. OAuth gotchas recorded in activeContext (playground redirect URI WITHOUT slash, Web application client type)
- [x] Cleanup (2026-09-16): dead `ALLOWED_ORIGIN` var removed (backend-0.1.3 green); 36 parking DNS records deleted (subdomain NS, www A, MX/TXT/CAA, www NS) — zone now holds only the 2 WorkersCustomDomain AAAA records; apex + api verified 200 after cleanup
- [x] **0.2.0 milestone released** (2026-09-16): `infra-0.2.0` / `backend-0.2.0` / `website-0.2.0` all green — stack complete, live end-to-end (no component diffs vs prior tags; milestone release records)
- [x] RSVP 404 bug fixed (2026-09-16, backend-0.2.1 green): SPREADSHEET_ID typo in wrangler.jsonc (`hlQeI…` → real sheet `hlIeP…`) — appends had gone to a different/deleted sheet; live POST 200 ×2, form working. NOTE: deleted typo-ID sheet in Drive trash may hold earlier test rows
- [x] New monogram applied (2026-09-16, website-0.2.1 green): `src/assets/monogram.png` (320×270, RGB white bg) wired into header/footer (import switched from `monogram-transparent.png`, CSS `w-auto` keeps aspect); favicon.ico (48/32/16 multi-size) + `monogram-transparent-192` (white keyed out) + `monogram-white-192` (white silhouette w/ alpha) regenerated via ImageMagick. `monogram-transparent.png` now unused (kept), `monogram-old.png` = user backup

## Working
- [ ] Release pipelines smoke test: push tag `website-0.0.1` (or dry) after `CLOUDFLARE_API_TOKEN` + `PULUMI_ACCESS_TOKEN` repo secrets set

## TODO / open
- [x] ~~Registrar NS switch~~ done (zone active)
- [x] ~~Google OAuth + secrets + backend deploy~~ done (live 200)
- [x] ~~Live Google Sheets round-trip~~ done 2026-09-16
- [x] ~~Parking DNS junk cleanup + dead ALLOWED_ORIGIN~~ done 2026-09-16
- [ ] pyodide launcher patch may need re-apply if uv reinstalls pyodide dist (cmd in backend/README.md; only for local Node 24+ dev — CI Node 20/22 unaffected)

## Decision log
- Plain controlled form over react-hook-form — fewer moving parts for one form; revisit if validation grows
- All sections in single `index.tsx` — one page, no premature splitting
- Italian-only content, no i18n
- Monorepo via just `mod` (recipe names can't contain `:`, so `just website dev` not `website:dev`)
- `git mv` for restructure — rename history preserved
- Backend entry: `Default(WorkerEntrypoint)` class (current runtime requirement; legacy `on_fetch` silently produces "no fetch handler")
- Backend framework: FastAPI (user request) via official ASGI adapter pattern; deps vendored by pywrangler sync into `python_modules/` — deploy path is `uv run pywrangler deploy` (wrangler alone can't resolve fastapi imports without the vendored tree)
- Backend validation: reuse plain `validate()` fn with Italian messages inside the FastAPI route instead of pydantic models — keeps API contract (400 + joined messages) and tests intact
- pyodide launcher: patched uv's pyodide shim (Node ≥24 drops the wasm flag) rather than downgrading Node — one line, re-apply cmd in backend/README.md
- Website deploy: `@cloudflare/vite-plugin` + `wrangler deploy` (official TanStack Start→Workers path; custom `src/server.ts` entry kept as documented "custom entrypoint")
- `find_additional_modules` removed from backend wrangler.jsonc after pywrangler migration — `python_modules/` vendor tree must be auto-discovered; `.venv` no longer bundled once vendor tree present
