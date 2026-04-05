import { sql, type Kysely } from "kysely";
import { ulid } from "ulidx";

import {
	buildRedirectLocation,
	normalizeRedirectDestination,
	normalizeRedirectSourcePath,
	normalizeRequestPath,
	normalizedPathnameEquals,
} from "../../redirects/normalize.js";
import {
	compilePattern,
	matchPattern,
	interpolateDestination,
	isPattern,
} from "../../redirects/patterns.js";
import { currentTimestampValue } from "../dialect-helpers.js";
import type { Database, RedirectTable } from "../types.js";
import { encodeCursor, decodeCursor, type FindManyResult } from "./types.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Redirect {
	id: string;
	source: string;
	destination: string;
	type: number;
	isPattern: boolean;
	enabled: boolean;
	hits: number;
	lastHitAt: string | null;
	groupName: string | null;
	auto: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface CreateRedirectInput {
	source: string;
	destination: string;
	type?: number;
	isPattern?: boolean;
	enabled?: boolean;
	groupName?: string | null;
	auto?: boolean;
}

export interface UpdateRedirectInput {
	source?: string;
	destination?: string;
	type?: number;
	isPattern?: boolean;
	enabled?: boolean;
	groupName?: string | null;
}

export interface NotFoundEntry {
	id: string;
	path: string;
	referrer: string | null;
	userAgent: string | null;
	ip: string | null;
	createdAt: string;
}

export interface NotFoundSummary {
	path: string;
	count: number;
	lastSeen: string;
	topReferrer: string | null;
}

export interface RedirectMatch {
	redirect: Redirect;
	resolvedDestination: string;
}

type MatchPathOptions = {
	search?: string;
	maxHops?: number;
};

// ---------------------------------------------------------------------------
// Row mapping
// ---------------------------------------------------------------------------

function rowToRedirect(row: RedirectTable): Redirect {
	return {
		id: row.id,
		source: row.source,
		destination: row.destination,
		type: row.type,
		isPattern: row.is_pattern === 1,
		enabled: row.enabled === 1,
		hits: row.hits,
		lastHitAt: row.last_hit_at,
		groupName: row.group_name,
		auto: row.auto === 1,
		createdAt: row.created_at,
		updatedAt: row.updated_at,
	};
}

function compareRedirectIdentity(a: Redirect, b: Redirect): number {
	return a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id);
}

function getPatternMetrics(source: string): {
	staticSegments: number;
	catchAllSegments: number;
	totalSegments: number;
} {
	const segments = normalizeRequestPath(source).split("/").filter(Boolean);

	let staticSegments = 0;
	let catchAllSegments = 0;

	for (const segment of segments) {
		const isDynamic = segment.startsWith("[") && segment.endsWith("]");
		const isCatchAll = segment.startsWith("[...") && segment.endsWith("]");
		if (!isDynamic) {
			staticSegments += 1;
		}
		if (isCatchAll) {
			catchAllSegments += 1;
		}
	}

	return {
		staticSegments,
		catchAllSegments,
		totalSegments: segments.length,
	};
}

function comparePatternPrecedence(a: Redirect, b: Redirect): number {
	const aMetrics = getPatternMetrics(a.source);
	const bMetrics = getPatternMetrics(b.source);

	if (aMetrics.staticSegments !== bMetrics.staticSegments) {
		return bMetrics.staticSegments - aMetrics.staticSegments;
	}

	if (aMetrics.catchAllSegments !== bMetrics.catchAllSegments) {
		return aMetrics.catchAllSegments - bMetrics.catchAllSegments;
	}

	if (aMetrics.totalSegments !== bMetrics.totalSegments) {
		return bMetrics.totalSegments - aMetrics.totalSegments;
	}

	return compareRedirectIdentity(a, b);
}

function normalizeAutoRedirectPath(
	urlPattern: string | null,
	collection: string,
	slug: string,
	contentId: string,
): string {
	const rawPath = urlPattern
		? urlPattern.replace("{slug}", slug).replace("{id}", contentId)
		: `/${collection}/${slug}`;

	return normalizeRedirectDestination(rawPath).href;
}

// ---------------------------------------------------------------------------
// Repository
// ---------------------------------------------------------------------------

