import { describe, expect, it } from "vitest";

import {
	buildSitemapShardPath,
	renderSitemapIndex,
	renderSitemapUrlSet,
} from "../../../src/seo/sitemap.js";

describe("sitemap helpers", () => {
	it("renders a sitemap urlset", () => {
		const xml = renderSitemapUrlSet([
			{ loc: "https://example.com/posts/hello-world", lastmod: "2026-04-02T12:00:00.000Z" },
		]);

		expect(xml).toContain("<urlset");
		expect(xml).toContain("<loc>https://example.com/posts/hello-world</loc>");
		expect(xml).toContain("<lastmod>2026-04-02T12:00:00.000Z</lastmod>");
	});

	it("renders a sitemap index", () => {
		const xml = renderSitemapIndex([
			{ loc: "https://example.com/sitemaps/content/post/1.xml", lastmod: "2026-04-03T08:15:00.000Z" },
		]);

		expect(xml).toContain("<sitemapindex");
		expect(xml).toContain("<loc>https://example.com/sitemaps/content/post/1.xml</loc>");
		expect(xml).toContain("<lastmod>2026-04-03T08:15:00.000Z</lastmod>");
	});

	it("builds shard paths for child sitemaps", () => {
		expect(buildSitemapShardPath("content", "post", 2)).toBe("/sitemaps/content/post/2.xml");
	});
});
