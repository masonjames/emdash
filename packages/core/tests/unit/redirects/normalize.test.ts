import { describe, expect, it } from "vitest";

import {
	buildRedirectLocation,
	normalizeRedirectDestination,
	normalizeRedirectSourcePath,
	normalizeRequestPath,
	normalizedPathnameEquals,
} from "../../../src/redirects/normalize.js";

describe("redirect normalization", () => {
	describe("normalizeRequestPath", () => {
		it("adds a leading slash", () => {
			expect(normalizeRequestPath("about")).toBe("/about");
		});

		it("collapses duplicate slashes", () => {
			expect(normalizeRequestPath("//foo///bar/")).toBe("/foo/bar");
		});

		it("preserves root", () => {
			expect(normalizeRequestPath("/")).toBe("/");
		});

		it("removes trailing slashes for non-root paths", () => {
			expect(normalizeRequestPath("/foo/")).toBe("/foo");
		});
	});

	describe("normalizeRedirectSourcePath", () => {
		it("normalizes redirect source paths", () => {
			expect(normalizeRedirectSourcePath("foo/")).toBe("/foo");
		});

		it("rejects query strings", () => {
			expect(() => normalizeRedirectSourcePath("/foo?bar=baz")).toThrow(
				"Redirect sources must not include query strings or hash fragments",
			);
		});

		it("rejects hash fragments", () => {
			expect(() => normalizeRedirectSourcePath("/foo#section")).toThrow(
				"Redirect sources must not include query strings or hash fragments",
			);
		});
	});

	describe("normalizeRedirectDestination", () => {
		it("normalizes the pathname and preserves query and hash", () => {
			expect(normalizeRedirectDestination("foo//bar/?a=1#frag")).toEqual({
				pathname: "/foo/bar",
				search: "?a=1",
				hash: "#frag",
				href: "/foo/bar?a=1#frag",
			});
		});
	});

	describe("buildRedirectLocation", () => {
		it("preserves the request query when the destination has none", () => {
			expect(buildRedirectLocation("/target", "?utm=1")).toBe("/target?utm=1");
		});

		it("does not merge request query when destination already has one", () => {
			expect(buildRedirectLocation("/target?fixed=1", "?utm=1")).toBe("/target?fixed=1");
		});

		it("preserves hash fragments when appending request query", () => {
			expect(buildRedirectLocation("/target#frag", "?utm=1")).toBe("/target?utm=1#frag");
		});
	});

	describe("normalizedPathnameEquals", () => {
		it("treats trailing slash variants as equal", () => {
			expect(normalizedPathnameEquals("/about", "/about/")).toBe(true);
		});

		it("ignores query and hash differences", () => {
			expect(normalizedPathnameEquals("/about?x=1", "/about/#frag")).toBe(true);
		});
	});
});
