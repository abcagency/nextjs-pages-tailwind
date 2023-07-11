import { forwardRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Icon from '~/components/modules/icon';

// Notes:
// Button with a variant of 'link' should not contain a <Button.Body>.

const linkDefaultClasses = "normal-case text-inherit !font-[inherit] [font-weight:inherit] !p-0 rounded-none";
const underlineClasses = "!underline decoration-1 underline-offset-2 hover:!no-underline focus:!no-underline";

const ButtonVariant = {
	primary: 'bg-blue-600 text-white hover:bg-blue-800 focus:bg-blue-800',
	secondary: 'bg-pink-600 text-white hover:bg-pink-800 focus:bg-pink-800',
	link: `${linkDefaultClasses} text-indigo-700 hover:text-indigo-500 focus:text-indigo-500`
};

const ButtonSize = {
	sm: 'py-1 px-4 text-sm',
	lg: 'py-4 px-10 text-lg'
};

const ButtonDefaults = {
	style: 'group font-bold uppercase text-center rounded transition-colors',
	size: 'py-2 px-6',
	variant: ButtonVariant.primary,
	block: 'block w-full'
};

const linkVariants = variant => variant === 'link';

const buttonClasses = (variant, size, isBlock, hasUnderline, className) => (`
	${isBlock ? ButtonDefaults.block : linkVariants(variant) ? 'inline' : 'inline-block'}
	${ButtonDefaults.style}
	${variant ? ButtonVariant[variant] : ButtonDefaults.variant}
	${size ? ButtonSize[size] : ButtonDefaults.size}
	${hasUnderline ? underlineClasses : ''}
	${className ?? ''}
`);

const Button = ({
	children
}) => {
	return (
		{ children }
	);
};

export const Anchor = ({
	children,
	href,
	className,
	size,
	variant,
	isBlock,
	hasUnderline,
	target = '_blank',
	...rest
}) => {
	return (
		<a
			href={href}
			target={target}
			className={buttonClasses(variant, size, isBlock, hasUnderline, className)}
			{...rest}
		>
			{children}
		</a>
	);
};

export const AnchorLink = ({
	children,
	href,
	className,
	activeClassName,
	partiallyActive = false,
	size,
	variant,
	isBlock,
	hasUnderline,
	...rest
}) => {
	const router = useRouter();

	return (
		<Link
			href={href}
			className={`
				${buttonClasses(variant, size, isBlock, hasUnderline, className)}
				${(activeClassName && router.pathname === href) || (router.pathname.startsWith(href) && partiallyActive) ? activeClassName : ''}
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

export const Btn = forwardRef((props, ref) => {
	const {
		children,
		type = 'button',
		className,
		size,
		variant,
		isBlock,
		hasUnderline,
		...rest
	} = props;
	return (
		<button
			ref={ref}
			type={type}
			className={buttonClasses(variant, size, isBlock, hasUnderline, className)}
			{...rest}
		>
			{children}
		</button>
	);
});

export const ButtonBody = ({
	children,
	className
}) => {
	return (
		<span className={`
			inline-flex w-full items-center justify-between gap-1.5
			${className ?? ''}
		`}>
			{children}
		</span>
	);
};

export const ButtonIcon = ({
	icon,
	sizeClasses = 'w-4 h-4',
	className
}) => {
	return (
		<Icon
			icon={icon}
			sizeClasses={sizeClasses}
			className={className ?? ''}
		/>
	);
};

Button.Anchor = Anchor;
Button.Link = AnchorLink;
Button.Scroll = ScrollAnchor;
Button.Btn = Btn;
Button.Body = ButtonBody;
Button.Icon = ButtonIcon;

Btn.displayName = 'Button:Button';
ScrollAnchor.displayName = 'Button:ScrollAnchor';
export default Button;
