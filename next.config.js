const site = require('./data/site.json');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = {
	reactStrictMode: true,
	experimental: {
		scrollRestoration: true
	},
	i18n: {
		locales: ['en-US'],
		defaultLocale: 'en-US'
	},
	webpack(config) {
		config.plugins.push(new FaviconsWebpackPlugin({
			logo: `public/${site.logo}`,
			outputPath: './',
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
					appleIcon: [
						'apple-touch-icon-180x180.png',
						'apple-touch-icon.png'
					],
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
		}));

		// Grab the existing rule that handles SVG imports
		const fileLoaderRule = config.module.rules.find(rule =>
			rule.test?.test?.('.svg')
		);

		config.module.rules.push(
			// Reapply the existing rule, but only for svg imports ending in ?url
			{
				...fileLoaderRule,
				test: /\.svg$/i,
				resourceQuery: /url/ // *.svg?url
			},
			// Convert all other *.svg imports to React components
			{
				test: /\.svg$/i,
				issuer: /\.[jt]sx?$/,
				resourceQuery: { not: /url/ }, // exclude if *.svg?url
				use: [
					{
						loader: '@svgr/webpack',
						options: {
							dimensions: false
						}
					}
				]
			}
		);

		// Modify the file loader rule to ignore *.svg, since we have it handled now.
		fileLoaderRule.exclude = /\.svg$/i;

		return config;
	}
};
