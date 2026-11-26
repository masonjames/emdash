/**
 * Under Astro's `trailingSlash: "always"`, a route only matches its slashed
 * path, but the admin, API clients, OAuth and MCP clients all request
 * EmDash's routes without one. Returns the slashed URL to rewrite to, or null.
 */

const EMDASH_WELL_KNOWN_PATHS = new Set([
	"/.well-known/oauth-protected-resource",
	"/.well-known/oauth-authorization-server/_emdash",
]);

const FILE_EXTENSION_RE = /\.[^/]+$/;

export function emdashTrailingSlashRewrite(
	url: URL,
	trailingSlash: "always" | "never" | "ignore" | undefined,
): URL | null {
	if (trailingSlash !== "always") return null;
	const { pathname } = url;
	if (pathname.endsWith("/") || FILE_EXTENSION_RE.test(pathname)) return null;
	const isEmDashPath =
		pathname === "/_emdash" ||
		pathname.startsWith("/_emdash/") ||
		EMDASH_WELL_KNOWN_PATHS.has(pathname);
	if (!isEmDashPath) return null;
	const target = new URL(url);
	target.pathname = `${pathname}/`;
	return target;
}
