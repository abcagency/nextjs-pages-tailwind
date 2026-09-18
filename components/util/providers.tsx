'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/router';

import { HeadroomProvider } from '~/components/util/context/headroom';
import { SectionProvider } from '~/components/util/context/section';
import { Toaster } from '~/components/modules/core/sonner';

export function Provider({ children }: { children: ReactNode }) {
	const router = useRouter();
	// New documents get a fresh registry and view lifetime; hash changes do not.
	const [pageKey, setPageKey] = useState(router.asPath.split('#')[0]);
	useEffect(() => {
		const refreshPage = () => {
			setPageKey(`${window.location.pathname}${window.location.search}`);
		};
		refreshPage();
		// Read the displayed URL: asPath can omit locale and base-path prefixes.
		router.events.on('routeChangeComplete', refreshPage);
		return () => router.events.off('routeChangeComplete', refreshPage);
	}, [router.events]);
	return (
		<HeadroomProvider>
			<SectionProvider key={pageKey}>
				{children}
				<Toaster />
			</SectionProvider>
		</HeadroomProvider>
	);
}
