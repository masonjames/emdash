# Mason EmDash fork maintenance

The fork carries one GitHub Actions workflow:
`.github/workflows/mj-sync-upstream.yml`. Every workflow inherited from
`emdash-cms/emdash` is deleted on the production branch and disabled in the
repository settings. There is no CLA workflow and no workflow that runs on pull
requests, comments, reviews, pushes, or contributor activity.

## Release flow

1. The watcher polls GitHub Releases every six hours and selects only stable
   product tags matching `emdash@x.y.z`. Package releases such as
   `@emdash-cms/admin@x.y.z` are ignored.
2. `docs/operations/mj-upstream-release.json` records the exact upstream
   product tag and commit already represented by `mj/prod`.
3. A read-only job calculates the incremental Git diff between the tracked
   product release and the new one. The upstream `.github` directory is
   excluded before any candidate is created.
4. A separate publication job checks out the exact same production base,
   independently recreates the candidate, and requires the Git tree to match.
   It never installs dependencies or executes upstream code.
5. The candidate is committed once as `github-actions[bot]` and opened as
   a draft pull request. Original upstream commits and authors are not copied
   into the downstream PR, so no contributor list is available for a CLA or
   notification bot to process.
6. The workflow never merges the PR, writes `mj/prod`, updates the fork's
   `main` branch, vendors the website, or deploys production.

The production review must still confirm Mason's carried media behavior,
including button uploads, drag-and-drop uploads, R2 URLs, and editable media
metadata. Upstream CI covers upstream code; the fork's live deployment gate
covers the downstream integration.

## Repository settings

- Default workflow token permission: read-only.
- GitHub Actions cannot approve pull requests.
- Only pinned GitHub-owned actions are allowed.
- All historical inherited workflows remain manually disabled.
- `MJ_SYNC_TOKEN` is exposed only to the publication step. Keep it scoped
  to Contents and Pull requests for `masonjames/emdash`; it does not need
  Actions, Workflows, Issues, or Administration permission because upstream
  `.github` changes are excluded.

The Cloudflare Workers and Pages GitHub App is not a GitHub Actions workflow.
It must not be connected to this source fork; production is deployed through
the Mason website/Dokploy path.

## Local verification

```bash
node --test scripts/mj/tests/fork-policy.test.mjs
scripts/mj/sync-upstream.sh
```

The policy test fails if a second workflow, a contributor-facing trigger, an
unpinned/non-GitHub action, or upstream bot configuration is reintroduced.
