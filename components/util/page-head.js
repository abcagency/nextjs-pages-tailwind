import { useRouter } from 'next/router';
import Head from 'next/head';

import site from '~/data/site.json';

const PageHead = ({
	description,
	keywords,
	title
}) => {
	const router = useRouter();
	const defaultTitle = site.title;
	const pageTitle = title || defaultTitle;
	const metaDescription = description || site.description;

	return (
		<Head>
			<title>{title ? `${title} | ${defaultTitle}` : defaultTitle}</title>
			<meta name="description" content={metaDescription} />
			{keywords?.length > 0
				? (
					<meta name="keywords" content={`${keywords.join(', ')}`} />
				) : null
			}

			<meta property="og:title" content={pageTitle} />
			<meta property="og:description" content={metaDescription} />
			{site?.shareImage &&
				<meta property="og:image" content={`${process.env.NEXT_PUBLIC_HOST}/${site.shareImage}`} />
			}
			<meta property="og:type" content="website" />

			<meta name="twitter:card" content="summary" />
			<meta name="twitter:creator" content={site?.author} />
			<meta name="twitter:title" content={pageTitle} />
			<meta name="twitter:description" content={metaDescription} />
			<script type="application/ld+json">
				{`
						{
							"@context": "https://schema.org",
							"@type": "WebPage",
							"url": "${process.env.NEXT_PUBLIC_HOST}${router?.pathname}",
							"legalName": "${defaultTitle}",
							"name": "${pageTitle}",
							"about": "${metaDescription}",
							"brand": "${defaultTitle}"
						}
				`}
			</script>

			<link rel="icon" href="/favicon.svg" type="image/svg+xml" />

			{/* Only show these in Production */}
			{process.env.NODE_ENV !== 'development' && <>
				<link rel="icon" href="/favicon.ico" sizes="any" />
				<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
				<link rel="manifest" href="/manifest.webmanifest" />
				<meta name="msapplication-TileColor" content={site.colors.manifest.tileColor} />
			</>}
		</Head>
	);
};

export default PageHead;
