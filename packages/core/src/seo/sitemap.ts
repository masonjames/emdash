import type { Kysely } from "kysely";

import {
	SITEMAP_MAX_ENTRIES,
	handleSitemapData,
	handleSitemapSummaryData,
} from "../api/handlers/seo.js";
import type { Database } from "../database/types.js";
import { getPluginSettingWithDb, getSiteSettingsWithDb } from "../settings/index.js";

const TRAILING_SLASH_RE = /\/$/;
const ABSOLUTE_HTTP_URL_RE = /^https?:\/\//i;
const LINE_BREAK_RE = /\r?\n/;
const AMP_RE = /&/g;
const LT_RE = /</g;
const GT_RE = />/g;
const QUOT_RE = /"/g;
const APOS_RE = /'/g;
const SITEMAP_DIRECTIVE_LINE_RE = /^\s*Sitemap:/i;

export const SITEMAP_CONTENT_VARIANT = "content";

export interface ResolvedSitemapRuntimeConfig {
	enabled: boolean;
	siteUrl: string;
}

export interface SitemapDocumentEntry {
	loc: string;
	lastmod?: string;
}

export type SitemapRootPlan =
	| {
			kind: "disabled";
	  }
	| {
			kind: "urlset";
			entries: SitemapDocumentEntry[];
	  }
	| {
			kind: "index";
			entries: SitemapDocumentEntry[];
	  };

export type SitemapShardPlan =
	| {
			kind: "disabled";
	  }
	| {
			kind: "not_found";
	  }
	| {
			kind: "urlset";
			entries: SitemapDocumentEntry[];
	  };

function escapeXml(value: string): string {
	return value
		.replace(AMP_RE, "&amp;")
		.replace(LT_RE, "&lt;")
		.replace(GT_RE, "&gt;")
		.replace(QUOT_RE, "&quot;")
		.replace(APOS_RE, "&apos;");
}

