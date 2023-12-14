import { createContext, useState } from 'react';

export const SectionContext = createContext(null);

export const SectionProvider = ({ children }) => {
	const [currentSection, setCurrentSection] = useState(null);

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
