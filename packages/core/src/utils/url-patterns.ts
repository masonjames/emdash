const URL_PARAM_PATTERN = /\{(\w+)\}/g;
const UNRESOLVED_URL_PARAM_PATTERN = /\{\w+\}/;
const REGEX_SPECIAL_PATTERN = /[.*+?^${}()|[\]\\]/g;

function escapeRegex(value: string): string {
	return value.replace(REGEX_SPECIAL_PATTERN, "\\$&");
}

function encodePathParam(value: string): string {
	return encodeURIComponent(value);
}

/**
 * Interpolate a URL pattern with named params.
 *
 * Unknown params are left in place so callers can detect unresolved placeholders.
 */
export function interpolateUrlPattern(
	pattern: string,
	params: Record<string, string | null | undefined>,
): string {
	return pattern.replace(URL_PARAM_PATTERN, (match, name: string) => {
		const value = params[name];
		if (!value) {
			return match;
		}
		return encodePathParam(value);
	});
}

/**
 * Resolve a content entry path from an optional collection URL pattern.
 *
 * Falls back to /{collection}/{slug-or-id} when no pattern is configured or when
 * the configured pattern contains placeholders we cannot satisfy.
 */
export function resolveContentEntryPath(options: {
	collection: string;
	slug: string | null;
	id: string;
	urlPattern?: string | null;
}): string {
	const identifier = options.slug || options.id;
	const fallback = `/${encodePathParam(options.collection)}/${encodePathParam(identifier)}`;

	if (!options.urlPattern) {
		return fallback;
	}

	const interpolated = interpolateUrlPattern(options.urlPattern, {
		slug: identifier,
		id: options.id,
	});
	return UNRESOLVED_URL_PARAM_PATTERN.test(interpolated) ? fallback : interpolated;
}

/** Convert a URL pattern like "/blog/{slug}" to a regex and param name list. */
export function patternToRegex(pattern: string): { regex: RegExp; paramNames: string[] } {
	const paramNames: string[] = [];
	let regexString = "";
	let lastIndex = 0;

	for (const match of pattern.matchAll(URL_PARAM_PATTERN)) {
		const [placeholder, name] = match;
		if (typeof name !== "string") continue;
		const matchIndex = match.index ?? 0;
		regexString += escapeRegex(pattern.slice(lastIndex, matchIndex));
		regexString += "([^/]+)";
		paramNames.push(name);
		lastIndex = matchIndex + placeholder.length;
	}

	regexString += escapeRegex(pattern.slice(lastIndex));
	return { regex: new RegExp(`^${regexString}$`), paramNames };
}
