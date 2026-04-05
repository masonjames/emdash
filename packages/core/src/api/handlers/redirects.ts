/**
 * Redirect CRUD and 404 log handlers
 */

import type { Kysely } from "kysely";

import {
	RedirectRepository,
	type Redirect,
	type NotFoundEntry,
	type NotFoundSummary,
} from "../../database/repositories/redirect.js";
import type { FindManyResult } from "../../database/repositories/types.js";
import type { Database } from "../../database/types.js";
import {
	normalizeRedirectDestination,
	normalizeRedirectSourcePath,
	normalizedPathnameEquals,
} from "../../redirects/normalize.js";
import { validatePattern, validateDestinationParams, isPattern } from "../../redirects/patterns.js";
import type { ApiResult } from "../types.js";

type RedirectMutationInput = {
	source: string;
	destination: string;
	type?: number;
	enabled?: boolean;
	groupName?: string | null;
};

type PreparedRedirectMutation = {
	source: string;
	destination: string;
	type: number;
	enabled: boolean;
	groupName: string | null;
	sourceIsPattern: boolean;
};

type ResolvedNotFoundRedirect = {
	redirect: Redirect;
	deleted: number;
};

async function prepareRedirectMutation(
	repo: RedirectRepository,
	input: RedirectMutationInput,
	opts: { existingId?: string } = {},
): Promise<ApiResult<PreparedRedirectMutation>> {
	let source: string;
	let destination: string;

	try {
		source = normalizeRedirectSourcePath(input.source);
		destination = normalizeRedirectDestination(input.destination).href;
	} catch (error) {
		return {
			success: false,
			error: {
				code: "VALIDATION_ERROR",
				message: error instanceof Error ? error.message : "Invalid redirect paths",
			},
		};
	}

	if (normalizedPathnameEquals(source, destination)) {
		return {
			success: false,
			error: {
				code: "VALIDATION_ERROR",
				message: "Source and destination must resolve to different paths",
			},
		};
	}

	const sourceIsPattern = isPattern(source);
	if (sourceIsPattern) {
		const patternError = validatePattern(source);
		if (patternError) {
			return {
				success: false,
				error: { code: "VALIDATION_ERROR", message: `Invalid source pattern: ${patternError}` },
			};
		}

		const destError = validateDestinationParams(source, destination);
		if (destError) {
			return {
				success: false,
				error: { code: "VALIDATION_ERROR", message: destError },
			};
		}
	}

	const duplicate = await repo.findBySource(source);
	if (duplicate && duplicate.id !== opts.existingId) {
		return {
			success: false,
			error: {
				code: "CONFLICT",
				message: `A redirect from "${source}" already exists`,
			},
		};
	}

	if (!sourceIsPattern && (input.enabled ?? true)) {
		const wouldLoop = await repo.wouldCreateLoop(source, destination);
		if (wouldLoop) {
			return {
				success: false,
				error: {
					code: "CONFLICT",
					message: `Redirect from "${source}" would create a redirect loop`,
				},
			};
		}
	}

	return {
		success: true,
		data: {
			source,
			destination,
			type: input.type ?? 301,
			enabled: input.enabled ?? true,
			groupName: input.groupName ?? null,
			sourceIsPattern,
		},
	};
}

// ---------------------------------------------------------------------------
// Redirects
// ---------------------------------------------------------------------------

/**
 * List redirects with cursor pagination and optional filters
 */
export async function handleRedirectList(
	db: Kysely<Database>,
	params: {
		cursor?: string;
		limit?: number;
		search?: string;
		group?: string;
		enabled?: boolean;
		auto?: boolean;
	},
): Promise<ApiResult<FindManyResult<Redirect>>> {
	try {
		const repo = new RedirectRepository(db);
		const result = await repo.findMany(params);
		return { success: true, data: result };
	} catch {
		return {
			success: false,
			error: { code: "REDIRECT_LIST_ERROR", message: "Failed to fetch redirects" },
		};
	}
}

