import { forwardRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { twMerge } from 'tailwind-merge';

import Icon from '~/components/modules/icon';

const buttonClasses = (
	type = 'btn',
	variant = 'primary',
	size = 'md',
	isRound,
	isBlock,
	hasUnderline,
	className
) =>
	twMerge`
		group inline-block text-center cursor-pointer transition
		${type}
		${variant && variant}
		${size && size}
		${isBlock && 'is-block'}
		${isRound && 'is-round'}
		${hasUnderline && 'has-underline'}
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
	isRound,
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
				isRound,
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
	isRound,
	isBlock,
	hasUnderline,
	...rest
}) => {
	const router = useRouter();

	return (
		<Link
			href={href}
			className={`
				${buttonClasses(type, variant, size, isRound, isBlock, hasUnderline, className)}
				${(activeClassName && router.pathname === href) || (router.pathname.startsWith(href) && partiallyActive) ? activeClassName : ''}
			`}
			{...rest}
		>
			{children}
		</Link>
	);
};

export const ScrollAnchor = forwardRef(
	(
		{
			children,
			href,
			className,
			type,
			size,
			variant,
			isRound,
			isBlock,
			hasUnderline,
			...rest
		},
		ref
	) => {
		return (
			<Link
				ref={ref}
				href={`#${href}`}
				scroll={false}
				className={buttonClasses(
					type,
					variant,
					size,
					isRound,
					isBlock,
					hasUnderline,
					className
				)}
				{...rest}
			>
				{children}
			</Link>
		);
	}
);

export const Btn = forwardRef(
	(
		{
			children,
			btnType = 'button',
			className,
			type,
			size,
			variant,
			isRound,
			isBlock,
			hasUnderline,
			...rest
		},
		ref
	) => {
		return (
			<button
				ref={ref}
				type={btnType}
				className={buttonClasses(
					type,
					variant,
					size,
					isRound,
					isBlock,
					hasUnderline,
					className
				)}
				{...rest}
			>
				{children}
			</button>
		);
	}
);

export const Span = forwardRef(
	(
		{
			children,
			className,
			type,
			size,
			variant,
			isRound,
			isBlock,
			hasUnderline,
			...rest
		},
		ref
	) => {
		return (
			<span
				ref={ref}
				className={buttonClasses(
					type,
					variant,
					size,
					isRound,
					isBlock,
					hasUnderline,
					className
				)}
				{...rest}
			>
				{children}
			</span>
		);
	}
);

export const ButtonBody = ({ children, className }) => {
	return (
		<span
			className={`
			btn-body
			${className ?? ''}
		`}
		>
			{children}
		</span>
	);
};

export const ButtonIcon = ({ icon, size = 'size-4', inline, className }) => {
	return (
		<Icon
			icon={icon}
			size={size}
			inline={inline}
			className={`btn-icon ${className ?? ''}`}
		/>
	);
};

Button.Anchor = Anchor;
Button.Link = AnchorLink;
Button.Scroll = ScrollAnchor;
Button.Btn = Btn;
Button.Span = Span;
Button.Body = ButtonBody;
Button.Icon = ButtonIcon;

Btn.displayName = 'Button:Button';
ScrollAnchor.displayName = 'Button:ScrollAnchor';
export default Button;
