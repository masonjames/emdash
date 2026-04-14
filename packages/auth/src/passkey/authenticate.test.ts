import { describe, it, expect, vi } from "vitest";

import type { AuthAdapter, Credential } from "../types.js";
import { authenticateWithPasskey, PasskeyAuthenticationError } from "./authenticate.js";
import type { ChallengeStore } from "./types.js";

const credential: Credential = {
	id: "registered-credential",
	userId: "user_1",
	publicKey: new Uint8Array(),
	counter: 0,
	deviceType: "singleDevice",
	backedUp: false,
	transports: [],
	name: null,
	createdAt: new Date(),
	lastUsedAt: new Date(),
};

const config = {
	rpName: "Test Site",
	rpId: "localhost",
	origin: "http://localhost:4321",
};

function createAdapter(): AuthAdapter {
	return {
		getCredentialById: vi.fn(async () => credential),
		updateCredentialCounter: vi.fn(async () => undefined),
		getUserById: vi.fn(async () => null),
	} as unknown as AuthAdapter;
}

function createChallengeStore(): ChallengeStore {
	return {
		set: vi.fn(async () => undefined),
		get: vi.fn(async () => null),
		delete: vi.fn(async () => undefined),
	};
}

describe("authenticateWithPasskey", () => {
	it("throws a typed passkey auth error for malformed assertion payloads", async () => {
		try {
			await authenticateWithPasskey(
				config,
				createAdapter(),
				{
					id: "registered-credential",
					rawId: "registered-credential",
					type: "public-key",
					response: {
						clientDataJSON: "AA",
						authenticatorData: "AA",
						signature: "AA",
					},
				},
				createChallengeStore(),
			);
			expect.fail("Expected passkey authentication to fail");
		} catch (error) {
			expect(error).toBeInstanceOf(PasskeyAuthenticationError);
			expect(error).toMatchObject({ code: "invalid_response" });
		}
	});
});
