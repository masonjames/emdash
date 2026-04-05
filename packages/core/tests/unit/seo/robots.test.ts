import { describe, expect, it } from "vitest";

import { hasSitemapDirective, renderRobotsText } from "../../../src/seo/sitemap.js";

describe("robots helpers", () => {
	it("appends a sitemap line when custom robots content is missing one", () => {
		const robots = renderRobotsText({
			customContent: "User-agent: *\nAllow: /",
			sitemapUrl: "https://example.com/sitemap.xml",
		});

		expect(robots).toContain("Sitemap: https://example.com/sitemap.xml");
	});

	it("detects explicit sitemap directives but ignores commented mentions", () => {
		expect(hasSitemapDirective("User-agent: *\nSitemap: https://example.com/sitemap.xml")).toBe(true);
		expect(hasSitemapDirective("User-agent: *\n# Sitemap: https://example.com/sitemap.xml")).toBe(false);
	});

	it("omits sitemap output when no sitemap url is provided", () => {
		const robots = renderRobotsText({ sitemapUrl: null });

		expect(robots).not.toContain("Sitemap:");
		expect(robots).toContain("Disallow: /_emdash/");
	});
});
