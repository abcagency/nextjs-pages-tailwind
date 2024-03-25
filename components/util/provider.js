'use client';

import { Provider as RWBProvider } from 'react-wrap-balancer';

import { SectionProvider } from '~/components/util/context/section';
import { HeadroomProvider } from '~/components/util/context/headroom';

export function Provider({
	children
}) {
	return (
		<HeadroomProvider>
			<SectionProvider>
				<RWBProvider>
					{children}
				</RWBProvider>
			</SectionProvider>
		</HeadroomProvider>
	);
}
