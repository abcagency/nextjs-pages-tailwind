import Image from 'next/image';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

const cardClasses = (variant = 'primary', className, hasShadow) =>
	twMerge`
		relative flex flex-wrap flex-col bg-clip-border break-words
		${variant ? `card-${variant}` : ''}
		${hasShadow && 'card-hasShadow'}
		${className ?? ''}
	`;

const Card = ({ children }) => {
	return { children };
};

const CardDefault = ({
	className,
	variant,
	hasShadow = true,
	image,
	body,
	children,
	footer,
	...rest
}) => {
	return (
		<div className={cardClasses(variant, className, hasShadow)} {...rest}>
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
	hasShadow = true,
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
				${cardClasses(variant, className, hasShadow)}
				card-link group transition
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
		<div className={twMerge`card-image w-full ${className ?? ''}`}>
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
		<div className={twMerge`card-body flex-auto ${className ?? ''}`}>
			{children}
		</div>
	);
};

export const CardTitle = ({ children, className }) => {
	return (
		<h3 className={twMerge`card-title text-pretty ${className ?? ''}`}>
			{children}
		</h3>
	);
};

export const CardFooter = ({ children, className }) => {
	return (
		<div
			className={twMerge`
				card-footer
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
Card.Footer = CardFooter;

export default Card;
