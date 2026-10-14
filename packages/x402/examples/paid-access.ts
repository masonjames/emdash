import type { EnforceOptions } from "@emdash-cms/x402";

/** Discovery for a concrete Markdown URL from Paid Access's offers catalogue. */
export const paidAccessExtensions = {
	bazaar: {
		info: {
			input: { type: "http", method: "GET", queryParams: {} },
			output: {
				type: "text",
				format: "text/markdown",
				example: "# Example article\n\nSynthetic example content.",
			},
		},
		schema: {
			type: "object",
			properties: {
				input: {
					type: "object",
					properties: {
						type: { const: "http" },
						method: { const: "GET" },
						queryParams: { type: "object", properties: {}, additionalProperties: false },
					},
					required: ["type", "method", "queryParams"],
				},
				output: {
					type: "object",
					properties: {
						type: { const: "text" },
						format: { const: "text/markdown" },
						example: { type: "string" },
					},
					required: ["type", "format", "example"],
				},
			},
			required: ["input", "output"],
		},
	},
} satisfies NonNullable<EnforceOptions["extensions"]>;
