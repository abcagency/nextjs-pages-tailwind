module.exports = {
	plugins: {
		'tailwindcss/nesting': 'postcss-nesting',
		tailwindcss: {},
		'postcss-preset-env': {
			autoprefixer: false,
			stage: 0,
			features: {
				'nesting-rules': false
			}
		},
		autoprefixer: {}
	}
};
