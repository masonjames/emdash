/**
 * SEO Handlers
 *
 * Business logic for sitemap generation and robots.txt.
 */

import { sql, type Kysely } from "kysely";

import type { Database } from "../../database/types.js";
import { validateIdentifier } from "../../database/validate.js";
import { resolveContentEntryPath } from "../../utils/url-patterns.js";
import type { ApiResult } from "../types.js";

/** Maximum entries per sitemap (per spec) */
export const SITEMAP_MAX_ENTRIES = 50_000;

/** Raw content data for sitemap generation — the route builds the absolute URLs */
export interface SitemapContentEntry {
	/** Collection slug (e.g., "post", "page") */
	collection: string;
	/** Content slug or ID */
	identifier: string;
	/** Resolved public path */
	path: string;
	/** ISO date of last modification */
	updatedAt: string;
}

export interface SitemapDataResponse {
	entries: SitemapContentEntry[];
}

export interface SitemapDataOptions {
	collection?: string;
	limit?: number;
	offset?: number;
}

export interface SitemapCollectionSummaryEntry {
	collection: string;
	totalEntries: number;
	lastModifiedAt: string | null;
}

export interface SitemapSummaryDataResponse {
	totalEntries: number;
	collections: SitemapCollectionSummaryEntry[];
}

interface SeoCollectionRow {
	slug: string;
	url_pattern: string | null;
}

function normalizeLimit(value: number | undefined): number {
	if (!Number.isFinite(value) || value === undefined) {
		return SITEMAP_MAX_ENTRIES;
	}
	return Math.max(1, Math.min(SITEMAP_MAX_ENTRIES, Math.trunc(value)));
}

function normalizeOffset(value: number | undefined): number {
	if (!Number.isFinite(value) || value === undefined) {
		return 0;
	}
	return Math.max(0, Math.trunc(value));
}

async function loadSeoCollections(
	db: Kysely<Database>,
	collection?: string,
): Promise<SeoCollectionRow[]> {
	let query = db
		.selectFrom("_emdash_collections")
		.select(["slug", "url_pattern"])
		.where("has_seo", "=", 1)
		.orderBy("slug", "asc");

	if (collection) {
		query = query.where("slug", "=", collection);
	}

	return query.execute();
}

/**
 * Collect all published, indexable content across SEO-enabled collections
 * for sitemap generation.
 *
 * Only includes content from collections with `has_seo = 1`.
 * Excludes content with `seo_no_index = 1` in the `_emdash_seo` table.
 */
export async function handleSitemapData(
	db: Kysely<Database>,
	options: SitemapDataOptions = {},
): Promise<ApiResult<SitemapDataResponse>> {
	try {
		const collections = await loadSeoCollections(db, options.collection);
		const requestedLimit = normalizeLimit(options.limit);
		const requestedOffset = normalizeOffset(options.offset);
		const entries: SitemapContentEntry[] = [];

		for (const col of collections) {
			if (!options.collection && entries.length >= requestedLimit) {
				break;
			}

			try {
				validateIdentifier(col.slug, "collection slug");
			} catch {
				console.warn(`[SITEMAP] Skipping collection with invalid slug: ${col.slug}`);
				continue;
			}

			const tableName = `ec_${col.slug}`;
			const limit = options.collection ? requestedLimit : requestedLimit - entries.length;
			const offset = options.collection ? requestedOffset : 0;

			try {
				const rows = await sql<{
					slug: string | null;
					id: string;
					updated_at: string;
				}>`
					SELECT c.slug, c.id, c.updated_at
					FROM ${sql.ref(tableName)} c
					LEFT JOIN _emdash_seo s
						ON s.collection = ${col.slug}
						AND s.content_id = c.id
					WHERE c.status = 'published'
					AND c.deleted_at IS NULL
					AND (s.seo_no_index IS NULL OR s.seo_no_index = 0)
					ORDER BY c.updated_at DESC, c.id DESC
					LIMIT ${limit}
					OFFSET ${offset}
				`.execute(db);

				for (const row of rows.rows) {
					entries.push({
						collection: col.slug,
						identifier: row.slug || row.id,
						path: resolveContentEntryPath({
							collection: col.slug,
							slug: row.slug,
							id: row.id,
							urlPattern: col.url_pattern,
						}),
						updatedAt: row.updated_at,
					});
				}
			} catch (error) {
				console.warn(`[SITEMAP] Failed to query collection "${col.slug}":`, error);
				continue;
			}
		}

		if (!options.collection) {
			entries.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) || a.path.localeCompare(b.path));
		}

		return { success: true, data: { entries } };
	} catch (error) {
		console.error("[SITEMAP_ERROR]", error);
		return {
			success: false,
			error: { code: "SITEMAP_ERROR", message: "Failed to generate sitemap data" },
		};
	}
}

/**
	* Collect per-collection sitemap counts and last-modified timestamps.
	* Used to decide whether /sitemap.xml can render directly or must fan out into
	* a sitemap index with sharded child sitemaps.
	*/
export async function handleSitemapSummaryData(
	db: Kysely<Database>,
	options: { collection?: string } = {},
): Promise<ApiResult<SitemapSummaryDataResponse>> {
	try {
		const collections = await loadSeoCollections(db, options.collection);
		const summaries: SitemapCollectionSummaryEntry[] = [];
		let totalEntries = 0;

		for (const col of collections) {
			try {
				validateIdentifier(col.slug, "collection slug");
			} catch {
				console.warn(`[SITEMAP] Skipping collection with invalid slug: ${col.slug}`);
				continue;
			}

			const tableName = `ec_${col.slug}`;

			try {
				const result = await sql<{
					total: number | string | bigint;
					last_modified_at: string | null;
				}>`
					SELECT COUNT(*) AS total, MAX(c.updated_at) AS last_modified_at
					FROM ${sql.ref(tableName)} c
					LEFT JOIN _emdash_seo s
						ON s.collection = ${col.slug}
						AND s.content_id = c.id
					WHERE c.status = 'published'
					AND c.deleted_at IS NULL
					AND (s.seo_no_index IS NULL OR s.seo_no_index = 0)
				`.execute(db);

				const row = result.rows[0];
				if (!row) continue;

				const count = Number(row.total);
				if (!Number.isFinite(count) || count <= 0) {
					continue;
				}

				totalEntries += count;
				summaries.push({
					collection: col.slug,
					totalEntries: count,
					lastModifiedAt: row.last_modified_at,
				});
			} catch (error) {
				console.warn(`[SITEMAP] Failed to summarize collection "${col.slug}":`, error);
				continue;
			}
		}

		return {
			success: true,
			data: {
				totalEntries,
				collections: summaries,
			},
		};
	} catch (error) {
		console.error("[SITEMAP_SUMMARY_ERROR]", error);
		return {
			success: false,
			error: { code: "SITEMAP_ERROR", message: "Failed to summarize sitemap data" },
		};
	}
}
