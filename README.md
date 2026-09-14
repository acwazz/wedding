# Licia e Manu — wedding site

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS

## Development

Requires [bun](https://bun.sh) (or npm/node — same scripts work).

```sh
cd website
bun install
bun run dev
```

Or use [just](https://github.com/casey/just) from repo root (monorepo layout, app lives in `website/`):

```sh
just website dev      # install + dev server
just website build    # install + production build
just website test     # install + typecheck + lint
```
