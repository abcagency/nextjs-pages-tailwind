const site = require('./data/site.json');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const redirects = require('./data/redirects.js');

module.exports = {
	reactStrictMode: true,
	experimental: {
		scrollRestoration: true
	},
	eslint: {
		dirs: ['components', 'hooks', 'lib', 'pages']
	},
	i18n: {
		locales: ['en-US'],
		defaultLocale: 'en-US'
	},
	async redirects() {
		return redirects;
	},
	webpack(config) {
		config.plugins.push(
			new FaviconsWebpackPlugin({
				logo: `./public/${site.logo}`,
				outputPath: '../public',
				inject: false,
				favicons: {
					appName: site.title,
					appShortName: site.titleShort,
					appDescription: site.description,
					developerName: site.author,
					display: 'browser',
					background: site.colors.manifest.backgroundColor,
					theme_color: site.colors.manifest.themeColor,
					icons: {
						android: [
							'android-chrome-192x192.png',
							'android-chrome-512x512.png'
						],
						appleIcon: ['apple-touch-icon-180x180.png', 'apple-touch-icon.png'],
						appleStartup: false,
						favicons: [
							'favicon-16x16.png',
							'favicon-32x32.png',
							'favicon-48x48.png',
							'favicon.ico',
							'favicon.svg'
						],
						windows: false,
						yandex: false
					}
				}
			})
		);

		config.module.rules.push({
			test: /\.svg$/,
			use: ['@svgr/webpack']
		});

		return config;
	}
};
