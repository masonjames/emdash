import { decodePaymentRequiredHeader, encodePaymentSignatureHeader } from "@x402/core/http";
import type { PaymentPayload, PaymentRequired } from "@x402/core/types";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { paidAccessExtensions } from "../examples/paid-access.js";
import type { X402Enforcer } from "../src/types.js";

const network = "eip155:84532";
const url = "https://example.com/agents/posts/example.md";
const facilitatorUrl = "https://facilitator.example.com";
const facilitator = vi.fn<typeof fetch>();
let enforcer: X402Enforcer;

async function challenge(payment?: PaymentPayload) {
	const response = await enforcer.enforce(
		new Request(url, {
			headers: payment ? { "PAYMENT-SIGNATURE": encodePaymentSignatureHeader(payment) } : {},
		}),
		{ extensions: paidAccessExtensions, mimeType: "text/markdown", description: "Example article" },
	);
	if (!(response instanceof Response)) throw new Error("Expected a payment challenge");
	expect(response.status).toBe(402);
	expect(response.headers.get("Content-Type")).toBe("application/json");
	const body = (await response.json()) as PaymentRequired;
	expect(decodePaymentRequiredHeader(response.headers.get("PAYMENT-REQUIRED")!)).toEqual(body);
	return body;
}

describe("payment discovery", () => {
	beforeEach(async () => {
		vi.resetModules();
		facilitator.mockReset();
		facilitator.mockImplementation(async (input) => {
			if (input === `${facilitatorUrl}/supported`) {
				return Response.json({
					kinds: [{ x402Version: 2, scheme: "exact", network }],
					extensions: [],
					signers: {},
				});
			}
			if (input === `${facilitatorUrl}/verify`) {
				return Response.json({ isValid: false, invalidReason: "insufficient_funds" });
			}
			throw new Error("Unexpected facilitator request");
		});
		vi.stubGlobal("fetch", facilitator);
		const { createEnforcer } = await import("../src/enforcer.js");
		enforcer = createEnforcer({
			payTo: "0x1111111111111111111111111111111111111111",
			network,
			defaultPrice: "$0.001",
			facilitatorUrl,
		});
	});

	afterEach(() => vi.unstubAllGlobals());

	it("describes a Paid Access Markdown offer in the challenge body and header", async () => {
		const body = await challenge();
		expect(body.extensions).toEqual(paidAccessExtensions);
		expect(body.resource).toEqual({
			url: "/agents/posts/example.md",
			description: "Example article",
			mimeType: "text/markdown",
		});
		expect(body.accepts[0]).toMatchObject({ network, amount: "1000" });
	});

	it.each(["mismatched requirements", "failed verification"])(
		"preserves discovery after %s",
		async (failure) => {
			const initial = await challenge();
			const accepted = initial.accepts[0]!;
			const body = await challenge({
				x402Version: 2,
				accepted: failure === "mismatched requirements" ? { ...accepted, amount: "1" } : accepted,
				payload: {},
			});
			expect(body.extensions).toEqual(paidAccessExtensions);
			expect(body.error).toBe(
				failure === "mismatched requirements"
					? "Payment does not match accepted requirements"
					: "insufficient_funds",
			);
		},
	);

	it("does not carry one request's extensions into a later challenge", async () => {
		await challenge();
		const response = await enforcer.enforce(new Request(url));
		if (!(response instanceof Response)) throw new Error("Expected a payment challenge");
		const body = (await response.json()) as PaymentRequired;
		expect(body.extensions).toBeUndefined();
		expect(decodePaymentRequiredHeader(response.headers.get("PAYMENT-REQUIRED")!)).toEqual(body);
	});
});
