/**
 * Robots.txt endpoint
 *
	* GET /robots.txt - Serves robots.txt with optional sitemap reference.
 */

import type { APIRoute } from "astro";

import { renderRobotsText, resolveSitemapRuntimeConfig } from "#seo/sitemap.js";
import { getSiteSettingsWithDb } from "#settings/index.js";

export const prerender = false;

export const GET: APIRoute = async ({ locals, url }) => {
	const { emdash } = locals;

	if (!emdash?.db) {
		return new Response("User-agent: *\nAllow: /\n", {
			status: 200,
			headers: { "Content-Type": "text/plain; charset=utf-8" },
		});
	}

	try {
		const [settings, sitemapConfig] = await Promise.all([
			getSiteSettingsWithDb(emdash.db),
			resolveSitemapRuntimeConfig(emdash.db, url.origin, {
				seoCorePluginEnabled: emdash.isPluginEnabled("seo-core"),
			}),
		]);
		const sitemapUrl = sitemapConfig.enabled ? `${sitemapConfig.siteUrl}/sitemap.xml` : null;
		const content = renderRobotsText({
			customContent: settings.seo?.robotsTxt ?? null,
			sitemapUrl,
		});

		return new Response(content, {
			status: 200,
			headers: {
				"Content-Type": "text/plain; charset=utf-8",
				"Cache-Control": "public, max-age=86400",
			},
		});
	} catch {
		return new Response("User-agent: *\nAllow: /\n", {
			status: 200,
			headers: { "Content-Type": "text/plain; charset=utf-8" },
		});
	}
};
