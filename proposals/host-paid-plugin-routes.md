---
title: Host-managed payments for plugin GET routes
type: rfc
status: proposed
authors:
  - Mason James (@masonjames)
champion: Mason James (@masonjames)
sponsor: null
discussions:
  - https://github.com/emdash-cms/emdash/discussions/3700
created: 2026-10-14
---

# Host-managed payments for plugin GET routes

## Summary

Allow a sandboxed plugin GET route to quote a request. The host challenges and
verifies payment using the site owner's x402 settings, runs the handler, and settles
only after a successful response has been validated and buffered. Release paid
content only after confirmed settlement.

This initial RFC follows [discussion #3700](https://github.com/emdash-cms/emdash/discussions/3700).
It has no Maintainer sponsor or design acceptance. The accompanying fork prototype
exercises ordering and failure handling; it is not connected to the runtime dispatcher.

## Problem and user case

Paid Access sells per-entry Markdown reads. Its registry plugin needs a native Astro
companion because raw plugin routes cannot implement a host-owned x402 exchange.
Allowing payment response headers alone would leave verification, settlement, and
recipient selection with every plugin.

## Example

The intended route contract adds an optional quote callback and verified payment
context to an existing public GET route.

```ts
payment: {
	quote: async (context) => ({ price: "$0.001", description: "Article Markdown" }),
}
```

The plugin returns `null` for a free request. A missing result, invalid price, or
failed quote is an error. The host resolves the site's recipient, network, and
facilitator; the quote cannot override them. The handler receives payer, amount,
and network after verification. That context means verified, not settled.

## Goals

- Support dynamic prices for read-only GET routes in registry plugins.
- Preserve existing routes that do not declare payments.
- Keep payment credentials, signatures, settlement, and receipt headers in the host.
- Avoid charging failed handlers and avoid releasing content after failed settlement.

## Non-goals

Mutating paid requests, streaming paid responses, refunds, subscriptions, prepaid
balances, provider credentials in plugins, and a durable receipt notification API
are outside the first slice. HEAD is not a purchase and is rejected for paid routes
in the prototype. Broader method behavior requires a separate decision.

## Detailed design

Add an optional payment declaration to route definitions and route metadata. Extend
the sandbox invocation protocol with a quote phase and an optional verified-payment
field on handler context. Quote callbacks receive the same validated route input;
the host retains the quote for that execution and verifies against it.

Use the existing plugin HTTP dispatch boundary for orchestration:

1. Authorize the route and validate method/input as today.
2. Resolve and validate the quote. Run explicitly free requests normally.
3. Ask the x402 integration to challenge or verify against that quote.
4. Invoke the handler with verified payment details.
5. Apply existing raw-response validation and buffer the successful body within a
   fixed limit. A thrown handler, non-2xx status, body read failure, or oversize
   response does not trigger settlement.
6. Settle once, add the host-generated `PAYMENT-RESPONSE`, and release the response.

The dispatcher must override public route cache declarations for payment-dependent
responses. The x402 package supplies the payment adapter; core does not add another
facilitator implementation. Its current `enforce()` verifies and settles together,
so implementation needs an additive staged API while preserving existing callers.
The host attaches payment headers after plugin response filtering.

The [fork prototype](../packages/core/examples/paid-route.ts) accepts a trusted
host payment adapter and uses Web Request/Response APIs. Its
[tests](../packages/core/tests/unit/plugins/paid-route-prototype.test.ts) simulate
that adapter. It deliberately does not claim SDK, sandbox wire, or dispatcher integration.
The prototype accepts positive USD strings with up to six fractional digits and
buffers at most 1 MiB; these are proposed initial limits, not existing public APIs.

## Compatibility and migration

Existing route declarations and `x402.enforce()` behavior remain unchanged.
No database migration is required for the initial slice. Native companions can
continue operating while registry plugins adopt the new route capability. Older
hosts must reject unsupported paid declarations rather than serve them as free.

## Security and privacy

Only host-verified payment details enter handler context. Plugins cannot choose
`payTo`, network, facilitator, or receipt headers. The current quote is authoritative
on each retry, so price changes invalidate older requirements. Restrict payment
context to the request; do not persist signatures or reader identifiers in logs.
Payment proves access to a priced route, not that the caller is a bot.

## Performance

Unpaid routes retain their existing path. Paid responses incur quote, verification,
buffering, and settlement latency. Measure memory at the proposed body limit and
concurrent requests on both Node and Workers before acceptance.

## Failure handling

Fail closed when x402 is unavailable, quotes are invalid, verification fails, or
settlement fails. A settlement timeout has an unknown financial outcome; do not
automatically retry or promise that the caller was not charged. Withhold content,
record a sanitized correlation identifier, and define reconciliation before enabling
production use. A client disconnect after settlement can still lose delivery;
exactly-once delivery and payment are not guaranteed by this sequence.

## Verification

The fork tests cover challenge short-circuiting, explicit free quotes, wallet
override rejection, handler errors, body failures, body limits, private caching,
host receipt ownership, settlement failure/timeout, and HEAD rejection.

Before implementation is complete, add real x402 SDK/facilitator-transport tests,
sandbox wire round trips, runtime dispatcher tests, changed-price retries, replay
behavior, and missing integration tests on Node and Workers. In an isolated
masonjames.com copy, exercise Paid Access unpaid/paid/denied Markdown reads and
receipts. Confirm existing member pages and EmVB rendering/editing still work.

## Rollout and implementation

First review the contract and prototype. Then implement the staged x402 adapter,
route declaration/wire support, and dispatcher integration as one opt-in vertical
slice. Adopt it in a Paid Access test adapter before removing any native companion.
The independent discovery extension from #387 can describe these challenges.
The content gate in #1467 remains responsible for other routes that expose the entry.

## Alternatives

Allow plugin-managed payment headers, use fixed prices only, or keep native
companions. Dynamic quotes preserve Paid Access's existing per-entry pricing;
host-managed settlement keeps recipient selection and payment checks centralized.

## Drawbacks

This introduces a two-phase sandbox call and requires buffering. Settlement
uncertainty and receipt persistence remain operational concerns even for read-only routes.

## Open questions

- Who will sponsor the RFC, and should the initial scope support GET only?
- What staged x402 adapter interface can preserve existing `enforce()` behavior?
- What response size limit and verification timeout fit Node and Workers?
- How should a plugin receive confirmed settlement for durable receipts without
  making receipt-storage failure look like a failed payment?
- What replay and unknown-settlement recovery guarantees are required before rollout?
