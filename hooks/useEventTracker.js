const isBrowser = typeof window !== 'undefined';

if (isBrowser) {
	window.dataLayer = window.dataLayer || [];
}

const trackEvent = (category, action, label, value) => {
	if (isBrowser && window.dataLayer) {
		window.dataLayer.push({
			'event': 'eventTracking',
			'category': category,
			'action': action,
			'label': label,
			'value': value
		});
	}
};

export default trackEvent;
