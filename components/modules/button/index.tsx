import type {
	AnchorHTMLAttributes,
	ButtonHTMLAttributes,
	ComponentPropsWithoutRef,
	HTMLAttributes,
	MouseEvent,
	ReactElement,
	ReactNode
} from 'react';
import { forwardRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { twMerge } from 'tailwind-merge';

import Icon from '~/components/modules/icon';

const linkDefaultClasses =
	'p-0! normal-case text-inherit font-[inherit]! [font-weight:inherit]! rounded-none';
const underlineClasses =
	'underline! decoration-1 underline-offset-2 hover:no-underline! focus:no-underline!';

const buttonVariants = {
	none: '',
	primary: 'bg-blue-600 text-white hover:bg-blue-800 focus:bg-blue-800',
	secondary: 'bg-pink-600 text-white hover:bg-pink-800 focus:bg-pink-800',
	link: `${linkDefaultClasses} text-indigo-700 hover:text-indigo-500 focus:text-indigo-500`,
	icon: 'opacity-100 hover:opacity-80 focus:opacity-80'
} as const;

const buttonSizes = {
	none: '',
	sq: 'p-2.5',
	'2xs': 'py-0.5 px-2 text-2xs',
	xs: 'py-1 px-2 text-xs',
	sm: 'py-1.5 px-3 text-sm',
	md: 'py-2 px-4 text-base',
	lg: 'py-3 px-6 text-lg'
} as const;

const buttonDefaults = {
	style: 'group font-bold uppercase text-center rounded-sm cursor-pointer transition',
	size: buttonSizes.md,
	variant: buttonVariants.primary,
	block: 'block w-full'
} as const;

type ButtonVariant = keyof typeof buttonVariants;

type ButtonSize = keyof typeof buttonSizes;

type ButtonStyleProps = {
	className?: string;
	size?: ButtonSize;
	variant?: ButtonVariant;
	isRound?: boolean;
	isBlock?: boolean;
	hasUnderline?: boolean;
};

const linkVariants = (variant?: ButtonVariant) => variant === 'link';

const buttonClasses = (
	variant: ButtonVariant | undefined,
	size: ButtonSize | undefined,
	isRound: boolean | undefined,
	isBlock: boolean | undefined,
	hasUnderline: boolean | undefined,
	className: string | undefined
) =>
	twMerge(
		isBlock
			? buttonDefaults.block
			: linkVariants(variant)
				? 'inline'
				: 'inline-block',
		buttonDefaults.style,
		variant ? buttonVariants[variant] : buttonDefaults.variant,
		size ? buttonSizes[size] : buttonDefaults.size,
		isRound && 'rounded-full',
		hasUnderline ? underlineClasses : '',
		className ?? ''
	);

type ButtonRootProps = {
	children?: ReactNode;
};

const ButtonRoot = ({ children }: ButtonRootProps) => {
	return <>{children}</>;
};

export type AnchorProps = ButtonStyleProps &
	Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'href'> & {
		href: string;
		target?: AnchorHTMLAttributes<HTMLAnchorElement>['target'];
	};

export const Anchor = ({
	children,
	href,
	className,
	size,
	variant,
	isRound,
	isBlock,
	hasUnderline,
	target = '_blank',
	rel,
	onClick,
	...rest
}: AnchorProps) => {
	const relValue = target === '_blank' ? rel ?? 'noreferrer' : rel;

	const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
		if (href === '#') {
			event.preventDefault();
		}
		onClick?.(event);
	};

	return (
		<a
			href={href}
			target={target}
			className={buttonClasses(
				variant,
				size,
				isRound,
				isBlock,
				hasUnderline,
				className
			)}
			onClick={handleClick}
			{...rest}
			rel={relValue}
		>
			{children}
		</a>
	);
};

export type AnchorLinkProps = ButtonStyleProps &
	Omit<ComponentPropsWithoutRef<typeof Link>, 'className' | 'href'> & {
		href: string;
		activeClassName?: string;
		partiallyActive?: boolean;
	};

export const AnchorLink = ({
	children,
	href,
	className,
	activeClassName,
	partiallyActive = false,
	size,
	variant,
	isRound,
	isBlock,
	hasUnderline,
	...rest
}: AnchorLinkProps) => {
	const router = useRouter();

	const isActive =
		(activeClassName && router.pathname === href) ||
		(router.pathname.startsWith(href) && partiallyActive);

	return (
		<Link
			href={href}
			className={twMerge(
				buttonClasses(
					variant,
					size,
					isRound,
					isBlock,
					hasUnderline,
					className
				),
				isActive ? activeClassName : ''
			)}
			{...rest}
		>
			{children}
		</Link>
	);
};

export type ScrollAnchorProps = ButtonStyleProps &
	Omit<ComponentPropsWithoutRef<typeof Link>, 'className' | 'href'> & {
		href: string;
	};

export const ScrollAnchor = forwardRef<HTMLAnchorElement, ScrollAnchorProps>(
	(
		{
			children,
			href,
			className,
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

export type BtnProps = ButtonStyleProps &
	Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'type'> & {
		type?: 'button' | 'submit' | 'reset';
	};

export const Btn = forwardRef<HTMLButtonElement, BtnProps>(
	(
		{
			children,
			type = 'button',
			className,
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
				type={type}
				className={buttonClasses(
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

export type SpanProps = ButtonStyleProps &
	Omit<HTMLAttributes<HTMLSpanElement>, 'className'>;

export const Span = forwardRef<HTMLSpanElement, SpanProps>(
	(
		{
			children,
			className,
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

export type ButtonBodyProps = HTMLAttributes<HTMLSpanElement>;

export const ButtonBody = ({ children, className, ...rest }: ButtonBodyProps) => {
	return (
		<span
			className={twMerge(
				'inline-flex w-full items-center justify-between gap-1.5',
				className ?? ''
			)}
			{...rest}
		>
			{children}
		</span>
	);
};

export type ButtonIconProps = {
	icon: string;
	size?: string;
	inline?: boolean;
	className?: string;
};

export const ButtonIcon = ({
	icon,
	size = 'size-4',
	inline,
	className
}: ButtonIconProps) => {
	return (
		<Icon icon={icon} size={size} inline={inline} className={className ?? ''} />
	);
};

type ButtonCompound = ((props: ButtonRootProps) => ReactElement | null) & {
	Anchor: typeof Anchor;
	Link: typeof AnchorLink;
	Scroll: typeof ScrollAnchor;
	Btn: typeof Btn;
	Span: typeof Span;
	Body: typeof ButtonBody;
	Icon: typeof ButtonIcon;
};

const Button = ButtonRoot as ButtonCompound;

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
