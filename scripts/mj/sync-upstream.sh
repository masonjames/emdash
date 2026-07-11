#!/usr/bin/env bash
# Dispatch the clean-runner upstream preparation workflow. This entrypoint is
# deliberately safe in dirty/shared checkouts: it never fetches, checks out,
# merges, commits, or pushes from the local repository.
set -euo pipefail

RECHECK=false
case "${1:-}" in
	--recheck)
		RECHECK=true
		shift
		;;
	--force-build)
		echo "warning: --force-build is deprecated; the sync lane never executes candidate builds. Using --recheck." >&2
		RECHECK=true
		shift
		;;
esac
if [[ $# -ne 0 ]]; then
	echo "usage: $0 [--recheck]" >&2
	exit 2
fi
if ! command -v gh >/dev/null 2>&1; then
	echo "error: GitHub CLI (gh) is required" >&2
	exit 1
fi

gh workflow run mj-sync-upstream.yml \
	--repo masonjames/emdash \
	--ref mj/prod \
	--field "recheck=$RECHECK"

echo "Dispatched the PR-only EmDash upstream workflow."
echo "Follow: https://github.com/masonjames/emdash/actions/workflows/mj-sync-upstream.yml"
