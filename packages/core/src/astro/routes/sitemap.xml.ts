/**
 * Sitemap XML endpoint
 *
 * GET /sitemap.xml - Auto-generated sitemap from published content
 *
 * Includes all published, non-noindex content across all collections.
 * The site URL is read from site settings or the request URL origin.
 *
 * Default URL pattern: /{collection}/{slug-or-id}. Users can override
 * by creating their own /sitemap.xml route in their Astro project.
 */

import type { APIRoute } from "astro";

import { handleSitemapData } from "#api/handlers/seo.js";
import { buildDefaultSitemapDocument, renderSitemapXml } from "#seo/sitemap.js";
import { getSiteSettingsWithDb } from "#settings/index.js";

export const prerender = false;

const TRAILING_SLASH_RE = /\/$/;

export const GET: APIRoute = async ({ locals, url }) => {
	const { emdash } = locals;

	if (!emdash?.db) {
		return new Response("<!-- EmDash not configured -->", {
			status: 500,
			headers: { "Content-Type": "application/xml" },
		});
	}

	try {
		const discovery =
			typeof emdash.collectSiteDiscovery === "function"
				? await emdash.collectSiteDiscovery()
				: { sitemap: { enabled: true } };
		if (!discovery.sitemap.enabled) {
			return new Response("Not Found", {
				status: 404,
				headers: {
					"Content-Type": "text/plain; charset=utf-8",
					"Cache-Control": "no-store",
				},
			});
		}

		// Determine site URL from settings or request origin
		const settings = await getSiteSettingsWithDb(emdash.db);
		const siteUrl = (settings.url || url.origin).replace(TRAILING_SLASH_RE, "");

		const result = await handleSitemapData(emdash.db);

		if (!result.success || !result.data) {
			return new Response("<!-- Failed to generate sitemap -->", {
				status: 500,
				headers: { "Content-Type": "application/xml" },
			});
		}

		const document = buildDefaultSitemapDocument({
			siteUrl,
			entries: result.data.entries,
		});

		return new Response(renderSitemapXml(document), {
			status: 200,
			headers: {
				"Content-Type": "application/xml; charset=utf-8",
				"Cache-Control": "public, max-age=3600",
			},
		});
	} catch {
		return new Response("<!-- Internal error generating sitemap -->", {
			status: 500,
			headers: { "Content-Type": "application/xml" },
		});
	}
};
