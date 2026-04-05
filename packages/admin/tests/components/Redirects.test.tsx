import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

import type {
	NotFoundEntry,
	NotFoundSummary,
	Redirect,
	RedirectListResult,
} from "../../src/lib/api/redirects";

const mockFetchRedirects = vi.fn<() => Promise<RedirectListResult>>();
const mockFetch404Summary = vi.fn<() => Promise<NotFoundSummary[]>>();
const mockFetch404Entries = vi.fn();
const mockCreateRedirect = vi.fn();
const mockUpdateRedirect = vi.fn();
const mockDeleteRedirect = vi.fn();
const mockDelete404Entry = vi.fn();
const mockClear404Entries = vi.fn();
const mockPrune404Entries = vi.fn();
const mockResolve404ToRedirect = vi.fn();

vi.mock("../../src/lib/api/redirects", async () => {
	const actual = await vi.importActual("../../src/lib/api/redirects");
	return {
		...actual,
		fetchRedirects: (...args: unknown[]) => mockFetchRedirects(...(args as [])),
		fetch404Summary: (...args: unknown[]) => mockFetch404Summary(...(args as [])),
		fetch404Entries: (...args: unknown[]) => mockFetch404Entries(...(args as [])),
		createRedirect: (...args: unknown[]) => mockCreateRedirect(...(args as [])),
		updateRedirect: (...args: unknown[]) => mockUpdateRedirect(...(args as [])),
		deleteRedirect: (...args: unknown[]) => mockDeleteRedirect(...(args as [])),
		delete404Entry: (...args: unknown[]) => mockDelete404Entry(...(args as [])),
		clear404Entries: (...args: unknown[]) => mockClear404Entries(...(args as [])),
		prune404Entries: (...args: unknown[]) => mockPrune404Entries(...(args as [])),
		resolve404ToRedirect: (...args: unknown[]) => mockResolve404ToRedirect(...(args as [])),
	};
});

const { Redirects } = await import("../../src/components/Redirects");

function makeRedirect(overrides: Partial<Redirect> = {}): Redirect {
	return {
		id: "redir_1",
		source: "/old-path",
		destination: "/new-path",
		type: 301,
		isPattern: false,
		enabled: true,
		hits: 7,
		lastHitAt: null,
		groupName: null,
		auto: false,
		createdAt: "2026-04-03T00:00:00.000Z",
		updatedAt: "2026-04-03T00:00:00.000Z",
		...overrides,
	};
}

function makeNotFoundSummary(overrides: Partial<NotFoundSummary> = {}): NotFoundSummary {
	return {
		path: "/missing-page",
		count: 4,
		lastSeen: "2026-04-03T00:00:00.000Z",
		topReferrer: "https://example.com/referrer",
		...overrides,
	};
}

function makeNotFoundEntry(overrides: Partial<NotFoundEntry> = {}): NotFoundEntry {
	return {
		id: "nf_1",
		path: "/missing-page",
		referrer: "https://example.com/referrer",
		userAgent: "Mozilla/5.0",
		ip: null,
		createdAt: "2026-04-03T00:00:00.000Z",
		...overrides,
	};
}

