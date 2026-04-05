/**
 * Sitemap document helpers
 *
 * Provides a small internal abstraction over sitemap XML rendering so the
 * public /sitemap.xml route can evolve toward variants or indexes later
 * without rewriting the route contract.
 */

import type { SitemapContentEntry } from "../api/handlers/seo.js";

const AMP_RE = /&/g;
const LT_RE = /</g;
const GT_RE = />/g;
const QUOT_RE = /"/g;
const APOS_RE = /'/g;
const TRAILING_SLASH_RE = /\/$/;

export interface SitemapUrlEntry {
	loc: string;
	lastmod: string;
	changefreq?: "weekly";
	priority?: number;
}

export interface SitemapUrlSetDocument {
	kind: "urlset";
	entries: SitemapUrlEntry[];
}

export type SitemapDocument = SitemapUrlSetDocument;

export function buildDefaultSitemapDocument(args: {
	siteUrl: string;
	entries: SitemapContentEntry[];
}): SitemapDocument {
	const siteUrl = args.siteUrl.replace(TRAILING_SLASH_RE, "");
	return {
		kind: "urlset",
		entries: args.entries.map((entry) => ({
			loc: `${siteUrl}/${encodeURIComponent(entry.collection)}/${encodeURIComponent(entry.identifier)}`,
			lastmod: entry.updatedAt,
			changefreq: "weekly",
			priority: 0.7,
		})),
	};
}

export function renderSitemapXml(document: SitemapDocument): string {
	const lines: string[] = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
	];

	for (const entry of document.entries) {
		lines.push("  <url>");
		lines.push(`    <loc>${escapeXml(entry.loc)}</loc>`);
		lines.push(`    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`);
		if (entry.changefreq) {
			lines.push(`    <changefreq>${escapeXml(entry.changefreq)}</changefreq>`);
		}
		if (typeof entry.priority === "number") {
			lines.push(`    <priority>${escapeXml(entry.priority.toString())}</priority>`);
		}
		lines.push("  </url>");
	}

	lines.push("</urlset>");
	return lines.join("\n");
}

function escapeXml(str: string): string {
	return str
		.replace(AMP_RE, "&amp;")
		.replace(LT_RE, "&lt;")
		.replace(GT_RE, "&gt;")
		.replace(QUOT_RE, "&quot;")
		.replace(APOS_RE, "&apos;");
}
