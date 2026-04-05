import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
	clear404Entries,
	delete404Entry,
	fetch404Entries,
	prune404Entries,
	resolve404ToRedirect,
} from "../../src/lib/api/redirects";

describe("redirects api client", () => {
	const originalFetch = globalThis.fetch;
	let fetchSpy: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		fetchSpy = vi
			.fn()
			.mockResolvedValue(
				new Response(JSON.stringify({ data: { items: [], nextCursor: undefined } }), {
					status: 200,
				}),
			);
		globalThis.fetch = fetchSpy;
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
	});

	it("fetch404Entries requests the paginated 404 endpoint with query params", async () => {
		fetchSpy.mockResolvedValueOnce(
			new Response(JSON.stringify({ data: { items: [], nextCursor: "next_404" } }), {
				status: 200,
			}),
		);

		const result = await fetch404Entries({ cursor: "cur_1", limit: 25, search: "/missing path" });

		expect(fetchSpy).toHaveBeenCalledOnce();
		const [url, init] = fetchSpy.mock.calls[0]!;
		expect(String(url)).toBe(
			"/_emdash/api/redirects/404s?cursor=cur_1&limit=25&search=%2Fmissing+path",
		);
		expect(init?.method).toBeUndefined();
		expect(result.nextCursor).toBe("next_404");
	});

	it("resolve404ToRedirect posts to the resolve endpoint with json payload", async () => {
		fetchSpy.mockResolvedValueOnce(
			new Response(
				JSON.stringify({
					data: {
						redirect: {
							id: "redir_1",
							source: "/missing",
							destination: "/new-home",
							type: 301,
							isPattern: false,
							enabled: true,
							hits: 0,
							lastHitAt: null,
							groupName: "Resolved 404",
							auto: false,
							createdAt: "2026-04-03T00:00:00.000Z",
							updatedAt: "2026-04-03T00:00:00.000Z",
						},
						deleted: 3,
					},
				}),
				{ status: 201 },
			),
		);

		const result = await resolve404ToRedirect({
			source: "/missing",
			destination: "/new-home",
			type: 301,
			enabled: true,
			groupName: "Resolved 404",
		});

		const [url, init] = fetchSpy.mock.calls[0]!;
		expect(String(url)).toBe("/_emdash/api/redirects/404s/resolve");
		expect(init?.method).toBe("POST");
		expect(new Headers(init?.headers).get("Content-Type")).toBe("application/json");
		expect(init?.body).toBe(
			JSON.stringify({
				source: "/missing",
				destination: "/new-home",
				type: 301,
				enabled: true,
				groupName: "Resolved 404",
			}),
		);
		expect(result.deleted).toBe(3);
		expect(result.redirect.source).toBe("/missing");
	});

	it("delete404Entry issues a DELETE request", async () => {
		fetchSpy.mockResolvedValueOnce(new Response(null, { status: 204 }));

		await delete404Entry("nf_1");

		const [url, init] = fetchSpy.mock.calls[0]!;
		expect(String(url)).toBe("/_emdash/api/redirects/404s/nf_1");
		expect(init?.method).toBe("DELETE");
	});

	it("clear404Entries deletes the entire 404 log", async () => {
		fetchSpy.mockResolvedValueOnce(
			new Response(JSON.stringify({ data: { deleted: 12 } }), { status: 200 }),
		);

		const result = await clear404Entries();

		const [url, init] = fetchSpy.mock.calls[0]!;
		expect(String(url)).toBe("/_emdash/api/redirects/404s");
		expect(init?.method).toBe("DELETE");
		expect(result.deleted).toBe(12);
	});

	it("prune404Entries posts the cutoff timestamp", async () => {
		fetchSpy.mockResolvedValueOnce(
			new Response(JSON.stringify({ data: { deleted: 5 } }), { status: 200 }),
		);

		const result = await prune404Entries("2026-04-01T12:00:00.000Z");

		const [url, init] = fetchSpy.mock.calls[0]!;
		expect(String(url)).toBe("/_emdash/api/redirects/404s");
		expect(init?.method).toBe("POST");
		expect(new Headers(init?.headers).get("Content-Type")).toBe("application/json");
		expect(init?.body).toBe(JSON.stringify({ olderThan: "2026-04-01T12:00:00.000Z" }));
		expect(result.deleted).toBe(5);
	});
});
