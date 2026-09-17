mod website "website"
mod backend "backend"
mod infra "infra"

default:
    just website dev

# install repo-level tools (lefthook git hooks — run once after cloning)
install:
    bun install
