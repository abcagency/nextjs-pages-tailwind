import { usePathname } from 'next/navigation';
import Link from 'next/link';
import * as Scroll from 'react-scroll';

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

// export const ScrollAnchor = ({
// 	href,
// 	children,
// 	activeClassName,
// 	className,
// 	partiallyActive = false,
// 	...rest
// }) => {
// 	const pathname = usePathname();

// 	return (
// 		<a
// 			href={href}
// 			className={`
// 				${className ?? ''}
// 				${(activeClassName && pathname === href) || (pathname.startsWith(href) && partiallyActive) ? activeClassName : ''}
// 			`}
// 			{...rest}
// 		>
// 			{children}
// 		</a>
// 	);
// };

export const ScrollAnchor = ({
	href,
	children,
	activeClassName,
	className,
	partiallyActive = false,
	...rest
}) => {
	let ScrollLink = Scroll.Link;

	return (
		<ScrollLink
			href={`#${href}`}
			to={href}
			smooth={true}
			offset={-25}
			duration={250}
			className={className ?? ''}
			activeClass={activeClassName ?? ''}
			{...rest}
		>
			{children}
		</ScrollLink>
	);
};

NavLink.Anchor = Anchor;
NavLink.ScrollAnchor = ScrollAnchor;
export default NavLink;
