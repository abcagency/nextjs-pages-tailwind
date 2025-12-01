const { favicons } = require('favicons');
const fs = require('fs').promises;
const path = require('path');
const site = require('../data/site.json');

async function generateFavicons() {
	const source = path.join(__dirname, '..', 'public', site.logo);
	const outputDir = path.join(__dirname, '..', 'public');

	console.log('Generating favicons...');

	try {
		const response = await favicons(source, {
			appName: site.title,
			appShortName: site.titleShort,
			appDescription: site.description,
			developerName: site.author,
			display: 'browser',
			background: site.colors.manifest.backgroundColor,
			theme_color: site.colors.manifest.themeColor,
			icons: {
				android: ['android-chrome-192x192.png', 'android-chrome-512x512.png'],
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
		});

		// Write image files
		for (const image of response.images) {
			await fs.writeFile(path.join(outputDir, image.name), image.contents);
		}

		// Write HTML files (manifest, browserconfig, etc.)
		for (const file of response.files) {
			await fs.writeFile(path.join(outputDir, file.name), file.contents);
		}

		console.log('✓ Favicons generated successfully!');
		console.log(`  Generated ${response.images.length} images`);
		console.log(`  Generated ${response.files.length} files`);
	} catch (error) {
		console.error('Error generating favicons:', error);
		process.exit(1);
	}
}

generateFavicons();
