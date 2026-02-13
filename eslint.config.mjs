import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

const eslintConfig = [
	...nextCoreWebVitals,
	prettierRecommended,
	{
		ignores: ['dist/**'],
		rules: {
			strict: 0,
			'react/display-name': 'off',
			'react/no-unescaped-entities': 'off',
			'prefer-arrow-callback': [
				'error',
				{
					allowNamedFunctions: true
				}
			],
			'react/prop-types': 'off',
			'import/no-webpack-loader-syntax': 'off',
			'react-hooks/set-state-in-effect': 'off',
			'react-hooks/refs': 'off',
			'react-hooks/immutability': 'off'
		}
	}
];

export default eslintConfig;
