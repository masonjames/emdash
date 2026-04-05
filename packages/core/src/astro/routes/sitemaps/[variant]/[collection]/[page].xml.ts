import type { APIRoute } from "astro";

import {
	buildShardSitemapPlan,
	renderSitemapUrlSet,
	resolveSitemapRuntimeConfig,
} from "#seo/sitemap.js";

export const prerender = false;

function xmlResponse(body: string, status = 200): Response {
	return new Response(body, {
		status,
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
}

export const GET: APIRoute = async ({ locals, params, url }) => {
	const { emdash } = locals;

	if (!emdash?.db) {
		return xmlResponse("<!-- EmDash not configured -->", 500);
	}

	const variant = params.variant;
	const collection = params.collection;
	const page = params.page ? Number.parseInt(params.page, 10) : Number.NaN;
	if (!variant || !collection || !Number.isInteger(page) || page < 1) {
		return xmlResponse("<!-- Sitemap shard not found -->", 404);
	}

	try {
		const config = await resolveSitemapRuntimeConfig(emdash.db, url.origin, {
			seoCorePluginEnabled: emdash.isPluginEnabled("seo-core"),
		});
		const plan = await buildShardSitemapPlan(emdash.db, config, {
			variant,
			collection,
			page,
		});

		if (plan.kind === "disabled") {
			return xmlResponse("<!-- Sitemap disabled -->", 404);
		}
		if (plan.kind === "not_found") {
			return xmlResponse("<!-- Sitemap shard not found -->", 404);
		}

		return xmlResponse(renderSitemapUrlSet(plan.entries));
	} catch {
		return xmlResponse("<!-- Internal error generating sitemap -->", 500);
	}
};