function toAbsoluteUrl(siteUrl: string, path: string): string {
	if (ABSOLUTE_HTTP_URL_RE.test(path)) {
		return path;
	}
	return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function mapContentEntries(siteUrl: string, entries: Array<{ path: string; updatedAt: string }>): SitemapDocumentEntry[] {
	return entries.map((entry) => ({
		loc: toAbsoluteUrl(siteUrl, entry.path),
		lastmod: entry.updatedAt,
	}));
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

function normalizeSeoCoreSitemapEnabled(value: unknown): boolean {
	if (!isRecord(value)) {
		return true;
	}

	const sitemap = value.sitemap;
	if (!isRecord(sitemap)) {
		return true;
	}

	return sitemap.enabled !== false;
}

export async function resolveSitemapRuntimeConfig(
	db: Kysely<Database>,
	requestOrigin: string,
	options: { seoCorePluginEnabled?: boolean } = {},
): Promise<ResolvedSitemapRuntimeConfig> {
	const settings = await getSiteSettingsWithDb(db);
	const siteUrl = (settings.url || requestOrigin).replace(TRAILING_SLASH_RE, "");

	let enabled = true;
	if (options.seoCorePluginEnabled) {
		const seoCoreSettings = await getPluginSettingWithDb<Record<string, unknown>>(
			"seo-core",
			"config",
			db,
		);
		enabled = normalizeSeoCoreSitemapEnabled(seoCoreSettings);
	}

	return { enabled, siteUrl };
}

export function buildSitemapShardPath(variant: string, collection: string, page: number): string {
	return `/sitemaps/${encodeURIComponent(variant)}/${encodeURIComponent(collection)}/${page}.xml`;
}

export async function buildRootSitemapPlan(
	db: Kysely<Database>,
	config: ResolvedSitemapRuntimeConfig,
): Promise<SitemapRootPlan> {
	if (!config.enabled) {
		return { kind: "disabled" };
	}

	const summaryResult = await handleSitemapSummaryData(db);
	if (!summaryResult.success) {
		throw new Error(summaryResult.error.message || "Failed to summarize sitemap data");
	}
	if (!summaryResult.data) {
		throw new Error("Failed to summarize sitemap data");
	}

	if (summaryResult.data.totalEntries <= SITEMAP_MAX_ENTRIES) {
		const dataResult = await handleSitemapData(db);
		if (!dataResult.success) {
			throw new Error(dataResult.error.message || "Failed to load sitemap data");
		}
		if (!dataResult.data) {
			throw new Error("Failed to load sitemap data");
		}

		return {
			kind: "urlset",
			entries: mapContentEntries(config.siteUrl, dataResult.data.entries),
		};
	}

	return {
		kind: "index",
		entries: summaryResult.data.collections.flatMap((collection) => {
			const pageCount = Math.ceil(collection.totalEntries / SITEMAP_MAX_ENTRIES);
			return Array.from({ length: pageCount }, (_unused, index) => ({
				loc: toAbsoluteUrl(
					config.siteUrl,
					buildSitemapShardPath(SITEMAP_CONTENT_VARIANT, collection.collection, index + 1),
				),
				lastmod: collection.lastModifiedAt ?? undefined,
			}));
		}),
	};
}

export async function buildShardSitemapPlan(
	db: Kysely<Database>,
	config: ResolvedSitemapRuntimeConfig,
	options: { variant: string; collection: string; page: number },
): Promise<SitemapShardPlan> {
	if (!config.enabled) {
		return { kind: "disabled" };
	}

	if (
		options.variant !== SITEMAP_CONTENT_VARIANT ||
		!Number.isInteger(options.page) ||
		options.page < 1
	) {
		return { kind: "not_found" };
	}

	const result = await handleSitemapData(db, {
		collection: options.collection,
		limit: SITEMAP_MAX_ENTRIES,
		offset: (options.page - 1) * SITEMAP_MAX_ENTRIES,
	});
	if (!result.success) {
		throw new Error(result.error.message || "Failed to load sitemap shard data");
	}
	if (!result.data) {
		throw new Error("Failed to load sitemap shard data");
	}

	if (result.data.entries.length === 0) {
		return { kind: "not_found" };
	}

	return {
		kind: "urlset",
		entries: mapContentEntries(config.siteUrl, result.data.entries),
	};
}

export function renderSitemapUrlSet(entries: SitemapDocumentEntry[]): string {
	const lines: string[] = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
	];

	for (const entry of entries) {
		lines.push("  <url>");
		lines.push(`    <loc>${escapeXml(entry.loc)}</loc>`);
		if (entry.lastmod) {
			lines.push(`    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`);
		}
		lines.push("  </url>");
	}

	lines.push("</urlset>");
	return lines.join("\n");
}

export function renderSitemapIndex(entries: SitemapDocumentEntry[]): string {
	const lines: string[] = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
	];

	for (const entry of entries) {
		lines.push("  <sitemap>");
		lines.push(`    <loc>${escapeXml(entry.loc)}</loc>`);
		if (entry.lastmod) {
			lines.push(`    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`);
		}
		lines.push("  </sitemap>");
	}

	lines.push("</sitemapindex>");
	return lines.join("\n");
}

export function hasSitemapDirective(content: string): boolean {
	return content.split(LINE_BREAK_RE).some((line) => SITEMAP_DIRECTIVE_LINE_RE.test(line));
}

export function renderRobotsText(options: {
	customContent?: string | null;
	sitemapUrl?: string | null;
}): string {
	const sitemapUrl = options.sitemapUrl?.trim() || null;
	if (options.customContent) {
		const trimmed = options.customContent.trimEnd();
		if (!sitemapUrl || hasSitemapDirective(trimmed)) {
			return `${trimmed}\n`;
		}
		return `${trimmed}\n\nSitemap: ${sitemapUrl}\n`;
	}

	const lines = ["User-agent: *", "Allow: /", "", "# Disallow admin and API routes", "Disallow: /_emdash/"];
	if (sitemapUrl) {
		lines.push("", `Sitemap: ${sitemapUrl}`);
	}
	lines.push("");
	return lines.join("\n");
}
