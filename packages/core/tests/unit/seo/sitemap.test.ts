import { describe, expect, it } from "vitest";

import { buildDefaultSitemapDocument, renderSitemapXml } from "../../../src/seo/sitemap.js";

describe("sitemap helpers", () => {
	it("builds default sitemap entries using encoded collection and identifier segments", () => {
		const document = buildDefaultSitemapDocument({
			siteUrl: "https://example.com/",
			entries: [
				{
					collection: "blog posts",
					identifier: "hello world/β",
					updatedAt: "2026-04-03T12:00:00.000Z",
				},
			],
		});

		expect(document).toEqual({
			kind: "urlset",
			entries: [
				{
					loc: "https://example.com/blog%20posts/hello%20world%2F%CE%B2",
					lastmod: "2026-04-03T12:00:00.000Z",
					changefreq: "weekly",
					priority: 0.7,
				},
			],
		});
	});

	it("renders a populated sitemap document as XML", () => {
		const xml = renderSitemapXml({
			kind: "urlset",
			entries: [
				{
					loc: "https://example.com/posts/hello-world",
					lastmod: "2026-04-03T12:00:00.000Z",
					changefreq: "weekly",
					priority: 0.7,
				},
			],
		});

		expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
		expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
		expect(xml).toContain("<loc>https://example.com/posts/hello-world</loc>");
		expect(xml).toContain("<lastmod>2026-04-03T12:00:00.000Z</lastmod>");
		expect(xml).toContain("<changefreq>weekly</changefreq>");
		expect(xml).toContain("<priority>0.7</priority>");
		expect(xml).toContain("</urlset>");
	});

	it("renders an empty but valid urlset", () => {
		const xml = renderSitemapXml({ kind: "urlset", entries: [] });

		expect(xml).toBe(
			'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n</urlset>',
		);
	});
});
