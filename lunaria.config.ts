import { defineConfig } from "@lunariajs/core/config";

import {
	SOURCE_LOCALE,
	TARGET_LOCALES,
	type LocaleDefinition,
} from "./packages/admin/src/locales/locales.js";

type LunariaLocale = { label: string; lang: string };

function toNonEmptyLunariaLocales(
	locales: LocaleDefinition[],
): [LunariaLocale, ...LunariaLocale[]] {
	const [first, ...rest] = locales.map((l) => ({
		label: l.label,
		lang: l.code,
	}));
	if (!first) throw new Error("Lunaria requires at least one target locale");
	return [first, ...rest];
}

const locales = toNonEmptyLunariaLocales(TARGET_LOCALES);

export default defineConfig({
	repository: {
		name: "emdash-cms/emdash",
		branch: "main",
	},
	sourceLocale: {
		label: SOURCE_LOCALE.label,
		lang: SOURCE_LOCALE.code,
	},
	locales,
	files: [
		{
			include: ["packages/admin/src/locales/en/messages.po"],
			pattern: "packages/admin/src/locales/@lang/messages.po",
			type: "dictionary",
		},
	],
});
