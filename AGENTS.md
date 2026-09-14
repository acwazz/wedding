# Agent Rules

## Project Context
You are an expert Software developer.

## Memory Bank
The `memory-bank/` directory at the project root is the **persistent knowledge
base** for this project. It MUST be read at the start of every session and kept
up-to-date throughout the conversation.

### Files and their purpose
| File | Contains |
|---|---|
| `memory-bank/projectbrief.md` | Project purpose, goals, non-goals |
| `memory-bank/productContext.md` | Why project exists, audience, UX goals |
| `memory-bank/techContext.md` | Full tech stack, dependencies, tooling |
| `memory-bank/systemPatterns.md` | Architecture, module map, design patterns |
| `memory-bank/activeContext.md` | Current focus, known issues, env vars |
| `memory-bank/progress.md` | What works, what is pending/TODO |

### Rules
1. **Always read** `memory-bank/activeContext.md` and `memory-bank/progress.md`
   before starting any task. Read the other files when the task involves the
   corresponding area (e.g. read `systemPatterns.md` before touching
   architecture or modules).
2. **Update `memory-bank/activeContext.md`** at the end of every session or
   after any significant change (new feature, bug fix, refactor, decision).
   Always update the `> Last updated:` date.
3. **Update `memory-bank/progress.md`** whenever:
   - A feature, endpoint, or test is completed (move to "What Is Working").
   - A new TODO or bug is discovered (add to the relevant pending section).
4. **Update `memory-bank/systemPatterns.md`** when any new module, class,
   design pattern, or architectural decision is introduced.
5. **Update `memory-bank/techContext.md`** when dependencies change
   (`pyproject.toml` edits) or new tools/commands are added.
6. **Update `memory-bank/projectbrief.md`** only when the project's core
   purpose or goals change.


## Agent Workflow

### Code style
- Avoid at all cost explaining code through comments, do it only when the line of code is very complex.
- Always comment with a FIXME security issues when is not possible to fix it.

### Agent Safety & Boundaries
- Never execute destructive operations (delete, drop, truncate, force-push) without explicit user confirmation.
- Never commit secrets, credentials, API keys, or `.env` files — always use environment variables or secret managers.
- Always create backups or branches before destructive operations — `git stash` or `git branch backup` before risky refactors.
- Don't install system-level dependencies or modify global configuration without asking first.
- When running shell commands, explain what each command does before executing it.
- Prefer reversible actions over irreversible ones — soft-delete over hard-delete, new migration over ALTER.
- Use `--dry-run` or `--check` flags when available to preview destructive operations.
- Write the failing test first, then implement the minimum code to pass, then refactor — never skip the red-green-refactor cycle.
- Run the full test suite after each refactor step to ensure nothing broke — tests are your safety net for aggressive refactoring.
- Keep tests fast (under 1 second each) — slow tests break the TDD feedback loop and discourage frequent test runs.
- Use the Arrange-Act-Assert pattern: set up data, perform the action, verify the result.
- Isolate the unit under test by replacing collaborators with fakes or stubs so each test validates one behavior.
- Maintain test coverage above 80% for business logic — focus on complex and risky code.
