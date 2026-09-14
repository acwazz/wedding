# Active Context

> Last updated: 2026-09-14

## Current state
Repo restructured for monorepo: root keeps `AGENTS.md`, `README.md`, `justfile`, `memory-bank/`, `.gitignore`; all app code moved to `website/` via `git mv` (history preserved). `AGENTS.md` now at root defines memory-bank protocol, code style, safety rules, TDD workflow.

Landing page complete per roadmap. Sections: Header (sticky), Hero (`src/assets/hero.png`), Program timeline, RSVP form, Footer.

## Repo layout
```
/               → AGENTS.md, README.md, justfile, memory-bank/, website/
website/        → app: src/, public/, configs, own justfile
```

## Known gaps / decisions pending
- **RSVP submissions go nowhere** — `handleSubmit` sets local success state only. No API route, no email, no DB. Needs real submission path before invitations go out.
- Unused deps: react-hook-form, zod, most shadcn ui components (boilerplate from template).
- E2e suite now exists (`just website e2e`, Playwright); no unit test framework.

## Next likely steps
1. Wire RSVP to actual storage (server route + DB or form service)
2. Real venue/date verification with couple
3. Deploy (static/SSR host)
4. Future packages (API, admin, etc.): new folder + `mod <name> "<folder>"` line in root justfile
