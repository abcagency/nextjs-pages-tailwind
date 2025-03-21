import { useRouter } from 'next/router';
import Head from 'next/head';

import site from '~/data/site.json';

const PageHead = ({ shareImage, description, keywords, title }) => {
	const router = useRouter();
	const defaultTitle = site.title;
	const pageTitle = title || defaultTitle;
	const metaDescription = description || site.description;

	const shareImageSrc = shareImage?.src || shareImage;
	const ogImage = shareImageSrc
		? `${shareImageSrc[0] === '/' ? shareImageSrc : `${shareImageSrc}`}`
		: `${process.env.NEXT_PUBLIC_HOST}/${site.shareImage}`;

	return (
		<Head>
			<title>{title ? `${title} | ${defaultTitle}` : defaultTitle}</title>
			<meta name="description" content={metaDescription} />
			{keywords?.length > 0 ? (
				<meta name="keywords" content={`${keywords.join(', ')}`} />
			) : null}

			<meta property="og:title" content={pageTitle} />
			<meta property="og:description" content={metaDescription} />
			<meta property="og:image" content={ogImage} />
			<meta property="og:type" content="website" />

			<meta name="twitter:card" content="summary" />
			<meta name="twitter:creator" content={site?.author} />
			<meta name="twitter:title" content={pageTitle} />
			<meta name="twitter:description" content={metaDescription} />
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'WebPage',
						url: `${process.env.NEXT_PUBLIC_HOST}${router?.pathname}`,
						name: pageTitle,
						about: metaDescription
					})
				}}
			/>

			<link rel="icon" href="/favicon.svg" type="image/svg+xml" />

			{/* Only show these in Production */}
			{process.env.NODE_ENV !== 'development' && (
				<>
					<link rel="icon" href="/favicon.ico" sizes="any" />
					<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
					<link rel="manifest" href="/manifest.webmanifest" />
					<meta
						name="msapplication-TileColor"
						content={site.colors.manifest.tileColor}
					/>
				</>
			)}
		</Head>
	);
};

export default PageHead;
