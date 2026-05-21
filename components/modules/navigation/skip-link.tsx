import type { ReactNode } from 'react';

type SkipLinkProps = {
	href?: string;
	className?: string;
	children?: ReactNode;
};

const SkipLink = ({
	href = '#start-of-content',
	className,
	children = 'Skip to content'
}: SkipLinkProps) => {
	return (
		<a
			href={href}
			className={
				'sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:z-9999 focus-visible:py-2 focus-visible:px-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-center transition-colors hover:bg-gray-700 ' +
				(className ?? '')
			}
		>
			{children}
		</a>
	);
};

export default SkipLink;
