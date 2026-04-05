/**
 * Redirects API client
 */

import {
	API_BASE,
	apiFetch,
	parseApiResponse,
	throwResponseError,
	type FindManyResult,
} from "./client.js";

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

export interface CreateRedirectInput {
	source: string;
	destination: string;
	type?: number;
	enabled?: boolean;
	groupName?: string | null;
}

export interface UpdateRedirectInput {
	source?: string;
	destination?: string;
	type?: number;
	enabled?: boolean;
	groupName?: string | null;
}

export interface RedirectListOptions {
	cursor?: string;
	limit?: number;
	search?: string;
	group?: string;
	enabled?: boolean;
	auto?: boolean;
}

export interface NotFoundListOptions {
	cursor?: string;
	limit?: number;
	search?: string;
}

export interface NotFoundResolveResult {
	redirect: Redirect;
	deleted: number;
}

export type RedirectListResult = FindManyResult<Redirect>;
export type NotFoundListResult = FindManyResult<NotFoundEntry>;

function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
	const searchParams = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined && value !== "") {
			searchParams.set(key, String(value));
		}
	}
	const query = searchParams.toString();
	return query ? `?${query}` : "";
}

/**
 * List redirects with optional filters
 */
export async function fetchRedirects(options?: RedirectListOptions): Promise<RedirectListResult> {
	const response = await apiFetch(
		`${API_BASE}/redirects${buildQueryString({
			cursor: options?.cursor,
			limit: options?.limit,
			search: options?.search,
			group: options?.group,
			enabled: options?.enabled,
			auto: options?.auto,
		})}`,
	);
	return parseApiResponse<RedirectListResult>(response, "Failed to fetch redirects");
}

/**
 * Create a redirect
 */
export async function createRedirect(input: CreateRedirectInput): Promise<Redirect> {
	const response = await apiFetch(`${API_BASE}/redirects`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(input),
	});
	return parseApiResponse<Redirect>(response, "Failed to create redirect");
}

/**
 * Update a redirect
 */
export async function updateRedirect(id: string, input: UpdateRedirectInput): Promise<Redirect> {
	const response = await apiFetch(`${API_BASE}/redirects/${encodeURIComponent(id)}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(input),
	});
	return parseApiResponse<Redirect>(response, "Failed to update redirect");
}

/**
 * Delete a redirect
 */
export async function deleteRedirect(id: string): Promise<void> {
	const response = await apiFetch(`${API_BASE}/redirects/${encodeURIComponent(id)}`, {
		method: "DELETE",
	});
	if (!response.ok) await throwResponseError(response, "Failed to delete redirect");
}

/**
 * Fetch 404 summary (grouped by path, sorted by count)
 */
export async function fetch404Summary(limit?: number): Promise<NotFoundSummary[]> {
	const response = await apiFetch(
		`${API_BASE}/redirects/404s/summary${buildQueryString({ limit })}`,
	);
	const data = await parseApiResponse<{ items: NotFoundSummary[] }>(
		response,
		"Failed to fetch 404 summary",
	);
	return data.items;
}

/**
 * Fetch paginated 404 log entries.
 */
export async function fetch404Entries(options?: NotFoundListOptions): Promise<NotFoundListResult> {
	const response = await apiFetch(
		`${API_BASE}/redirects/404s${buildQueryString({
			cursor: options?.cursor,
			limit: options?.limit,
			search: options?.search,
		})}`,
	);
	return parseApiResponse<NotFoundListResult>(response, "Failed to fetch 404 log entries");
}

/**
 * Delete a single 404 log entry.
 */
export async function delete404Entry(id: string): Promise<void> {
	const response = await apiFetch(`${API_BASE}/redirects/404s/${encodeURIComponent(id)}`, {
		method: "DELETE",
	});
	if (!response.ok) await throwResponseError(response, "Failed to delete 404 log entry");
}

/**
 * Clear all 404 log entries.
 */
export async function clear404Entries(): Promise<{ deleted: number }> {
	const response = await apiFetch(`${API_BASE}/redirects/404s`, { method: "DELETE" });
	return parseApiResponse<{ deleted: number }>(response, "Failed to clear 404 log entries");
}

/**
 * Prune 404 log entries older than the provided ISO datetime.
 */
export async function prune404Entries(olderThan: string): Promise<{ deleted: number }> {
	const response = await apiFetch(`${API_BASE}/redirects/404s`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ olderThan }),
	});
	return parseApiResponse<{ deleted: number }>(response, "Failed to prune 404 log entries");
}

/**
 * Resolve a 404 path by creating a redirect and deleting matching 404 rows.
 */
export async function resolve404ToRedirect(
	input: CreateRedirectInput,
): Promise<NotFoundResolveResult> {
	const response = await apiFetch(`${API_BASE}/redirects/404s/resolve`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(input),
	});
	return parseApiResponse<NotFoundResolveResult>(response, "Failed to resolve 404 path");
}
