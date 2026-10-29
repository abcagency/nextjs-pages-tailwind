import Tracking from '~/components/util/tracking';
import type { AppProps } from 'next/app';
import NextProgress from 'next-progress';

import { inter } from '~/styles/fonts';
import site from '~/data/site.json';

import '~/styles/app.css';

const App = ({ Component, pageProps }: AppProps) => {
	return (
		<>
			<NextProgress
				color={site.colors.progress}
				delay={600}
				options={{
					trickleRate: 0.2,
					trickleSpeed: 400
				}}
			/>
			<Tracking />
			<div
				className={`
					relative
					${inter.variable}
				`}
			>
				<Component {...pageProps} />
			</div>
		</>
	);
};

export default App;
