# Progress

## Done (roadmap.md all checked)
- [x] Hero placeholder generated → replaced with user illustration
- [x] Palette, typography, layout set (Coolors palette applied via Tailwind tokens)
- [x] Header, Hero, Program (vertical timeline), RSVP form, Footer built
- [x] Build + visual verification passed

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
