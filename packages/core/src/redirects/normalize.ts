const MULTIPLE_SLASHES_REGEX = /\/{2,}/g;
const TRAILING_SLASHES_REGEX = /\/+$/g;

export type NormalizedDestination = {
	pathname: string;
	search: string;
	hash: string;
	href: string;
};

function splitPathInput(input: string): {
	pathname: string;
	search: string;
	hash: string;
} {
	let pathnameAndSearch = input;
	let hash = "";

	const hashIndex = pathnameAndSearch.indexOf("#");
	if (hashIndex >= 0) {
		hash = pathnameAndSearch.slice(hashIndex);
		pathnameAndSearch = pathnameAndSearch.slice(0, hashIndex);
	}

	let pathname = pathnameAndSearch;
	let search = "";

	const queryIndex = pathnameAndSearch.indexOf("?");
	if (queryIndex >= 0) {
		pathname = pathnameAndSearch.slice(0, queryIndex);
		search = pathnameAndSearch.slice(queryIndex);
	}

	return { pathname, search, hash };
}

function normalizePathname(pathname: string): string {
	const withLeadingSlash = pathname.startsWith("/") ? pathname : `/${pathname}`;
	const collapsed = withLeadingSlash.replace(MULTIPLE_SLASHES_REGEX, "/");

	if (collapsed === "/") {
		return "/";
	}

	const trimmed = collapsed.replace(TRAILING_SLASHES_REGEX, "");
	return trimmed === "" ? "/" : trimmed;
}

function normalizeSearch(search?: string): string {
	if (!search || search === "?") {
		return "";
	}

	return search.startsWith("?") ? search : `?${search}`;
}

export function normalizeRequestPath(pathname: string): string {
	return normalizePathname(pathname);
}

export function normalizeRedirectSourcePath(input: string): string {
	const { pathname, search, hash } = splitPathInput(input);

	if (search || hash) {
		throw new Error("Redirect sources must not include query strings or hash fragments");
	}

	return normalizePathname(pathname);
}

export function normalizeRedirectDestination(input: string): NormalizedDestination {
	const { pathname, search, hash } = splitPathInput(input);
	const normalizedPathname = normalizePathname(pathname);

	return {
		pathname: normalizedPathname,
		search,
		hash,
		href: `${normalizedPathname}${search}${hash}`,
	};
}

export function buildRedirectLocation(destination: string, requestSearch?: string): string {
	const normalized = normalizeRedirectDestination(destination);
	if (normalized.search) {
		return normalized.href;
	}

	const search = normalizeSearch(requestSearch);
	return `${normalized.pathname}${search}${normalized.hash}`;
}

export function normalizedPathnameEquals(a: string, b: string): boolean {
	return (
		normalizePathname(splitPathInput(a).pathname) === normalizePathname(splitPathInput(b).pathname)
	);
}