export class RedirectRepository {
	constructor(private db: Kysely<Database>) {}

	// --- CRUD ---------------------------------------------------------------

	async findById(id: string): Promise<Redirect | null> {
		const row = await this.db
			.selectFrom("_emdash_redirects")
			.selectAll()
			.where("id", "=", id)
			.executeTakeFirst();
		return row ? rowToRedirect(row) : null;
	}

	async findBySource(source: string): Promise<Redirect | null> {
		const direct = await this.db
			.selectFrom("_emdash_redirects")
			.selectAll()
			.where("source", "=", source)
			.executeTakeFirst();
		if (direct) {
			return rowToRedirect(direct);
		}

		const normalizedSource = normalizeRedirectSourcePath(source);
		if (normalizedSource !== source) {
			const normalized = await this.db
				.selectFrom("_emdash_redirects")
				.selectAll()
				.where("source", "=", normalizedSource)
				.executeTakeFirst();
			if (normalized) {
				return rowToRedirect(normalized);
			}
		}

		return this.findRedirectWithNormalizedSource(normalizedSource);
	}

	async findMany(opts: {
		cursor?: string;
		limit?: number;
		search?: string;
		group?: string;
		enabled?: boolean;
		auto?: boolean;
	}): Promise<FindManyResult<Redirect>> {
		const limit = Math.min(Math.max(opts.limit ?? 50, 1), 100);

		let query = this.db
			.selectFrom("_emdash_redirects")
			.selectAll()
			.orderBy("created_at", "desc")
			.orderBy("id", "desc")
			.limit(limit + 1);

		if (opts.search) {
			const term = `%${opts.search}%`;
			query = query.where((eb) =>
				eb.or([eb("source", "like", term), eb("destination", "like", term)]),
			);
		}

		if (opts.group !== undefined) {
			query = query.where("group_name", "=", opts.group);
		}

		if (opts.enabled !== undefined) {
			query = query.where("enabled", "=", opts.enabled ? 1 : 0);
		}

		if (opts.auto !== undefined) {
			query = query.where("auto", "=", opts.auto ? 1 : 0);
		}

		if (opts.cursor) {
			const decoded = decodeCursor(opts.cursor);
			if (decoded) {
				query = query.where((eb) =>
					eb.or([
						eb("created_at", "<", decoded.orderValue),
						eb.and([eb("created_at", "=", decoded.orderValue), eb("id", "<", decoded.id)]),
					]),
				);
			}
		}

		const rows = await query.execute();
		const items = rows.slice(0, limit).map(rowToRedirect);
		const result: FindManyResult<Redirect> = { items };

		if (rows.length > limit) {
			const last = items.at(-1)!;
			result.nextCursor = encodeCursor(last.createdAt, last.id);
		}

		return result;
	}

	async create(input: CreateRedirectInput): Promise<Redirect> {
		const id = ulid();
		const now = new Date().toISOString();
		const normalizedSource = normalizeRedirectSourcePath(input.source);
		const normalizedDestination = normalizeRedirectDestination(input.destination).href;
		const patternFlag = input.isPattern ?? isPattern(normalizedSource);

		await this.db
			.insertInto("_emdash_redirects")
			.values({
				id,
				source: normalizedSource,
				destination: normalizedDestination,
				type: input.type ?? 301,
				is_pattern: patternFlag ? 1 : 0,
				enabled: input.enabled !== false ? 1 : 0,
				hits: 0,
				last_hit_at: null,
				group_name: input.groupName ?? null,
				auto: input.auto ? 1 : 0,
				created_at: now,
				updated_at: now,
			})
			.execute();

		return (await this.findById(id))!;
	}

	async update(id: string, input: UpdateRedirectInput): Promise<Redirect | null> {
		const existing = await this.findById(id);
		if (!existing) return null;

		const now = new Date().toISOString();
		const values: Record<string, unknown> = { updated_at: now };

		if (input.source !== undefined) {
			const normalizedSource = normalizeRedirectSourcePath(input.source);
			values.source = normalizedSource;
			values.is_pattern =
				input.isPattern !== undefined
					? input.isPattern
						? 1
						: 0
					: isPattern(normalizedSource)
						? 1
						: 0;
		} else if (input.isPattern !== undefined) {
			values.is_pattern = input.isPattern ? 1 : 0;
		}

		if (input.destination !== undefined) {
			values.destination = normalizeRedirectDestination(input.destination).href;
		}
		if (input.type !== undefined) values.type = input.type;
		if (input.enabled !== undefined) values.enabled = input.enabled ? 1 : 0;
		if (input.groupName !== undefined) values.group_name = input.groupName;

		await this.db.updateTable("_emdash_redirects").set(values).where("id", "=", id).execute();

		return (await this.findById(id))!;
	}

