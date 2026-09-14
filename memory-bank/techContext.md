# Tech Context

## Stack
- TanStack Start 1.168 + TanStack Router 1.170 (file-based routes) + React Query
- React 19, TypeScript 5.8
- Vite 8, Nitro (dev dep, SSR server)
- Tailwind CSS v4 (`@tailwindcss/vite`), tw-animate-css
- shadcn/ui components (Radix), lucide-react icons, sonner
- react-hook-form + zod installed but NOT used yet
- Bun (bun.lock, bunfig.toml); npm/node also work
- just 1.58 (command runner, monorepo via `mod`)
- Playwright 1.63 e2e (`@playwright/test`), Chromium browser in `~/.cache/ms-playwright`

## Commands (just, module-style)
Root justfile: `mod website "website"` — run from repo root.
- `just website dev` — install + dev server (port **5173**, not 3000)
- `just website build` — production build (outputs `website/dist/`)
- `just website test` — typecheck + lint
- `just website e2e` — Playwright suite (`website/e2e/`); first run needs `bunx playwright install chromium`
- `just website preview` — serve production build
- `just website fmt` — prettier

Direct: `cd website && bun run dev|build|lint|format|typecheck`

## Config files (all under `website/`)
- `eslint.config.js`, `tsconfig.json` (strict, `noPropertyAccessFromIndexSignature` → use `process.env["X"]`), `vite.config.ts`, `components.json` (shadcn), `bunfig.toml`, `bun.lock`, `playwright.config.ts`
- `rolldown` pinned to 1.2.1 via overrides
- Root `.gitignore` covers nested dirs (patterns match at any depth)
