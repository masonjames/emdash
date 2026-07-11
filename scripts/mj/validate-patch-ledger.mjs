#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ALLOWED_PATCH_STATUSES = new Set([
	"active",
	"local_only",
	"operational",
	"upstream_merged_pending_removal",
]);

const ALLOWED_UPSTREAM_STATUSES = new Set([
	"merged",
	"not_applicable",
	"not_submitted",
	"open_pr",
]);

const SHA_PATTERN = /^[0-9a-f]{40}$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const PATCH_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function nonEmptyStrings(value) {
	return (
		Array.isArray(value) &&
		value.length > 0 &&
		value.every((entry) => typeof entry === "string" && entry.trim())
	);
}

export function validatePatchLedger(
	ledger,
	{
		commitExists = () => true,
		commitOnProduction = () => true,
		commitOnUpstream = () => true,
		expectedProductionSha = null,
		expectedUpstreamSha = null,
	} = {},
) {
	const errors = [];
	const seenIds = new Set();
	const seenAnchors = new Set();

	if (!ledger || typeof ledger !== "object" || Array.isArray(ledger)) {
		return ["ledger must be a JSON object"];
	}
	if (ledger.schema_version !== 1) errors.push("schema_version must be 1");
	if (ledger.production_branch !== "mj/prod")
		errors.push("production_branch must be mj/prod");
	if (ledger.upstream_repository !== "emdash-cms/emdash") {
		errors.push("upstream_repository must be emdash-cms/emdash");
	}
	if (ledger.upstream_branch !== "main")
		errors.push("upstream_branch must be main");
	if (!ISO_DATE_PATTERN.test(ledger.last_reviewed ?? "")) {
		errors.push("last_reviewed must be an ISO date (YYYY-MM-DD)");
	}
	const reviewedProductionSha = ledger.reviewed_production_sha ?? "";
	const reviewedUpstreamSha = ledger.reviewed_upstream_sha ?? "";
	if (!SHA_PATTERN.test(reviewedProductionSha)) {
		errors.push("reviewed_production_sha must be a full commit SHA");
	} else {
		if (!commitExists(reviewedProductionSha)) {
			errors.push("reviewed_production_sha does not exist in this checkout");
		} else if (!commitOnProduction(reviewedProductionSha)) {
			errors.push(
				"reviewed_production_sha is not reachable from the production ref",
			);
		}
		if (expectedProductionSha !== null) {
			if (!SHA_PATTERN.test(expectedProductionSha)) {
				errors.push("expected production SHA must be a full commit SHA");
			} else if (reviewedProductionSha !== expectedProductionSha) {
				errors.push(
					`reviewed_production_sha must equal the PR base ${expectedProductionSha}`,
				);
			}
		}
	}
	if (!SHA_PATTERN.test(reviewedUpstreamSha)) {
		errors.push("reviewed_upstream_sha must be a full commit SHA");
	} else {
		if (!commitExists(reviewedUpstreamSha)) {
			errors.push("reviewed_upstream_sha does not exist in this checkout");
		} else if (!commitOnUpstream(reviewedUpstreamSha)) {
			errors.push(
				"reviewed_upstream_sha is not reachable from the upstream ref",
			);
		}
		if (expectedUpstreamSha !== null) {
			if (!SHA_PATTERN.test(expectedUpstreamSha)) {
				errors.push("expected upstream SHA must be a full commit SHA");
			} else if (reviewedUpstreamSha !== expectedUpstreamSha) {
				errors.push(
					`reviewed_upstream_sha must equal the fetched upstream tip ${expectedUpstreamSha}`,
				);
			}
		}
	}
	if (!Array.isArray(ledger.patch_sets) || ledger.patch_sets.length === 0) {
		errors.push("patch_sets must contain at least one patch set");
		return errors;
	}

	for (const [index, patchSet] of ledger.patch_sets.entries()) {
		const prefix = `patch_sets[${index}]`;
		if (!patchSet || typeof patchSet !== "object" || Array.isArray(patchSet)) {
			errors.push(`${prefix} must be an object`);
			continue;
		}

		if (
			typeof patchSet.id !== "string" ||
			!PATCH_ID_PATTERN.test(patchSet.id)
		) {
			errors.push(`${prefix}.id must be a kebab-case identifier`);
		} else if (seenIds.has(patchSet.id)) {
			errors.push(`${prefix}.id duplicates ${patchSet.id}`);
		} else {
			seenIds.add(patchSet.id);
		}

		if (typeof patchSet.summary !== "string" || !patchSet.summary.trim()) {
			errors.push(`${prefix}.summary must be non-empty`);
		}
		if (!ALLOWED_PATCH_STATUSES.has(patchSet.status)) {
			errors.push(`${prefix}.status is not supported`);
		}
		if (!nonEmptyStrings(patchSet.owners))
			errors.push(`${prefix}.owners must be non-empty`);
		if (!nonEmptyStrings(patchSet.files))
			errors.push(`${prefix}.files must be non-empty`);
		if (!nonEmptyStrings(patchSet.tests))
			errors.push(`${prefix}.tests must be non-empty`);
		if (!nonEmptyStrings(patchSet.removal_criteria)) {
			errors.push(`${prefix}.removal_criteria must be non-empty`);
		}

		if (
			!patchSet.upstream ||
			!ALLOWED_UPSTREAM_STATUSES.has(patchSet.upstream.status)
		) {
			errors.push(`${prefix}.upstream.status is not supported`);
		} else if (["merged", "open_pr"].includes(patchSet.upstream.status)) {
			if (
				!Number.isInteger(patchSet.upstream.pull_request) ||
				patchSet.upstream.pull_request < 1
			) {
				errors.push(
					`${prefix}.upstream.pull_request must be a positive integer`,
				);
			}
			if (
				typeof patchSet.upstream.url !== "string" ||
				!patchSet.upstream.url.startsWith("https://github.com/")
			) {
				errors.push(`${prefix}.upstream.url must be a GitHub URL`);
			}
		}

		if (
			!Array.isArray(patchSet.commit_anchors) ||
			patchSet.commit_anchors.length === 0
		) {
			errors.push(`${prefix}.commit_anchors must be non-empty`);
			continue;
		}
		for (const [anchorIndex, anchor] of patchSet.commit_anchors.entries()) {
			const anchorPrefix = `${prefix}.commit_anchors[${anchorIndex}]`;
			if (!anchor || typeof anchor !== "object" || Array.isArray(anchor)) {
				errors.push(`${anchorPrefix} must be an object`);
				continue;
			}
			if (!SHA_PATTERN.test(anchor.sha ?? "")) {
				errors.push(`${anchorPrefix}.sha must be a full commit SHA`);
				continue;
			}
			if (typeof anchor.role !== "string" || !anchor.role.trim()) {
				errors.push(`${anchorPrefix}.role must be non-empty`);
			}
			if (seenAnchors.has(anchor.sha)) {
				errors.push(`${anchorPrefix}.sha duplicates ${anchor.sha}`);
			} else {
				seenAnchors.add(anchor.sha);
			}
			if (!commitExists(anchor.sha))
				errors.push(`${anchorPrefix}.sha does not exist in this checkout`);
			if (!commitOnProduction(anchor.sha)) {
				errors.push(
					`${anchorPrefix}.sha is not reachable from the production ref`,
				);
			}
		}
	}

	return errors;
}

