/**
 * Page Context Tests
 *
 * Tests the public page context builder for:
 * - Astro-like input handling
 * - URL string and object input
 * - Default pageType resolution
 * - Null normalization for optional fields
 */

import { describe, it, expect } from "vitest";

import { createPublicPageContext } from "../../../src/page/context.js";

describe("createPublicPageContext", () => {
	it("accepts Astro-like input and extracts url/path/locale", () => {
		const result = createPublicPageContext({
			Astro: {
				url: new URL("https://example.com/blog/hello"),
				currentLocale: "en",
			},
			kind: "content",
			title: "Hello",
		});

		expect(result.url).toBe("https://example.com/blog/hello");
		expect(result.path).toBe("/blog/hello");
		expect(result.locale).toBe("en");
		expect(result.title).toBe("Hello");
	});

	it("accepts URL string input", () => {
		const result = createPublicPageContext({
			url: "https://example.com/about",
			kind: "custom",
			locale: "fr",
		});

		expect(result.url).toBe("https://example.com/about");
		expect(result.path).toBe("/about");
		expect(result.locale).toBe("fr");
	});

	it("accepts URL object input", () => {
		const urlObj = new URL("https://example.com/products?page=2");

		const result = createPublicPageContext({
			url: urlObj,
			kind: "custom",
		});

		expect(result.url).toBe("https://example.com/products?page=2");
		expect(result.path).toBe("/products");
	});

	it('defaults pageType to "article" for content kind', () => {
		const result = createPublicPageContext({
			url: "https://example.com/post/1",
			kind: "content",
		});

		expect(result.pageType).toBe("article");
	});

	it('defaults pageType to "website" for custom kind', () => {
		const result = createPublicPageContext({
			url: "https://example.com/",
			kind: "custom",
		});

		expect(result.pageType).toBe("website");
	});

	it("normalizes undefined locale to null", () => {
		const result = createPublicPageContext({
			Astro: {
				url: new URL("https://example.com/"),
				// currentLocale not set
			},
			kind: "custom",
		});

		expect(result.locale).toBeNull();
	});

	it("normalizes content slug undefined to null", () => {
		const result = createPublicPageContext({
			url: "https://example.com/post/1",
			kind: "content",
			content: { collection: "posts", id: "abc123" },
		});

		expect(result.content).toBeDefined();
		expect(result.content!.slug).toBeNull();
		expect(result.content!.collection).toBe("posts");
		expect(result.content!.id).toBe("abc123");
	});

	it("sets content to undefined for custom kind", () => {
		const result = createPublicPageContext({
			url: "https://example.com/about",
			kind: "custom",
		});

		expect(result.content).toBeUndefined();
	});

	it("passes through explicit structured data payloads", () => {
		const structuredData = {
			faq: {
				items: [{ question: "What is EmDash?", answer: "An Astro-native CMS." }],
			},
			howTo: {
				name: "Install EmDash",
				steps: [{ text: "Install the package." }],
			},
			product: {
				name: "EmDash Pro",
				offers: [{ price: "99.00", priceCurrency: "USD" }],
				aggregateRating: { ratingValue: 4.8, reviewCount: 12 },
			},
			reviews: [
				{
					title: "Worth it",
					body: "Excellent publishing workflow.",
					authorName: "Mason James",
					rating: 5,
				},
			],
		};

		const result = createPublicPageContext({
			url: "https://example.com/products/emdash-pro",
			kind: "content",
			structuredData,
		});

		expect(result.structuredData).toEqual(structuredData);
	});

	it("passes through archive descriptors unchanged", () => {
		const archive = {
			kind: "taxonomy" as const,
			collection: { slug: "posts", label: "Posts" },
			taxonomy: {
				name: "tag",
				label: "Tags",
				term: {
					id: "term_1",
					slug: "astro",
					label: "Astro",
				},
			},
		};

		const result = createPublicPageContext({
			url: "https://example.com/tag/astro",
			kind: "custom",
			title: "Astro",
			archive,
		});

		expect(result.archive).toEqual(archive);
	});
});
