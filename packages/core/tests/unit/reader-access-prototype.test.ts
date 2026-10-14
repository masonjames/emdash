import { describe, expect, it, vi } from "vitest";

import { readForReader, type AccessDecision } from "../../examples/reader-access.js";

function setup() {
	return {
		resource: { collection: "posts", id: "article", locale: "en" },
		protected: true,
		reader: null,
		audience: "reader" as const,
		publicPreview: { title: "Public title", excerpt: "Explicit public preview" },
		load: vi.fn(async () => ({ body: "PROTECTED_BODY", metadata: "PROTECTED_METADATA" })),
	};
}

describe("reader access prototype", () => {
	it("does not load protected content without a provider", async () => {
		const input = setup();
		expect(await readForReader(input)).toEqual({ kind: "deny", cacheControl: "private, no-store" });
		expect(input.load).not.toHaveBeenCalled();
	});

	it("fails closed when the provider throws", async () => {
		const input = setup();
		const result = await readForReader({
			...input,
			decide: async () => {
				throw new Error("identity provider unavailable");
			},
		});
		expect(result.kind).toBe("deny");
		expect(input.load).not.toHaveBeenCalled();
	});

	it("returns only an explicit public preview", async () => {
		const input = setup();
		const result = await readForReader({ ...input, decide: async () => ({ kind: "preview" }) });
		expect(result).toEqual({
			kind: "preview",
			value: input.publicPreview,
			cacheControl: "private, no-store",
		});
		expect(JSON.stringify(result)).not.toContain("PROTECTED");
		expect(input.load).not.toHaveBeenCalled();
	});

	it("denies preview access when no safe preview exists", async () => {
		const input = setup();
		const result = await readForReader({
			...input,
			publicPreview: undefined,
			decide: async () => ({ kind: "preview" }),
		});
		expect(result.kind).toBe("deny");
		expect(input.load).not.toHaveBeenCalled();
	});

	it("carries verified reader identity and locale into the decision", async () => {
		const input = setup();
		const reader = { provider: "oidc", subject: "synthetic-reader" };
		const decide = vi.fn(async (): Promise<AccessDecision> => ({ kind: "allow" }));
		const result = await readForReader({ ...input, reader, decide });
		expect(decide).toHaveBeenCalledWith({ resource: input.resource, reader, audience: "reader" });
		expect(result).toEqual({
			kind: "full",
			value: { body: "PROTECTED_BODY", metadata: "PROTECTED_METADATA" },
			cacheControl: "private, no-store",
		});
		expect(input.load).toHaveBeenCalledTimes(1);
	});

	it("distinguishes a paid route's quote from a denial without delivering content", async () => {
		const input = setup();
		const result = await readForReader({
			...input,
			audience: "paid-route",
			decide: async () => ({ kind: "payment-required", price: "$0.001" }),
		});
		expect(result).toEqual({
			kind: "payment-required",
			price: "$0.001",
			cacheControl: "private, no-store",
		});
		expect(input.load).not.toHaveBeenCalled();
	});

	it.each(["$0", "invalid"])("rejects an unusable payment price %s", async (price) => {
		const input = setup();
		expect(
			(
				await readForReader({
					...input,
					audience: "paid-route",
					decide: async () => ({ kind: "payment-required", price }),
				})
			).kind,
		).toBe("deny");
		expect(input.load).not.toHaveBeenCalled();
	});

	it("does not infer a payment audience for a reader page", async () => {
		const input = setup();
		expect(
			(
				await readForReader({
					...input,
					decide: async () => ({ kind: "payment-required", price: "$0.001" }),
				})
			).kind,
		).toBe("deny");
		expect(input.load).not.toHaveBeenCalled();
	});

	it("does not carry one reader's permission into another read", async () => {
		const input = setup();
		const decide = vi
			.fn<() => Promise<AccessDecision>>()
			.mockResolvedValueOnce({ kind: "allow" })
			.mockResolvedValueOnce({ kind: "deny" });
		expect((await readForReader({ ...input, decide })).kind).toBe("full");
		expect((await readForReader({ ...input, decide })).kind).toBe("deny");
		expect(input.load).toHaveBeenCalledTimes(1);
	});

	it("keeps public reads independent of the identity provider", async () => {
		const input = setup();
		const decide = vi.fn<() => Promise<AccessDecision>>();
		expect((await readForReader({ ...input, protected: false, decide })).kind).toBe("full");
		expect(decide).not.toHaveBeenCalled();
	});

	it("treats an EmVB layout as protected data before rendering", async () => {
		const input = setup();
		const load = vi.fn(async () => ({ root: { type: "text", props: { text: "MEMBER_LAYOUT" } } }));
		const result = await readForReader({
			...input,
			resource: { ...input.resource, collection: "emvb_pages" },
			load,
			decide: async () => ({ kind: "deny" }),
		});
		expect(JSON.stringify(result)).not.toContain("MEMBER_LAYOUT");
		expect(load).not.toHaveBeenCalled();
	});
});
