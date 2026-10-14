import { describe, expect, it, vi } from "vitest";

import { runPaidRoute } from "../../../examples/paid-route.js";

function setup() {
	const events: string[] = [];
	const payment = { payer: "test-payer", amount: "1000", network: "eip155:84532" };
	const settle = vi.fn(async () => {
		events.push("settle");
		return { success: true as const, header: "host-receipt" };
	});
	const input = {
		request: new Request("https://example.com/paid/article"),
		quote: vi.fn(async () => ({ price: "$0.001" })),
		prepare: vi.fn(async () => {
			events.push("verify");
			return { payment, settle };
		}),
		handle: vi.fn(async () => {
			events.push("handler");
			return new Response("protected Markdown", {
				headers: { "Cache-Control": "public", "PAYMENT-RESPONSE": "plugin-receipt" },
			});
		}),
	};
	return { input, events, settle, payment };
}

describe("paid plugin route prototype", () => {
	it("settles after the body is ready and releases only the host receipt", async () => {
		const { input, events, payment } = setup();
		const response = await runPaidRoute(input);
		expect(events).toEqual(["verify", "handler", "settle"]);
		expect(input.handle).toHaveBeenCalledWith(payment);
		expect(await response.text()).toBe("protected Markdown");
		expect(response.headers.get("PAYMENT-RESPONSE")).toBe("host-receipt");
		expect(response.headers.get("Cache-Control")).toBe("private, no-store");
	});

	it("returns a challenge without running the handler", async () => {
		const { input, settle } = setup();
		const response = await runPaidRoute({
			...input,
			prepare: async () => new Response("Payment required", { status: 402 }),
		});
		expect(response.status).toBe(402);
		expect(input.handle).not.toHaveBeenCalled();
		expect(settle).not.toHaveBeenCalled();
	});

	it.each([403, 404, 500])("does not settle a handler's %s response", async (status) => {
		const { input, settle } = setup();
		input.handle.mockResolvedValue(new Response(null, { status }));
		expect((await runPaidRoute(input)).status).toBe(status);
		expect(settle).not.toHaveBeenCalled();
	});

	it("does not charge a throwing handler", async () => {
		const { input, settle } = setup();
		input.handle.mockRejectedValue(new Error("render failed"));
		expect((await runPaidRoute(input)).status).toBe(503);
		expect(settle).not.toHaveBeenCalled();
	});

	it.each(["failed", "unknown"])("withholds content after %s settlement", async (kind) => {
		const { input } = setup();
		const response = await runPaidRoute({
			...input,
			prepare: async () => ({
				payment: { payer: "test", amount: "1000", network: "eip155:84532" },
				settle: async () => {
					if (kind === "unknown") throw new Error("timeout");
					return { success: false };
				},
			}),
		});
		expect(response.status).toBe(503);
		expect(await response.text()).toBe("");
		expect(response.headers.has("PAYMENT-RESPONSE")).toBe(false);
	});

	it("serves an explicitly free quote without a payment call", async () => {
		const { input } = setup();
		const response = await runPaidRoute({ ...input, quote: async () => null });
		expect(response.status).toBe(200);
		expect(input.prepare).not.toHaveBeenCalled();
		expect(input.handle).toHaveBeenCalledWith(undefined);
	});

	it.each([undefined, {}, { price: "$0" }, { price: "$0.01", payTo: "plugin-wallet" }])(
		"fails closed for an invalid quote %j",
		async (quote) => {
			const { input } = setup();
			expect((await runPaidRoute({ ...input, quote: async () => quote })).status).toBe(503);
			expect(input.prepare).not.toHaveBeenCalled();
			expect(input.handle).not.toHaveBeenCalled();
		},
	);

	it("does not settle a body that fails while being read", async () => {
		const { input, settle } = setup();
		input.handle.mockResolvedValue(
			new Response(
				new ReadableStream({
					start(controller) {
						controller.error(new Error("body failed"));
					},
				}),
			),
		);
		expect((await runPaidRoute(input)).status).toBe(503);
		expect(settle).not.toHaveBeenCalled();
	});

	it("rejects an oversized body before settlement", async () => {
		const { input, settle } = setup();
		input.handle.mockResolvedValue(new Response(new Uint8Array(1024 * 1024 + 1)));
		expect((await runPaidRoute(input)).status).toBe(503);
		expect(settle).not.toHaveBeenCalled();
	});

	it("does not treat HEAD as a purchase", async () => {
		const { input } = setup();
		const response = await runPaidRoute({
			...input,
			request: new Request(input.request, { method: "HEAD" }),
		});
		expect(response.status).toBe(405);
		expect(input.quote).not.toHaveBeenCalled();
	});
});
