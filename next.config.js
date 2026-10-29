const redirects = require('./data/redirects.ts');

module.exports = {
	reactStrictMode: true,
	env: {
		NEXT_PUBLIC_TRACKING_DEPLOY_CONTEXT:
			process.env.CONTEXT || process.env.VERCEL_ENV || 'production'
	},
	experimental: {
		scrollRestoration: true
	},
	i18n: {
		locales: ['en-US'],
		defaultLocale: 'en-US'
	},
	async redirects() {
		return redirects;
	},
	turbopack: {
		rules: {
			'*.svg': {
				loaders: ['@svgr/webpack'],
				as: '*.js'
			}
		}
	},
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			use: ['@svgr/webpack']
		});

		return config;
	}
};
