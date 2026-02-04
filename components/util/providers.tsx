'use client';

import type { ReactNode } from 'react';

import { HeadroomProvider } from '~/components/util/context/headroom';
import { SectionProvider } from '~/components/util/context/section';
import { Toaster } from '~/components/modules/core/sonner';

export function Provider({ children }: { children: ReactNode }) {
	return (
		<HeadroomProvider>
			<SectionProvider>
				{children}
				<Toaster />
			</SectionProvider>
		</HeadroomProvider>
	);
}
