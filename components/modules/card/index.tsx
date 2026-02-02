import type {
	ComponentPropsWithoutRef,
	ElementType,
	HTMLAttributes,
	ReactElement,
	ReactNode
} from 'react';
import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

const cardVariants = {
	none: '',
	white: 'bg-white text-gray-850'
} as const;

type CardVariant = keyof typeof cardVariants;

const cardClasses = (
	className: string | undefined,
	variant: CardVariant | undefined,
	hasShadow: boolean | undefined,
	hasBorder: boolean | undefined
) =>
	twMerge(
		'relative flex flex-wrap flex-col bg-clip-border break-words',
		variant ? cardVariants[variant] : cardVariants.white,
		hasBorder ? 'border border-gray-850/5' : '',
		hasShadow ? 'shadow-lg' : '',
		className ?? ''
	);

type CardRootProps = {
	children?: ReactNode;
};

const CardRoot = ({ children }: CardRootProps) => {
	return <>{children}</>;
};

type CardDefaultProps = HTMLAttributes<HTMLDivElement> & {
	className?: string;
	variant?: CardVariant;
	hasBorder?: boolean;
	hasShadow?: boolean;
	image?: ReactNode;
	body?: ReactNode;
	footer?: ReactNode;
};

const CardDefault = ({
	className,
	variant,
	hasBorder = true,
	hasShadow,
	image,
	body,
	children,
	footer,
	...rest
}: CardDefaultProps) => {
	return (
		<div
			className={cardClasses(className, variant, hasShadow, hasBorder)}
			{...rest}
		>
			{image}
			{children}
			{body}
			{footer}
		</div>
	);
};

type CardLinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, 'className'> & {
	as?: 'link' | ElementType;
	href: string;
	className?: string;
	variant?: CardVariant;
	hasBorder?: boolean;
	hasShadow?: boolean;
	image?: ReactNode;
	body?: ReactNode;
	footer?: ReactNode;
};

const CardLink = ({
	as = 'link',
	href,
	className,
	variant,
	hasBorder = true,
	hasShadow,
	image,
	body,
	children,
	footer,
	...rest
}: CardLinkProps) => {
	const Container = as === 'link' ? Link : as;

	return (
		<Container
			href={href}
			className={twMerge(
				cardClasses(className, variant, hasShadow, hasBorder),
				'group transition hover:shadow-xl hover:border-indigo-300 focus:shadow-xl  focus:border-indigo-300'
			)}
			{...rest}
		>
			{image}
			{children}
			{body}
			{footer}
		</Container>
	);
};

type CardImageProps = Omit<ComponentPropsWithoutRef<typeof Image>, 'src' | 'alt'> & {
	image: StaticImageData;
	alt?: string;
	className?: string;
	imageClassName?: string;
};

export const CardImage = ({
	image,
	alt,
	className,
	imageClassName,
	...rest
}: CardImageProps) => {
	return (
		<div className={twMerge('w-full', className ?? '')}>
			<Image
				src={image.src}
				width={image.width}
				height={image.height}
				alt={alt ?? ''}
				className={twMerge('w-full h-auto', imageClassName ?? '')}
				{...rest}
			/>
		</div>
	);
};

type CardBodyProps = HTMLAttributes<HTMLDivElement>;

export const CardBody = ({ children, className, ...rest }: CardBodyProps) => {
	return (
		<div
			className={twMerge(
				'flex-auto p-4 md:px-6 lg:px-8',
				className ?? ''
			)}
			{...rest}
		>
			{children}
		</div>
	);
};

type CardTitleProps = {
	as?: ElementType;
	children?: ReactNode;
	className?: string;
} & Omit<ComponentPropsWithoutRef<'h3'>, 'className'>;

export const CardTitle = ({
	as: Title = 'h3',
	children,
	className,
	...rest
}: CardTitleProps) => {
	return (
		<Title
			className={twMerge(
				'text-lg md:text-xl font-bold text-pretty',
				className ?? ''
			)}
			{...rest}
		>
			{children}
		</Title>
	);
};

type CardHeaderProps = HTMLAttributes<HTMLDivElement>;

export const CardHeader = ({ children, className, ...rest }: CardHeaderProps) => {
	return (
		<div
			className={twMerge(
				'py-2 px-4 md:px-6 lg:px-8',
				className ?? ''
			)}
			{...rest}
		>
			{children}
		</div>
	);
};

type CardFooterProps = HTMLAttributes<HTMLDivElement>;

export const CardFooter = ({ children, className, ...rest }: CardFooterProps) => {
	return (
		<div
			className={twMerge(
				'py-2 px-4 md:px-6 lg:px-8 bg-gray-100',
				className ?? ''
			)}
			{...rest}
		>
			{children}
		</div>
	);
};

type CardCompound = ((props: CardRootProps) => ReactElement | null) & {
	Default: typeof CardDefault;
	Link: typeof CardLink;
	Image: typeof CardImage;
	Body: typeof CardBody;
	Title: typeof CardTitle;
	Header: typeof CardHeader;
	Footer: typeof CardFooter;
};

const Card = CardRoot as CardCompound;

Card.Default = CardDefault;
Card.Link = CardLink;
Card.Image = CardImage;
Card.Body = CardBody;
Card.Title = CardTitle;
Card.Header = CardHeader;
Card.Footer = CardFooter;

export default Card;
