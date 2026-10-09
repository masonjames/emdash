import type { APIContext } from "astro";
import { beforeEach, describe, expect, it, vi } from "vitest";

const assets = vi.hoisted(() => ({ service: {} as Record<string, unknown> }));
vi.mock(
	"astro:assets",
	() => ({ getConfiguredImageService: async () => assets.service, imageConfig: {} }),
	{ virtual: true },
);
vi.mock("astro/assets/endpoint/generic", () => ({ GET: vi.fn() }), { virtual: true });
import { GET } from "../../../src/astro/image-endpoint.js";

function context(storage: Record<string, unknown>, etag?: string): APIContext {
	const request = new Request(
		"https://site.example.com/_image?href=" +
			encodeURIComponent("https://site.example.com/_emdash/api/media/file/photo.jpg") +
			"&w=400&f=webp",
	);
	if (etag) request.headers.set("If-None-Match", etag);
	return {
		request,
		url: new URL(request.url),
		params: {},
		locals: { emdash: { storage } },
	} as unknown as APIContext;
}

describe("storage download lifetime on image revalidation", () => {
	beforeEach(() => {
		assets.service = {
			parseURL: async () => ({ width: 400 }),
			transform: vi.fn(async () => ({ data: new Uint8Array([1]), format: "webp" })),
		};
	});
	it.each(["application/pdf", "image/jpeg"])(
		"releases the unused %s stream on 304",
		async (contentType) => {
			const cancel = vi.fn();
			const storage = {
				download: async () => ({
					body: new ReadableStream<Uint8Array>({
						start(controller) {
							controller.enqueue(new Uint8Array([1]));
							controller.close();
						},
						cancel,
					}),
					contentType,
					size: 1,
					lastModified: new Date("2026-01-15T12:00:00Z"),
				}),
			};
			const initial = await GET(context(storage));
			expect(initial.status).toBe(200);
			await initial.arrayBuffer();
			const response = await GET(context(storage, initial.headers.get("ETag")!));
			expect(response.status).toBe(304);
			expect(response.body).toBeNull();
			expect(cancel).toHaveBeenCalledOnce();
			expect(response.headers.get("Content-Type")).toBeNull();
			expect(response.headers.get("ETag")).toBe(initial.headers.get("ETag"));
		},
	);
	it("releases the original when the local service cannot parse the transform", async () => {
		assets.service.parseURL = async () => undefined;
		const cancel = vi.fn();
		const storage = {
			download: async () => ({
				body: new ReadableStream<Uint8Array>({
					start(controller) {
						controller.enqueue(new Uint8Array([1]));
						controller.close();
					},
					cancel,
				}),
				contentType: "image/jpeg",
				size: 1,
				lastModified: new Date("2026-01-15T12:00:00Z"),
			}),
		};
		const initial = await GET(context(storage));
		await initial.arrayBuffer();
		const response = await GET(context(storage, initial.headers.get("ETag")!));
		expect(response.status).toBe(304);
		expect(cancel).toHaveBeenCalledOnce();
	});
});
