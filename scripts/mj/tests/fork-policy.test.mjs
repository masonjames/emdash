import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../../../", import.meta.url));
const workflowsDir = path.join(repoRoot, ".github", "workflows");
const workflowFiles = fs
	.readdirSync(workflowsDir)
	.filter((name) => name.endsWith(".yml") || name.endsWith(".yaml"))
	.toSorted();

await test("the fork contains exactly one GitHub Actions workflow", () => {
	assert.deepEqual(workflowFiles, ["mj-sync-upstream.yml"]);
});

const workflow = fs.readFileSync(
	path.join(workflowsDir, "mj-sync-upstream.yml"),
	"utf8",
);

await test("the release watcher cannot react to contributors or pull requests", () => {
	for (const forbidden of [
		/\bpull_request_target:/,
		/\bpull_request:/,
		/\bissue_comment:/,
		/\bpull_request_review/,
		/\bworkflow_run:/,
		/contributor-assistant/i,
		/\bCLA Assistant\b/i,
		/\blunaria\b/i,
		/scope-guard/i,
	]) {
		assert.doesNotMatch(workflow, forbidden);
	}
});

await test("only pinned GitHub-owned actions are used", () => {
	const uses = [...workflow.matchAll(/^\s*uses:\s*([^\s#]+)/gm)].map(
		(match) => match[1],
	);
	assert.ok(uses.length > 0);
	for (const action of uses) {
		assert.match(action, /^actions\/checkout@[0-9a-f]{40}$/);
	}
});

await test("upstream GitHub metadata and contributor identities stay out", () => {
	assert.match(workflow, /':\(exclude\)\.github'/);
	assert.match(
		workflow,
		/41898282\+github-actions\[bot\]@users\.noreply\.github\.com/,
	);
	assert.doesNotMatch(workflow, /gh\s+(?:issue|pr\s+comment)\b/);
});

await test("upstream bot configuration is absent", () => {
	for (const relativePath of [
		".github/dependabot.yml",
		".github/bonk-models.json",
		".github/zizmor.yml",
	]) {
		assert.equal(fs.existsSync(path.join(repoRoot, relativePath)), false);
	}
	const scriptsDirectory = path.join(repoRoot, ".github", "scripts");
	if (fs.existsSync(scriptsDirectory)) {
		assert.deepEqual(fs.readdirSync(scriptsDirectory), []);
	}
});
