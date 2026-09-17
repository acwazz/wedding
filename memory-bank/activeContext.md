# Active Context

> Last updated: 2026-09-17

## Current state
- **InfoUtili card headers restyled (2026-09-17, session 8)**: icons now sit
  **left of each card title** (icon badge + h3 in `flex items-center gap-4`
  row, `mt-4` dropped from h3, badge got `shrink-0`) in all 4 cards — TDD,
  new e2e `info utili icons sit left of the card titles` (geometric check:
  icon right ≤ title left + vertical overlap) red→green, suite **15/15**,
  mobile overflow guards still green, typecheck+lint clean. Released with the
  migration as `website-0.4.0`, live-verified.
- **Website migrated React → SolidJS + lefthook pre-commit added (2026-09-17,
  session 7)**: TanStack Start/React SSR → **SolidJS 1.9 SPA**, client-rendered
  and served as **Workers static assets** (assets-only `wrangler.jsonc` +
  `public/_redirects` `/invito` → 307; client fallback in `entry.tsx`).
  SSR worker bundle 983 KiB → **19 KiB gzip** static JS. ALL React deps removed
  (react, react-dom, @tanstack/*, @types/react*, @vitejs/plugin-react,
  eslint-plugin-react-hooks/-refresh, @cloudflare/vite-plugin, vaul, rolldown
  override); added solid-js, lucide-solid (deep imports only), vite-plugin-solid.
  Root **lefthook** pre-commit, glob-gated per component: website→typecheck+lint,
  backend→pytest, infra→uv lock+py_compile. Post-migration fixes found by
  dry-run: missing `compatibility_date` in wrangler.jsonc (CI deploy would have
  failed) + stale `.wrangler/deploy/config.json` SSR redirect (deleted, local
  cache). Full suite green: typecheck+lint, build, e2e 14/14 (specs unchanged,
  framework-agnostic), pytest 13/13, infra check, `lefthook run pre-commit
  --all-files` 3/3. Released with the InfoUtili icon change as
  **`website-0.4.0`** — pipeline green (run 35198732552, 2026-09-17),
  live-verified (apex 200, `/invito` → 307, bundle = new Solid SPA:
  `card-icon`/`shrink-0` + RSVP-disabled banner present, no React/TanStack).
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
- RSVP guests field (2026-09-16, session 3): range is now **1–15** and nothing
  is enforced while typing — onChange keeps raw value (`parseInt||0`, no
  `Math.max` clamp), validation only on submit ("tra 1 e 15"). e2e 9/9,
  typecheck+lint clean. **Backend deliberately left at 1–20** (user decision
  2026-09-16 — website-only enforcement, API stays lenient). Released as
  `website-0.2.4`, live-verified (max=15 input + new helper text on
  emanuelelicia.it, HTTP 200).
- RSVP guests UI (2026-09-16, session 4): number input replaced by `Counter`
  stepper component (user request, shadcn.io/counter style: minus/number/plus,
  sliding digit animation via tw-animate-css, no new deps — Framer Motion
  deliberately not added). Steps 0–15 (buttons disabled at bounds), 1 is never
  auto-enforced (0 reachable, submit validation "tra 1 e 15" unchanged),
  whole counter disabled when declining. e2e 9/9, typecheck+lint clean,
  SSR markup verified. Released as `website-0.2.5`, live-verified (counter
  markup on emanuelelicia.it).
- Card-ready changes (2026-09-16, session 5): RSVP deadline now **15 febbraio
  2027**; RSVP form **disabled in prod** (`VITE_RSVP_ENABLED="false"` in
  release-website.yml build env → `RSVP_ENABLED` gate → `<fieldset disabled>`
  + banner "A breve potrai confermare la tua presenza…" — dev/e2e unaffected,
  flip the workflow env + retag to re-enable); **`/invito` route** (beforeLoad
  redirect → `/`, participation cards print that URL — FE redirect, SSR 30x);
  InfoUtili cards got lucide icon badges (Shirt/Gem/Landmark/MapPin via
  `InfoIcon`). e2e 12/12 (new disabled spec on 2nd dev server :5174),
  typecheck+lint clean. Released as `website-0.3.0`, live-verified (form
  disabled + banner, deadline text, 4 card icons, `/invito` → HTTP 307 → `/`).
- Small-screen polish (2026-09-16, session 6): "in arrivo" tape was ~330px
  wide → **5px horizontal scroll at 320px** — mobile now `text-3xl
  tracking-[0.2em] px-6 py-3` (desktop unchanged via `md:`); hero h1
  `text-4xl sm:text-5xl md:text-7xl` (was text-5xl — wrapped raggedly on
  ≤375px phones). New e2e guards: no-overflow at 320/360/375 + tape-fits-
  timeline at 320/360 (offsetParent rect check). e2e 14/14, typecheck+lint
  clean. Released as `website-0.3.1`, live-verified (tape + hero classes in
  prod HTML).

## Repo layout
```
/               → AGENTS.md, README.md, justfile, memory-bank/, website/, backend/
website/        → SolidJS SPA landing page: src/, e2e/, configs, own justfile + wrangler.jsonc
backend/        → CF Python Worker: src/main.py, tests/ (pytest), pyproject.toml, wrangler.jsonc
```

## Known gaps / decisions pending
- OpenCode env (2026-09-16, later session): global plugins `@dietrichgebert/ponytail@4.10.0`
  and `opencode-caveman` fail to load on every server start (WARN in
  `~/.local/share/opencode/log/opencode.log`, e.g. ref err_9e3f9a47) — both implement
  the **V1** plugin API (function/object default export) while the running server is
  OpenCode **V2** (2.0.3), which requires `Plugin.define({ id, setup })`. Upstream:
  ponytail issue #863 + PR #864 (V2 support) open, not yet released. Not a wedding-repo
  issue (config lives in `~/.config/opencode/opencode.jsonc`, key `plugin`). Fix options
  presented to user; no action taken yet.
- ~~RSVP backend live but no Google creds~~ **DONE 2026-09-16**: OAuth secrets set
  (GOOGLE_CLIENT_ID/SECRET/REFRESH_TOKEN), live round-trip green
  (`POST /rsvp` → 200 → Sheet row). Whole stack LIVE end-to-end.
- py3.14 runtime notes: global `fetch` gone → `from workers import fetch`
  (guarded for tests, tests monkeypatch `main.fetch`); SDK fetch takes
  kwargs (`fetch(url, method=..., headers=..., body=...)`) not positional
  init dict — test fakes updated (`**init`). 502 path now logs
  `rsvp failed: <exc>` to `wrangler tail` (safe: no secrets in messages).
- OAuth setup gotchas (user hit all): consent screen test user needed;
  client must be **Web application** with redirect URI
  `https://developers.google.com/oauthplayground` (NO trailing slash —
  that's what playground sends; slash variant optional extra).
- No `.dev.vars` → live Google Sheets round-trip untested; e2e covers the
  website↔backend POST contract via mocks, unit tests cover Google auth+append flow.
- ~~Unused deps removed (react-hook-form, zod, shadcn ui kit, sonner, React Query)~~
  superseded by the SolidJS migration: **ALL React/TanStack deps gone** from
  website/package.json (react, react-dom, @tanstack/*, @types/react*,
  @vitejs/plugin-react, eslint-plugin-react-hooks/-refresh,
  @cloudflare/vite-plugin, vaul, rolldown override); icons now lucide-solid
  deep imports.
- `ALLOWED_ORIGIN` var in backend wrangler.jsonc is dead — CORS hardcoded
  `allow_origins=["*"]` in main.py. Wire it or delete var.
- API behavior change (accepted): bare OPTIONS (non-preflight) now 405 (starlette)
  instead of 204; browser preflights unaffected. Preflight = 200 (starlette 1.6),
  was 204 pre-FastAPI. Website unaffected (only preflight + POST used).

## Next likely steps
- When the couple is ready to receive RSVPs: flip `VITE_RSVP_ENABLED` to
  `"true"` (or remove it) in `.github/workflows/release-website.yml` and retag
  `website-*` — the form goes live; deadline shown is 15 febbraio 2027.
  (Backend stays 1–20 guests per user decision 2026-09-16.)

## CI/CD
- `.github/workflows/release-{infra,backend,website}.yml`: deploy on tag push
  `{component}-{semver}` (glob `{component}-*`). Infra: uv + Pulumi CLI (latest,
  ≥3.142 needed for uv toolchain) + `pulumi up --stack dev --yes`. Backend:
  pytest gate + `uv run pywrangler deploy`. Website: bun install + build
  (VITE_RSVP_ENDPOINT hardcoded api.emanuelelicia.it; VITE_RSVP_ENABLED="false"
  → RSVP form disabled in prod) + `bunx wrangler deploy`.
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