	async delete(id: string): Promise<boolean> {
		const result = await this.db
			.deleteFrom("_emdash_redirects")
			.where("id", "=", id)
			.executeTakeFirst();
		return BigInt(result.numDeletedRows) > 0n;
	}

	// --- Matching -----------------------------------------------------------

	private async findRedirectWithNormalizedSource(
		source: string,
		excludeId?: string,
	): Promise<Redirect | null> {
		const normalizedSource = normalizeRedirectSourcePath(source);
		const rows = await this.db.selectFrom("_emdash_redirects").selectAll().execute();

		const matches = rows
			.map(rowToRedirect)
			.filter((redirect) => {
				if (excludeId && redirect.id === excludeId) {
					return false;
				}

				return normalizedPathnameEquals(redirect.source, normalizedSource);
			})
			.toSorted(compareRedirectIdentity);

		return matches[0] ?? null;
	}

	private async findExactMatch(path: string): Promise<Redirect | null> {
		const normalizedPath = normalizeRequestPath(path);
		const directCandidates = [...new Set([path, normalizedPath])];

		for (const candidate of directCandidates) {
			const row = await this.db
				.selectFrom("_emdash_redirects")
				.selectAll()
				.where("source", "=", candidate)
				.where("enabled", "=", 1)
				.where("is_pattern", "=", 0)
				.executeTakeFirst();
			if (row) {
				return rowToRedirect(row);
			}
		}

		const rows = await this.db
			.selectFrom("_emdash_redirects")
			.selectAll()
			.where("enabled", "=", 1)
			.where("is_pattern", "=", 0)
			.execute();

		const matches = rows
			.map(rowToRedirect)
			.filter((redirect) => normalizedPathnameEquals(redirect.source, normalizedPath))
			.toSorted(compareRedirectIdentity);

		return matches[0] ?? null;
	}

	async findEnabledPatternRules(): Promise<Redirect[]> {
		const rows = await this.db
			.selectFrom("_emdash_redirects")
			.selectAll()
			.where("enabled", "=", 1)
			.where("is_pattern", "=", 1)
			.execute();
		return rows.map(rowToRedirect);
	}

	private sortPatternRulesForMatching(rules: Redirect[]): Redirect[] {
		return rules.toSorted(comparePatternPrecedence);
	}

	private findBestPatternMatch(
		path: string,
		rules: Redirect[],
		requestSearch?: string,
	): RedirectMatch | null {
		for (const redirect of this.sortPatternRulesForMatching(rules)) {
			try {
				const compiled = compilePattern(normalizeRedirectSourcePath(redirect.source));
				const params = matchPattern(compiled, path);
				if (!params) {
					continue;
				}

				const resolved = interpolateDestination(redirect.destination, params);
				return {
					redirect,
					resolvedDestination: buildRedirectLocation(resolved, requestSearch),
				};
			} catch {
				continue;
			}
		}

		return null;
	}

	private async findConcreteMatchWithoutLoopCheck(
		path: string,
		options: MatchPathOptions = {},
	): Promise<RedirectMatch | null> {
		const normalizedPath = normalizeRequestPath(path);
		const exact = await this.findExactMatch(normalizedPath);
		if (exact) {
			return {
				redirect: exact,
				resolvedDestination: buildRedirectLocation(exact.destination, options.search),
			};
		}

		const patterns = await this.findEnabledPatternRules();
		return this.findBestPatternMatch(normalizedPath, patterns, options.search);
	}

	private async countEnabledRules(): Promise<number> {
		const result = await sql<{ count: number | string }>`
			SELECT COUNT(*) as count
			FROM _emdash_redirects
			WHERE enabled = 1
		`.execute(this.db);

		return Number(result.rows[0]?.count ?? 0);
	}

