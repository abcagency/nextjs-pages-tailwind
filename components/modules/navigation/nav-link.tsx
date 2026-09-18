import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { forwardRef, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import SectionContext from '~/components/util/context/section';
import { decodeSectionHash, resolveSectionLink } from '~/lib/section-tracking';

const NavLink = ({ children }: { children?: ReactNode }) => {
	return <>{children}</>;
};

export type AnchorProps = Omit<
	ComponentPropsWithoutRef<typeof Link>,
	'href'
> & {
	href: string;
	activeClassName?: string;
	partiallyActive?: boolean;
	className?: string;
	children?: ReactNode;
};

export const Anchor = ({
	href,
	children,
	activeClassName,
	className,
	partiallyActive = false,
	as,
	prefetch,
	replace,
	scroll,
	shallow,
	locale,
	onNavigate,
	legacyBehavior,
	passHref,
	transitionTypes,
	...rest
}: AnchorProps) => {
	const router = useRouter();
	const context = useContext(SectionContext);
	const [documentUrl, setDocumentUrl] = useState<string | null>(null);
	useEffect(() => {
		setDocumentUrl(window.location.href);
	}, [router.asPath]);
	const destination = resolveSectionLink(
		typeof as === 'string' ? as : href,
		documentUrl
	);
	const isSectionLink =
		destination.sameDocument &&
		(as === undefined || typeof as === 'string') &&
		(locale === undefined || locale === false || locale === router.locale);
	const isActive = isSectionLink
		? destination.id !== null && context?.hashSection === destination.id
		: (activeClassName && router.pathname === href) ||
			(router.pathname.startsWith(`${href}/`) && partiallyActive);
	const linkClassName = `group ${className ?? ''} ${isActive ? `is-active ${activeClassName ?? ''}` : ''}`;

	if (isSectionLink && !legacyBehavior) {
		return (
			<a
				href={typeof as === 'string' ? as : href}
				className={linkClassName}
				aria-current={isActive ? 'location' : undefined}
				{...rest}
			>
				{children}
			</a>
		);
	}

	return (
		<Link
			href={href}
			as={as}
			prefetch={prefetch}
			replace={replace}
			scroll={scroll}
			shallow={shallow}
			locale={locale}
			onNavigate={onNavigate}
			legacyBehavior={legacyBehavior}
			passHref={passHref}
			transitionTypes={transitionTypes}
			className={linkClassName}
			{...rest}
		>
			{children}
		</Link>
	);
};

type ScrollAnchorProps = ComponentPropsWithoutRef<'a'> & {
	href: string;
	activeClassName?: string;
	className?: string;
	children?: ReactNode;
};

export const ScrollAnchor = forwardRef<HTMLAnchorElement, ScrollAnchorProps>(
	({ children, href, className, activeClassName, ...rest }, ref) => {
		const context = useContext(SectionContext);
		// This existing API accepts a bare section ID; also accept a fragment.
		const id = href.startsWith('#') ? decodeSectionHash(href) : href;
		const isActive = id !== null && context?.hashSection === id;
		return (
			<a
				ref={ref}
				href={href.startsWith('#') ? href : `#${encodeURIComponent(href)}`}
				className={`${className ?? ''}${isActive ? ` is-active ${activeClassName ?? ''}` : ''}`}
				aria-current={isActive ? 'location' : undefined}
				{...rest}
			>
				{children}
			</a>
		);
	}
);

NavLink.Anchor = Anchor;
NavLink.ScrollAnchor = ScrollAnchor;

ScrollAnchor.displayName = 'NavLink:ScrollAnchor';

export default NavLink;
