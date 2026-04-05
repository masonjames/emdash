import type { Kysely } from "kysely";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
	handleNotFoundDelete,
	handleNotFoundResolve,
	handleRedirectCreate,
} from "../../../src/api/handlers/redirects.js";
import { RedirectRepository } from "../../../src/database/repositories/redirect.js";
import type { Database } from "../../../src/database/types.js";
import { setupTestDatabase, teardownTestDatabase } from "../../utils/test-db.js";

describe("redirect handlers", () => {
	let db: Kysely<Database>;

	beforeEach(async () => {
		db = await setupTestDatabase();
	});

	afterEach(async () => {
		await teardownTestDatabase(db);
	});

	it("normalizes redirect create input", async () => {
		const result = await handleRedirectCreate(db, {
			source: "/old/",
			destination: "/new//path/?a=1#frag",
		});

		expect(result.success).toBe(true);
		expect(result.data!.source).toBe("/old");
		expect(result.data!.destination).toBe("/new/path?a=1#frag");
	});

	it("rejects exact redirect loops", async () => {
		await handleRedirectCreate(db, { source: "/b", destination: "/a" });
		const result = await handleRedirectCreate(db, { source: "/a", destination: "/b" });

		expect(result.success).toBe(false);
		expect(result.error?.code).toBe("CONFLICT");
		expect(result.error?.message).toContain("redirect loop");
	});

	it("resolves 404 paths by creating a redirect and deleting normalized log rows", async () => {
		const repo = new RedirectRepository(db);
		await repo.log404({ path: "/missing/page" });
		await db
			.insertInto("_emdash_404_log")
			.values({
				id: "legacy-missing-page",
				path: "/missing/page/",
				referrer: null,
				user_agent: null,
				ip: null,
				created_at: new Date().toISOString(),
			})
			.execute();

		const result = await handleNotFoundResolve(db, {
			source: "/missing/page",
			destination: "/new-page",
		});

		expect(result.success).toBe(true);
		expect(result.data!.redirect.source).toBe("/missing/page");
		expect(result.data!.redirect.destination).toBe("/new-page");
		expect(result.data!.redirect.groupName).toBe("Resolved 404");
		expect(result.data!.deleted).toBe(2);
		expect((await repo.find404s({})).items).toHaveLength(0);
	});

	it("returns not found when deleting a missing 404 log entry", async () => {
		const result = await handleNotFoundDelete(db, "missing-404-entry");

		expect(result.success).toBe(false);
		expect(result.error?.code).toBe("NOT_FOUND");
	});
});
