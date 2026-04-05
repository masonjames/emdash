import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("#api/handlers/seo.js", () => ({
	handleSitemapData: vi.fn(),
}));

vi.mock("#settings/index.js", () => ({
	getSiteSettingsWithDb: vi.fn(),
}));

import { handleSitemapData } from "#api/handlers/seo.js";
import { getSiteSettingsWithDb } from "#settings/index.js";

import { GET as robotsGet } from "../../../src/astro/routes/robots.txt.ts";
import { GET as sitemapGet } from "../../../src/astro/routes/sitemap.xml.ts";

function createRouteContext(emdash: Record<string, unknown>, url = "https://request.test/path") {
	return {
		locals: { emdash },
		url: new URL(url),
	};
}

describe("discovery routes", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(getSiteSettingsWithDb).mockResolvedValue({
			url: "https://example.com",
			seo: {},
		} as never);
	});

	describe("/sitemap.xml", () => {
		it("is enabled by default when no discovery hook result exists", async () => {
			vi.mocked(handleSitemapData).mockResolvedValue({
				success: true,
				data: {
					entries: [
						{
							collection: "posts",
							identifier: "hello-world",
							updatedAt: "2026-04-03T12:00:00.000Z",
						},
					],
				},
			} as never);

			const response = await sitemapGet(
				createRouteContext({ db: {} }, "https://request.test/sitemap.xml") as never,
			);

			expect(response.status).toBe(200);
			expect(response.headers.get("Content-Type")).toContain("application/xml");
			await expect(response.text()).resolves.toContain(
				"<loc>https://example.com/posts/hello-world</loc>",
			);
		});

		it("returns 404 and no-store when sitemap generation is disabled", async () => {
			const collectSiteDiscovery = vi.fn().mockResolvedValue({ sitemap: { enabled: false } });

			const response = await sitemapGet(
				createRouteContext(
					{ db: {}, collectSiteDiscovery },
					"https://request.test/sitemap.xml",
				) as never,
			);

			expect(response.status).toBe(404);
			expect(response.headers.get("Cache-Control")).toBe("no-store");
			await expect(response.text()).resolves.toBe("Not Found");
			expect(handleSitemapData).not.toHaveBeenCalled();
		});

		it("returns an empty but valid sitemap when enabled with no entries", async () => {
			const collectSiteDiscovery = vi.fn().mockResolvedValue({ sitemap: { enabled: true } });
			vi.mocked(handleSitemapData).mockResolvedValue({
				success: true,
				data: { entries: [] },
			} as never);

			const response = await sitemapGet(
				createRouteContext(
					{ db: {}, collectSiteDiscovery },
					"https://request.test/sitemap.xml",
				) as never,
			);
			const body = await response.text();

			expect(response.status).toBe(200);
			expect(body).toContain("<urlset");
			expect(body).toContain("</urlset>");
		});
	});

	describe("/robots.txt", () => {
		it("includes the sitemap line in default robots output when enabled", async () => {
			const response = await robotsGet(
				createRouteContext({ db: {} }, "https://request.test/robots.txt") as never,
			);

			expect(response.status).toBe(200);
			await expect(response.text()).resolves.toContain("Sitemap: https://example.com/sitemap.xml");
		});

		it("omits the sitemap line from default robots output when disabled", async () => {
			const collectSiteDiscovery = vi.fn().mockResolvedValue({ sitemap: { enabled: false } });

			const response = await robotsGet(
				createRouteContext(
					{ db: {}, collectSiteDiscovery },
					"https://request.test/robots.txt",
				) as never,
			);

			expect(response.status).toBe(200);
			await expect(response.text()).resolves.not.toContain("Sitemap:");
		});

		it("appends a sitemap line to custom robots content only when enabled", async () => {
			vi.mocked(getSiteSettingsWithDb).mockResolvedValue({
				url: "https://example.com",
				seo: { robotsTxt: "User-agent: *\nAllow: /" },
			} as never);

			const response = await robotsGet(
				createRouteContext({ db: {} }, "https://request.test/robots.txt") as never,
			);

			await expect(response.text()).resolves.toContain("Sitemap: https://example.com/sitemap.xml");
		});

		it("leaves custom robots content unchanged when disabled and no sitemap line exists", async () => {
			vi.mocked(getSiteSettingsWithDb).mockResolvedValue({
				url: "https://example.com",
				seo: { robotsTxt: "User-agent: *\nDisallow: /private" },
			} as never);
			const collectSiteDiscovery = vi.fn().mockResolvedValue({ sitemap: { enabled: false } });

			const response = await robotsGet(
				createRouteContext(
					{ db: {}, collectSiteDiscovery },
					"https://request.test/robots.txt",
				) as never,
			);

			await expect(response.text()).resolves.toBe("User-agent: *\nDisallow: /private");
		});

		it("preserves a manual sitemap line in custom robots content even when disabled", async () => {
			vi.mocked(getSiteSettingsWithDb).mockResolvedValue({
				url: "https://example.com",
				seo: {
					robotsTxt: "User-agent: *\nAllow: /\n\nSitemap: https://manual.example.com/sitemap.xml\n",
				},
			} as never);
			const collectSiteDiscovery = vi.fn().mockResolvedValue({ sitemap: { enabled: false } });

			const response = await robotsGet(
				createRouteContext(
					{ db: {}, collectSiteDiscovery },
					"https://request.test/robots.txt",
				) as never,
			);
			const body = await response.text();

			expect(body).toContain("Sitemap: https://manual.example.com/sitemap.xml");
			expect(body).not.toContain("Sitemap: https://example.com/sitemap.xml");
		});
	});
});
