const path = require('node:path');

module.exports = {
	extends: ['next', 'prettier'],
	plugins: ['prettier'],
	env: {
		browser: true,
		node: true,
		es2021: true
	},
	settings: {
		'import/resolver': {
			alias: {
				map: [['~', './']],
				extensions: ['.js', '.jsx', '.ts', '.tsx']
			}
		}
	},
	ignorePatterns: ['**/.next/**'],
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
		'react/jsx-pascal-case': [
			1,
			{
				allowNamespace: true
			}
		],
		'prettier/prettier': 'error',
		'jsx-a11y/accessible-emoji': 1,
		'jsx-a11y/alt-text': 1,
		'jsx-a11y/anchor-has-content': 1,
		'jsx-a11y/anchor-is-valid': 1,
		'jsx-a11y/aria-activedescendant-has-tabindex': 1,
		'jsx-a11y/aria-props': 1,
		'jsx-a11y/aria-proptypes': 1,
		'jsx-a11y/aria-role': 1,
		'jsx-a11y/aria-unsupported-elements': 1,
		'jsx-a11y/autocomplete-valid': [
			1,
			{
				inputComponents: []
			}
		],
		'jsx-a11y/click-events-have-key-events': 1,
		'jsx-a11y/control-has-associated-label': [
			1,
			{
				ignoreElements: [
					'audio',
					'canvas',
					'embed',
					'input',
					'textarea',
					'tr',
					'video'
				],
				ignoreRoles: [
					'grid',
					'listbox',
					'menu',
					'menubar',
					'radiogroup',
					'row',
					'tablist',
					'toolbar',
					'tree',
					'treegrid'
				],
				includeRoles: ['alert', 'dialog']
			}
		],
		'jsx-a11y/heading-has-content': 1,
		'jsx-a11y/html-has-lang': 1,
		'jsx-a11y/iframe-has-title': 1,
		'jsx-a11y/img-redundant-alt': 1,
		'jsx-a11y/interactive-supports-focus': [
			1,
			{
				tabbable: [
					'button',
					'checkbox',
					'link',
					'progressbar',
					'searchbox',
					'slider',
					'spinbutton',
					'switch',
					'textbox'
				]
			}
		],
		'jsx-a11y/label-has-associated-control': 1,
		'jsx-a11y/lang': 1,
		'jsx-a11y/media-has-caption': 1,
		'jsx-a11y/mouse-events-have-key-events': 1,
		'jsx-a11y/no-access-key': 1,
		'jsx-a11y/no-autofocus': 1,
		'jsx-a11y/no-distracting-elements': 1,
		'jsx-a11y/no-interactive-element-to-noninteractive-role': 1,
		'jsx-a11y/no-noninteractive-element-interactions': [
			1,
			{
				body: ['onError', 'onLoad'],
				iframe: ['onError', 'onLoad'],
				img: ['onError', 'onLoad']
			}
		],
		'jsx-a11y/no-noninteractive-element-to-interactive-role': 1,
		'jsx-a11y/no-noninteractive-tabindex': 1,
		'jsx-a11y/no-onchange': 1,
		'jsx-a11y/no-redundant-roles': 1,
		'jsx-a11y/no-static-element-interactions': 1,
		'jsx-a11y/role-has-required-aria-props': 1,
		'jsx-a11y/role-supports-aria-props': 1,
		'jsx-a11y/scope': 1,
		'jsx-a11y/tabindex-no-positive': 1,
		'react-hooks/rules-of-hooks': 2
	}
};
