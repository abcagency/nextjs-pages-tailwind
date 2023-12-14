'use client';

import { Provider as RWBProvider } from 'react-wrap-balancer';

import { SectionProvider } from '~/components/util/context/section';

export function Provider({
	children
}) {
	return (
		<SectionProvider>
			<RWBProvider>
				{children}
			</RWBProvider>
		</SectionProvider>
	);
}
