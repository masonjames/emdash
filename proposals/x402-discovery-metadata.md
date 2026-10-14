---
title: Discovery metadata in x402 payment challenges
type: rfc
status: proposed
authors:
  - Mason James (@masonjames)
champion: Mason James (@masonjames)
sponsor: null
discussions:
  - https://github.com/emdash-cms/emdash/discussions/387
created: 2026-10-14
---

# Discovery metadata in x402 payment challenges

## Summary

Add optional per-request discovery extensions to `@emdash-cms/x402.enforce()`.
Forward them to the SDK's payment-required response so clients receive the same
metadata in the JSON body and `PAYMENT-REQUIRED` header.

This is the first contribution toward [discussion #387](https://github.com/emdash-cms/emdash/discussions/387).
It does not complete that discussion's OpenAPI discovery proposal. This draft
has no Maintainer sponsor or design acceptance. An RFC is proposed because the
change extends a public API; Maintainers may prefer a bounded feature plan.

## Problem and user case

Mason maintains Paid Access, which publishes concrete paid Markdown URLs through
`/agents/offers.json`. A client can find a URL and price there, but EmDash's 402
response does not carry the input/output schemas needed by discovery clients.
The underlying x402 SDK already accepts an extensions object.

## Example

The Paid Access example supplies Bazaar input and output metadata for a concrete
GET URL. The resource URL identifies the entry; a slug query parameter is unnecessary.
Its output example contains synthetic Markdown because discovery is public.

See [the executable example](../packages/x402/examples/paid-access.ts) and
[the regression tests](../packages/x402/tests/discovery.test.ts) on this prototype branch.
Move those code links to immutable fork URLs when preparing an upstream design-only PR.

## Goals

- Preserve extensions on unpaid and rejected-payment challenges.
- Keep the response body and header consistent.
- Keep calls that omit extensions unchanged.

## Non-goals

OpenAPI generation, CMS resource enumeration, discovery registration, automatic
Bazaar schema inference, plugin route payments, and content gating are separate work.

## Detailed design

Extend `EnforceOptions` with `extensions?: Record<string, unknown>`. Callers supply
JSON-serializable values. Pass the value to the fourth argument of the SDK's
`createPaymentRequiredResponse()` in the existing shared 402 response builder.
Use the same builder for missing signatures, unmatched requirements, and failed
verification. No CMS core, stored-data, runtime configuration, or payment lifecycle
change is required. Node and Workers use the same Web Response serialization.

## Compatibility and migration

The option is additive. Existing callers need no migration. A minor package
changeset accompanies implementation. Existing `enforce()` settlement behavior
remains unchanged.

## Security and privacy

Extensions are visible before payment. Callers must use public or synthetic
examples, not protected content, reader identities, credentials, or payment secrets.
Metadata describes a resource; it never authorizes access.

## Performance

Serialization cost and header size grow with the supplied metadata. This adds no
database queries or facilitator calls. Keep examples compact and route-specific.

## Failure handling

Non-serializable metadata fails through existing JSON serialization. The prototype
does not introduce a schema validator or silently strip unknown extension names.
Invalid-payment challenges retain the metadata required for a corrected retry.

## Verification

Tests use the real x402 SDK with a simulated facilitator transport. Check both
wire representations, rejected payments, and absence of cross-request carryover.
The Paid Access companion has also been exercised locally with synthetic content
and simulated verification/settlement. AgentCash discovery 1.7.5 accepted the
resulting schemas; this is not evidence of registry registration or real settlement.

## Rollout and implementation

Review this proposal and the fork prototype first. After design acceptance, submit
the existing focused implementation, tests, example, guide, and changeset. Qualify
the package in an isolated masonjames.com copy alongside Paid Access and EmVB before
adopting the vendor update. Production deployment remains separate.

## Alternatives

Call the x402 SDK directly from each application, or implement the full OpenAPI
generator first. Forwarding the SDK option makes the existing enforcer usable by
discovery clients without introducing a second payment implementation.

## Drawbacks

The generic option leaves extension-schema correctness and response size with the
caller. The offers catalogue and a future OpenAPI document still require maintenance.

## Open questions

- Should this small additive API change use a feature plan instead of an RFC?
- Does the project want a separate JSON value type or size limit for extensions?
- Which separate proposal should define the OpenAPI resource/pricing source of truth?
