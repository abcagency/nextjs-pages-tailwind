import { useState } from 'react';
import trackEvent from '~/hooks/useEventTracker';

const isBrowser = typeof window !== 'undefined';

const ignore = ["intro"];
const RATIO = 0.33;
let first = true;

const useSectionTracker = () => {
	const [lastSection, setLastSection] = useState('');
	const [isAtTop, setIsAtTop] = useState(true);
	const sections = new Array();
	let timeout = null;

	// If we're near the top, clear the hash, set state, clear timeout
	if (isBrowser) {
		window.onscroll = () => {
			if (window.scrollY <=10) {
				setHash(' ');
				setIsAtTop(true);
				clearTimeout(timeout);
			} else {
				setIsAtTop(false);
			}
		};
	}

	// Allows a blank hash or ensures there is a # in the hash and replaces current state
	const setHash = hash => {
		if (hash !== ' ' && hash.indexOf('#') === -1) {
			hash = `#${hash}`;
		}
		if (window.history.replaceState) {
			window.history.replaceState(null, null, hash);
		} else {
			window.location.replace(hash);
		}
	};

	// Called when a section is intersecting
	const setCurrentSection = (id, ratio, threshold) => {
		// If we're mostly visible, we're entirely visible
		const newThreshold = ratio > 0.95 ? 1 : threshold;
		let found = false;

		// Update sections we've seen before
		sections.forEach(section => {
			if (section.id === id) {
				if (newThreshold < RATIO) {
					section.active = false;
				} else {
					section.active = true;
				}
				section.threshold = newThreshold;
				found = true;
			}
		});

		// Otherwise, add the section to the list
		if (!found) {
			sections.push({ id, threshold: newThreshold, active: newThreshold < RATIO ? false : true });
		}

		let maxThreshold = 0;
		let currentSection = '';

		clearTimeout(timeout);

		timeout = setTimeout(() => {
			// Find the section with the largest threshold
			sections.forEach(section => {
				if (section.active && section.threshold > maxThreshold) {
					maxThreshold = section.threshold;
					currentSection = section.id;
				}
			});

			// Set the current section (hash, track event)
			if (isBrowser && !isAtTop && currentSection && currentSection !== lastSection) {
				if (!first) {
					setHash(ignore.some(id => id === currentSection) ? ' ' : currentSection);
				}
				trackEvent('Engagement', 'View Section', currentSection);
				first = false;
			} else {
				first = false;
			}

			// Remember this section for next time so we don't set it again if not necessary
			setLastSection(currentSection);
		}, 1000);
	};

	return setCurrentSection;
};

export default useSectionTracker;
