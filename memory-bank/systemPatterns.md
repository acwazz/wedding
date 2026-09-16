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
- Single page app: `src/routes/index.tsx` contains ALL page sections (Header, Hero, Program, InfoUtili, Rsvp, Footer) as local components, plus the reusable `Counter` stepper (used by Rsvp for guests)
- File-based routing via TanStack Router (`src/routeTree.gen.ts` generated — don't edit)
- `src/routes/__root.tsx` root layout; SEO meta via route `head()` in index.tsx
- shadcn-style UI kit removed; page uses raw HTML + Tailwind (lucide-react icons kept)
- Entry: `src/start.ts` → `src/server.ts` (custom fetch-handler entry: wraps `@tanstack/react-start/server-entry`, normalizes h3-swallowed 500s to error page), SSR via TanStack Start + Nitro
- Workers deploy: `@cloudflare/vite-plugin` first in `vite.config.ts` plugins (`viteEnvironment: { name: "ssr" }`), `wrangler.jsonc` main `./src/server.ts` + `nodejs_compat`; build emits `dist/` + `dist/server/wrangler.json`, `wrangler deploy` auto-uses it. **Build before deploy** — without a fresh dist, wrangler falls back to raw esbuild on src/ and fails on virtual modules
- Router has `scrollRestoration: true` (`src/router.tsx`) — races native anchor jumps, so e2e asserts hash not scroll for the 2nd anchor click

## E2E tests (website/e2e/home.spec.ts, Playwright)
- 9 tests: title/hero, anchor nav, program items, mobile menu toggle, RSVP validation, RSVP success+reset (POST mocked, guests via + clicks), RSVP guest counter 0–15 stepper bounds (POST mocked; minus floor at 0, 0↔1 stepping, plus ceiling at 15, submit at 15), backend failure alert (POST mocked), declining disables guest counter
- webServer: `bun run dev` on port 5173
- **Hydration race**: `open(page)` helper waits for `window.__appReady` (set by useEffect in Home) — fills/clicks before hydration are silently lost
- Mobile nav closed state = `max-h-0 opacity-0` (NOT display:none) → assert via class, Playwright sees clipped children as visible
- Prefer id/class locators over getByLabel (substring, case-insensitive: "Nome" matches "Cognome")

## Code conventions
- TypeScript strict, React 19 function components
- Tailwind v4 (CSS-first config in `src/styles.css`); tokens: primary/background/accent/etc mapped to palette
- Fonts: `font-serif` for headings, `font-sans` body
- Italian copy, apostrophes escaped as `&apos;` in JSX
- Hero image imported as `src/assets/hero.png?url`
- Comments only for complex lines; FIXME for unfixed security issues (per AGENTS.md)

## Notable choices
- RSVP form: plain controlled `useState`, manual validation (react-hook-form/zod were removed from deps — never used); guests = `Counter` stepper component (minus/number/plus, shadcn-counter style: lucide Minus/Plus, `tw-animate-css` direction-aware slide on digit change via `key={value}` remount, `aria-live` display, buttons `type="button"` + aria-labels, bounds via disabled at min/max) — stepping range 0–15, submission still validates 1–15 (backend validates server-side too, 1–20)
- Timeline: alternating left/right on md+, stacked on mobile
- Anchor nav (`#programma`, `#rsvp`) with `scroll-mt-24` offset for sticky header
