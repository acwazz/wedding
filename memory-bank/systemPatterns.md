# System Patterns

## Architecture
- Single page app: `src/routes/index.tsx` contains ALL page sections (Header, Hero, Program, Rsvp, Footer) as local components
- File-based routing via TanStack Router (`src/routeTree.gen.ts` generated — don't edit)
- `src/routes/__root.tsx` root layout; SEO meta via route `head()` in index.tsx
- shadcn-style UI kit in `src/components/ui/` — mostly unused by the page (page uses raw HTML + Tailwind)
- Entry: `src/start.ts` → `src/server.ts`, SSR via TanStack Start + Nitro

## Code conventions
- TypeScript strict, React 19 function components
- Tailwind v4 (CSS-first config in `src/styles.css`); tokens: primary/background/accent/etc mapped to palette
- Fonts: `font-serif` for headings, `font-sans` body
- Italian copy, apostrophes escaped as `&apos;` in JSX
- Hero image imported as `src/assets/hero.png?url`

## Notable choices
- RSVP form: plain controlled `useState`, manual validation, no react-hook-form/zod despite being installed
- Timeline: alternating left/right on md+, stacked on mobile
- Anchor nav (`#programma`, `#rsvp`) with `scroll-mt-24` offset for sticky header
