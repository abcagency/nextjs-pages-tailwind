'use client';

import { Provider as RWBProvider } from 'react-wrap-balancer';
import NextProgress from 'next-progress';

import site from '~/data/site.json';

export function Providers({
	children
}) {
	return (
		<RWBProvider>
			<NextProgress
				color={site.colors.progress}
				delay={600}
				options={
					{
						trickleRate: 0.2,
						trickleSpeed: 400
					}
				}
			/>
			{children}
		</RWBProvider>
	);
}
