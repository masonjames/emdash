# Mason fork upstream maintenance

`mj/prod` is the production source branch for Mason's EmDash builds. It is not
an automatically writable mirror: upstream changes must arrive through a
reviewed pull request, and the branch must pass the dedicated production gate
before it can notify the site-vendoring lane.

## Automated flow

1. `.github/workflows/mj-sync-upstream.yml` runs weekly on clean GitHub-hosted
   runners. A read-only preparation job fetches `emdash-cms/emdash:main` and
   records the candidate Git tree without receiving a write credential. Both
   scheduled and manual runs reject any workflow ref other than `mj/prod`.
2. The workflow never pushes `mj/prod`, never merges its own pull request, and
   never resolves a merge conflict. A separate publication job checks out the
   exact recorded `mj/prod` commit, repeats the merge using Git only, requires
   the upstream tip and candidate tree to match preparation, and then opens a
   pull request. No code from the merged candidate executes in that job.
3. Conflict, preparation, and publication failures are reported from separate
   issues-only jobs. Each checks out the exact recorded production commit before
   running the reporter, reasserts assignment and labels, and leaves the
   maintenance run red.
4. `.github/workflows/mj-production-ci.yml` is the required check for pull
   requests targeting `mj/prod`. It validates the patch ledger, frozen install,
   build, lint, typecheck, unit/browser tests, and targeted patch E2E coverage.
5. After a human merges the pull request, the same production workflow verifies
   the exact branch commit again and emits `emdash-source-evidence.json`. The
   evidence contains the full commit, Git tree, archive SHA-256, patch-ledger
   SHA-256, and workflow run identity.
6. When `MASON_SITE_VENDOR_DISPATCH_ENABLED` is explicitly set to `true`, the
   successful production run sends a `repository_dispatch` event named
   `emdash_verified_for_vendoring` to `masonjames/masonjames.com`. Client/site
   mutation remains disabled until that variable and its scoped credential are
   deliberately configured.

## Credentials and branch protection

- `MJ_SYNC_TOKEN` is required for candidate branch pushes and pull-request
  creation. It must be a narrowly scoped token or GitHub App credential that can
  write contents, workflows, and pull requests in `masonjames/emdash`. A token
  outside `GITHUB_TOKEN` is intentional so the created pull request triggers its
  checks. It is exposed only to the publication job, which runs fixed workflow
  shell and Git/GitHub CLI commands and never executes files from the candidate.
- `MASON_SITE_DISPATCH_TOKEN` is required only when site dispatch is enabled. It
  must be able to send `repository_dispatch` to `masonjames/masonjames.com`; it
  must not have deployment or environment-secret privileges.
- Protect `mj/prod` against direct pushes. Require `Mason production / verify`
  and `Mason production / patch E2E`, dismiss stale approvals, and require human
  review. Do not enable auto-merge for upstream sync pull requests yet.

## Site receiver contract

The site repository receiver must treat the dispatch payload as a request, not
as proof. Before opening a separate vendoring pull request it must:

1. Query the referenced EmDash Actions run and require `conclusion=success` and
   `head_sha` equal to `client_payload.emdash_commit`.
2. Require that commit to still be the exact `mj/prod` tip.
3. Check out EmDash at that detached commit in a clean workspace, recompute the
   Git tree and archive SHA-256, and compare both with the payload.
4. Vendor from that detached source without reading or changing an interactive
   checkout. Record the exact EmDash commit and checksum in the site PR body and
   a committed small provenance manifest.
5. Run the complete site gate in rehearsal. Do not merge or deploy the site PR.
6. Deduplicate by full EmDash commit; a retry updates the existing PR or issue.

The receiver is intentionally not implemented from this repository. Until it
exists and is reviewed in `masonjames.com`, leave
`MASON_SITE_VENDOR_DISPATCH_ENABLED` unset or `false`.

## Patch ledger

`docs/operations/mj-patch-ledger.json` records every active patch set's commit
anchors, regression commands, upstream status, and removal criteria. Validate it
with:

```bash
git fetch origin main
node scripts/mj/validate-patch-ledger.mjs \
  --production-ref HEAD \
  --upstream-ref origin/main
```

Update the ledger in the same pull request that adds, rebases, upstreams, or
removes a carried patch. `upstream_merged_pending_removal` does not authorize an
automatic deletion: compare behavior and migration history and run the named
tests first. Pull-request CI additionally requires `reviewed_production_sha` to
equal the exact PR base and `reviewed_upstream_sha` to equal the fetched
`upstream/main` tip. This makes the generated PR intentionally fail until a
reviewer records the revisions actually examined.

For the exact pull-request gate, run:

```bash
node scripts/mj/validate-patch-ledger.mjs \
  --production-ref HEAD \
  --upstream-ref upstream/main \
  --expected-production-sha "$(git rev-parse origin/mj/prod)" \
  --expected-upstream-sha "$(git rev-parse upstream/main)"
```

## Local operator entrypoint

`scripts/mj/sync-upstream.sh` only dispatches the clean-runner workflow. It does
not check out, merge, or push from the current working directory:

```bash
scripts/mj/sync-upstream.sh
scripts/mj/sync-upstream.sh --recheck
```

The legacy `com.masonjames.emdash-sync` LaunchAgent was disabled and unloaded on
2026-07-11. Its plist is retained only as rollback evidence; do not re-enable
it. Local vendoring automation stays disabled until the site receiver above is
merged and a test dispatch creates one review-only vendoring PR with matching
evidence.
