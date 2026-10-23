import { describe, expect, it } from "vitest";

import { validateSubmission } from "../src/validation.js";

function singleCheckboxField(required = false): {
	id: string;
	type: "checkbox";
	label: string;
	name: string;
	required: boolean;
	width: "full";
} {
	return {
		id: "f0",
		type: "checkbox",
		label: "I agree",
		name: "agree",
		required,
		width: "full",
	};
}

function checkboxField(): {
	id: string;
	type: "checkbox-group";
	label: string;
	name: string;
	required: boolean;
	width: "full";
	options: { label: string; value: string }[];
} {
	return {
		id: "f1",
		type: "checkbox-group",
		label: "Interests",
		name: "interests",
		required: false,
		width: "full",
		options: [
			{ label: "A", value: "a" },
			{ label: "B", value: "b" },
			{ label: "C", value: "c" },
		],
	};
}

describe("validateSubmission checkbox", () => {
	it("coerces the default value of a checked checkbox to true", () => {
		const result = validateSubmission([singleCheckboxField()], { agree: "1" });
		expect(result.valid).toBe(true);
		expect(result.errors).toHaveLength(0);
		expect(result.data.agree).toBe(true);
	});

	it("coerces an explicit true value to true", () => {
		const result = validateSubmission([singleCheckboxField()], { agree: "true" });
		expect(result.valid).toBe(true);
		expect(result.data.agree).toBe(true);
	});

	it("coerces an on value to true", () => {
		const result = validateSubmission([singleCheckboxField()], { agree: "on" });
		expect(result.valid).toBe(true);
		expect(result.data.agree).toBe(true);
	});

	it("rejects a required checkbox that is not submitted", () => {
		const result = validateSubmission([singleCheckboxField(true)], {});
		expect(result.valid).toBe(false);
		expect(result.errors).toEqual([{ field: "agree", message: "I agree is required" }]);
	});
});

describe("validateSubmission checkbox-group", () => {
	it.each([{ selection: [] }, { selection: [""] }, { selection: [" "] }])(
		"rejects an empty required selection: $selection",
		({ selection }) => {
			const result = validateSubmission(
				[{ ...checkboxField(), required: true, options: undefined }],
				{ interests: selection },
			);
			expect(result.valid).toBe(false);
			expect(result.errors).toEqual([{ field: "interests", message: "Interests is required" }]);
			expect(result.data).toEqual({});
		},
	);

	it("accepts multiple selected values", () => {
		const result = validateSubmission([checkboxField()], {
			interests: ["a", "b"],
		});
		expect(result.valid).toBe(true);
		expect(result.errors).toHaveLength(0);
		expect(result.data.interests).toEqual(["a", "b"]);
	});

	it("accepts a single selected value", () => {
		const result = validateSubmission([checkboxField()], {
			interests: "a",
		});
		expect(result.valid).toBe(true);
		expect(result.data.interests).toEqual(["a"]);
	});

	it("rejects values not in the option list", () => {
		const result = validateSubmission([checkboxField()], {
			interests: ["a", "x"],
		});
		expect(result.valid).toBe(false);
		expect(result.errors).toEqual([
			{ field: "interests", message: "Interests contains an invalid selection" },
		]);
	});
});

describe("validateSubmission file fields", () => {
	const fileField = {
		id: "f2",
		type: "file" as const,
		label: "Attachment",
		name: "attachment",
		required: true,
		width: "full" as const,
	};

	it("accepts a required file field when the file was submitted", () => {
		const result = validateSubmission([fileField], {}, new Set(["attachment"]));
		expect(result).toEqual({ valid: true, errors: [], data: {} });
	});

	it("rejects a required file field with no file, whatever data holds", () => {
		const result = validateSubmission([fileField], { attachment: "x.pdf" });
		expect(result.errors).toEqual([{ field: "attachment", message: "Attachment is required" }]);
	});
});

describe("validateSubmission mapped scalar types", () => {
	it.each(["Infinity", "-Infinity", "1e999"])("rejects non-finite numbers: %s", (value) => {
		const result = validateSubmission(
			[
				{
					id: "number",
					name: "number",
					label: "Number",
					type: "number",
					required: true,
					width: "full",
				},
			],
			{ number: value },
		);
		expect(result.valid).toBe(false);
		expect(result.data).toEqual({});
	});

	it.each(["https://my site.com", "http://[", "https://example.com/\u0001"])(
		"rejects malformed URLs: %s",
		(value) => {
			const result = validateSubmission(
				[{ id: "url", name: "url", label: "URL", type: "url", required: true, width: "full" }],
				{ url: value },
			);
			expect(result.valid).toBe(false);
			expect(result.data).toEqual({});
		},
	);

	it("keeps valid decimal numbers and HTTPS URLs", () => {
		const result = validateSubmission(
			[
				{
					id: "number",
					name: "number",
					label: "Number",
					type: "number",
					required: true,
					width: "full",
				},
				{ id: "url", name: "url", label: "URL", type: "url", required: true, width: "full" },
			],
			{ number: "2.5", url: "https://example.com/event" },
		);
		expect(result).toEqual({
			valid: true,
			errors: [],
			data: { number: 2.5, url: "https://example.com/event" },
		});
	});
});
