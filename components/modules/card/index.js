import Image from 'next/image';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

const CardVariant = {
	none: '',
	white: 'bg-white text-gray-850'
};

const cardClasses = (className, variant, hasShadow, hasBorder) =>
	twMerge`
		relative flex flex-wrap flex-col bg-clip-border break-words
		${variant ? CardVariant[variant] : CardVariant.white}
		${hasBorder ? 'border border-gray-850/5' : ''}
		${hasShadow ? 'shadow-lg' : ''}
		${className ?? ''}
	`;

const Card = ({ children }) => {
	return { children };
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
}) => {
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
}) => {
	const Container = as === 'link' ? Link : as;

	return (
		<Container
			href={href}
			className={twMerge`
				${cardClasses(className, variant, hasShadow, hasBorder)}
				group transition hover:shadow-xl hover:border-indigo-300 focus:shadow-xl  focus:border-indigo-300
			`}
			{...rest}
		>
			{image && image}
			{children}
			{body && body}
			{footer && footer}
		</Container>
	);
};

export const CardImage = ({
	image,
	alt,
	className,
	imageClassName,
	...rest
}) => {
	return (
		<div
			className={twMerge`
				w-full
				${className ?? ''}
			`}
		>
			<Image
				src={image || image.src}
				width={image.width ? image.width : null}
				height={image.height ? image.height : null}
				alt={alt ?? ''}
				className={twMerge`w-full h-auto ${imageClassName ?? ''}`}
				{...rest}
			/>
		</div>
	);
};

export const CardBody = ({ children, className }) => {
	return (
		<div
			className={twMerge`
				flex-auto p-4 md:px-6 lg:px-8
				${className ?? ''}
			`}
		>
			{children}
		</div>
	);
};

export const CardTitle = ({ as = 'h3', children, className }) => {
	const Title = as;
	return (
		<Title
			className={twMerge`
				text-lg md:text-xl font-bold text-pretty
				${className ?? ''}
			`}
		>
			{children}
		</Title>
	);
};

export const CardHeader = ({ children, className }) => {
	return (
		<div
			className={twMerge`
				py-2 px-4 md:px-6 lg:px-8
				${className ?? ''}
			`}
		>
			{children}
		</div>
	);
};

export const CardFooter = ({ children, className }) => {
	return (
		<div
			className={twMerge`
				py-2 px-4 md:px-6 lg:px-8 bg-gray-100
				${className ?? ''}
			`}
		>
			{children}
		</div>
	);
};

Card.Default = CardDefault;
Card.Link = CardLink;
Card.Image = CardImage;
Card.Body = CardBody;
Card.Title = CardTitle;
Card.Header = CardHeader;
Card.Footer = CardFooter;

export default Card;
