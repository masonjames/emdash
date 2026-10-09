/**
 * Node image endpoint -- the `image.endpoint` EmDash installs on non-Cloudflare
 * platforms.
 *
 * It wraps Astro's generic endpoint: local services transform bytes loaded
 * directly from the storage adapter, while external services receive the
 * storage adapter's public URL through Astro's `validateOptions`/`getURL`
 * contract. Every non-EmDash image is delegated to the stock endpoint.
 */

import type { APIRoute } from "astro";
// @ts-ignore - astro/assets internal endpoint, resolved by the consumer's Astro build
import { GET as genericGET } from "astro/assets/endpoint/generic";
// @ts-ignore - astro:assets is resolved by the consumer's Astro build
import { getConfiguredImageService, imageConfig } from "astro:assets";

import {
	getTransformFingerprint,
	isHeicMedia,
	matchInternalMediaKey,
	MUTABLE_MEDIA_CACHE_CONTROL,
	originalMediaHeaders,
	parseTransformParams,
	resolveExternalImageServiceUrl,
	validatorHeaders,
	isNotModified,
} from "../media/image-endpoint.js";
import { imageServiceConfigSupportsHeic, resolveStorageImageSource } from "./image-service.js";

export const prerender = false;

const FORMAT_MIME: Record<string, string> = {
	webp: "image/webp",
	avif: "image/avif",
	png: "image/png",
	jpeg: "image/jpeg",
	jpg: "image/jpeg",
	gif: "image/gif",
};

function isNotFound(error: unknown): boolean {
	return (
		error instanceof Error &&
		(error.message.includes("not found") || error.message.includes("NOT_FOUND"))
	);
}

function streamOriginal(
	body: ReadableStream<Uint8Array>,
	contentType: string,
	size: number,
	lastModified?: Date,
): Response {
	return new Response(body, {
		status: 200,
		headers: originalMediaHeaders(contentType, size, lastModified),
	});
}

function notModifiedResponse(
	contentType: string,
	size: number,
	lastModified?: Date,
	suffix?: string,
): Response {
	return new Response(null, {
		status: 304,
		headers: {
			"Content-Type": contentType,
			"Cache-Control": MUTABLE_MEDIA_CACHE_CONTROL,
			"X-Content-Type-Options": "nosniff",
			...validatorHeaders(size, lastModified, suffix),
		},
	});
}

function unsupportedHeic(): Response {
	return new Response("HEIC is not supported by the configured image service", { status: 415 });
}

export const GET: APIRoute = async (ctx) => {
	const url = new URL(ctx.request.url);
	const key = matchInternalMediaKey(url.searchParams.get("href"));
	const storage = ctx.locals.emdash?.storage;

	// Not EmDash media, or storage unavailable: let the stock endpoint handle it
	// (bundled assets, allowed remote, `publicUrl` media).
	if (!key || !storage) return genericGET(ctx);

	const service = await getConfiguredImageService();
	let transformingHeic = false;

	try {
		if (!("transform" in service)) {
			const parsed = parseTransformParams(url.searchParams);
			if (!parsed.ok) return new Response(parsed.message, { status: 400 });
			if (isHeicMedia("", key) && !imageServiceConfigSupportsHeic(imageConfig.service.config)) {
				return unsupportedHeic();
			}

			let sourceUrl = resolveStorageImageSource(storage, key, url);
			const mediaVersion = new URL(url.searchParams.get("href")!, url).searchParams.get(
				"_emdash_media",
			);
			if (sourceUrl && mediaVersion) {
				const versionedSource = new URL(sourceUrl);
				versionedSource.searchParams.set("_emdash_media", mediaVersion);
				sourceUrl = versionedSource.href;
			}
			const externalUrl = sourceUrl
				? await resolveExternalImageServiceUrl(
						service,
						imageConfig,
						sourceUrl,
						parsed.options,
						url.origin,
						ctx.logger,
					)
				: null;
			if (externalUrl) {
				return new Response(null, {
					status: 302,
					headers: {
						Location: externalUrl,
						"Cache-Control": MUTABLE_MEDIA_CACHE_CONTROL,
						"X-Content-Type-Options": "nosniff",
					},
				});
			}
			if (isHeicMedia("", key)) return unsupportedHeic();

			const source = await storage.download(key);
			if (isNotModified(ctx.request, source.size, source.lastModified)) {
				return notModifiedResponse(source.contentType, source.size, source.lastModified);
			}
			return streamOriginal(source.body, source.contentType, source.size, source.lastModified);
		}

		const source = await storage.download(key);
		transformingHeic = isHeicMedia(source.contentType, key);

		// Only raster images are transformable; serve anything else unchanged.
		if (!source.contentType.startsWith("image/")) {
			if (isNotModified(ctx.request, source.size, source.lastModified)) {
				return notModifiedResponse(source.contentType, source.size, source.lastModified);
			}
			return streamOriginal(source.body, source.contentType, source.size, source.lastModified);
		}

		const transform = await service.parseURL(url, imageConfig);
		if (!transform) {
			if (isNotModified(ctx.request, source.size, source.lastModified)) {
				return notModifiedResponse(source.contentType, source.size, source.lastModified);
			}
			return streamOriginal(source.body, source.contentType, source.size, source.lastModified);
		}

		const fingerprint = getTransformFingerprint(url.searchParams);
		if (isNotModified(ctx.request, source.size, source.lastModified, fingerprint)) {
			return notModifiedResponse(source.contentType, source.size, source.lastModified, fingerprint);
		}

		const inputBuffer = new Uint8Array(await new Response(source.body).arrayBuffer());
		const { data, format } = await service.transform(inputBuffer, transform, imageConfig);

		return new Response(data, {
			status: 200,
			headers: {
				"Content-Type": FORMAT_MIME[format] ?? source.contentType,
				"Cache-Control": MUTABLE_MEDIA_CACHE_CONTROL,
				"X-Content-Type-Options": "nosniff",
				...validatorHeaders(source.size, source.lastModified, fingerprint),
			},
		});
	} catch (error) {
		if (isNotFound(error)) return new Response("Not Found", { status: 404 });
		if (transformingHeic) return unsupportedHeic();
		console.error("[emdash] image transform failed:", error);
		return new Response("Internal Server Error", { status: 500 });
	}
};
