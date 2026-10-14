---
title: Reader-aware protection for whole-entry content
type: rfc
status: proposed
authors:
  - Mason James (@masonjames)
champion: Mason James (@masonjames)
sponsor: null
discussions:
  - https://github.com/emdash-cms/emdash/discussions/1467
created: 2026-10-14
---

# Reader-aware protection for whole-entry content

## Summary

Introduce a provider-neutral reader entitlement contract and enforce it at shared
public content reads. Start with whole-entry protection and an explicitly public
preview. A provider decides access; core prevents protected fields from reaching
unauthorized readers.

This is an initial slice of [discussion #1467](https://github.com/emdash-cms/emdash/discussions/1467),
not a complete implementation of its authoring, delivery, and proxy modes. It has
no Maintainer sponsor or design acceptance. The fork's executable prototype
exercises decisions and load ordering; current public content APIs do not invoke it.

## Problem and user case

Paid Access can gate a component or native route, but a theme can fetch and render
the body directly. Per-template checks also leave APIs, search, feeds, and plugin
reads to each integrator. The Auth0/OIDC use case in the discussion needs the same
protection with an external identity provider and no payment requirement.

EmVB layouts are another protected payload: hiding rendered markup is insufficient
if serialized layout data still contains the protected text. The gate must apply
before public rendering or serialization, including builder layouts.

## Example

The prototype accepts a server-resolved reader identity and a locale-scoped resource.
The entitlement result has four outcomes.

```ts
type AccessDecision =
	| { kind: "allow" }
	| { kind: "deny" }
	| { kind: "preview" }
	| { kind: "payment-required"; price: string };
```

An allowed read can load protected fields. A preview read returns only fields the
publisher explicitly designated public. A denied read has no protected payload.
On a host-designated paid route, payment-required supplies a quote to the payment
flow proposed in #3700; it does not itself verify payment or create an x402 response.

## Goals

- Gate whole entries across supported public content surfaces.
- Separate reader identity and entitlements from editor/admin roles.
- Support external identity and subscription providers without storing duplicate roles.
- Preserve payment-required versus denied access for paid routes.
- Fail closed and prevent shared-cache exposure of protected responses.

## Non-goals

Core reader accounts, a new login UI, billing, subscription storage, partial-body
paywall blocks, server islands, external paywall proxy mode, and crawler exemptions
are deferred. This does not promise control over arbitrary trusted server code
that directly reads the database or data exported before protection was enabled.

## Detailed design

Provide request-scoped reader identity (`provider`, opaque `subject`) through a
trusted host adapter. Sandboxed entitlement providers receive the minimum verified
identity/context needed for their decision, not cookies or credentials. The host
sets audience from the route; user-agent strings and client-provided role claims
do not establish it.

Resolve protection metadata before loading protected fields. The first implementation
needs a stable representation of protected status, provider binding, public preview
fields, and locale scope. The representation is an open decision; the prototype
receives trusted metadata explicitly and adds no storage migration.

Route public entry/list helpers, content APIs, search results/snippets, feeds,
exports, and sandbox content reads through the same decision. Inventory each
actual entrypoint before implementation. Separate authenticated editorial reads
with existing permission checks; never infer an editorial bypass from caller input.

Missing or unavailable providers keep protected entries locked. Build previews
from an explicit public projection; dropping only `body` can still leak layout,
custom fields, metadata, embedded content, or generated search snippets. Reader
decisions must not be shared across requests. Public unprotected reads should
avoid identity-provider calls and additional database round trips.

The [fork prototype](../packages/core/examples/reader-access.ts) delays its protected
loader until allow and returns tagged results. The
[tests](../packages/core/tests/unit/reader-access-prototype.test.ts) cover these
semantics, including an EmVB-shaped layout fixture. They do not exercise a real
EmVB renderer, an Auth0 integration, or the existing public entrypoints.

## Compatibility and migration

Unconfigured sites keep current public behavior. Enabling protection requires
explicit publisher configuration and a cache transition. Protected entries cannot
silently become public when a provider is removed. Existing Paid Access policy
storage remains authoritative until a reviewed migration/adapter is available.
Choose the storage format and migration policy before accepting this RFC.

## Security and privacy

Keep reader sessions distinct from administrator sessions. Provider verification
happens on the server. An authenticated reader is not automatically entitled to
every entry. Payment authorization must bind to the resource and current policy.

Start with `private, no-store` for every protected result, including previews, and
disable the host's route cache where needed. When public content becomes protected,
purge/version affected cache entries before reporting protection as effective.
Purge failure must remain visible and block that success claim. Headers on new
responses cannot remove old CDN copies. Public-preview caching can follow once
the invalidation contract is verified.

## Performance

Piggyback protection metadata on existing reads where possible. Measure anonymous
query counts and request-local deduplication, with reader/locale/resource dimensions
in cache keys. External provider checks require bounded timeouts. Do not add a
global identity query to sites or collections without protection.

## Failure handling

Missing decisions, provider exceptions, invalid quotes, or missing explicit previews
deny protected access. Content-load failures propagate as server failures rather
than substituting unprotected content. Define behavior for policy changes during
an in-flight read and for cache purge outages before enabling protection.

## Verification

The prototype tests denied and preview reads without loading protected data,
provider failures, public reads, locale/identity context, cross-request isolation,
payment-required versus deny, and protected layout data.

Completion requires integration leak tests for each inventoried public entrypoint,
including unpublished and translated content, nested layouts, derived snippets,
and custom fields. Exercise public-to-paid transitions with an actual cache adapter.
Test Paid Access subscriptions and paid reads plus a separately maintained OIDC
provider against the same contract. No OIDC contributor commitment is assumed.

Use an isolated masonjames.com copy on current EmDash for anonymous/member page
reads, Paid Access offers/challenges, EmVB SSR and editor save/preview. Test synthetic
content and simulated payments first; real settlement and production deployment
require separate authorization.

## Rollout and implementation

Review the contract, select the metadata/cache model, and inventory public reads.
Implement an opt-in whole-entry gate with entrypoint leak tests before advertising
native protection. Keep native Paid Access checks until equivalent core coverage
is proven. #387 improves discovery independently; #3700 supplies a host-owned paid
route execution path that can consume this contract.

## Alternatives

Continue per-template components, gate only HTTP pages in middleware, or use an
external paywall proxy. Shared content-read enforcement is needed for the chosen
core-managed mode because those approaches do not cover the same public surfaces.

## Drawbacks

This changes a security boundary and touches multiple read paths. Provider latency,
cache invalidation, custom field classification, and plugin access require careful
compatibility work. A standalone helper does not establish the proposed guarantee.

## Open questions

- Who will sponsor this RFC and maintain a second provider integration?
- Where should protected status, provider bindings, and public projections live?
- Which current public and sandbox reads must be routed through the gate?
- Are policies shared across translations, or must every locale be configured?
- Which host cache invalidation contract can safely complete a public-to-paid change?
- How should multiple entitlement providers compose without accidental allow?
