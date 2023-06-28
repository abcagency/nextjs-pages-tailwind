import { useState, useContext } from 'react';
import trackEvent from '~/hooks/useEventTracker';

import { SectionContext } from '~/components/modules/sections/sectionContext';

const isBrowser = typeof window !== 'undefined';

const ignore = ['intro'];
const RATIO = 0.33;
// let first = true;

const useSectionTracker = () => {
	const { setCurrentSection } = useContext(SectionContext);

	const [lastSection, setLastSection] = useState('');
	const [sections, setSections] = useState([]);
	let timeout = null;

	// Allows a blank hash or ensures there is a # in the hash and replaces current state
	const setHash = hash => {
		if (hash !== ' ' && hash.indexOf('#') === -1) {
			hash = `#${hash}`;
		}
		if (window.history.replaceState) {
			window.history.replaceState(window.history.state, null, hash);
		} else {
			window.location.replace(hash);
		}
	};

	// Called when a section is intersecting
	const sectionIsIntersecting = (id, ratio, threshold) => {
		// Ignore sections we don't want to track
		if (ignore.indexOf(id) !== -1) {
			return;
		}

		const newThreshold = threshold;
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
			setSections(sections => {
				sections.push({ id, threshold: newThreshold, active: newThreshold < RATIO ? false : true });
				return sections;
			});
		}

		let maxThreshold = 0;
		let sectionId = '';

		clearTimeout(timeout);

		timeout = setTimeout(() => {
			// Find the section with the largest threshold
			sections.forEach(section => {
				if (section.active && section.threshold > maxThreshold) {
					maxThreshold = section.threshold;
					sectionId = section.id;
				}
			});

			// Set the current section (hash, track event)
			if (isBrowser && sectionId && sectionId !== lastSection) {
				setHash(ignore.some(id => id === sectionId) ? ' ' : sectionId);
				trackEvent('Engagement', 'View Section', sectionId);
				setCurrentSection(sectionId);
			// } else {
			} else if (isBrowser && window.scrollY < 100) {
				setCurrentSection(' ');
				setHash(' ');
			}

			// Remember this section for next time so we don't set it again if not necessary
			setLastSection(sectionId);
		}, 500);
	};

	return sectionIsIntersecting;
};

export default useSectionTracker;
