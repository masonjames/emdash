import assert from "node:assert/strict";
import test from "node:test";

import {
	buildFailureBody,
	issueTitle,
	sanitizeDetail,
} from "../report-upstream-failure.mjs";

const UPSTREAM_SHA = "a".repeat(40);
const PRODUCTION_SHA = "b".repeat(40);

await test("deduplication title includes stage and candidate SHA", () => {
	assert.equal(
		issueTitle("conflict", UPSTREAM_SHA),
		"[automation] EmDash upstream conflict blocked at aaaaaaaaaaaa",
	);
});

await test("sanitizes credentials from captured evidence", () => {
	const detail =
		"https://bot:password@github.com Bearer secret ghp_ABC123 ghs_DEF456 github_pat_ABC_123 ```";
	const sanitized = sanitizeDetail(detail);
	assert(!sanitized.includes("password"));
	assert(!sanitized.includes("secret"));
	assert(!sanitized.includes("ghp_ABC123"));
	assert(!sanitized.includes("ghs_DEF456"));
	assert(!sanitized.includes("github_pat_ABC_123"));
	assert(!sanitized.includes("```"));
});

await test("failure body records immutable inputs and fresh-worktree guidance", () => {
	const body = buildFailureBody({
		stage: "verification",
		upstreamSha: UPSTREAM_SHA,
		productionSha: PRODUCTION_SHA,
		runUrl: "https://github.com/masonjames/emdash/actions/runs/123",
		detail: "typecheck failed",
	});
	assert(body.includes(UPSTREAM_SHA));
	assert(body.includes(PRODUCTION_SHA));
	assert(body.includes("fresh branch or worktree"));
	assert(body.includes("production source branch moved"));
	assert(body.includes("site vendoring and deployment did not run"));
});

await test("pre-production failures do not claim the production source moved", () => {
	const body = buildFailureBody({
		stage: "publication",
		upstreamSha: UPSTREAM_SHA,
		productionSha: PRODUCTION_SHA,
		runUrl: "https://github.com/masonjames/emdash/actions/runs/456",
		detail: "tree mismatch",
	});
	assert(body.includes("before any production-source"));
	assert(!body.includes("production source branch moved"));
});
