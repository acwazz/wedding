# System Patterns

## Repo structure (monorepo-ready)
- Root: `justfile` (just `mod website "website"`), `AGENTS.md`, `memory-bank/`, `README.md`, `.gitignore`
- `website/`: full app (src/, public/, configs, own justfile)
- New packages = new top-level folder + one `mod` line in root justfile

## Architecture (website/)
- Single page app: `src/routes/index.tsx` contains ALL page sections (Header, Hero, Program, InfoUtili, Rsvp, Footer) as local components
- File-based routing via TanStack Router (`src/routeTree.gen.ts` generated — don't edit)
- `src/routes/__root.tsx` root layout; SEO meta via route `head()` in index.tsx
- shadcn-style UI kit in `src/components/ui/` — mostly unused by the page (page uses raw HTML + Tailwind)
- Entry: `src/start.ts` → `src/server.ts`, SSR via TanStack Start + Nitro
- Router has `scrollRestoration: true` (`src/router.tsx`) — races native anchor jumps, so e2e asserts hash not scroll for the 2nd anchor click

## E2E tests (website/e2e/home.spec.ts, Playwright)
- 7 tests: title/hero, anchor nav, program items, mobile menu toggle, RSVP validation, RSVP success+reset, declining disables guests
- webServer: `bun run dev` on port 5173
- Mobile nav closed state = `max-h-0 opacity-0` (NOT display:none) → assert via class, Playwright sees clipped children as visible
- Dev server hydration is slow in parallel — prefer id/class locators over getByLabel (substring, case-insensitive: "Nome" matches "Cognome")

## Code conventions
- TypeScript strict, React 19 function components
- Tailwind v4 (CSS-first config in `src/styles.css`); tokens: primary/background/accent/etc mapped to palette
- Fonts: `font-serif` for headings, `font-sans` body
- Italian copy, apostrophes escaped as `&apos;` in JSX
- Hero image imported as `src/assets/hero.png?url`
- Comments only for complex lines; FIXME for unfixed security issues (per AGENTS.md)

## Notable choices
- RSVP form: plain controlled `useState`, manual validation, no react-hook-form/zod despite being installed
- Timeline: alternating left/right on md+, stacked on mobile
- Anchor nav (`#programma`, `#rsvp`) with `scroll-mt-24` offset for sticky header
