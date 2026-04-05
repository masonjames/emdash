import { Badge, Button, Dialog, Input, Label, Switch } from "@cloudflare/kumo";
import {
	ArrowRight,
	ArrowsLeftRight,
	MagnifyingGlass,
	PencilSimple,
	Plus,
	Trash,
	X,
} from "@phosphor-icons/react";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as React from "react";

import {
	clear404Entries,
	createRedirect,
	delete404Entry,
	deleteRedirect,
	fetch404Entries,
	fetch404Summary,
	fetchRedirects,
	prune404Entries,
	resolve404ToRedirect,
	updateRedirect,
} from "../lib/api/redirects.js";
import type {
	CreateRedirectInput,
	NotFoundEntry,
	NotFoundSummary,
	Redirect,
	UpdateRedirectInput,
} from "../lib/api/redirects.js";
import { cn } from "../lib/utils.js";
import { ConfirmDialog } from "./ConfirmDialog.js";
import { DialogError, getMutationError } from "./DialogError.js";

function formatDateTime(value: string): string {
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function flattenPages<T>(pages?: Array<{ items: T[] }>): T[] {
	return pages?.flatMap((page) => page.items) ?? [];
}

type RedirectDialogMode =
	| { kind: "create"; defaultSource?: string }
	| { kind: "edit"; redirect: Redirect }
	| { kind: "resolve404"; defaultSource: string };

function RedirectFormDialog({
	open,
	onClose,
	mode,
}: {
	open: boolean;
	onClose: () => void;
	mode: RedirectDialogMode;
}) {
	const queryClient = useQueryClient();
	const isEdit = mode.kind === "edit";
	const isResolve = mode.kind === "resolve404";

	const [source, setSource] = React.useState("");
	const [destination, setDestination] = React.useState("");
	const [type, setType] = React.useState("301");
	const [enabled, setEnabled] = React.useState(true);
	const [groupName, setGroupName] = React.useState("");

	React.useEffect(() => {
		if (!open) return;
		if (mode.kind === "edit") {
			setSource(mode.redirect.source);
			setDestination(mode.redirect.destination);
			setType(String(mode.redirect.type));
			setEnabled(mode.redirect.enabled);
			setGroupName(mode.redirect.groupName ?? "");
			return;
		}

		setSource(mode.defaultSource ?? "");
		setDestination("");
		setType("301");
		setEnabled(true);
		setGroupName("");
	}, [mode, open]);

	const invalidateRedirectData = React.useCallback(() => {
		void queryClient.invalidateQueries({ queryKey: ["redirects"] });
	}, [queryClient]);

	const createMutation = useMutation({
		mutationFn: (input: CreateRedirectInput) => createRedirect(input),
		onSuccess: () => {
			invalidateRedirectData();
			onClose();
		},
	});

	const updateMutation = useMutation({
		mutationFn: (input: UpdateRedirectInput) =>
			updateRedirect(mode.kind === "edit" ? mode.redirect.id : "", input),
		onSuccess: () => {
			invalidateRedirectData();
			onClose();
		},
	});

	const resolveMutation = useMutation({
		mutationFn: (input: CreateRedirectInput) => resolve404ToRedirect(input),
		onSuccess: () => {
			invalidateRedirectData();
			onClose();
		},
	});

	const mutation = isEdit ? updateMutation : isResolve ? resolveMutation : createMutation;

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const input = {
			source: source.trim(),
			destination: destination.trim(),
			type: Number(type),
			enabled,
			groupName: groupName.trim() || null,
		};

		if (isEdit) {
			updateMutation.mutate(input);
			return;
		}
		if (isResolve) {
			resolveMutation.mutate(input);
			return;
		}
		createMutation.mutate(input);
	}

	const title = isEdit ? "Edit Redirect" : isResolve ? "Resolve 404" : "New Redirect";
	const description = isEdit
		? "Update this redirect rule."
		: isResolve
			? "Create a redirect for this missing path and remove matching 404 log entries."
			: "Use [param] or [...rest] in paths for pattern matching.";
	const submitLabel = isEdit ? "Save" : isResolve ? "Resolve" : "Create";
	const pendingLabel = isEdit ? "Saving..." : isResolve ? "Resolving..." : "Creating...";

	return (
		<Dialog.Root open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
			<Dialog className="p-6" size="lg">
				<div className="mb-4 flex items-start justify-between gap-4">
					<div>
						<Dialog.Title className="text-lg font-semibold leading-none tracking-tight">
							{title}
						</Dialog.Title>
						<p className="mt-1 text-sm text-kumo-subtle">{description}</p>
					</div>
					<Dialog.Close
						aria-label="Close"
						render={(props) => (
							<Button
								{...props}
								variant="ghost"
								shape="square"
								aria-label="Close"
								className="absolute right-4 top-4"
							>
								<X className="h-4 w-4" />
							</Button>
						)}
					/>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<Input
						label="Source path"
						placeholder="/old-page or /blog/[slug]"
						value={source}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSource(e.target.value)}
						required
						readOnly={isResolve}
					/>

					<Input
						label="Destination path"
						placeholder="/new-page, /articles/[slug], or /search?q=term"
						value={destination}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDestination(e.target.value)}
						required
					/>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<Label htmlFor="redirect-type">Status code</Label>
							<select
								id="redirect-type"
								value={type}
								onChange={(e) => setType(e.target.value)}
								className="flex h-10 w-full rounded-md border border-kumo-line bg-kumo-base px-3 py-2 text-sm"
							>
								<option value="301">301 Permanent</option>
								<option value="302">302 Temporary</option>
								<option value="307">307 Temporary (Strict)</option>
								<option value="308">308 Permanent (Strict)</option>
							</select>
						</div>

						<Input
							label="Group (optional)"
							placeholder={isResolve ? "Defaults to Resolved 404" : "e.g. import, blog"}
							value={groupName}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGroupName(e.target.value)}
						/>
					</div>

					<div className="flex items-center gap-2">
						<Switch checked={enabled} onCheckedChange={setEnabled} id="redirect-enabled" />
						<Label htmlFor="redirect-enabled">Enabled</Label>
					</div>

					<DialogError message={getMutationError(mutation.error)} />

					<div className="flex justify-end gap-2">
						<Button type="button" variant="outline" onClick={onClose}>
							Cancel
						</Button>
						<Button type="submit" disabled={mutation.isPending}>
							{mutation.isPending ? pendingLabel : submitLabel}
						</Button>
					</div>
				</form>
			</Dialog>
		</Dialog.Root>
	);
}

