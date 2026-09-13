# Tech Context

## Stack
- TanStack Start 1.168 + TanStack Router 1.170 (file-based routes) + React Query
- React 19, TypeScript 5.8
- Vite 8, Nitro (dev dep, SSR server)
- Tailwind CSS v4 (`@tailwindcss/vite`), tw-animate-css
- shadcn/ui components (Radix), lucide-react icons, sonner
- react-hook-form + zod installed but NOT used yet
- Bun (bun.lock, bunfig.toml); npm/node also work

## Commands (justfile)
- `just dev` — install + dev server
- `just build` — production build (outputs `dist/`)
- `just test` — typecheck + lint (NO test framework exists)
- `just fmt` — prettier

Direct: `bun run dev|build|lint|format|typecheck`

## Config files
- `eslint.config.js`, `tsconfig.json`, `vite.config.ts`, `components.json` (shadcn)
- `rolldown` pinned to 1.2.1 via overrides
