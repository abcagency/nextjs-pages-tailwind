import { inter } from '~/styles/fonts';

import { SectionContext } from '~/components/modules/sections/sectionContext';
import useSectionTracker from '~/hooks/useSectionTracker';

import { Provider } from '~/components/util/provider';
import SkipLink from '~/components/modules/navigation/skip-link';
import Header from '~/components/layout/header';
import Footer from '~/components/layout/footer';

const RootLayout = ({
	children
}) => {
	const currentSection = useSectionTracker();
	return (
		<div
			id="top"
			className={`
				relative
				${inter.className}
			`}
		>
			<Provider>
				<SkipLink />
				<Header />

				<SectionContext.Provider value={currentSection}>
					<main id="start-of-content">
						{children}
					</main>
				</SectionContext.Provider>

				<Footer />
			</Provider>
		</div>
	);
};

export default RootLayout;
