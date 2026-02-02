'use client';

import type { ReactNode } from 'react';

import { SectionProvider } from '~/components/util/context/section';
import { HeadroomProvider } from '~/components/util/context/headroom';

export function Provider({ children }: { children: ReactNode }) {
	return (
		<HeadroomProvider>
			<SectionProvider>{children}</SectionProvider>
		</HeadroomProvider>
	);
}