function Prune404Dialog({
	open,
	onClose,
	onConfirm,
	isPending,
	error,
}: {
	open: boolean;
	onClose: () => void;
	onConfirm: (olderThanIso: string) => void;
	isPending: boolean;
	error: unknown;
}) {
	const [value, setValue] = React.useState("");
	const [localError, setLocalError] = React.useState<string | null>(null);

	React.useEffect(() => {
		if (!open) {
			setValue("");
			setLocalError(null);
		}
	}, [open]);

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!value) {
			setLocalError("Choose a cutoff date and time.");
			return;
		}

		const date = new Date(value);
		if (Number.isNaN(date.getTime())) {
			setLocalError("Choose a valid cutoff date and time.");
			return;
		}

		setLocalError(null);
		onConfirm(date.toISOString());
	}

	return (
		<Dialog.Root
			open={open}
			onOpenChange={(nextOpen) => !nextOpen && onClose()}
			disablePointerDismissal
		>
			<Dialog className="p-6" size="sm">
				<Dialog.Title className="text-lg font-semibold">Prune 404 Log</Dialog.Title>
				<Dialog.Description className="text-kumo-subtle">
					Delete 404 entries older than the selected date and time.
				</Dialog.Description>
				<form onSubmit={handleSubmit} className="mt-4 space-y-4">
					<div>
						<Label htmlFor="404-prune-older-than">Older than</Label>
						<input
							id="404-prune-older-than"
							type="datetime-local"
							value={value}
							onChange={(e) => setValue(e.target.value)}
							className="mt-1 flex h-10 w-full rounded-md border border-kumo-line bg-kumo-base px-3 py-2 text-sm"
							required
						/>
					</div>
					<DialogError message={localError ?? getMutationError(error)} />
					<div className="flex justify-end gap-2">
						<Button type="button" variant="secondary" onClick={onClose}>
							Cancel
						</Button>
						<Button type="submit" disabled={isPending}>
							{isPending ? "Pruning..." : "Prune"}
						</Button>
					</div>
				</form>
			</Dialog>
		</Dialog.Root>
	);
}

