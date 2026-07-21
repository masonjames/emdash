import type { OAuthConsumerConfig } from "@emdash-cms/auth";

type OAuthProviders = OAuthConsumerConfig["providers"];

/** Safely extract a string value from an env-like record. */
function envString(env: Record<string, unknown>, ...keys: string[]): string | undefined {
	for (const key of keys) {
		const val = env[key];
		if (typeof val === "string" && val) return val;
	}
	return undefined;
}

/**
 * Resolve OAuth provider env for Worker and Node adapters.
 *
 * Worker adapters expose runtime bindings through `virtual:emdash/env`. Node
 * deployments need `process.env` because Vite bakes `import.meta.env` at build
 * time, before container runtime secrets are available.
 */
export function resolveOAuthProviderEnv(
	runtimeEnv: Record<string, unknown> | undefined,
	buildEnv: Record<string, unknown>,
): Record<string, unknown> {
	if (runtimeEnv) return runtimeEnv;

	const processEnv =
		typeof process !== "undefined" && process.env
			? (process.env as Record<string, string | undefined>)
			: {};

	return { ...buildEnv, ...processEnv };
}

/**
 * Get OAuth config from environment variables.
 */
export function getOAuthConfig(env: Record<string, unknown>): OAuthProviders {
	const providers: OAuthProviders = {};

	const githubClientId = envString(env, "EMDASH_OAUTH_GITHUB_CLIENT_ID", "GITHUB_CLIENT_ID");
	const githubClientSecret = envString(
		env,
		"EMDASH_OAUTH_GITHUB_CLIENT_SECRET",
		"GITHUB_CLIENT_SECRET",
	);
	if (githubClientId && githubClientSecret) {
		providers.github = {
			clientId: githubClientId,
			clientSecret: githubClientSecret,
		};
	}

	const googleClientId = envString(env, "EMDASH_OAUTH_GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_ID");
	const googleClientSecret = envString(
		env,
		"EMDASH_OAUTH_GOOGLE_CLIENT_SECRET",
		"GOOGLE_CLIENT_SECRET",
	);
	if (googleClientId && googleClientSecret) {
		providers.google = {
			clientId: googleClientId,
			clientSecret: googleClientSecret,
		};
	}

	return providers;
}