function git(args, { allowFailure = false } = {}) {
	try {
		return execFileSync("git", args, {
			encoding: "utf8",
			stdio: ["ignore", "pipe", "pipe"],
		}).trim();
	} catch (error) {
		if (allowFailure) return null;
		throw error;
	}
}

function parseArgs(argv) {
	const options = {
		expectedProductionSha: null,
		expectedUpstreamSha: null,
		ledger: "docs/operations/mj-patch-ledger.json",
		productionRef: "HEAD",
		upstreamRef: "origin/main",
		json: false,
	};
	for (let index = 0; index < argv.length; index += 1) {
		const arg = argv[index];
		if (arg === "--json") {
			options.json = true;
		} else if (
			[
				"--expected-production-sha",
				"--expected-upstream-sha",
				"--ledger",
				"--production-ref",
				"--upstream-ref",
			].includes(arg)
		) {
			const value = argv[index + 1];
			if (!value) throw new Error(`${arg} requires a value`);
			index += 1;
			if (arg === "--expected-production-sha")
				options.expectedProductionSha = value;
			if (arg === "--expected-upstream-sha")
				options.expectedUpstreamSha = value;
			if (arg === "--ledger") options.ledger = value;
			if (arg === "--production-ref") options.productionRef = value;
			if (arg === "--upstream-ref") options.upstreamRef = value;
		} else {
			throw new Error(`unknown argument: ${arg}`);
		}
	}
	return options;
}

function main() {
	const options = parseArgs(process.argv.slice(2));
	const ledgerPath = path.resolve(options.ledger);
	const ledger = JSON.parse(fs.readFileSync(ledgerPath, "utf8"));
	const upstreamExists =
		git(["rev-parse", "--verify", options.upstreamRef], {
			allowFailure: true,
		}) !== null;
	const errors = validatePatchLedger(ledger, {
		commitExists: (sha) =>
			git(["cat-file", "-e", `${sha}^{commit}`], { allowFailure: true }) !==
			null,
		commitOnProduction: (sha) =>
			git(["merge-base", "--is-ancestor", sha, options.productionRef], {
				allowFailure: true,
			}) !== null,
		commitOnUpstream: (sha) =>
			upstreamExists &&
			git(["merge-base", "--is-ancestor", sha, options.upstreamRef], {
				allowFailure: true,
			}) !== null,
		expectedProductionSha: options.expectedProductionSha,
		expectedUpstreamSha: options.expectedUpstreamSha,
	});
	const summary = {
		ledger: path.relative(process.cwd(), ledgerPath),
		patch_sets: ledger.patch_sets?.length ?? 0,
		production_ref: git(["rev-parse", options.productionRef]),
		upstream_ref: upstreamExists
			? git(["rev-parse", options.upstreamRef])
			: null,
		upstream_commits_not_in_production: upstreamExists
			? Number(
					git([
						"rev-list",
						"--count",
						`${options.productionRef}..${options.upstreamRef}`,
					]),
				)
			: null,
		production_commits_not_in_upstream: upstreamExists
			? Number(
					git([
						"rev-list",
						"--count",
						`${options.upstreamRef}..${options.productionRef}`,
					]),
				)
			: null,
		errors,
	};

	if (options.json) {
		console.log(JSON.stringify(summary));
	} else if (errors.length === 0) {
		console.log(
			`Patch ledger valid: ${summary.patch_sets} patch sets; upstream lag ${summary.upstream_commits_not_in_production ?? "unknown"} commits`,
		);
	} else {
		for (const error of errors) console.error(`- ${error}`);
	}

	if (errors.length > 0) process.exitCode = 1;
}

if (
	process.argv[1] &&
	path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
	main();
}
