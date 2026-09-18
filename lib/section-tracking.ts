export const SECTION_SETTLE_MS = 900;

type SectionId = string | null;
type SectionEntry = { id: string; rect: Pick<DOMRect, 'top' | 'bottom'> };
type Viewport = Pick<
	Window,
	| 'location'
	| 'history'
	| 'performance'
	| 'innerHeight'
	| 'setTimeout'
	| 'clearTimeout'
	| 'requestAnimationFrame'
	| 'cancelAnimationFrame'
	| 'addEventListener'
	| 'removeEventListener'
	| 'getComputedStyle'
> & { ResizeObserver?: typeof ResizeObserver };
type RouterEvents = import('next/router').NextRouter['events'];
type TrackerOptions = {
	viewport: Viewport;
	router: { events: RouterEvents };
	sections: Map<string, HTMLElement>;
	pageUrl?: string;
	onChange: (id: SectionId) => void;
	onSettled: (id: SectionId) => void;
	onHashChange: (id: SectionId) => void;
	onView: (id: string) => void;
};

export function decodeSectionHash(hash: string): SectionId {
	try {
		return decodeURIComponent(hash.slice(1)) || null;
	} catch {
		return null;
	}
}

// Resolve against the actual document URL, including query and locale/base path.
export function resolveSectionLink(href: string, documentUrl: string | null) {
	if (!documentUrl) {
		return {
			sameDocument: href.startsWith('#'),
			id: href.startsWith('#') ? decodeSectionHash(href) : null
		};
	}
	try {
		const current = new URL(documentUrl);
		const target = new URL(href, current);
		return {
			sameDocument:
				href.includes('#') &&
				target.origin === current.origin &&
				target.pathname === current.pathname &&
				target.search === current.search,
			id: decodeSectionHash(target.hash)
		};
	} catch {
		return { sameDocument: false, id: null };
	}
}

export function registerSectionElement(
	sections: Map<string, HTMLElement>,
	refresh: () => void,
	id: string,
	element: HTMLElement
) {
	sections.set(id, element);
	refresh();
	return () => {
		if (sections.get(id) !== element) return;
		sections.delete(id);
		refresh();
	};
}

// Entries are in document order, so the last tie-breaker is deterministic.
export function pickDominantSection(
	entries: SectionEntry[],
	viewportHeight: number,
	activeId: SectionId
): SectionId {
	let best: { id: string; score: number; distance: number } | null = null;
	for (const { id, rect } of entries) {
		const height = rect.bottom - rect.top;
		const visible = Math.max(
			0,
			Math.min(viewportHeight, rect.bottom) - Math.max(0, rect.top)
		);
		if (height <= 0 || visible <= 0 || viewportHeight <= 0) continue;
		const score = visible / Math.min(height, viewportHeight);
		const distance = Math.abs(rect.top);
		if (
			!best ||
			score > best.score ||
			(score === best.score &&
				(id === activeId || (best.id !== activeId && distance < best.distance)))
		) {
			best = { id, score, distance };
		}
	}
	return best?.id ?? null;
}

