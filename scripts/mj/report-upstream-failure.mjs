#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const SHA_PATTERN = /^[0-9a-f]{40}$/;
const ALLOWED_STAGES = new Set([
	"conflict",
	"dispatch",
	"preparation",
	"publication",
	"verification",
]);
const ANSI_ESCAPE_PATTERN = new RegExp(
	`${String.fromCharCode(27)}\\[[0-9;]*m`,
	"g",
);

function stripControlCharacters(value) {
	return [...value]
		.filter((character) => {
			const code = character.codePointAt(0);
			return (
				code === 9 || code === 10 || code === 13 || (code >= 32 && code !== 127)
			);
		})
		.join("");
}

export function sanitizeDetail(value) {
	return stripControlCharacters(value.replaceAll(ANSI_ESCAPE_PATTERN, ""))
		.replaceAll(/https:\/\/[^\s/@]+:[^\s/@]+@/g, "https://***:***@")
		.replaceAll(
			/\b(?:gh[oprsu]|github_pat)_[A-Za-z0-9_]+\b/g,
			"[REDACTED_GITHUB_TOKEN]",
		)
		.replaceAll(/Bearer\s+[^\s]+/gi, "Bearer [REDACTED]")
		.replaceAll("```", "'''")
		.slice(0, 12_000);
}

export function issueTitle(stage, upstreamSha) {
	if (!ALLOWED_STAGES.has(stage))
		throw new Error(`unsupported failure stage: ${stage}`);
	if (!SHA_PATTERN.test(upstreamSha))
		throw new Error("upstream SHA must be a full commit SHA");
	return `[automation] EmDash upstream ${stage} blocked at ${upstreamSha.slice(0, 12)}`;
}

export function buildFailureBody({
	stage,
	upstreamSha,
	productionSha,
	runUrl,
	detail,
}) {
	if (!SHA_PATTERN.test(productionSha))
		throw new Error("production SHA must be a full commit SHA");
	const impact =
		stage === "verification"
			? "The production source branch moved to this commit, but site vendoring and deployment did not run."
			: "The automated EmDash maintenance lane stopped before any production-source, site-vendoring, or deployment change.";
	const productionLabel =
		stage === "verification"
			? "Production source commit"
			: "Starting `mj/prod` commit";
	return [
		`<!-- emdash-upstream:${stage}:${upstreamSha} -->`,
		impact,
		"",
		`- Failure stage: \`${stage}\``,
		`- Candidate upstream commit: \`${upstreamSha}\``,
		`- ${productionLabel}: \`${productionSha}\``,
		`- Workflow run: ${runUrl}`,
		"- Owner: @masonjames",
		"- Patch ledger: `docs/operations/mj-patch-ledger.json`",
		"",
		"Sanitized evidence:",
		"```text",
		sanitizeDetail(detail || "No additional detail was captured."),
		"```",
		"",
		"Resolve this in a fresh branch or worktree. Do not merge inside a shared interactive checkout and do not auto-resolve conflicts in the patch ledger or migration history.",
	].join("\n");
}

function gh(args, env) {
	return execFileSync("gh", args, {
		encoding: "utf8",
		env,
		stdio: ["ignore", "pipe", "pipe"],
	}).trim();
}

function requiredEnv(name) {
	const value = process.env[name];
	if (!value) throw new Error(`${name} is required`);
	return value;
}

function main() {
	const stage = requiredEnv("MJ_FAILURE_STAGE");
	const upstreamSha = requiredEnv("MJ_UPSTREAM_SHA");
	const productionSha = requiredEnv("MJ_PRODUCTION_SHA");
	const runUrl = requiredEnv("MJ_RUN_URL");
	const repository = requiredEnv("GH_REPOSITORY");
	const detailFile = process.env.MJ_DETAIL_FILE;
	const detail =
		detailFile && fs.existsSync(detailFile)
			? fs.readFileSync(detailFile, "utf8")
			: "";
	const title = issueTitle(stage, upstreamSha);
	const body = buildFailureBody({
		stage,
		upstreamSha,
		productionSha,
		runUrl,
		detail,
	});
	const env = { ...process.env, GH_PROMPT_DISABLED: "1" };

	for (const [label, color, description] of [
		[
			"automated-maintenance",
			"1d76db",
			"Created by an automated maintenance workflow",
		],
		["emdash-upstream-sync", "5319e7", "Mason fork upstream synchronization"],
		[
			"severity:medium",
			"fbca04",
			"Automated maintenance requires review; site deployment remains gated",
		],
	]) {
		gh(
			[
				"label",
				"create",
				label,
				"--repo",
				repository,
				"--color",
				color,
				"--description",
				description,
				"--force",
			],
			env,
		);
	}

	const candidates = JSON.parse(
		gh(
			[
				"issue",
				"list",
				"--repo",
				repository,
				"--state",
				"all",
				"--search",
				`${title} in:title`,
				"--json",
				"number,state,title",
				"--limit",
				"20",
			],
			env,
		) || "[]",
	);
	const existing = candidates.find((issue) => issue.title === title);
	const bodyFile = path.join(os.tmpdir(), `emdash-upstream-${process.pid}.md`);
	fs.writeFileSync(bodyFile, body, { mode: 0o600 });
	try {
		if (existing) {
			if (existing.state === "CLOSED") {
				gh(
					["issue", "reopen", String(existing.number), "--repo", repository],
					env,
				);
			}
			gh(
				[
					"issue",
					"edit",
					String(existing.number),
					"--repo",
					repository,
					"--add-assignee",
					"masonjames",
					"--add-label",
					"automated-maintenance,emdash-upstream-sync,severity:medium",
				],
				env,
			);
			gh(
				[
					"issue",
					"comment",
					String(existing.number),
					"--repo",
					repository,
					"--body-file",
					bodyFile,
				],
				env,
			);
			console.log(`Updated issue #${existing.number}`);
		} else {
			const url = gh(
				[
					"issue",
					"create",
					"--repo",
					repository,
					"--title",
					title,
					"--body-file",
					bodyFile,
					"--assignee",
					"masonjames",
					"--label",
					"automated-maintenance,emdash-upstream-sync,severity:medium",
				],
				env,
			);
			console.log(url);
		}
	} finally {
		fs.rmSync(bodyFile, { force: true });
	}
}

if (import.meta.url === `file://${process.argv[1]}`) {
	main();
}