function NotFoundSummaryPanel({
	items,
	onResolve,
}: {
	items: NotFoundSummary[];
	onResolve: (path: string) => void;
}) {
	if (items.length === 0) {
		return <p className="py-4 text-center text-sm text-kumo-subtle">No 404 errors recorded yet.</p>;
	}

	return (
		<div className="rounded-lg border">
			<div className="flex items-center gap-4 border-b bg-kumo-tint/50 px-4 py-2 text-sm font-medium text-kumo-subtle">
				<div className="flex-1">Path</div>
				<div className="w-16 text-right">Hits</div>
				<div className="w-40">Top referrer</div>
				<div className="w-44">Last seen</div>
				<div className="w-20" />
			</div>
			{items.map((item) => (
				<div
					key={item.path}
					className="flex items-center gap-4 border-b px-4 py-2 text-sm last:border-0"
				>
					<div className="flex-1 truncate font-mono text-xs" title={item.path}>
						{item.path}
					</div>
					<div className="w-16 text-right tabular-nums">{item.count}</div>
					<div
						className="w-40 truncate text-xs text-kumo-subtle"
						title={item.topReferrer ?? undefined}
					>
						{item.topReferrer ?? "—"}
					</div>
					<div className="w-44 text-xs text-kumo-subtle">{formatDateTime(item.lastSeen)}</div>
					<div className="w-20 text-right">
						<Button size="sm" variant="outline" onClick={() => onResolve(item.path)}>
							Resolve
						</Button>
					</div>
				</div>
			))}
		</div>
	);
}

function NotFoundEntriesTable({
	items,
	onResolve,
	onDelete,
}: {
	items: NotFoundEntry[];
	onResolve: (path: string) => void;
	onDelete: (entry: NotFoundEntry) => void;
}) {
	if (items.length === 0) {
		return (
			<p className="py-8 text-center text-sm text-kumo-subtle">No matching 404 log entries.</p>
		);
	}

	return (
		<div className="rounded-lg border">
			<div className="flex items-center gap-4 border-b bg-kumo-tint/50 px-4 py-2 text-sm font-medium text-kumo-subtle">
				<div className="flex-1">Path</div>
				<div className="w-48">Referrer</div>
				<div className="w-44">Seen</div>
				<div className="w-28 text-right">Actions</div>
			</div>
			{items.map((item) => (
				<div
					key={item.id}
					className="flex items-center gap-4 border-b px-4 py-2 text-sm last:border-0"
				>
					<div className="flex-1 truncate font-mono text-xs" title={item.path}>
						{item.path}
					</div>
					<div
						className="w-48 truncate text-xs text-kumo-subtle"
						title={item.referrer ?? undefined}
					>
						{item.referrer ?? "—"}
					</div>
					<div className="w-44 text-xs text-kumo-subtle">{formatDateTime(item.createdAt)}</div>
					<div className="flex w-28 items-center justify-end gap-1">
						<button
							onClick={() => onResolve(item.path)}
							className="p-1 text-kumo-subtle hover:text-kumo-default"
							title="Resolve 404"
							aria-label={`Resolve ${item.path}`}
						>
							<ArrowsLeftRight size={14} />
						</button>
						<button
							onClick={() => onDelete(item)}
							className="p-1 text-kumo-subtle hover:text-kumo-danger"
							title="Delete 404 entry"
							aria-label={`Delete 404 entry ${item.path}`}
						>
							<Trash size={14} />
						</button>
					</div>
				</div>
			))}
		</div>
	);
}

