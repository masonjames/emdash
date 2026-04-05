import { describe, expect, it } from "vitest";

import { injectCoreRoutes } from "../../../src/astro/integration/routes.js";

describe("core media route injection", () => {
	it("uses a catch-all media file route so storage keys can contain slashes", () => {
		const routes: Array<{ pattern: string; entrypoint: string }> = [];
		injectCoreRoutes((route) => {
			routes.push(route);
		});

		expect(routes).toContainEqual(
			expect.objectContaining({
				pattern: "/_emdash/api/media/file/[...key]",
				entrypoint: expect.stringContaining("api/media/file/[...key].ts"),
			}),
		);
	});
});