function Wrapper({ children }: { children: React.ReactNode }) {
	const queryClient = React.useMemo(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: { retry: false, gcTime: 0 },
					mutations: { retry: false },
				},
			}),
		[],
	);

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe("Redirects", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockFetchRedirects.mockResolvedValue({ items: [makeRedirect()], nextCursor: undefined });
		mockFetch404Summary.mockResolvedValue([makeNotFoundSummary()]);
		mockFetch404Entries.mockResolvedValue({ items: [makeNotFoundEntry()], nextCursor: undefined });
		mockCreateRedirect.mockResolvedValue(makeRedirect());
		mockUpdateRedirect.mockResolvedValue(makeRedirect());
		mockDeleteRedirect.mockResolvedValue(undefined);
		mockDelete404Entry.mockResolvedValue(undefined);
		mockClear404Entries.mockResolvedValue({ deleted: 10 });
		mockPrune404Entries.mockResolvedValue({ deleted: 3 });
		mockResolve404ToRedirect.mockResolvedValue({ redirect: makeRedirect(), deleted: 2 });
	});

	it("renders redirect rows on the redirects tab", async () => {
		const screen = await render(
			<Wrapper>
				<Redirects />
			</Wrapper>,
		);

		await expect.element(screen.getByRole("heading", { name: "Redirects" })).toBeInTheDocument();
		await expect.element(screen.getByText("/old-path")).toBeInTheDocument();
		await expect.element(screen.getByText("/new-path")).toBeInTheDocument();
		expect(mockFetchRedirects).toHaveBeenCalled();
	});

	it("loads the 404 tab summary and detailed log", async () => {
		const screen = await render(
			<Wrapper>
				<Redirects />
			</Wrapper>,
		);

		await screen.getByText("404 Errors").click();

		await expect.element(screen.getByText("Top missing paths")).toBeInTheDocument();
		await expect.element(screen.getByText("Detailed 404 log")).toBeInTheDocument();
		await expect.element(screen.getByLabelText("Resolve /missing-page")).toBeInTheDocument();
		await expect
			.element(screen.getByLabelText("Delete 404 entry /missing-page"))
			.toBeInTheDocument();
		expect(mockFetch404Summary).toHaveBeenCalled();
		expect(mockFetch404Entries).toHaveBeenCalled();
	});

	it("opens the resolve dialog with the 404 source path prefilled", async () => {
		const screen = await render(
			<Wrapper>
				<Redirects />
			</Wrapper>,
		);

		await screen.getByText("404 Errors").click();
		await expect.element(screen.getByLabelText("Resolve /missing-page")).toBeInTheDocument();

		await screen.getByLabelText("Resolve /missing-page").click();

		await expect.element(screen.getByText("Resolve 404")).toBeInTheDocument();
		await expect.element(screen.getByLabelText("Source path")).toHaveValue("/missing-page");
		await expect.element(screen.getByLabelText("Source path")).toHaveAttribute("readonly");
	});

	it("opens the prune 404 dialog", async () => {
		const screen = await render(
			<Wrapper>
				<Redirects />
			</Wrapper>,
		);

		await screen.getByText("404 Errors").click();
		await expect.element(screen.getByText("404 operations")).toBeInTheDocument();
		await screen.getByText("Prune old entries").click();
		await expect.element(screen.getByText("Prune 404 Log")).toBeInTheDocument();
	});

	it("opens the clear 404 log dialog", async () => {
		const screen = await render(
			<Wrapper>
				<Redirects />
			</Wrapper>,
		);

		await screen.getByText("404 Errors").click();
		await expect.element(screen.getByText("404 operations")).toBeInTheDocument();
		await screen.getByText("Clear entire 404 log").click();
		await expect.element(screen.getByText("Clear 404 Log?")).toBeInTheDocument();
	});

	it("opens the delete 404 entry dialog", async () => {
		const screen = await render(
			<Wrapper>
				<Redirects />
			</Wrapper>,
		);

		await screen.getByText("404 Errors").click();
		await expect
			.element(screen.getByLabelText("Delete 404 entry /missing-page"))
			.toBeInTheDocument();
		await screen.getByLabelText("Delete 404 entry /missing-page").click();
		await expect.element(screen.getByText("Delete 404 Log Entry?")).toBeInTheDocument();
	});

	it("opens the edit redirect dialog from a redirect row", async () => {
		const screen = await render(
			<Wrapper>
				<Redirects />
			</Wrapper>,
		);

		await expect.element(screen.getByText("/old-path")).toBeInTheDocument();
		await screen.getByLabelText("Edit redirect /old-path").click();
		await expect.element(screen.getByText("Edit Redirect")).toBeInTheDocument();
		await expect.element(screen.getByLabelText("Source path")).toHaveValue("/old-path");
		await expect.element(screen.getByLabelText("Destination path")).toHaveValue("/new-path");
	});
});
