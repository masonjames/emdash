#!/usr/bin/env bash
# add-pr.sh <num> — pull upstream PR <num> into the deployable mj/prod branch.
# See masonjames.com docs/prd/emdash-production/prd.md AD-2.
set -euo pipefail

if [[ $# -lt 1 || ! "$1" =~ ^[0-9]+$ ]]; then
  echo "usage: $0 <upstream-pr-number>" >&2
  exit 1
fi

cd "$(git rev-parse --show-toplevel)"

if [[ -n "$(git status --porcelain)" ]]; then
  echo "error: working tree is dirty; commit or stash first" >&2
  exit 1
fi

git fetch origin "pull/$1/head:pr-$1"
git checkout mj/prod
git merge --no-ff "pr-$1" -m "merge: upstream PR #$1"

echo "PR #$1 merged into mj/prod. Build/test, then push masonjames-fork mj/prod."
