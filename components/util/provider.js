'use client';

import { Provider as RWBProvider } from 'react-wrap-balancer';

export function Provider({
	children
}) {
	return (
		<RWBProvider>
			{children}
		</RWBProvider>
	);
}
