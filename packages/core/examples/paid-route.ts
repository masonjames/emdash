const USD_PRICE_PATTERN = /^\$(?:0|[1-9]\d*)(?:\.\d{1,6})?$/;

export interface PaymentQuote {
	price: string;
	description?: string;
}

export interface VerifiedPayment {
	payer: string;
	amount: string;
	network: string;
}

export interface PreparedPayment {
	payment: VerifiedPayment;
	settle(): Promise<{ success: true; header: string } | { success: false }>;
}

function privateResponse(response: Response): Response {
	const headers = new Headers(response.headers);
	headers.set("Cache-Control", "private, no-store");
	headers.delete("PAYMENT-RESPONSE");
	return new Response(response.body, { status: response.status, headers });
}

function unavailable(): Response {
	return privateResponse(new Response(null, { status: 503 }));
}

function parseQuote(value: unknown): PaymentQuote | null {
	if (value === null) return null;
	if (typeof value !== "object" || value === null) throw new Error("Invalid quote");
	const price: unknown = Reflect.get(value, "price");
	const description: unknown = Reflect.get(value, "description");
	if (
		typeof price !== "string" ||
		price.length > 32 ||
		!USD_PRICE_PATTERN.test(price) ||
		Number(price.slice(1)) <= 0 ||
		(description !== undefined && typeof description !== "string") ||
		Object.keys(value).some((key) => key !== "price" && key !== "description")
	) {
		throw new Error("Invalid quote");
	}
	return { price, description };
}

async function bufferBody(response: Response): Promise<Uint8Array<ArrayBuffer> | null> {
	if (!response.body) return null;
	const reader = response.body.getReader();
	const chunks: Uint8Array[] = [];
	let size = 0;
	try {
		while (true) {
			const chunk = await reader.read();
			if (chunk.done) break;
			size += chunk.value.byteLength;
			if (size > 1024 * 1024) throw new Error("Paid response exceeds prototype limit");
			chunks.push(chunk.value);
		}
	} catch (error) {
		await reader.cancel().catch(() => {});
		throw error;
	} finally {
		reader.releaseLock();
	}
	const bytes = new Uint8Array(size);
	let offset = 0;
	for (const chunk of chunks) {
		bytes.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return bytes;
}

/** Fork-only prototype; the runtime dispatcher does not call this function. */
export async function runPaidRoute(input: {
	request: Request;
	quote(): Promise<unknown>;
	prepare(request: Request, quote: PaymentQuote): Promise<PreparedPayment | Response>;
	handle(payment: VerifiedPayment | undefined): Promise<Response>;
}): Promise<Response> {
	if (input.request.method !== "GET") {
		return privateResponse(new Response(null, { status: 405, headers: { Allow: "GET" } }));
	}
	try {
		const quote = parseQuote(await input.quote());
		if (quote === null) return privateResponse(await input.handle(undefined));
		const prepared = await input.prepare(input.request, quote);
		if (prepared instanceof Response) return privateResponse(prepared);
		const response = await input.handle(prepared.payment);
		if (!response.ok) return privateResponse(response);
		const bytes = await bufferBody(response);
		const headers = new Headers(response.headers);
		headers.delete("PAYMENT-REQUIRED");
		headers.delete("PAYMENT-RESPONSE");
		headers.delete("Content-Length");
		headers.set("Cache-Control", "private, no-store");
		const output = new Response(bytes, { status: response.status, headers });
		const settlement = await prepared.settle();
		if (!settlement.success) return unavailable();
		output.headers.set("PAYMENT-RESPONSE", settlement.header);
		return output;
	} catch {
		return unavailable();
	}
}
