/**
 * 404 log entry endpoint
 *
 * DELETE /_emdash/api/redirects/404s/:id - Delete a single 404 log entry
 */

import type { APIRoute } from "astro";

import { requirePerm } from "#api/authorize.js";
import { apiError, handleError, unwrapResult } from "#api/error.js";
import { handleNotFoundDelete } from "#api/handlers/redirects.js";

export const prerender = false;

export const DELETE: APIRoute = async ({ params, locals }) => {
	const { emdash, user } = locals;
	const db = emdash.db;
	const { id } = params;

	const denied = requirePerm(user, "redirects:manage");
	if (denied) return denied;

	if (!id) {
		return apiError("VALIDATION_ERROR", "id is required", 400);
	}

	try {
		const result = await handleNotFoundDelete(db, id);
		return unwrapResult(result);
	} catch (error) {
		return handleError(error, "Failed to delete 404 log entry", "NOT_FOUND_DELETE_ERROR");
	}
};
