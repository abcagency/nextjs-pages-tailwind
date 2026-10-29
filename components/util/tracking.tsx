import { useEffect } from 'react';
import { useTrackingPolicy } from '~/hooks/use-tracking-policy';
import { tracking } from '~/lib/tracking';
import site from '~/data/site.json';

export default function Tracking() {
	const policy = useTrackingPolicy();
	useEffect(() => {
		tracking.resolve(window);
	}, []);

	useEffect(() => {
		if (!site.analytics.gtmId) return;
		// Start only after the initial page-load policy has resolved.
		tracking.initialize(() => {
			window.dataLayer ??= [];
			window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
			const script = document.createElement('script');
			script.id = 'google-tag-manager';
			script.async = true;
			script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(site.analytics.gtmId)}`;
			document.head.appendChild(script);
		});
	}, [policy.allowed]);

	if (!policy.excluded) return null;
	return (
		<span
			className="tracking-exclusion"
			tabIndex={0}
			role="img"
			aria-label="Analytics excluded"
		>
			<span role="tooltip" className="tracking-exclusion-tooltip">
				Analytics excluded.
			</span>
		</span>
	);
}
