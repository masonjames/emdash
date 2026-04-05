/**
 * 404 resolution endpoint
 *
 * POST /_emdash/api/redirects/404s/resolve - Create a redirect and clear matching 404 log rows
 */

import type { APIRoute } from "astro";

import { requirePerm } from "#api/authorize.js";
import { handleError, unwrapResult } from "#api/error.js";
import { handleNotFoundResolve } from "#api/handlers/redirects.js";
import { isParseError, parseBody } from "#api/parse.js";
import { notFoundResolveBody } from "#api/schemas.js";

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
	const { emdash, user } = locals;
	const db = emdash.db;

	const denied = requirePerm(user, "redirects:manage");
	if (denied) return denied;

	try {
		const body = await parseBody(request, notFoundResolveBody);
		if (isParseError(body)) return body;

		const result = await handleNotFoundResolve(db, body);
		return unwrapResult(result, 201);
	} catch (error) {
		return handleError(error, "Failed to resolve 404 path", "NOT_FOUND_RESOLVE_ERROR");
	}
};
