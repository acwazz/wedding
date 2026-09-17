# System Patterns

## Repo structure (monorepo-ready)
- Root: `justfile` (mods: `website`, `backend`, `infra`), `AGENTS.md`, `memory-bank/`, `README.md`, `.gitignore`
- `website/`: landing page (src/, public/, configs, own justfile, Playwright e2e)
- `backend/`: CF Python Worker — RSVP → Google Sheets append (entry `src/main.py`, tests `tests/`)
- `infra/`: Pulumi **Python** (`pulumi_cloudflare` v6, uv toolchain — entry `__main__.py`, deps `pyproject.toml`/`uv.lock`) — zone `emanuelelicia.it` + Workers custom domains (`wedding-website` → apex, `wedding-backend` → `api.emanuelelicia.it`); free plan; SSL = Universal SSL auto-issued, no cert resources. Workers must exist before `pulumi up` (deploy via `just website/backend deploy` first). Zone created via API → NS switch at registrar is manual.
- New packages = new top-level folder + one `mod` line in root justfile

## Backend (backend/, Cloudflare Python Worker + FastAPI)
- `src/main.py`: FastAPI app (`POST /rsvp` → validate → append row to Google Sheet) + `Default(WorkerEntrypoint)` adapter: `async def fetch(self, request): import asgi; return await asgi.fetch(app, request.js_object, self.env)` — official pattern from cloudflare/python-workers-examples. `env` reached inside routes via `request.scope["env"]`.
- CORS = FastAPI `CORSMiddleware` (open `*`, POST/OPTIONS, Content-Type, max-age 86400). Preflight → 200 (starlette 1.6); bare OPTIONS → 405 (behavior change from vanilla worker, browsers unaffected).
- deps via `pyproject.toml` → `uv run pywrangler sync` vendors to `python_modules/` (incl. SDK shims `asgi.py`), bundled on deploy (365 modules, gzip ~2.16 MiB — under 3 MiB free limit)
- `workers` SDK import needs Pyodide's `js` module → guarded with `try/except ImportError` + stub for local tests
- Google auth = **OAuth refresh-token flow** (Python Workers can't run `cryptography` → no service-account JWT). Token cached in module global ~1h
- Env: `GOOGLE_CLIENT_ID/SECRET/REFRESH_TOKEN` (secrets/.dev.vars), `SPREADSHEET_ID` (wrangler.jsonc vars), `SHEET_RANGE` (default `Foglio1!A:A`)
- Row: timestamp | nome | cognome | Sì/No | ospiti | note
- Errors: 400 validation/JSON (Italian messages), 502 Google failure; body must be JSON object (non-dict → 400, not 500)
- `tests/test_main.py`: pytest (13 tests), stdlib-only hand-rolled `asgi_call(app, method, path, body)` ASGI client (~30 lines, in test file); monkeypatches module-global `fetch` + `request.scope["env"]`; `uv run pytest`
- `pywrangler dev/deploy` = sync (vendor deps) + wrangler proxy; needs uv ≥0.12 and a pyodide-launcher patch on Node ≥24 (flag `--experimental-wasm-stack-switching` removed — re-apply cmd in backend/README.md)
- Website wires form via `RSVP_ENDPOINT` = `VITE_RSVP_ENDPOINT` env (default `http://localhost:8787/rsvp`), `submitting` state disables button, network error → alert

## Architecture (website/)
- **SolidJS SPA** (migrated from TanStack Start/React SSR 2026-09-16): `index.html` static head → `src/entry.tsx` (`render(App, #root)`, client `/invito` fallback) → `src/App.tsx` = thin composition root. No router (single page).
- **src layout** (reorg 2026-09-17): `src/sections/` = page regions, one file each (Header, Hero, Program, InfoUtili, Rsvp, Footer — each owns its section data/consts: `navLinks`, `schedule`, `IBAN` + Villa Grant coords, `RSVP_ENDPOINT`/`RSVP_ENABLED`/`Attending`); `src/components/` = reusable props-driven widgets (`Counter` stepper, `InfoIcon` badge). Cross-folder imports use the `@/` tsconfig path alias (vite `resolve.tsconfigPaths: true`); assets import as `@/assets/...`.
- **Deploy**: Workers **static assets** (`wrangler.jsonc` assets-only, SPA fallback) — no SSR worker, no Nitro, no server entry. `/invito` → HTTP 307 via `public/_redirects` (Cloudflare assets feature); entry.tsx re-checks pathname client-side for dev/hosts without _redirects.
- Solid idioms: `createSignal`/`createStore` (form), `onMount`+`onCleanup` (scroll listener, IntersectionObserver tape slap, `window.__appReady`), `<For>` (index accessor for alternating classes), `<Show keyed>` (counter digit remount = React `key` trick), `<Dynamic>` (schedule/InfoIcon lucide components), `class=`/`for=`/`onclick=`/`onInput` (text inputs — Solid has no React onChange semantics; radios use native `onChange`), `fetchpriority` attr.
- Lucide icons: `lucide-solid/icons/<kebab>` deep imports ONLY (barrel = 1500 un-prebundled dev modules → e2e timeouts; vitefu excludes `solid`-condition packages from optimizeDeps).
- Tailwind v4 (CSS-first config in `src/styles.css`); fonts: `font-serif` headings (Cormorant Garamond), `font-sans` body (Outfit); Italian copy, `&apos;` entities; images imported from `src/assets` (`?url` for hero)
- Sticky header w/ scroll-tint signal; anchor nav (`#programma`, `#info-utili`, `#rsvp`) with `scroll-mt-24` — pure native anchors now (router scrollRestoration gone)
- SEO meta = static `<head>` in `index.html` (no SSR head system); favicon in `public/`
- shadcn-style UI kit removed; page uses raw HTML + Tailwind (lucide-solid icons kept)
- `wrangler.jsonc`: assets-only + `not_found_handling: single-page-application` — `compatibility_date` is required by wrangler even with no worker code; deploy = `vite build` → `bunx wrangler deploy` (serves `dist/` as static assets)
- Stale local `.wrangler/deploy/config.json` from the SSR era redirects wrangler to the removed `dist/server/wrangler.json` → deploy fails; delete `website/.wrangler/deploy/` if that error appears (local cache only)

## E2E tests (website/e2e/, Playwright)
- 14 tests across 2 projects (config: webServer array — :5173 enabled, :5174 with `VITE_RSVP_ENABLED=false`): title/hero+deadline, anchor nav, program items, mobile menu toggle, no horizontal overflow at 320/360/375, program tape fits timeline at 320/360 (offsetParent rect check, selector `#programma div[aria-hidden="true"] > span`), RSVP validation, RSVP success+reset (POST mocked, guests via + clicks), RSVP guest counter 0–15 stepper bounds (POST mocked; minus floor at 0, 0↔1 stepping, plus ceiling at 15, submit at 15), backend failure alert (POST mocked), declining disables guest counter, /invito redirect, info-utili icons (`#info-utili .card-icon svg` count 4), disabled-RSVP spec (`e2e/disabled.spec.ts`, disabled project: banner role=status + every control disabled, no alert)
- All assertions are DOM-level → framework-agnostic: the entire suite passed **unchanged** through the React→Solid migration (SPA renders client-side; `open()` waits for `window.__appReady` set in App's `onMount`)

## Git hooks (lefthook 2.1, root)
- `package.json` (root) devDep + `postinstall: lefthook install`; `bun install` at root once per clone
- `lefthook.yml` (non-dotted name — v2 auto-creates an example `lefthook.yml` if config is only in the legacy `.lefthook.yml`): pre-commit jobs, parallel, each **skipped unless staged files match its glob** — website (`website/**` → `just website test`: typecheck+lint; e2e stays in CI, too slow for commits), backend (`backend/**` → `just backend test`: pytest), infra (`infra/**` → `just infra check`: `uv lock --check` + py_compile, no pulumi login)
- Verified: `bunx lefthook run pre-commit --all-files` → 3 jobs green (4.6s total)
- webServer: `bun run dev` on port 5173
- **Mount race**: `open(page)` helper waits for `window.__appReady` (set in App's `onMount`) — fills/clicks before mount are silently lost
- Mobile nav closed state = `max-h-0 opacity-0` (NOT display:none) → assert via class, Playwright sees clipped children as visible
- Prefer id/class locators over getByLabel (substring, case-insensitive: "Nome" matches "Cognome")

## Code conventions
- TypeScript strict, Solid 1.9 function components
- Tailwind v4 (CSS-first config in `src/styles.css`); tokens: primary/background/accent/etc mapped to palette
- Fonts: `font-serif` for headings, `font-sans` body
- Italian copy, apostrophes escaped as `&apos;` in JSX
- Hero image imported as `src/assets/hero.png?url`
- Comments only for complex lines; FIXME for unfixed security issues (per AGENTS.md)

## Notable choices
- RSVP form: `createStore` state + manual validation (react-hook-form/zod were removed from deps — never used); guests = `Counter` stepper component (minus/number/plus, shadcn-counter style: lucide Minus/Plus, `tw-animate-css` direction-aware slide on digit change via `<Show keyed>` remount, `aria-live` display, buttons `type="button"` + aria-labels, bounds via disabled at min/max) — stepping range 0–15, submission still validates 1–15 (backend validates server-side too, 1–20); prod gate: whole form wrapped in `<fieldset disabled={!RSVP_ENABLED}>` + `role="status"` banner when built with `VITE_RSVP_ENABLED=false` (CI only — dev/e2e default enabled)
- Timeline: alternating left/right on md+, stacked on mobile
- Anchor nav (`#programma`, `#rsvp`) with `scroll-mt-24` offset for sticky header
