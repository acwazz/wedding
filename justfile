default: dev

install:
    bun install

# run dev server
dev: install
    bun run dev

# production build
build: install
    bun run build

# typecheck + lint (no test framework in project yet)
test: install
    bun run typecheck
    bun run lint

# serve production build
preview: install
    bun run preview

# format code
fmt:
    bun run format
