# Active Context

## Current state
Landing page complete per roadmap (all 5 items checked). Sections live: Header (sticky), Hero (with user illustration `src/assets/hero.png`), Program timeline, RSVP form, Footer.

## Known gaps / decisions pending
- **RSVP submissions go nowhere** — `handleSubmit` sets local success state only. No API route, no email, no DB. Needs real submission path before invitations go out.
- Unused deps: react-hook-form, zod, most shadcn ui components (boilerplate from template).
- No tests (only typecheck+lint).
- Not a git repo yet.

## Next likely steps
1. Wire RSVP to actual storage (server route + DB or form service)
2. Real venue/date verification with couple
3. Deploy (static/SSR host)
