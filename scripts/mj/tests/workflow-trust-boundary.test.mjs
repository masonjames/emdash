import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const READ_PERMISSIONS_PATTERN = /permissions:\n\s+contents: read/;
const SECRET_CONTEXT_PATTERN = /secrets\./;
const REPOSITORY_PROGRAM_PATTERN = /\b(?:node|pnpm|npm|yarn|bun)\b/;
const PRODUCTION_REF_PATTERN = /EVENT_REF.*refs\/heads\/mj\/prod/s;
const SYNC_TOKEN_PATTERN = /secrets\.MJ_SYNC_TOKEN/;
const TREE_COMPARISON_PATTERN = /actual_tree.*EXPECTED_TREE/s;
const UPSTREAM_COMPARISON_PATTERN =
	/actual_upstream_sha.*EXPECTED_UPSTREAM_SHA/s;
const BASE_COMPARISON_PATTERN = /current_base.*EXPECTED_BASE_SHA/s;
const TRUSTED_CHECKOUT_PATTERN =
	/ref: \$\{\{ needs\.prepare\.outputs\.production_sha \}\}/;
const GITHUB_TOKEN_PATTERN = /GH_TOKEN: \$\{\{ github\.token \}\}/;
const REPORTER_PATTERN = /node scripts\/mj\/report-upstream-failure\.mjs/;

const workflow = fs.readFileSync(
	new URL("../../../.github/workflows/mj-sync-upstream.yml", import.meta.url),
	"utf8",
);

function jobBlock(name, nextName) {
	const startMarker = `\n  ${name}:\n`;
	const endMarker = `\n  ${nextName}:\n`;
	const start = workflow.indexOf(startMarker);
	const end = workflow.indexOf(endMarker, start + startMarker.length);
	assert(start >= 0, `missing job ${name}`);
	assert(end > start, `missing job boundary after ${name}`);
	return workflow.slice(start, end);
}

await test("preparation is read-only and executes no repository program", () => {
	const prepare = jobBlock("prepare", "report-preparation-failure");
	assert.match(prepare, READ_PERMISSIONS_PATTERN);
	assert.doesNotMatch(prepare, SECRET_CONTEXT_PATTERN);
	assert.doesNotMatch(prepare, REPOSITORY_PROGRAM_PATTERN);
	assert.match(prepare, PRODUCTION_REF_PATTERN);
});

await test("publication reproduces the tree without executing candidate code", () => {
	const publish = jobBlock("publish", "report-publication-failure");
	assert.match(publish, SYNC_TOKEN_PATTERN);
	assert.match(publish, TREE_COMPARISON_PATTERN);
	assert.match(publish, UPSTREAM_COMPARISON_PATTERN);
	assert.match(publish, BASE_COMPARISON_PATTERN);
	assert.doesNotMatch(publish, REPOSITORY_PROGRAM_PATTERN);
});

await test("failure reporters run from the exact trusted production commit", () => {
	for (const report of [
		jobBlock("report-preparation-failure", "publish"),
		workflow.slice(workflow.indexOf("\n  report-publication-failure:\n")),
	]) {
		assert.match(report, TRUSTED_CHECKOUT_PATTERN);
		assert.match(report, GITHUB_TOKEN_PATTERN);
		assert.match(report, REPORTER_PATTERN);
		assert.doesNotMatch(report, SECRET_CONTEXT_PATTERN);
	}
});
