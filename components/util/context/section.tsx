import {
	createContext,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState
} from 'react';
import type { ReactNode } from 'react';
import Router from 'next/router';

import trackEvent from '~/hooks/useEventTracker';
import {
	createSectionTracker,
	registerSectionElement
} from '~/lib/section-tracking';

type SectionContextValue = {
	currentSection: string | null;
	settledSection: string | null;
	hashSection: string | null;
	registerSection: (id: string, element: HTMLElement) => () => void;
};

export const SectionContext = createContext<SectionContextValue | null>(null);

export const SectionProvider = ({ children }: { children: ReactNode }) => {
	const [currentSection, setCurrentSection] = useState<string | null>(null);
	const [settledSection, setSettledSection] = useState<string | null>(null);
	const [hashSection, setHashSection] = useState<string | null>(null);
	const sectionsRef = useRef(new Map<string, HTMLElement>());
	const trackerRef = useRef<ReturnType<typeof createSectionTracker> | null>(
		null
	);

	useEffect(() => {
		const tracker = createSectionTracker({
			viewport: window,
			router: Router,
			sections: sectionsRef.current,
			onChange: setCurrentSection,
			onSettled: setSettledSection,
			onHashChange: setHashSection,
			onView: id => {
				try {
					Promise.resolve(trackEvent('Engagement', 'View Section', id)).catch(
						error => {
							console.error('Section-view analytics failed', error);
						}
					);
				} catch (error) {
					console.error('Section-view analytics failed', error);
				}
			}
		});
		trackerRef.current = tracker;
		return () => {
			tracker.dispose();
			trackerRef.current = null;
		};
	}, []);

	const registerSection = useCallback((id: string, element: HTMLElement) => {
		return registerSectionElement(
			sectionsRef.current,
			() => trackerRef.current?.refreshSections(),
			id,
			element
		);
	}, []);

	const value = useMemo(
		() => ({ currentSection, settledSection, hashSection, registerSection }),
		[currentSection, settledSection, hashSection, registerSection]
	);

	return (
		<SectionContext.Provider value={value}>{children}</SectionContext.Provider>
	);
};

export default SectionContext;
