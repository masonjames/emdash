const USD_PRICE_PATTERN = /^\$(?:0|[1-9]\d*)(?:\.\d{1,6})?$/;

export interface ReaderIdentity {
	provider: string;
	subject: string;
}

export interface ReaderResource {
	collection: string;
	id: string;
	locale: string;
}

export type AccessDecision =
	| { kind: "allow" }
	| { kind: "deny" }
	| { kind: "preview" }
	| { kind: "payment-required"; price: string };

export type ReaderResult<T, P> =
	| { kind: "full"; value: T; cacheControl: string }
	| { kind: "preview"; value: P; cacheControl: "private, no-store" }
	| { kind: "deny"; cacheControl: "private, no-store" }
	| { kind: "payment-required"; price: string; cacheControl: "private, no-store" };

/** Fork-only prototype; public content APIs do not call this function. */
export async function readForReader<T, P>(input: {
	resource: ReaderResource;
	protected: boolean;
	reader: ReaderIdentity | null;
	audience: "reader" | "paid-route";
	publicPreview?: P;
	decide?(context: {
		resource: ReaderResource;
		reader: ReaderIdentity | null;
		audience: "reader" | "paid-route";
	}): Promise<AccessDecision>;
	load(): Promise<T>;
}): Promise<ReaderResult<T, P>> {
	if (!input.protected) {
		return { kind: "full", value: await input.load(), cacheControl: "public, max-age=0" };
	}
	const cacheControl = "private, no-store" as const;
	let decision: AccessDecision | undefined;
	try {
		decision = await input.decide?.({
			resource: input.resource,
			reader: input.reader,
			audience: input.audience,
		});
	} catch {
		return { kind: "deny", cacheControl };
	}
	if (decision?.kind === "allow") {
		return { kind: "full", value: await input.load(), cacheControl };
	}
	if (decision?.kind === "preview" && input.publicPreview !== undefined) {
		return { kind: "preview", value: input.publicPreview, cacheControl };
	}
	if (
		decision?.kind === "payment-required" &&
		input.audience === "paid-route" &&
		typeof decision.price === "string" &&
		decision.price.length <= 32 &&
		USD_PRICE_PATTERN.test(decision.price) &&
		Number(decision.price.slice(1)) > 0
	) {
		return { kind: "payment-required", price: decision.price, cacheControl };
	}
	return { kind: "deny", cacheControl };
}
