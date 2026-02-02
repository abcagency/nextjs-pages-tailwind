import { useState, useContext } from 'react';

import trackEvent from '~/hooks/useEventTracker';
import SectionContext from '~/components/util/context/section';

const isBrowser = typeof window !== 'undefined';

const ignore = ['intro'] as const;
const RATIO = 0.33;

type SectionEntry = {
	id: string;
	threshold: number;
	active: boolean;
};

const useSectionTracker = () => {
	const context = useContext(SectionContext);
	if (!context) {
		throw new Error('useSectionTracker must be used within a SectionProvider');
	}

	const { setCurrentSection } = context;

	const [lastSection, setLastSection] = useState('');
	const [sections, setSections] = useState<SectionEntry[]>([]);
	let timeout: ReturnType<typeof setTimeout> | null = null;

	const setHash = (hash: string) => {
		if (hash !== ' ' && hash.indexOf('#') === -1) {
			hash = `#${hash}`;
		}
		if (window.history.replaceState) {
			window.history.replaceState(window.history.state, '', hash);
		} else {
			window.location.replace(hash);
		}
	};

	const sectionIsIntersecting = (
		id: string,
		ratio: number,
		threshold: number
	) => {
		if (ignore.includes(id as (typeof ignore)[number])) {
			return;
		}

		const newThreshold = threshold;
		let found = false;

		sections.forEach(section => {
			if (section.id === id) {
				section.active = newThreshold >= RATIO;
				section.threshold = newThreshold;
				found = true;
			}
		});

		if (!found) {
			setSections(currentSections => {
				currentSections.push({
					id,
					threshold: newThreshold,
					active: newThreshold >= RATIO
				});
				return currentSections;
			});
		}

		let maxThreshold = 0;
		let sectionId = '';

		if (timeout) {
			clearTimeout(timeout);
		}

		timeout = setTimeout(() => {
			sections.forEach(section => {
				if (section.active && section.threshold > maxThreshold) {
					maxThreshold = section.threshold;
					sectionId = section.id;
				}
			});

			if (isBrowser && sectionId && sectionId !== lastSection) {
				setHash(ignore.some(idValue => idValue === sectionId) ? ' ' : sectionId);
				trackEvent('Engagement', 'View Section', sectionId);
				setCurrentSection(sectionId);
			} else if (isBrowser && window.scrollY < 100) {
				setCurrentSection(' ');
				setHash(' ');
			}

			setLastSection(sectionId);
		}, 500);
	};

	return sectionIsIntersecting;
};

export default useSectionTracker;
