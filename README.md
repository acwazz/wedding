# Licia e Manu — wedding site

Wedding landing page + RSVP backend, deployed on Cloudflare Workers.

## Layout

```
website/   → landing page (TanStack Start + React + Tailwind)
backend/   → RSVP API (FastAPI on CF Python Workers → Google Sheets)
infra/     → Cloudflare zone + custom domains (Pulumi, Python/uv)
```

## Development

Requires [bun](https://bun.sh) (website) and [uv](https://docs.astral.sh/uv/) (backend).
Run everything through [just](https://github.com/casey/just) from repo root:

```sh
just website dev      # install + dev server (port 5173)
just website build    # install + production build
just website test     # install + typecheck + lint
just website e2e      # Playwright suite

just backend dev      # pywrangler dev on :8787 (needs .dev.vars with Google creds)
just backend test     # pytest unit tests
just backend deploy   # vendor deps + deploy worker

just infra preview    # pulumi preview
just infra up         # pulumi up (zone + custom domains)
```

## Deploy order

1. Backend secrets (Google OAuth — steps in `backend/README.md`), then `just backend deploy`
2. `VITE_RSVP_ENDPOINT=https://api.emanuelelicia.it/rsvp just website deploy`
3. `just infra up` — requires both workers to exist; export NS and set them at the registrar

Pulumi CLI (≥3.142, for uv toolchain) and `CLOUDFLARE_API_TOKEN` env required for infra.
First `pulumi` run needs a stack: `cd infra && pulumi stack init dev` (or `select`).
