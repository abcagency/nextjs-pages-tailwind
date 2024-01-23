// const isBrowser = typeof window !== 'undefined';

// if (isBrowser) {
// 	window.dataLayer = window.dataLayer || [];
// }

// const trackEvent = (category, action, label, value) => {
// 	if (isBrowser && window.dataLayer) {
// 		window.dataLayer.push({
// 			'event': 'eventTracking',
// 			'category': category,
// 			'action': action,
// 			'label': label,
// 			'value': value
// 		});
// 	}
// };

// export default trackEvent;

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
