import { createContext, useState } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';

type SectionContextValue = {
	currentSection: string | null;
	setCurrentSection: Dispatch<SetStateAction<string | null>>;
};

export const SectionContext = createContext<SectionContextValue | null>(null);

export const SectionProvider = ({ children }: { children: ReactNode }) => {
	const [currentSection, setCurrentSection] = useState<string | null>(null);

	return (
		<SectionContext.Provider
			value={{
				currentSection,
				setCurrentSection
			}}
		>
			{children}
		</SectionContext.Provider>
	);
};

export default SectionContext;
