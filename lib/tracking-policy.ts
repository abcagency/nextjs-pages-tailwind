export const EXCLUSION_COOKIE = 'hc_tracking_excluded';
const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

export type TrackingPolicy = {
	resolved: boolean;
	excluded: boolean;
	allowed: boolean;
};
export const UNRESOLVED_POLICY: TrackingPolicy = {
	resolved: false,
	excluded: false,
	allowed: false
};

type Environment = {
	production: boolean;
	productionHostname: string;
	deployContext: string;
};

type Browser = {
	location: { href: string };
	document: { cookie: string };
	dataLayer?: Array<Record<string, unknown>>;
};

export function resolveTrackingPolicy(
	url: URL,
	cookie: string,
	environment: Environment
): TrackingPolicy {
	const control = url.searchParams.get('exclude');
	const stored = cookie
		.split(';')
		.some(part => part.trim() === `${EXCLUSION_COOKIE}=true`);
	const excluded = control === 'true' || (control !== 'false' && stored);
	const host = url.hostname.toLowerCase();
	const preview =
		host.includes('--') ||
		/(^|[.-])(preview|staging|development|dev)([.-]|$)/.test(host);
	const local =
		host === 'localhost' ||
		!host.includes('.') ||
		/^(\d{1,3}\.){3}\d{1,3}$/.test(host) ||
		host.includes(':') ||
		/\.(localhost|local|test|invalid)$/.test(host);
	return {
		resolved: true,
		excluded,
		allowed:
			environment.production &&
			environment.deployContext === 'production' &&
			!local &&
			!preview &&
			host === environment.productionHostname.toLowerCase() &&
			!excluded
	};
}

export function exclusionCookie(excluded: boolean, secure: boolean): string {
	return `${EXCLUSION_COOKIE}=${excluded ? 'true' : ''}; Path=/; Max-Age=${excluded ? TEN_YEARS : 0}; SameSite=Lax${secure ? '; Secure' : ''}`;
}

// One instance owns the page-load policy for scripts, custom events and the indicator.
export function createTrackingPolicy(environment: Environment) {
	let policy = UNRESOLVED_POLICY;
	let initialized = false;
	const listeners = new Set<() => void>();
	return {
		getSnapshot: () => policy,
		subscribe(listener: () => void) {
			listeners.add(listener);
			return () => {
				listeners.delete(listener);
			};
		},
		resolve(browser: Browser) {
			// Exclusion controls are supported on full page loads only.
			if (policy.resolved) return;
			const url = new URL(browser.location.href);
			let cookie = '';
			try {
				cookie = browser.document.cookie;
			} catch {
				/* Storage may be blocked. */
			}
			const next = resolveTrackingPolicy(url, cookie, environment);
			if (next.excluded || url.searchParams.get('exclude') === 'false') {
				try {
					browser.document.cookie = exclusionCookie(
						next.excluded,
						url.protocol === 'https:'
					);
				} catch {
					// Query exclusion still applies when browser storage is unavailable.
				}
			}
			policy = next;
			listeners.forEach(listener => listener());
		},
		initialize(start: () => void) {
			if (!policy.allowed || initialized) return;
			initialized = true;
			start();
		},
		pushEvent(browser: Browser, event: Record<string, unknown>) {
			if (!policy.allowed) return;
			browser.dataLayer ??= [];
			browser.dataLayer.push(event);
		}
	};
}
