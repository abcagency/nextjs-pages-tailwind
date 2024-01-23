import { sendGTMEvent } from '@next/third-parties/google';

const trackEvent = (category, action, label, value) => {
	sendGTMEvent({
		'event': 'eventTracking',
		'category': category,
		'action': action,
		'label': label,
		'value': value
	});
};

export default trackEvent;