/**
 * Create a redirect rule
 */
export async function handleRedirectCreate(
	db: Kysely<Database>,
	input: RedirectMutationInput,
): Promise<ApiResult<Redirect>> {
	try {
		const repo = new RedirectRepository(db);
		const prepared = await prepareRedirectMutation(repo, input);
		if (!prepared.success) {
			return prepared;
		}

		const redirect = await repo.create({
			source: prepared.data.source,
			destination: prepared.data.destination,
			type: prepared.data.type,
			isPattern: prepared.data.sourceIsPattern,
			enabled: prepared.data.enabled,
			groupName: prepared.data.groupName,
		});

		return { success: true, data: redirect };
	} catch {
		return {
			success: false,
			error: { code: "REDIRECT_CREATE_ERROR", message: "Failed to create redirect" },
		};
	}
}

/**
 * Get a redirect by ID
 */
export async function handleRedirectGet(
	db: Kysely<Database>,
	id: string,
): Promise<ApiResult<Redirect>> {
	try {
		const repo = new RedirectRepository(db);
		const redirect = await repo.findById(id);

		if (!redirect) {
			return {
				success: false,
				error: { code: "NOT_FOUND", message: `Redirect "${id}" not found` },
			};
		}

		return { success: true, data: redirect };
	} catch {
		return {
			success: false,
			error: { code: "REDIRECT_GET_ERROR", message: "Failed to fetch redirect" },
		};
	}
}

/**
 * Update a redirect by ID
 */
export async function handleRedirectUpdate(
	db: Kysely<Database>,
	id: string,
	input: {
		source?: string;
		destination?: string;
		type?: number;
		enabled?: boolean;
		groupName?: string | null;
	},
): Promise<ApiResult<Redirect>> {
	try {
		const repo = new RedirectRepository(db);
		const existing = await repo.findById(id);
		if (!existing) {
			return {
				success: false,
				error: { code: "NOT_FOUND", message: `Redirect "${id}" not found` },
			};
		}

		const prepared = await prepareRedirectMutation(
			repo,
			{
				source: input.source ?? existing.source,
				destination: input.destination ?? existing.destination,
				type: input.type ?? existing.type,
				enabled: input.enabled ?? existing.enabled,
				groupName: input.groupName === undefined ? existing.groupName : input.groupName,
			},
			{ existingId: id },
		);
		if (!prepared.success) {
			return prepared;
		}

		const updated = await repo.update(id, {
			source: input.source !== undefined ? prepared.data.source : undefined,
			destination: input.destination !== undefined ? prepared.data.destination : undefined,
			type: input.type,
			enabled: input.enabled,
			groupName: input.groupName,
		});

		if (!updated) {
			return {
				success: false,
				error: { code: "REDIRECT_UPDATE_ERROR", message: "Failed to update redirect" },
			};
		}

		return { success: true, data: updated };
	} catch {
		return {
			success: false,
			error: { code: "REDIRECT_UPDATE_ERROR", message: "Failed to update redirect" },
		};
	}
}

/**
 * Delete a redirect by ID
 */
export async function handleRedirectDelete(
	db: Kysely<Database>,
	id: string,
): Promise<ApiResult<{ deleted: true }>> {
	try {
		const repo = new RedirectRepository(db);
		const deleted = await repo.delete(id);

		if (!deleted) {
			return {
				success: false,
				error: { code: "NOT_FOUND", message: `Redirect "${id}" not found` },
			};
		}

		return { success: true, data: { deleted: true } };
	} catch {
		return {
			success: false,
			error: { code: "REDIRECT_DELETE_ERROR", message: "Failed to delete redirect" },
		};
	}
}

// ---------------------------------------------------------------------------
// 404 Log
// ---------------------------------------------------------------------------

/**
 * List 404 log entries with cursor pagination
 */
