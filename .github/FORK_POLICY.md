# Downstream fork policy

This branch intentionally contains no GitHub Actions workflows or upstream bot
configuration. It is retained only as a source-history branch for the private
Mason James deployment fork.

Upstream release discovery is owned by the single guarded workflow on
`mj/prod`. That workflow imports application changes only, excludes upstream
`.github` metadata, creates bot-authored draft pull requests, and requires human
review before anything reaches production.

Do not restore upstream workflows, CLA automation, contributor triage bots,
preview deployments, or release publishing automation on this fork.
