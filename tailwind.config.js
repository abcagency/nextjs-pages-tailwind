const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}'
	],
	theme: {
		extend: {
			animation: {
				slideDown: 'slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1)',
				slideUp: 'slideUp 300ms cubic-bezier(0.87, 0, 0.13, 1)'
			},
			container: {
				center: true
			},
			cursor: {
				grab: 'grab'
			},
			colors: {
				gray: {
					850: '#141414'
				}
			},
			fontFamily: {
				'sans': ['var(--font-inter)', ...defaultTheme.fontFamily.sans]
			},
			fontSize: {
				'2xs': '0.65rem',
				300: 'clamp(0.7rem, 0.66rem + 0.2vw, 0.8rem)',
				400: 'clamp(0.88rem, 0.83rem + 0.24vw, 1rem)',
				450: 'clamp(1rem, 1rem + 0.33vw, 1.33rem)',
				500: 'clamp(1.09rem, 1rem + 0.47vw, 1.33rem)',
				600: 'clamp(1.37rem, 1.21rem + 0.8vw, 1.78rem)',
				700: 'clamp(1.71rem, 1.45rem + 1.29vw, 2.37rem)',
				800: 'clamp(2.14rem, 1.74rem + 1.99vw, 3.16rem)',
				900: 'clamp(2.67rem, 2.07rem + 3vw, 4.21rem)',
				1000: 'clamp(3.34rem, 2.45rem + 4.43vw, 5.61rem)'
			},
			keyframes: {
				slideDown: {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				slideUp: {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 }
				}
			},
			typography: {
				DEFAULT: {
					css: {
						video: {
							'margin-bottom': 0,
							'margin-top': 0
						}
					}
				},
				'sm': {
					css: {
						video: {
							'margin-bottom': 0,
							'margin-top': 0
						}
					}
				},
				'md': {
					css: {
						video: {
							'margin-bottom': 0,
							'margin-top': 0
						}
					}
				},
				'lg': {
					css: {
						video: {
							'margin-bottom': 0,
							'margin-top': 0
						}
					}
				},
				'xl': {
					css: {
						video: {
							'margin-bottom': 0,
							'margin-top': 0
						}
					}
				},
				'2xl': {
					css: {
						video: {
							'margin-bottom': 0,
							'margin-top': 0
						}
					}
				}
			},
			zIndex: {
				'-1': '-1',
				'1': '1'
			}
		}
	},
	variants: {
		scrollSnapType: ['responsive']
	},
	plugins: [
		require('@tailwindcss/aspect-ratio'),
		require('@tailwindcss/forms'),
		require('@tailwindcss/typography')
	]
};