export async function handleNotFoundList(
	db: Kysely<Database>,
	params: { cursor?: string; limit?: number; search?: string },
): Promise<ApiResult<FindManyResult<NotFoundEntry>>> {
	try {
		const repo = new RedirectRepository(db);
		const result = await repo.find404s(params);
		return { success: true, data: result };
	} catch {
		return {
			success: false,
			error: { code: "NOT_FOUND_LIST_ERROR", message: "Failed to fetch 404 log" },
		};
	}
}

/**
 * Get 404 summary (grouped by path, sorted by count)
 */
export async function handleNotFoundSummary(
	db: Kysely<Database>,
	limit?: number,
): Promise<ApiResult<{ items: NotFoundSummary[] }>> {
	try {
		const repo = new RedirectRepository(db);
		const items = await repo.get404Summary(limit);
		return { success: true, data: { items } };
	} catch {
		return {
			success: false,
			error: { code: "NOT_FOUND_SUMMARY_ERROR", message: "Failed to fetch 404 summary" },
		};
	}
}

/**
 * Delete a single 404 log entry
 */
export async function handleNotFoundDelete(
	db: Kysely<Database>,
	id: string,
): Promise<ApiResult<{ deleted: true }>> {
	try {
		const repo = new RedirectRepository(db);
		const deleted = await repo.delete404(id);
		if (!deleted) {
			return {
				success: false,
				error: { code: "NOT_FOUND", message: `404 log entry "${id}" not found` },
			};
		}

		return { success: true, data: { deleted: true } };
	} catch {
		return {
			success: false,
			error: { code: "NOT_FOUND_DELETE_ERROR", message: "Failed to delete 404 log entry" },
		};
	}
}

/**
 * Resolve a 404 path by creating a redirect and removing matching 404 log rows.
 */
export async function handleNotFoundResolve(
	db: Kysely<Database>,
	input: RedirectMutationInput,
): Promise<ApiResult<ResolvedNotFoundRedirect>> {
	try {
		return await db.transaction().execute(async (trx) => {
			const repo = new RedirectRepository(trx);
			const prepared = await prepareRedirectMutation(repo, {
				...input,
				groupName: input.groupName ?? "Resolved 404",
			});
			if (!prepared.success) {
				return prepared;
			}

			const redirect = await repo.create({
				source: prepared.data.source,
				destination: prepared.data.destination,
				type: prepared.data.type,
				isPattern: prepared.data.sourceIsPattern,
				enabled: prepared.data.enabled,
				groupName: prepared.data.groupName,
			});
			const deleted = await repo.delete404sByPath(prepared.data.source);

			return {
				success: true,
				data: {
					redirect,
					deleted,
				},
			};
		});
	} catch {
		return {
			success: false,
			error: { code: "NOT_FOUND_RESOLVE_ERROR", message: "Failed to resolve 404 path" },
		};
	}
}

/**
 * Clear all 404 log entries
 */
export async function handleNotFoundClear(
	db: Kysely<Database>,
): Promise<ApiResult<{ deleted: number }>> {
	try {
		const repo = new RedirectRepository(db);
		const deleted = await repo.clear404s();
		return { success: true, data: { deleted } };
	} catch {
		return {
			success: false,
			error: { code: "NOT_FOUND_CLEAR_ERROR", message: "Failed to clear 404 log" },
		};
	}
}

/**
 * Prune 404 log entries older than a given date
 */
export async function handleNotFoundPrune(
	db: Kysely<Database>,
	olderThan: string,
): Promise<ApiResult<{ deleted: number }>> {
	try {
		const repo = new RedirectRepository(db);
		const deleted = await repo.prune404s(olderThan);
		return { success: true, data: { deleted } };
	} catch {
		return {
			success: false,
			error: { code: "NOT_FOUND_PRUNE_ERROR", message: "Failed to prune 404 log" },
		};
	}
}
