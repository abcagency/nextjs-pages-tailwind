'use client';

import { SectionProvider } from '~/components/util/context/section';
import { HeadroomProvider } from '~/components/util/context/headroom';

export function Provider({ children }) {
	return (
		<HeadroomProvider>
			<SectionProvider>{children}</SectionProvider>
		</HeadroomProvider>
	);
}
