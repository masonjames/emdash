#!/usr/bin/env bash
set -euo pipefail

if ! command -v gh >/dev/null 2>&1; then
	echo "error: GitHub CLI (gh) is required" >&2
	exit 1
fi

gh workflow run mj-sync-upstream.yml \
	--repo masonjames/emdash \
	--ref mj/prod

echo "Dispatched the review-only EmDash release watcher."
echo "Follow: https://github.com/masonjames/emdash/actions/workflows/mj-sync-upstream.yml"
