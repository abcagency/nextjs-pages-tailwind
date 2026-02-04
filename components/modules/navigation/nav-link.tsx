import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { forwardRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

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
	...rest
}: AnchorProps) => {
	const router = useRouter();
	const isActive =
		(activeClassName && router.pathname === href) ||
		(router.pathname.startsWith(`${href}/`) && partiallyActive);

	return (
		<Link
			href={href}
			className={`group ${className ?? ''} ${
				isActive ? `is-active ${activeClassName ?? ''}` : ''
			}`}
			{...rest}
		>
			{children}
		</Link>
	);
};

type ScrollAnchorProps = Omit<ComponentPropsWithoutRef<typeof Link>, 'href'> & {
	href: string;
	className?: string;
	children?: ReactNode;
};

export const ScrollAnchor = forwardRef<HTMLAnchorElement, ScrollAnchorProps>(
	({ children, href, className, ...rest }, ref) => {
		return (
			<Link
				ref={ref}
				href={`#${href}`}
				scroll={false}
				className={className ?? ''}
				{...rest}
			>
				{children}
			</Link>
		);
	}
);

NavLink.Anchor = Anchor;
NavLink.ScrollAnchor = ScrollAnchor;

ScrollAnchor.displayName = 'NavLink:ScrollAnchor';

export default NavLink;
