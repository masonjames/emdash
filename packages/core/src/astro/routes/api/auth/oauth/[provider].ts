/**
 * GET /_emdash/api/auth/oauth/[provider]
 *
 * Start OAuth flow - redirects to provider authorization URL
 */

import type { APIRoute } from "astro";

export const prerender = false;

import { createAuthorizationUrl, type OAuthConsumerConfig } from "@emdash-cms/auth";

import { getPublicOrigin } from "#api/public-url.js";
import { getOAuthConfig, resolveOAuthProviderEnv } from "#auth/oauth-provider-env.js";
import { createOAuthStateStore } from "#auth/oauth-state-store.js";

type ProviderName = "github" | "google";

const VALID_PROVIDERS = new Set<string>(["github", "google"]);

function isValidProvider(provider: string): provider is ProviderName {
	return VALID_PROVIDERS.has(provider);
}

export const GET: APIRoute = async ({ params, request, locals, redirect }) => {
	const { emdash } = locals;
	const provider = params.provider;

	// Determine where to redirect errors (setup wizard or login page)
	const referer = request.headers.get("referer") ?? "";
	const errorRedirectBase = referer.includes("/setup")
		? "/_emdash/admin/setup"
		: "/_emdash/admin/login";

	// Validate provider
	if (!provider || !isValidProvider(provider)) {
		return redirect(
			`${errorRedirectBase}?error=invalid_provider&message=${encodeURIComponent("Invalid OAuth provider")}`,
		);
	}

	if (!emdash?.db) {
		return redirect(
			`${errorRedirectBase}?error=server_error&message=${encodeURIComponent("Database not configured")}`,
		);
	}

	try {
		const url = new URL(request.url);

		// Get OAuth providers from environment
		// eslint-disable-next-line typescript/no-unsafe-type-assertion -- locals.runtime is injected by the Cloudflare adapter at runtime; not declared on App.Locals since the adapter is optional
		const runtimeLocals = locals as unknown as { runtime?: { env?: Record<string, unknown> } };
		// eslint-disable-next-line typescript/no-unsafe-type-assertion -- import.meta.env is typed as ImportMetaEnv but we need Record<string, unknown> for getOAuthConfig
		const env = resolveOAuthProviderEnv(
			runtimeLocals.runtime?.env,
			import.meta.env as Record<string, unknown>,
		);
		const providers = getOAuthConfig(env);

		if (!providers[provider]) {
			return redirect(
				`${errorRedirectBase}?error=provider_not_configured&message=${encodeURIComponent(`OAuth provider ${provider} is not configured. Set either EMDASH_OAUTH_${provider.toUpperCase()}_CLIENT_ID and EMDASH_OAUTH_${provider.toUpperCase()}_CLIENT_SECRET, or ${provider.toUpperCase()}_CLIENT_ID and ${provider.toUpperCase()}_CLIENT_SECRET.`)}`,
			);
		}

		const config: OAuthConsumerConfig = {
			baseUrl: `${getPublicOrigin(url, emdash?.config)}/_emdash`,
			providers,
		};

		const stateStore = createOAuthStateStore(emdash.db);

		const { url: authUrl } = await createAuthorizationUrl(config, provider, stateStore);

		return redirect(authUrl);
	} catch (error) {
		console.error("OAuth initiation error:", error);
		return redirect(
			`${errorRedirectBase}?error=oauth_error&message=${encodeURIComponent("Failed to start OAuth flow. Please try again.")}`,
		);
	}
};
