import { GoogleTagManager } from '@next/third-parties/google';
import NextProgress from 'next-progress';
import { inter } from '~/styles/fonts';

import site from '~/data/site.json';

import '~/styles/globals.css';

const App = ({ Component, pageProps }) => {
	const gtmId = site?.analytics?.gtmId;

	return (
		<>
			<NextProgress
				color={site.colors.progress}
				delay={600}
				options={
					{
						trickleRate: 0.2,
						trickleSpeed: 400
					}
				}
			/>
			{/* {(gtmId && process.env.NODE_ENV === 'production') &&
				<GoogleTagManager gtmId={site.analytics.gtmId} />
			} */}
			<GoogleTagManager gtmId={site.analytics.gtmId} />

			<div
				className={`
					relative
					${inter.className}
				`}
			>
				<Component {...pageProps} />
			</div>
		</>
	);
};

export default App;
