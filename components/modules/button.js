import { forwardRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { twMerge } from 'tailwind-merge';

import Icon from '~/components/modules/icon';

const buttonClasses = (
	type = 'button',
	variant = 'primary',
	size = 'md',
	isBlock,
	hasUnderline,
	className
) =>
	twMerge`
		group inline-block text-center transition
		${type === 'link' ? 'inline !p-0 normal-case text-inherit !font-[inherit] [font-weight:inherit] rounded-none' : ''}
		${isBlock && 'isBlock'}
		${hasUnderline && 'hasUnderline'}
		${variant && `${type}-${variant}`}
		${size && `${type}-${size}`}
		${className ?? ''}
	`;

const Button = ({ children }) => {
	return { children };
};

export const Anchor = ({
	children,
	href,
	className,
	type,
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
			className={buttonClasses(
				type,
				variant,
				size,
				isBlock,
				hasUnderline,
				className
			)}
			onClick={
				href === '#'
					? e => {
							e.preventDefault();
						}
					: null
			}
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
	type,
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
				${buttonClasses(type, variant, size, isBlock, hasUnderline, className)}
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
		type,
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
			className={buttonClasses(
				type,
				variant,
				size,
				isBlock,
				hasUnderline,
				className
			)}
			{...rest}
		>
			{children}
		</Link>
	);
});

export const Btn = forwardRef((props, ref) => {
	const {
		children,
		btnType = 'button',
		className,
		type,
		size,
		variant,
		isBlock,
		hasUnderline,
		...rest
	} = props;
	return (
		<button
			ref={ref}
			type={btnType}
			className={buttonClasses(
				type,
				variant,
				size,
				isBlock,
				hasUnderline,
				className
			)}
			{...rest}
		>
			{children}
		</button>
	);
});

export const ButtonBody = ({ children, className }) => {
	return (
		<span
			className={`
			inline-flex w-full items-center justify-between gap-1.5
			${className ?? ''}
		`}
		>
			{children}
		</span>
	);
};

export const ButtonIcon = ({ icon, size = 'size-4', inline, className }) => {
	return (
		<Icon icon={icon} size={size} inline={inline} className={className ?? ''} />
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
