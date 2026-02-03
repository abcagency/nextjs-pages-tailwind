declare global {
	interface Window {
		dataLayer?: Array<Record<string, unknown>>;
	}
}

const isBrowser = typeof window !== 'undefined';

if (isBrowser) {
	window.dataLayer = window.dataLayer || [];
}

type EventValue = string | number | undefined;

const trackEvent = (
	category: string,
	action: string,
	label?: string,
	value?: EventValue
) => {
	if (isBrowser && window.dataLayer) {
		window.dataLayer.push({
			event: 'eventTracking',
			category,
			action,
			label,
			value
		});
	}
};

export default trackEvent;