	private async wouldLoopForConcretePath(
		startPath: string,
		firstDestination: string,
		opts: { maxHops?: number } = {},
	): Promise<boolean> {
		const visited = new Set<string>([normalizeRequestPath(startPath)]);
		let currentPath = normalizeRedirectDestination(firstDestination).pathname;
		const maxHops = opts.maxHops ?? (await this.countEnabledRules()) + 1;

		for (let hop = 0; hop < maxHops; hop += 1) {
			const normalizedCurrent = normalizeRequestPath(currentPath);
			if (visited.has(normalizedCurrent)) {
				return true;
			}

			visited.add(normalizedCurrent);
			const nextMatch = await this.findConcreteMatchWithoutLoopCheck(normalizedCurrent);
			if (!nextMatch) {
				return false;
			}

			currentPath = normalizeRedirectDestination(nextMatch.resolvedDestination).pathname;
		}

		return true;
	}

	async wouldCreateLoop(
		source: string,
		destination: string,
		opts: { maxHops?: number } = {},
	): Promise<boolean> {
		return this.wouldLoopForConcretePath(
			normalizeRedirectSourcePath(source),
			normalizeRedirectDestination(destination).href,
			opts,
		);
	}

	/**
	 * Match a request path against all enabled redirect rules.
	 * Checks exact matches first, then pattern rules. Query strings are ignored
	 * for matching but preserved when the destination has no query of its own.
	 */
	async matchPath(path: string, options: MatchPathOptions = {}): Promise<RedirectMatch | null> {
		const normalizedPath = normalizeRequestPath(path);
		const match = await this.findConcreteMatchWithoutLoopCheck(normalizedPath, options);
		if (!match) {
			return null;
		}

		const wouldLoop = await this.wouldLoopForConcretePath(
			normalizedPath,
			match.resolvedDestination,
			{
				maxHops: options.maxHops,
			},
		);
		if (wouldLoop) {
			return null;
		}

		return match;
	}

	// --- Hit tracking -------------------------------------------------------

	async recordHit(id: string): Promise<void> {
		await sql`
			UPDATE _emdash_redirects
			SET hits = hits + 1, last_hit_at = ${currentTimestampValue(this.db)}, updated_at = ${currentTimestampValue(this.db)}
			WHERE id = ${id}
		`.execute(this.db);
	}

	// --- Auto-redirects (slug change) ---------------------------------------

	/**
	 * Create an auto-redirect when a content slug changes.
	 * Uses the collection's URL pattern to compute old/new URLs.
	 * Collapses existing redirect chains pointing to the old URL.
	 */
	async createAutoRedirect(
		collection: string,
		oldSlug: string,
		newSlug: string,
		contentId: string,
		urlPattern: string | null,
	): Promise<Redirect> {
		const oldUrl = normalizeAutoRedirectPath(urlPattern, collection, oldSlug, contentId);
		const newUrl = normalizeAutoRedirectPath(urlPattern, collection, newSlug, contentId);

		await this.collapseChains(oldUrl, newUrl);

		const existing = await this.findBySource(oldUrl);
		if (existing) {
			return (await this.update(existing.id, { destination: newUrl }))!;
		}

		return this.create({
			source: oldUrl,
			destination: newUrl,
			type: 301,
			isPattern: false,
			auto: true,
			groupName: "Auto: slug change",
		});
	}

	/**
	 * Update all redirects whose destination matches oldDestination
	 * to point to newDestination instead. Prevents redirect chains.
	 * Returns the number of updated rows.
	 */
	async collapseChains(oldDestination: string, newDestination: string): Promise<number> {
		const normalizedOldPath = normalizeRedirectDestination(oldDestination).pathname;
		const normalizedNewDestination = normalizeRedirectDestination(newDestination).href;
		const rows = await this.db
			.selectFrom("_emdash_redirects")
			.select(["id", "destination"])
			.execute();

		const ids = rows
			.filter((row) => normalizedPathnameEquals(row.destination, normalizedOldPath))
			.map((row) => row.id);

		if (ids.length === 0) {
			return 0;
		}

		const result = await this.db
			.updateTable("_emdash_redirects")
			.set({
				destination: normalizedNewDestination,
				updated_at: new Date().toISOString(),
			})
			.where("id", "in", ids)
			.executeTakeFirst();
		return Number(result.numUpdatedRows);
	}

