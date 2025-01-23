module.exports = {
	plugins: {
		'@tailwindcss/postcss': {},
		'postcss-preset-env': {
			autoprefixer: false,
			stage: 0,
			features: {
				'nesting-rules': false
			}
		},
	}
};
