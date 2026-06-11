#!/usr/bin/env bash
# sync-upstream.sh — mirror upstream main to the fork and merge it into mj/prod.
# Run weekly or on demand from the repo root. See masonjames.com
# docs/prd/emdash-production/prd.md AD-2 for the branching model.
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

if [[ -n "$(git status --porcelain)" ]]; then
  echo "error: working tree is dirty; commit or stash first" >&2
  exit 1
fi

git fetch origin

# Fast-forward-only mirror: fork main never diverges from upstream.
git push masonjames-fork origin/main:main

git checkout mj/prod
git merge origin/main

# Prove the merged branch before publishing it.
pnpm install
pnpm build
pnpm test

git push masonjames-fork mj/prod

echo "mj/prod synced to upstream $(git rev-parse --short origin/main) and pushed."