	// --- 404 log ------------------------------------------------------------

	async log404(entry: {
		path: string;
		referrer?: string | null;
		userAgent?: string | null;
		ip?: string | null;
	}): Promise<void> {
		await this.db
			.insertInto("_emdash_404_log")
			.values({
				id: ulid(),
				path: normalizeRequestPath(entry.path),
				referrer: entry.referrer ?? null,
				user_agent: entry.userAgent ?? null,
				ip: entry.ip ?? null,
				created_at: new Date().toISOString(),
			})
			.execute();
	}

	async find404s(opts: {
		cursor?: string;
		limit?: number;
		search?: string;
	}): Promise<FindManyResult<NotFoundEntry>> {
		const limit = Math.min(Math.max(opts.limit ?? 50, 1), 100);

		let query = this.db
			.selectFrom("_emdash_404_log")
			.selectAll()
			.orderBy("created_at", "desc")
			.orderBy("id", "desc")
			.limit(limit + 1);

		if (opts.search) {
			query = query.where("path", "like", `%${opts.search}%`);
		}

		if (opts.cursor) {
			const decoded = decodeCursor(opts.cursor);
			if (decoded) {
				query = query.where((eb) =>
					eb.or([
						eb("created_at", "<", decoded.orderValue),
						eb.and([eb("created_at", "=", decoded.orderValue), eb("id", "<", decoded.id)]),
					]),
				);
			}
		}

		const rows = await query.execute();
		const items: NotFoundEntry[] = rows.slice(0, limit).map((row) => ({
			id: row.id,
			path: row.path,
			referrer: row.referrer,
			userAgent: row.user_agent,
			ip: row.ip,
			createdAt: row.created_at,
		}));

		const result: FindManyResult<NotFoundEntry> = { items };
		if (rows.length > limit) {
			const last = items.at(-1)!;
			result.nextCursor = encodeCursor(last.createdAt, last.id);
		}

		return result;
	}

	async get404Summary(limit = 50): Promise<NotFoundSummary[]> {
		const rows = await sql<{
			path: string;
			count: number;
			last_seen: string;
			top_referrer: string | null;
		}>`
			SELECT
				path,
				COUNT(*) as count,
				MAX(created_at) as last_seen,
				(
					SELECT referrer FROM _emdash_404_log AS inner_log
					WHERE inner_log.path = _emdash_404_log.path
						AND referrer IS NOT NULL AND referrer != ''
					GROUP BY referrer
					ORDER BY COUNT(*) DESC
					LIMIT 1
				) as top_referrer
			FROM _emdash_404_log
			GROUP BY path
			ORDER BY count DESC
			LIMIT ${limit}
		`.execute(this.db);

		return rows.rows.map((row) => ({
			path: row.path,
			count: Number(row.count),
			lastSeen: row.last_seen,
			topReferrer: row.top_referrer,
		}));
	}

	async delete404(id: string): Promise<boolean> {
		const result = await this.db
			.deleteFrom("_emdash_404_log")
			.where("id", "=", id)
			.executeTakeFirst();
		return BigInt(result.numDeletedRows) > 0n;
	}

	async delete404sByPath(path: string): Promise<number> {
		const normalizedPath = normalizeRequestPath(path);
		const rows = await this.db.selectFrom("_emdash_404_log").select(["id", "path"]).execute();
		const ids = rows
			.filter((row) => normalizedPathnameEquals(row.path, normalizedPath))
			.map((row) => row.id);

		if (ids.length === 0) {
			return 0;
		}

		const result = await this.db
			.deleteFrom("_emdash_404_log")
			.where("id", "in", ids)
			.executeTakeFirst();
		return Number(result.numDeletedRows);
	}

	async clear404s(): Promise<number> {
		const result = await this.db.deleteFrom("_emdash_404_log").executeTakeFirst();
		return Number(result.numDeletedRows);
	}

	async prune404s(olderThan: string): Promise<number> {
		const result = await this.db
			.deleteFrom("_emdash_404_log")
			.where("created_at", "<", olderThan)
			.executeTakeFirst();
		return Number(result.numDeletedRows);
	}
}
