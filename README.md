# Licia e Manu — wedding site

Wedding landing page + RSVP backend, deployed on Cloudflare Workers.

## Layout

```
website/   → landing page (SolidJS SPA + Tailwind, served as Workers static assets)
backend/   → RSVP API (FastAPI on CF Python Workers → Google Sheets)
infra/     → Cloudflare zone + custom domains (Pulumi, Python/uv)
```

## Development

Requires [bun](https://bun.sh) (website) and [uv](https://docs.astral.sh/uv/) (backend).
Run everything through [just](https://github.com/casey/just) from repo root:

```sh
just install          # once after cloning: installs lefthook git hooks
just website dev      # install + dev server (port 5173)
just website build    # install + production build
just website test     # install + typecheck + lint
just website e2e      # Playwright suite

just backend dev      # pywrangler dev on :8787 (needs .dev.vars with Google creds)
just backend test     # pytest unit tests
just backend deploy   # vendor deps + deploy worker

just infra check      # uv lock check + entry syntax (no pulumi login)
just infra preview    # pulumi preview
just infra up         # pulumi up (zone + custom domains)
```

## Git hooks (lefthook)

Pre-commit runs per-component validation, only for the components you touched
(config in `lefthook.yml`): website → typecheck + lint, backend → pytest,
infra → lock check + py_compile. Run `bun install` at the repo root once after
cloning to activate the hooks.

## Deploy order

1. Backend secrets (Google OAuth — steps in `backend/README.md`), then `just backend deploy`
2. `VITE_RSVP_ENDPOINT=https://api.emanuelelicia.it/rsvp just website deploy`
3. `just infra up` — requires both workers to exist; export NS and set them at the registrar

Infra needs Pulumi CLI (≥3.142, for uv toolchain) and `CLOUDFLARE_API_TOKEN` in env.
Pulumi state is local (`file://` backend in `infra/.pulumi/`, committed to git);
the `just infra` recipes log in automatically — stack `dev` is already bootstrapped.

## Releases (CI)

Push a tag `{component}-{semver}` to deploy via GitHub Actions:

```sh
git tag backend-0.0.1 && git push origin backend-0.0.1   # pytest gate + worker deploy
git tag website-0.0.1 && git push origin website-0.0.1   # build + worker deploy
git tag infra-0.0.1   && git push origin infra-0.0.1     # pulumi up, state committed back
```

Requires the `CLOUDFLARE_API_TOKEN` repo secret. Infra state is committed back
to the default branch after each apply (local git-backed backend — don't run
concurrent infra releases).
