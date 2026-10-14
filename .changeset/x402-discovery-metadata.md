---
"@emdash-cms/x402": minor
---

Adds an optional `extensions` field to `x402.enforce()` so paid routes can describe their inputs and outputs to discovery clients, including Bazaar. The metadata is included in both the 402 response body and the `PAYMENT-REQUIRED` header, including challenges after a rejected payment. Calls without extensions retain their existing behavior.