type TabKey = "redirects" | "404s";

export function Redirects() {
	const queryClient = useQueryClient();
	const [tab, setTab] = React.useState<TabKey>("redirects");

	const [redirectSearch, setRedirectSearch] = React.useState("");
	const [debouncedRedirectSearch, setDebouncedRedirectSearch] = React.useState("");
	const [notFoundSearch, setNotFoundSearch] = React.useState("");
	const [debouncedNotFoundSearch, setDebouncedNotFoundSearch] = React.useState("");
	const [filterEnabled, setFilterEnabled] = React.useState<string>("all");
	const [filterAuto, setFilterAuto] = React.useState<string>("all");

	const [dialogMode, setDialogMode] = React.useState<RedirectDialogMode | null>(null);
	const [redirectToDelete, setRedirectToDelete] = React.useState<Redirect | null>(null);
	const [notFoundToDelete, setNotFoundToDelete] = React.useState<NotFoundEntry | null>(null);
	const [showClear404s, setShowClear404s] = React.useState(false);
	const [showPrune404s, setShowPrune404s] = React.useState(false);

	React.useEffect(() => {
		const timer = setTimeout(setDebouncedRedirectSearch, 300, redirectSearch);
		return () => clearTimeout(timer);
	}, [redirectSearch]);

	React.useEffect(() => {
		const timer = setTimeout(setDebouncedNotFoundSearch, 300, notFoundSearch);
		return () => clearTimeout(timer);
	}, [notFoundSearch]);

	const enabledFilter = filterEnabled === "all" ? undefined : filterEnabled === "true";
	const autoFilter = filterAuto === "all" ? undefined : filterAuto === "true";

	const redirectsQuery = useInfiniteQuery({
		queryKey: ["redirects", "list", debouncedRedirectSearch, enabledFilter, autoFilter],
		queryFn: ({ pageParam }) =>
			fetchRedirects({
				cursor: pageParam,
				limit: 50,
				search: debouncedRedirectSearch || undefined,
				enabled: enabledFilter,
				auto: autoFilter,
			}),
		initialPageParam: undefined as string | undefined,
		getNextPageParam: (lastPage) => lastPage.nextCursor,
	});

	const notFoundSummaryQuery = useQuery({
		queryKey: ["redirects", "404-summary"],
		queryFn: () => fetch404Summary(25),
		enabled: tab === "404s",
	});

	const notFoundEntriesQuery = useInfiniteQuery({
		queryKey: ["redirects", "404-entries", debouncedNotFoundSearch],
		queryFn: ({ pageParam }) =>
			fetch404Entries({
				cursor: pageParam,
				limit: 50,
				search: debouncedNotFoundSearch || undefined,
			}),
		initialPageParam: undefined as string | undefined,
		getNextPageParam: (lastPage) => lastPage.nextCursor,
		enabled: tab === "404s",
	});

	const invalidateRedirectData = React.useCallback(() => {
		void queryClient.invalidateQueries({ queryKey: ["redirects"] });
	}, [queryClient]);

	const deleteRedirectMutation = useMutation({
		mutationFn: (id: string) => deleteRedirect(id),
		onSuccess: () => {
			invalidateRedirectData();
			setRedirectToDelete(null);
		},
	});

	const toggleMutation = useMutation({
		mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
			updateRedirect(id, { enabled }),
		onSuccess: () => {
			invalidateRedirectData();
		},
		onError: () => {
			invalidateRedirectData();
		},
	});

	const delete404Mutation = useMutation({
		mutationFn: (id: string) => delete404Entry(id),
		onSuccess: () => {
			invalidateRedirectData();
			setNotFoundToDelete(null);
		},
	});

	const clear404sMutation = useMutation({
		mutationFn: () => clear404Entries(),
		onSuccess: () => {
			invalidateRedirectData();
			setShowClear404s(false);
		},
	});

	const prune404sMutation = useMutation({
		mutationFn: (olderThan: string) => prune404Entries(olderThan),
		onSuccess: () => {
			invalidateRedirectData();
			setShowPrune404s(false);
		},
	});

	const redirects = flattenPages(redirectsQuery.data?.pages);
	const notFoundEntries = flattenPages(notFoundEntriesQuery.data?.pages);

	function openNewRedirect(defaultSource?: string) {
		setDialogMode({ kind: "create", defaultSource });
	}

	function openEditRedirect(redirect: Redirect) {
		setDialogMode({ kind: "edit", redirect });
	}

	function openResolve404(path: string) {
		setDialogMode({ kind: "resolve404", defaultSource: path });
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Redirects</h1>
					<p className="text-kumo-subtle">
						Manage redirects and inspect missing URLs before they cost crawl budget.
					</p>
				</div>
				<Button icon={<Plus />} onClick={() => openNewRedirect()}>
					New Redirect
				</Button>
			</div>

			<div className="flex gap-1 border-b">
				<button
					onClick={() => setTab("redirects")}
					className={cn(
						"-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors",
						tab === "redirects"
							? "border-kumo-brand text-kumo-brand"
							: "border-transparent text-kumo-subtle hover:text-kumo-default",
					)}
				>
					Redirects
					<Badge variant="secondary" className="ml-2">
						{redirects.length}
						{redirectsQuery.hasNextPage ? "+" : ""}
					</Badge>
				</button>
				<button
					onClick={() => setTab("404s")}
					className={cn(
						"-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors",
						tab === "404s"
							? "border-kumo-brand text-kumo-brand"
							: "border-transparent text-kumo-subtle hover:text-kumo-default",
					)}
				>
					404 Errors
				</button>
			</div>

			{tab === "redirects" && (
				<>
					<div className="flex items-center gap-4">
						<div className="relative flex-1 max-w-md">
							<MagnifyingGlass
								className="absolute left-3 top-1/2 -translate-y-1/2 text-kumo-subtle"
								size={16}
							/>
							<Input
								aria-label="Search redirects"
								placeholder="Search source or destination..."
								className="pl-10"
								value={redirectSearch}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									setRedirectSearch(e.target.value)
								}
							/>
						</div>
						<select
							value={filterEnabled}
							onChange={(e) => setFilterEnabled(e.target.value)}
							className="h-10 rounded-md border border-kumo-line bg-kumo-base px-3 text-sm"
						>
							<option value="all">All statuses</option>
							<option value="true">Enabled</option>
							<option value="false">Disabled</option>
						</select>
						<select
							value={filterAuto}
							onChange={(e) => setFilterAuto(e.target.value)}
							className="h-10 rounded-md border border-kumo-line bg-kumo-base px-3 text-sm"
						>
							<option value="all">All types</option>
							<option value="false">Manual</option>
							<option value="true">Auto</option>
						</select>
					</div>

					{redirectsQuery.isLoading ? (
						<div className="py-12 text-center text-kumo-subtle">Loading redirects...</div>
					) : redirects.length === 0 ? (
						<div className="py-12 text-center text-kumo-subtle">
							<ArrowsLeftRight size={48} className="mx-auto mb-4 opacity-30" />
							<p className="text-lg font-medium">No redirects yet</p>
							<p className="mt-1 text-sm">Create redirect rules to manage URL changes cleanly.</p>
						</div>
					) : (
						<div className="rounded-lg border">
							<div className="flex items-center gap-4 border-b bg-kumo-tint/50 px-4 py-2 text-sm font-medium text-kumo-subtle">
								<div className="flex-1">Source</div>
								<div className="w-8 text-center" />
								<div className="flex-1">Destination</div>
								<div className="w-14 text-center">Code</div>
								<div className="w-16 text-right">Hits</div>
								<div className="w-28">Meta</div>
								<div className="w-20 text-center">Status</div>
								<div className="w-20" />
							</div>
							{redirects.map((redirect) => (
								<div
									key={redirect.id}
									className={cn(
										"flex items-center gap-4 border-b px-4 py-2 text-sm last:border-0",
										!redirect.enabled && "opacity-50",
									)}
								>
									<div className="flex-1 truncate font-mono text-xs" title={redirect.source}>
										{redirect.source}
									</div>
									<div className="w-8 text-center text-kumo-subtle">
										<ArrowRight size={14} />
									</div>
									<div className="flex-1 truncate font-mono text-xs" title={redirect.destination}>
										{redirect.destination}
									</div>
									<div className="w-14 text-center">
										<Badge variant="secondary">{redirect.type}</Badge>
									</div>
									<div className="w-16 text-right tabular-nums text-kumo-subtle">
										{redirect.hits}
									</div>
									<div className="w-28">
										{redirect.auto ? (
											<Badge variant="outline">Auto</Badge>
										) : (
											<span className="text-xs text-kumo-subtle">Manual</span>
										)}
									</div>
									<div className="w-20 text-center">
										<Switch
											checked={redirect.enabled}
											onCheckedChange={(checked) =>
												toggleMutation.mutate({ id: redirect.id, enabled: checked })
											}
											aria-label={redirect.enabled ? "Disable redirect" : "Enable redirect"}
										/>
									</div>
									<div className="flex w-20 items-center justify-end gap-1">
										<button
											onClick={() => openEditRedirect(redirect)}
											className="p-1 text-kumo-subtle hover:text-kumo-default"
											title="Edit redirect"
											aria-label={`Edit redirect ${redirect.source}`}
										>
											<PencilSimple size={14} />
										</button>
										<button
											onClick={() => setRedirectToDelete(redirect)}
											className="p-1 text-kumo-subtle hover:text-kumo-danger"
											title="Delete redirect"
											aria-label={`Delete redirect ${redirect.source}`}
										>
											<Trash size={14} />
										</button>
									</div>
								</div>
							))}
						</div>
					)}

					{redirectsQuery.hasNextPage && (
						<div className="flex justify-center">
							<Button
								variant="outline"
								onClick={() => redirectsQuery.fetchNextPage()}
								disabled={redirectsQuery.isFetchingNextPage}
							>
								{redirectsQuery.isFetchingNextPage ? "Loading..." : "Load more"}
							</Button>
						</div>
					)}
				</>
			)}

			{tab === "404s" && (
				<div className="space-y-6">
					<div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<div>
									<h2 className="text-lg font-semibold">Top missing paths</h2>
									<p className="text-sm text-kumo-subtle">Resolve the highest-volume 404s first.</p>
								</div>
							</div>
							{notFoundSummaryQuery.isLoading ? (
								<div className="py-12 text-center text-kumo-subtle">Loading 404 summary...</div>
							) : (
								<NotFoundSummaryPanel
									items={notFoundSummaryQuery.data ?? []}
									onResolve={openResolve404}
								/>
							)}
						</div>

						<div className="space-y-3">
							<div>
								<h2 className="text-lg font-semibold">404 operations</h2>
								<p className="text-sm text-kumo-subtle">
									Clean up noise after the important paths are resolved.
								</p>
							</div>
							<div className="rounded-lg border p-4 space-y-3">
								<Button variant="outline" onClick={() => setShowPrune404s(true)}>
									Prune old entries
								</Button>
								<Button variant="outline" onClick={() => setShowClear404s(true)}>
									Clear entire 404 log
								</Button>
								<p className="text-xs text-kumo-subtle">
									Clearing removes all log history. Pruning is safer for ongoing monitoring.
								</p>
							</div>
						</div>
					</div>

					<div className="space-y-3">
						<div className="flex items-center justify-between gap-4">
							<div>
								<h2 className="text-lg font-semibold">Detailed 404 log</h2>
								<p className="text-sm text-kumo-subtle">
									Inspect individual misses, referrers, and cleanup actions.
								</p>
							</div>
							<div className="relative w-full max-w-md">
								<MagnifyingGlass
									className="absolute left-3 top-1/2 -translate-y-1/2 text-kumo-subtle"
									size={16}
								/>
								<Input
									aria-label="Search 404 log"
									placeholder="Search missing paths..."
									className="pl-10"
									value={notFoundSearch}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
										setNotFoundSearch(e.target.value)
									}
								/>
							</div>
						</div>

						{notFoundEntriesQuery.isLoading ? (
							<div className="py-12 text-center text-kumo-subtle">Loading 404 log entries...</div>
						) : (
							<NotFoundEntriesTable
								items={notFoundEntries}
								onResolve={openResolve404}
								onDelete={setNotFoundToDelete}
							/>
						)}

						{notFoundEntriesQuery.hasNextPage && (
							<div className="flex justify-center">
								<Button
									variant="outline"
									onClick={() => notFoundEntriesQuery.fetchNextPage()}
									disabled={notFoundEntriesQuery.isFetchingNextPage}
								>
									{notFoundEntriesQuery.isFetchingNextPage ? "Loading..." : "Load more"}
								</Button>
							</div>
						)}
					</div>
				</div>
			)}

			{dialogMode && (
				<RedirectFormDialog open onClose={() => setDialogMode(null)} mode={dialogMode} />
			)}

			<ConfirmDialog
				open={!!redirectToDelete}
				onClose={() => {
					setRedirectToDelete(null);
					deleteRedirectMutation.reset();
				}}
				title="Delete Redirect?"
				description={
					redirectToDelete
						? `This redirect from ${redirectToDelete.source} will be permanently removed.`
						: "This redirect rule will be permanently removed."
				}
				confirmLabel="Delete"
				pendingLabel="Deleting..."
				isPending={deleteRedirectMutation.isPending}
				error={deleteRedirectMutation.error}
				onConfirm={() => redirectToDelete && deleteRedirectMutation.mutate(redirectToDelete.id)}
			/>

			<ConfirmDialog
				open={!!notFoundToDelete}
				onClose={() => {
					setNotFoundToDelete(null);
					delete404Mutation.reset();
				}}
				title="Delete 404 Log Entry?"
				description={
					notFoundToDelete
						? `This 404 log entry for ${notFoundToDelete.path} will be permanently removed.`
						: "This 404 log entry will be permanently removed."
				}
				confirmLabel="Delete"
				pendingLabel="Deleting..."
				isPending={delete404Mutation.isPending}
				error={delete404Mutation.error}
				onConfirm={() => notFoundToDelete && delete404Mutation.mutate(notFoundToDelete.id)}
			/>

			<ConfirmDialog
				open={showClear404s}
				onClose={() => {
					setShowClear404s(false);
					clear404sMutation.reset();
				}}
				title="Clear 404 Log?"
				description="This removes every 404 log entry. Existing redirect rules are not affected."
				confirmLabel="Clear log"
				pendingLabel="Clearing..."
				isPending={clear404sMutation.isPending}
				error={clear404sMutation.error}
				onConfirm={() => clear404sMutation.mutate()}
				variant="primary"
			/>

			<Prune404Dialog
				open={showPrune404s}
				onClose={() => {
					setShowPrune404s(false);
					prune404sMutation.reset();
				}}
				onConfirm={(olderThanIso) => prune404sMutation.mutate(olderThanIso)}
				isPending={prune404sMutation.isPending}
				error={prune404sMutation.error}
			/>
		</div>
	);
}
