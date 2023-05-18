import { inter } from '~/styles/fonts';

import { Providers } from '~/components/util/providers';
import SkipLink from '~/components/modules/navigation/skip-link';
import Header from '~/components/layout/header';
import Footer from '~/components/layout/footer';

const RootLayout = ({
	children
}) => {
	return (
		<div
			id="top"
			className={`
				relative
				${inter.className}
			`}
		>
			<Providers>
				<SkipLink />
				<Header />

				<main id="start-of-content">
					{children}
				</main>

				<Footer />
			</Providers>
		</div>
	);
};

export default RootLayout;
