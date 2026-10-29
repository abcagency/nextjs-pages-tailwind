import { tracking } from '~/lib/tracking';

declare global {
	interface Window {
		dataLayer?: Array<Record<string, unknown>>;
	}
}

type EventValue = string | number | undefined;

const trackEvent = (
	category: string,
	action: string,
	label?: string,
	value?: EventValue
) => {
	if (typeof window !== 'undefined') {
		tracking.pushEvent(window, {
			event: 'eventTracking',
			category,
			action,
			label,
			value
		});
	}
};

export default trackEvent;
