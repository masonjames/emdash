import type { APIContext } from "astro";
import { beforeEach, describe, expect, it, vi } from "vitest";

const assets = vi.hoisted(() => ({
	service: {} as Record<string, unknown>,
	imageConfig: {
		service: { entrypoint: "custom-external", config: {} },
		endpoint: { route: "/_image" },
	},
	genericGET: vi.fn(),
}));

vi.mock(
	"astro:assets",
	() => ({
		getConfiguredImageService: async () => assets.service,
		imageConfig: assets.imageConfig,
	}),
	{ virtual: true },
);
vi.mock("astro/assets/endpoint/generic", () => ({ GET: assets.genericGET }), { virtual: true });

import { GET } from "../../../src/astro/image-endpoint.js";

function context(key: string, storage: Record<string, unknown>): APIContext {
	const href = `https://site.example.com/_emdash/api/media/file/${key}`;
	const request = new Request(
		`https://site.example.com/_image?href=${encodeURIComponent(href)}&w=400&f=webp`,
	);
	return {
		request,
		url: new URL(request.url),
		params: {},
		locals: { emdash: { storage } },
		// eslint-disable-next-line typescript/no-unsafe-type-assertion -- minimal route context
	} as unknown as APIContext;
}

describe("storage-backed Node image endpoint", () => {
	beforeEach(() => {
		assets.genericGET.mockReset();
		assets.imageConfig.service.entrypoint = "custom-external";
		assets.imageConfig.service.config = {};
	});

	it("redirects storage media through the configured external image service", async () => {
		assets.imageConfig.service.config = { supportedInputFormats: ["heic"] };
		assets.service = {
			getURL: async ({ src, width }: { src: string; width: number }) =>
				`https://images.example.com/w_${width}/${src}`,
		};
		const download = vi.fn();

		const response = await GET(
			context("photo.heic", {
				getPublicUrl: (key: string) => `https://media.example.com/${key}`,
				download,
			}),
		);

		expect(response.status).toBe(302);
		expect(response.headers.get("Location")).toBe(
			"https://images.example.com/w_400/https://media.example.com/photo.heic",
		);
		expect(download).not.toHaveBeenCalled();
		expect(assets.genericGET).not.toHaveBeenCalled();
	});

	it("preserves replacement versions when delegating storage media", async () => {
		assets.service = {
			getURL: async ({ src }: { src: string }) => `https://images.example.com/${src}`,
		};
		const response = await GET(
			context("photo.jpg?_emdash_media=sha256%3Anew", {
				getPublicUrl: (key: string) => `https://media.example.com/${key}`,
			}),
		);
		expect(response.headers.get("Location")).toBe(
			"https://images.example.com/https://media.example.com/photo.jpg?_emdash_media=sha256%3Anew",
		);
	});

	it("revalidates original bytes when an external service passes the source through", async () => {
		assets.service = { getURL: async ({ src }: { src: string }) => src };
		const cancel = vi.fn();
		let lastModified = new Date("2026-01-15T12:00:00.000Z");
		const storage = {
			getPublicUrl: (key: string) => `https://media.example.com/${key}`,
			download: async () => ({
				body: new ReadableStream<Uint8Array>({
					start(controller) {
						controller.enqueue(new TextEncoder().encode("<svg/>"));
						controller.close();
					},
					cancel,
				}),
				contentType: "image/svg+xml",
				size: 6,
				lastModified,
			}),
		};
		const first = await GET(context("photo.svg", storage));
		expect(first.status).toBe(200);
		expect(await first.text()).toBe("<svg/>");
		expect(first.headers.get("Content-Disposition")).toBe("attachment");
		expect(first.headers.get("Content-Security-Policy")).toContain("sandbox");
		expect(first.headers.get("X-Content-Type-Options")).toBe("nosniff");
		expect(first.headers.get("Cache-Control")).toBe("public, max-age=0, must-revalidate");
		expect(first.headers.get("Last-Modified")).toBe(lastModified.toUTCString());
		const etag = first.headers.get("ETag");
		expect(etag).toBeTruthy();

		for (const [header, value] of [
			["If-None-Match", etag!],
			["If-Modified-Since", lastModified.toUTCString()],
		] as const) {
			const conditional = context("photo.svg", storage);
			conditional.request.headers.set(header, value);
			const cached = await GET(conditional);
			expect(cached.status).toBe(304);
			expect(cached.body).toBeNull();
			expect(cancel).toHaveBeenCalledTimes(header === "If-None-Match" ? 1 : 2);
			expect(cached.headers.get("ETag")).toBe(etag);
		}

		lastModified = new Date("2026-01-15T12:01:00.000Z");
		const replaced = context("photo.svg", storage);
		replaced.request.headers.set("If-None-Match", etag!);
		const updated = await GET(replaced);
		expect(updated.status).toBe(200);
		expect(updated.headers.get("ETag")).not.toBe(etag);
		expect(await updated.text()).toBe("<svg/>");
	});

	it("reports HEIC as unsupported when an external service rewrites without declaring support", async () => {
		assets.service = {
			getURL: async ({ src }: { src: string }) => `https://images.example.com/${src}`,
		};
		const download = vi.fn();

		const response = await GET(
			context("photo.heic", {
				getPublicUrl: (key: string) => `https://media.example.com/${key}`,
				download,
			}),
		);

		expect(response.status).toBe(415);
		expect(download).not.toHaveBeenCalled();
	});

	it("reports HEIC as unsupported when an external service passes it through", async () => {
		assets.service = { getURL: async ({ src }: { src: string }) => src };
		const download = vi.fn();

		const response = await GET(
			context("photo.heic", {
				getPublicUrl: (key: string) => `https://media.example.com/${key}`,
				download,
			}),
		);

		expect(response.status).toBe(415);
		expect(download).not.toHaveBeenCalled();
	});
});
