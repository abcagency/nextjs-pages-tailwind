import { forwardRef } from 'react';
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
	const isActive = (activeClassName && pathname === href) || (pathname.startsWith(`${href}/`) && partiallyActive);

	return (
		<Link
			href={href}
			className={`
				group
				${className ?? ''}
				${isActive ? `is-active ${activeClassName}` : ''}
			`}
			{...rest}
		>
			{children}
		</Link>
	);
};

export const ScrollAnchor = forwardRef((props, ref) => {
	const {
		children,
		href,
		className,
		size,
		variant,
		isBlock,
		hasUnderline,
		...rest
	} = props;

	return (
		<Link
			ref={ref}
			href={`#${href}`}
			scroll={false}
			className={buttonClasses(variant, size, isBlock, hasUnderline, className)}
			{...rest}
		>
			{children}
		</Link>
	);
});

NavLink.Anchor = Anchor;
NavLink.ScrollAnchor = ScrollAnchor;

ScrollAnchor.displayName = 'NavLink:ScrollAnchor';
export default NavLink;