// Browser and router dependencies are injected to test the actual event/timer
// lifecycle without duplicating it in a simulated React component.
export function createSectionTracker({
	viewport,
	router,
	sections,
	pageUrl = `${viewport.location.pathname}${viewport.location.search}`,
	onChange,
	onSettled,
	onHashChange,
	onView
}: TrackerOptions) {
	let activeId: SectionId = null;
	let hashId: SectionId = null;
	let settled = false;
	let pending: { id: SectionId; deadline: number } | null = null;
	let timer: number | null = null;
	let frame: number | null = null;
	let navigation: string | null = null;
	let disposed = false;
	const viewed = new Set<string>();
	const knownIds = new Set<string>();
	const observed = new Set<HTMLElement>();
	const now = () => viewport.performance.now();
	const ownsPage = () =>
		`${viewport.location.pathname}${viewport.location.search}` === pageUrl;

	function clearPending() {
		pending = null;
		if (timer !== null) viewport.clearTimeout(timer);
		timer = null;
	}

	function schedule() {
		if (disposed || frame !== null) return;
		frame = viewport.requestAnimationFrame(() => {
			frame = null;
			evaluate();
		});
	}

	function publishHashSection() {
		if (disposed) return;
		const id = decodeSectionHash(viewport.location.hash);
		const nextId = ownsPage() && id !== null && sections.has(id) ? id : null;
		if (nextId !== hashId) {
			hashId = nextId;
			onHashChange(hashId);
		}
	}

	function syncHash() {
		if (disposed || !settled || navigation !== null) return;
		const { pathname, search, hash } = viewport.location;
		if (!ownsPage()) return;
		// Non-section bookmarks remain meaningful while no section is visible.
		const fragmentId = decodeSectionHash(hash);
		if (activeId === null && (fragmentId === null || !knownIds.has(fragmentId)))
			return;
		const nextHash = activeId ? `#${encodeURIComponent(activeId)}` : '';
		if (fragmentId === activeId) {
			publishHashSection();
			return;
		}
		const url = `${pathname}${search}${nextHash}`;
		const state = viewport.history.state as Record<string, unknown> | null;
		// Next's Pages Container scrolls to the hash on router-driven renders,
		// even with scroll:false. A history-only write neither renders nor scrolls.
		// Keep saved Next URLs consistent for Back/Forward; preserve its key/options.
		viewport.history.replaceState(
			state?.__N
				? {
						...state,
						// Internal dynamic-route URLs and displayed locale/base paths differ.
						...(typeof state.url === 'string'
							? { url: state.url.split('#')[0] + nextHash }
							: {}),
						...(typeof state.as === 'string'
							? { as: state.as.split('#')[0] + nextHash }
							: {})
					}
				: state,
			'',
			url
		);
		// replaceState does not emit hashchange. Publish its result explicitly.
		publishHashSection();
	}

	function evaluate() {
		if (disposed || navigation !== null || !ownsPage()) return;
		const viewportHeight = viewport.innerHeight;
		const entries = [...sections]
			.filter(([, element]) => {
				if (!element.isConnected) return false;
				if (element.checkVisibility)
					return element.checkVisibility({
						checkOpacity: true,
						checkVisibilityCSS: true
					});
				const style = viewport.getComputedStyle(element);
				return (
					element.getClientRects().length > 0 &&
					style.visibility !== 'hidden' &&
					style.visibility !== 'collapse' &&
					style.opacity !== '0'
				);
			})
			.sort(([, a], [, b]) => {
				const position = a.compareDocumentPosition(b);
				return position & 4 ? -1 : position & 2 ? 1 : 0;
			})
			.map(([id, element]) => ({ id, rect: element.getBoundingClientRect() }));
		const candidate = pickDominantSection(entries, viewportHeight, activeId);
		// Publish the instant measurement independently of the settled value.
		if (candidate !== activeId) {
			clearPending();
			settled = false;
			activeId = candidate;
			onChange(activeId);
			if (disposed) return;
		}
		if (settled) {
			syncHash();
			return;
		}
		if (!pending || pending.id !== candidate) {
			clearPending();
			pending = { id: candidate, deadline: now() + SECTION_SETTLE_MS };
		}
		const remaining = pending.deadline - now();
		if (remaining <= 0) {
			clearPending();
			settled = true;
			onSettled(activeId);
			if (disposed) return;
			if (activeId && !viewed.has(activeId)) {
				viewed.add(activeId);
				onView(activeId);
			}
			syncHash();
		} else if (timer === null) {
			timer = viewport.setTimeout(() => {
				timer = null;
				schedule();
			}, remaining);
		}
	}

	function onNavigationStart(url: string) {
		if (disposed) return;
		navigation = url;
		clearPending();
		settled = false;
	}

	function onNavigationEnd(url: string) {
		if (disposed) return;
		if (navigation !== null && navigation !== url) return;
		navigation = null;
		clearPending();
		settled = false;
		publishHashSection();
		schedule();
	}

	function onNavigationError(_error: unknown, url: string) {
		onNavigationEnd(url);
	}

	function onLocationChange() {
		if (disposed) return;
		publishHashSection();
		clearPending();
		settled = false;
		schedule();
	}

	const observer = viewport.ResizeObserver
		? new viewport.ResizeObserver(schedule)
		: null;

	function refreshSections() {
		if (disposed) return;
		publishHashSection();
		const elements = new Set(sections.values());
		for (const element of observed) {
			if (!elements.has(element)) {
				observer?.unobserve(element);
				observed.delete(element);
			}
		}
		for (const [id, element] of sections) {
			knownIds.add(id);
			if (!observed.has(element)) {
				observer?.observe(element);
				observed.add(element);
			}
		}
		schedule();
	}

	const browserEvents = {
		scroll: schedule,
		resize: schedule,
		orientationchange: schedule,
		hashchange: onLocationChange,
		popstate: onLocationChange
	};
	const routerEvents = {
		hashChangeStart: onNavigationStart,
		routeChangeStart: onNavigationStart,
		hashChangeComplete: onNavigationEnd,
		routeChangeComplete: onNavigationEnd,
		routeChangeError: onNavigationError
	} satisfies Partial<
		Record<Parameters<RouterEvents['on']>[0], (...args: never[]) => void>
	>;
	for (const [event, handler] of Object.entries(browserEvents)) {
		viewport.addEventListener(event, handler, { passive: true });
	}
	for (const event of Object.keys(
		routerEvents
	) as (keyof typeof routerEvents)[]) {
		const handler = routerEvents[event];
		router.events.on(event, handler);
	}
	refreshSections();

	return {
		refreshSections,
		dispose() {
			disposed = true;
			clearPending();
			if (frame !== null) viewport.cancelAnimationFrame(frame);
			observer?.disconnect();
			for (const [event, handler] of Object.entries(browserEvents)) {
				viewport.removeEventListener(event, handler);
			}
			for (const event of Object.keys(
				routerEvents
			) as (keyof typeof routerEvents)[]) {
				const handler = routerEvents[event];
				router.events.off(event, handler);
			}
		}
	};
}
