import { useState } from 'react';

import { SectionContext } from '~/components/modules/sections/sectionContext';

import { Provider } from '~/components/util/provider';
import SkipLink from '~/components/modules/navigation/skip-link';
import Header from '~/components/layout/header';
import Footer from '~/components/layout/footer';

const RootLayout = ({
	children
}) => {
	const [currentSection, setCurrentSection] = useState(null);

	return (
		<div
			id="top"
			className="relative"
		>
			<Provider>
				<SectionContext.Provider
					value={{
						currentSection,
						setCurrentSection
					}}
				>
					<SkipLink />
					<Header />

					<main id="start-of-content">
						{children}
					</main>

					<Footer />
				</SectionContext.Provider>
			</Provider>
		</div>
	);
};

export default RootLayout;
