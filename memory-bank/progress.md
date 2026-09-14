# Progress

## Done (roadmap.md all checked)
- [x] Hero placeholder generated → replaced with user illustration
- [x] Palette, typography, layout set (Coolors palette applied via Tailwind tokens)
- [x] Header, Hero, Program (vertical timeline), RSVP form, Footer built
- [x] Build + visual verification passed
- [x] Monorepo restructure: app → `website/`, root = AGENTS.md + justfile + memory-bank + README; just modules (`just website <cmd>`); `just website test` green
- [x] Audit fixes: projectbrief stale date/venue corrected (10 aprile 2027, Villa Grant Roma — source `index.tsx`), package.json renamed `website`, Playwright suite added (7 tests, `just website e2e` green ×3)

## Working
(none)

## TODO / open
- [ ] RSVP persistence (server route, storage backend, or external form service)
- [ ] Deploy
- [ ] Optional: cleanup unused deps/components

## Decision log
- Plain controlled form over react-hook-form — fewer moving parts for one form; revisit if validation grows
- All sections in single `index.tsx` — one page, no premature splitting
- Italian-only content, no i18n
- Monorepo via just `mod` (recipe names can't contain `:`, so `just website dev` not `website:dev`)
- `git mv` for restructure — rename history preserved
