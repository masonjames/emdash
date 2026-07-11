import assert from "node:assert/strict";
import test from "node:test";

import { validatePatchLedger } from "../validate-patch-ledger.mjs";

const SHA_A = "a".repeat(40);
const SHA_B = "b".repeat(40);

function validLedger() {
	return {
		schema_version: 1,
		production_branch: "mj/prod",
		upstream_repository: "emdash-cms/emdash",
		upstream_branch: "main",
		last_reviewed: "2026-07-11",
		reviewed_production_sha: SHA_A,
		reviewed_upstream_sha: SHA_B,
		patch_sets: [
			{
				id: "example-patch",
				summary: "Example carried behavior",
				status: "active",
				owners: ["masonjames"],
				files: ["example.ts"],
				tests: ["pnpm test"],
				removal_criteria: [
					"Equivalent upstream behavior is released and verified.",
				],
				upstream: { status: "not_submitted" },
				commit_anchors: [{ sha: SHA_A, role: "implementation" }],
			},
		],
	};
}

await test("accepts a complete patch ledger", () => {
	assert.deepEqual(validatePatchLedger(validLedger()), []);
});

await test("requires regression tests and removal criteria", () => {
	const ledger = validLedger();
	ledger.patch_sets[0].tests = [];
	ledger.patch_sets[0].removal_criteria = [];
	const errors = validatePatchLedger(ledger);
	assert(errors.some((error) => error.includes(".tests")));
	assert(errors.some((error) => error.includes(".removal_criteria")));
});

await test("rejects duplicate commit anchors", () => {
	const ledger = validLedger();
	ledger.patch_sets.push({
		...ledger.patch_sets[0],
		id: "second-patch",
		commit_anchors: [{ sha: SHA_A, role: "duplicate" }],
	});
	assert(
		validatePatchLedger(ledger).some((error) => error.includes("duplicates")),
	);
});

await test("requires upstream PR metadata for an open PR", () => {
	const ledger = validLedger();
	ledger.patch_sets[0].upstream = { status: "open_pr" };
	const errors = validatePatchLedger(ledger);
	assert(errors.some((error) => error.includes("pull_request")));
	assert(errors.some((error) => error.includes("upstream.url")));
});

await test("requires reviewed SHAs to exist on their respective refs", () => {
	const errors = validatePatchLedger(validLedger(), {
		commitExists: (sha) => sha !== SHA_B,
		commitOnProduction: (sha) => sha === SHA_A,
		commitOnUpstream: () => false,
	});
	assert(
		errors.some((error) =>
			error.includes("reviewed_upstream_sha does not exist"),
		),
	);

	const unreachable = validatePatchLedger(validLedger(), {
		commitExists: () => true,
		commitOnProduction: () => false,
		commitOnUpstream: () => false,
	});
	assert(
		unreachable.some((error) =>
			error.includes("reviewed_production_sha is not reachable"),
		),
	);
	assert(
		unreachable.some((error) =>
			error.includes("reviewed_upstream_sha is not reachable"),
		),
	);
});

await test("can require reviewed SHAs to match the PR base and fetched upstream tip", () => {
	assert.deepEqual(
		validatePatchLedger(validLedger(), {
			expectedProductionSha: SHA_A,
			expectedUpstreamSha: SHA_B,
		}),
		[],
	);

	const errors = validatePatchLedger(validLedger(), {
		expectedProductionSha: "c".repeat(40),
		expectedUpstreamSha: "d".repeat(40),
	});
	assert(errors.some((error) => error.includes("must equal the PR base")));
	assert(
		errors.some((error) =>
			error.includes("must equal the fetched upstream tip"),
		),
	);
});
