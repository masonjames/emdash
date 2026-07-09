import { afterEach, describe, expect, it } from "vitest";

import { resolveOAuthProviderEnv } from "../../../src/auth/oauth-provider-env.js";

const ORIGINAL_ENV = { ...process.env };

describe("OAuth provider env resolution", () => {
	afterEach(() => {
		process.env = { ...ORIGINAL_ENV };
	});

	it("uses runtime process env ahead of build-time import.meta.env on Node", () => {
		process.env.EMDASH_OAUTH_GITHUB_CLIENT_ID = "runtime-client";
		process.env.EMDASH_OAUTH_GITHUB_CLIENT_SECRET = "runtime-secret";

		const env = resolveOAuthProviderEnv(undefined, {
			EMDASH_OAUTH_GITHUB_CLIENT_ID: "build-client",
			EMDASH_OAUTH_GITHUB_CLIENT_SECRET: "build-secret",
		});

		expect(env.EMDASH_OAUTH_GITHUB_CLIENT_ID).toBe("runtime-client");
		expect(env.EMDASH_OAUTH_GITHUB_CLIENT_SECRET).toBe("runtime-secret");
	});

	it("uses adapter runtime env ahead of Node process env", () => {
		process.env.EMDASH_OAUTH_GOOGLE_CLIENT_ID = "process-client";

		const env = resolveOAuthProviderEnv(
			{ EMDASH_OAUTH_GOOGLE_CLIENT_ID: "adapter-client" },
			{ EMDASH_OAUTH_GOOGLE_CLIENT_ID: "build-client" },
		);

		expect(env.EMDASH_OAUTH_GOOGLE_CLIENT_ID).toBe("adapter-client");
	});
});
