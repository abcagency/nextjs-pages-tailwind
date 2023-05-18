import { usePathname } from 'next/navigation';
import Link from 'next/link';

const NavLink = ({
	children
}) => {
	return (
		{ children }
	);
};

export const Anchor = ({
	href,
	children,
	activeClassName,
	className,
	partiallyActive = false,
	...rest
}) => {
	const pathname = usePathname();

	return (
		<Link
			href={href}
			className={`
				${className ?? ''}
				${(activeClassName && pathname === href) || (pathname.startsWith(href) && partiallyActive) ? activeClassName : ''}
			`}
			{...rest}
		>
			{children}
		</Link>
	);
};

export const ScrollAnchor = ({
	href,
	children,
	activeClassName,
	className,
	partiallyActive = false,
	...rest
}) => {
	const pathname = usePathname();

	return (
		<a
			href={href}
			className={`
				${className ?? ''}
				${(activeClassName && pathname === href) || (pathname.startsWith(href) && partiallyActive) ? activeClassName : ''}
			`}
			{...rest}
		>
			{children}
		</a>
	);
};

NavLink.Anchor = Anchor;
NavLink.ScrollAnchor = ScrollAnchor;
export default NavLink;
