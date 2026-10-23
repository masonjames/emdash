import { randomUUID } from "node:crypto";

import { SqliteDialect } from "kysely";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { NodeSqliteCompatDatabase as Database } from "#node-sqlite";

import { createPlugin } from "../../../../plugins/forms/src/index.js";
import type { ContentMapping } from "../../../../plugins/forms/src/types.js";
import { waitForDeferredTasks } from "../../../src/deferred-tasks.js";
import { EmDashRuntime } from "../../../src/emdash-runtime.js";
import { setI18nConfig } from "../../../src/i18n/config.js";

vi.mock("emdash", async () => await import("../../../src/index.js"));

describe("forms content mapping through the runtime", () => {
	let runtime: EmDashRuntime;

	beforeEach(async () => {
		const sqlite = new Database(":memory:");
		runtime = await EmDashRuntime.create({
			config: {
				database: { entrypoint: `test-forms-mapping-${randomUUID()}`, config: {}, type: "sqlite" },
			},
			createDialect: () => new SqliteDialect({ database: sqlite }),
			createStorage: null,
			plugins: [createPlugin()],
			sandboxEnabled: false,
			sandboxedPluginEntries: [],
			createSandboxRunner: null,
		});
		setI18nConfig({ defaultLocale: "fr", locales: ["en", "fr"] });
		await runtime.schemaRegistry.createCollection({
			slug: "events",
			label: "Events",
			supports: ["drafts"],
		});
		await runtime.schemaRegistry.createField("events", {
			slug: "title",
			label: "Title",
			type: "string",
			required: true,
		});
		await runtime.schemaRegistry.createField("events", {
			slug: "body",
			label: "Body",
			type: "portableText",
		});
	});

	afterEach(async () => {
		await waitForDeferredTasks();
		await runtime?.shutdown();
		setI18nConfig(null);
		vi.restoreAllMocks();
	});

	async function route(path: string, body: unknown) {
		const request = new Request(`https://example.com/_emdash/api/plugins/emdash-forms/${path}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		});
		return runtime.handlePluginApiRoute("emdash-forms", "POST", path, request);
	}

	async function saveForm(contentMapping?: ContentMapping) {
		const result = await route("forms/create", {
			name: "Submit an event",
			slug: "submit-event",
			pages: [
				{
					fields: [
						{ id: "name", name: "name", label: "Name", type: "text", required: true },
						{ id: "details", name: "details", label: "Details", type: "textarea", required: false },
					],
				},
			],
			settings: { spamProtection: "none", contentMapping },
		});
		if (!result.success) throw new Error(JSON.stringify(result.error));
		return (result.data as { id: string }).id;
	}

	const mapping: ContentMapping = {
		collection: "events",
		fieldMappings: { name: "title", details: { field: "body", transform: "portableText" } },
	};

	it("creates localized drafts with unique slugs and keeps both inbox submissions", async () => {
		const formId = await saveForm(mapping);
		for (let i = 0; i < 2; i++) {
			const response = await route("submit", {
				formId,
				data: { name: "Community BBQ", details: "Bring a dish.\n\nAll welcome." },
			});
			expect(response).toMatchObject({ success: true, data: { success: true } });
			await waitForDeferredTasks();
		}
		const entries = await runtime.db.selectFrom("ec_events").selectAll().execute();
		expect(entries).toHaveLength(2);
		expect(entries.map((entry) => entry.slug)).toEqual(
			expect.arrayContaining(["community-bbq", "community-bbq-1"]),
		);
		for (const entry of entries) {
			expect(entry).toMatchObject({ status: "draft", locale: "fr", published_at: null });
			const result = await runtime.handleContentGet("events", entry.id as string);
			expect(result).toMatchObject({
				success: true,
				data: {
					item: {
						data: {
							title: "Community BBQ",
							body: [
								{ _type: "block", children: [{ _type: "span", text: "Bring a dish." }] },
								{ _type: "block", children: [{ _type: "span", text: "All welcome." }] },
							],
						},
					},
				},
			});
		}
		const inbox = await runtime.db
			.selectFrom("_plugin_storage")
			.selectAll()
			.where("plugin_id", "=", "emdash-forms")
			.where("collection", "=", "submissions")
			.execute();
		expect(inbox).toHaveLength(2);
	});

	it("keeps entries unpublished when the collection has no draft support", async () => {
		await runtime.schemaRegistry.updateCollection("events", { supports: [] });
		const formId = await saveForm(mapping);
		expect(await route("submit", { formId, data: { name: "Community BBQ" } })).toMatchObject({
			success: true,
			data: { success: true },
		});
		await waitForDeferredTasks();
		const entries = await runtime.db.selectFrom("ec_events").selectAll().execute();
		expect(entries).toHaveLength(1);
		expect(entries[0]).toMatchObject({ status: "draft", published_at: null });
	});

	it("keeps the inbox submission when collection validation rejects a draft", async () => {
		const formId = await saveForm(mapping);
		await runtime.schemaRegistry.createField("events", {
			slug: "location",
			label: "Location",
			type: "string",
			required: true,
		});
		const error = vi.spyOn(console, "error").mockImplementation(() => {});
		expect(await route("submit", { formId, data: { name: "Community BBQ" } })).toMatchObject({
			success: true,
			data: { success: true },
		});
		await waitForDeferredTasks();
		expect(await runtime.db.selectFrom("ec_events").selectAll().execute()).toHaveLength(0);
		expect(
			await runtime.db
				.selectFrom("_plugin_storage")
				.selectAll()
				.where("plugin_id", "=", "emdash-forms")
				.where("collection", "=", "submissions")
				.execute(),
		).toHaveLength(1);
		expect(error).toHaveBeenCalledWith(
			"[plugin:emdash-forms]",
			"Failed to create content entry from submission",
			expect.objectContaining({
				collection: "events",
				error: expect.stringContaining("VALIDATION_ERROR"),
			}),
		);
	});

	it.each<[string, "integer" | "url" | "datetime" | "portableText", unknown]>([
		["quantity", "integer", 1.5],
		["website", "url", "not a URL"],
		["starts_at", "datetime", "2026-08-01T10:00:00"],
		["starts_at", "datetime", "2026-02-30T10:00:00Z"],
		["body", "portableText", [{}]],
	])("rejects fixed %s values that core cannot store", async (slug, type, value) => {
		if (slug !== "body") {
			await runtime.schemaRegistry.createField("events", { slug, label: slug, type });
		}
		const create = await runtime.handleContentCreate("events", {
			data: { title: "Event", [slug]: value },
		});
		expect(create).toMatchObject({ success: false, error: { code: "VALIDATION_ERROR" } });
		await expect(
			saveForm({
				collection: "events",
				fieldMappings: { name: "title" },
				metadata: { [slug]: value },
			}),
		).rejects.toThrow(/BAD_REQUEST/);
		expect(
			await runtime.db
				.selectFrom("_plugin_storage")
				.selectAll()
				.where("plugin_id", "=", "emdash-forms")
				.where("collection", "=", "forms")
				.execute(),
		).toHaveLength(0);
	});

	it("stores URL, date, and select mappings through core validation", async () => {
		await runtime.schemaRegistry.createField("events", {
			slug: "website",
			label: "Website",
			type: "url",
			required: true,
		});
		await runtime.schemaRegistry.createField("events", {
			slug: "starts_at",
			label: "Starts at",
			type: "datetime",
			required: true,
		});
		await runtime.schemaRegistry.createField("events", {
			slug: "category",
			label: "Category",
			type: "select",
			required: true,
			validation: { options: ["news", "event"] },
		});
		const created = await route("forms/create", {
			name: "Submit event details",
			slug: "event-details",
			pages: [
				{
					fields: [
						{ id: "website", name: "website", label: "Website", type: "url", required: true },
						{ id: "date", name: "date", label: "Date", type: "date", required: true },
						{
							id: "category",
							name: "category",
							label: "Category",
							type: "select",
							required: true,
							options: [{ label: "Event", value: "event" }],
						},
					],
				},
			],
			settings: {
				spamProtection: "none",
				contentMapping: {
					collection: "events",
					metadata: { title: "Community BBQ" },
					fieldMappings: {
						website: "website",
						date: { field: "starts_at", transform: "date" },
						category: "category",
					},
				},
			},
		});
		if (!created.success) throw new Error(JSON.stringify(created.error));
		const formId = (created.data as { id: string }).id;
		expect(
			await route("submit", {
				formId,
				data: { website: "https://example.com/event", date: "2026-08-01", category: "event" },
			}),
		).toMatchObject({ success: true, data: { success: true } });
		await waitForDeferredTasks();
		const entries = await runtime.db.selectFrom("ec_events").selectAll().execute();
		expect(entries).toHaveLength(1);
		expect(entries[0]).toMatchObject({
			status: "draft",
			website: "https://example.com/event",
			starts_at: "2026-08-01T00:00:00.000Z",
			category: "event",
		});
	});

	it("requires a checkbox selection before creating its mapped draft", async () => {
		const created = await route("forms/create", {
			name: "Submit topics",
			slug: "submit-topics",
			pages: [
				{
					fields: [
						{
							id: "topics",
							name: "topics",
							label: "Topics",
							type: "checkbox-group",
							required: true,
							options: [{ label: "News", value: "news" }],
						},
					],
				},
			],
			settings: {
				spamProtection: "none",
				contentMapping: {
					collection: "events",
					fieldMappings: { topics: { field: "title", transform: "string" } },
				},
			},
		});
		if (!created.success) throw new Error(JSON.stringify(created.error));
		const formId = (created.data as { id: string }).id;
		expect(await route("submit", { formId, data: { topics: [] } })).toMatchObject({
			success: true,
			data: { success: false, errors: [{ field: "topics", message: "Topics is required" }] },
		});
		await waitForDeferredTasks();
		expect(await runtime.db.selectFrom("ec_events").selectAll().execute()).toHaveLength(0);
		expect(await route("submit", { formId, data: { topics: ["news"] } })).toMatchObject({
			success: true,
			data: { success: true },
		});
		await waitForDeferredTasks();
		const entries = await runtime.db.selectFrom("ec_events").selectAll().execute();
		expect(entries).toHaveLength(1);
		expect(entries[0]).toMatchObject({ title: "news", status: "draft", published_at: null });
	});

	it("keeps forms without a mapping inbox-only", async () => {
		const formId = await saveForm();
		expect(await route("submit", { formId, data: { name: "Community BBQ" } })).toMatchObject({
			success: true,
			data: { success: true },
		});
		await waitForDeferredTasks();
		expect(await runtime.db.selectFrom("ec_events").selectAll().execute()).toHaveLength(0);
		expect(
			await runtime.db
				.selectFrom("_plugin_storage")
				.selectAll()
				.where("plugin_id", "=", "emdash-forms")
				.where("collection", "=", "submissions")
				.execute(),
		).toHaveLength(1);
	});
});
