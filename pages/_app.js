import Script from 'next/script';
import NextProgress from 'next-progress';

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
			{(gtmId && process.env.NODE_ENV === 'production') &&
				<Script id="google-tag-manager" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `
					(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
					new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
					j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
					'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
					})(window,document,'script','dataLayer','${site.analytics.gtmId}');
				` }}>
				</Script>
			}
			<Component {...pageProps} />
		</>
	);
};

export default App;
