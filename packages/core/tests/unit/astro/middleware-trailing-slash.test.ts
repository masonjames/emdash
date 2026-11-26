import { describe, expect, it } from "vitest";

import { emdashTrailingSlashRewrite } from "../../../src/astro/middleware/trailing-slash.js";

function rewrite(path: string, trailingSlash: "always" | "never" | "ignore" | undefined) {
	return emdashTrailingSlashRewrite(new URL(path, "https://example.com"), trailingSlash)?.href;
}

describe("emdashTrailingSlashRewrite", () => {
	it("slashes EmDash routes under trailingSlash always, keeping the query", () => {
		expect(rewrite("/_emdash/api/health", "always")).toBe(
			"https://example.com/_emdash/api/health/",
		);
		expect(rewrite("/_emdash/oauth/authorize?client_id=a&state=b", "always")).toBe(
			"https://example.com/_emdash/oauth/authorize/?client_id=a&state=b",
		);
		expect(rewrite("/_emdash", "always")).toBe("https://example.com/_emdash/");
	});

	it("slashes the OAuth discovery documents MCP clients fetch", () => {
		expect(rewrite("/.well-known/oauth-protected-resource", "always")).toBe(
			"https://example.com/.well-known/oauth-protected-resource/",
		);
		expect(rewrite("/.well-known/oauth-authorization-server/_emdash", "always")).toBe(
			"https://example.com/.well-known/oauth-authorization-server/_emdash/",
		);
	});

	it("leaves slashed paths, files and site routes alone", () => {
		expect(rewrite("/_emdash/api/health/", "always")).toBeUndefined();
		expect(rewrite("/_emdash/api/media/file/photo.jpg", "always")).toBeUndefined();
		expect(rewrite("/blog/post", "always")).toBeUndefined();
		expect(rewrite("/.well-known/security.txt", "always")).toBeUndefined();
		expect(rewrite("/_emdashfoo", "always")).toBeUndefined();
	});

	it("does nothing unless trailingSlash is always", () => {
		for (const policy of ["ignore", "never", undefined] as const) {
			expect(rewrite("/_emdash/api/health", policy)).toBeUndefined();
		}
	});
});
