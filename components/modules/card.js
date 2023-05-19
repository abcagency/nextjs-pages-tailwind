import Image from 'next/image';
import Link from 'next/link';

const cardClasses = className => (`
	relative flex flex-wrap flex-col bg-clip-border break-words bg-white border border-gray-100 shadow-lg
	${className ?? ''}
`);

const Card = ({
	children
}) => {
	return (
		{ children }
	);
};

const CardDefault = ({
	className,
	image,
	body,
	children,
	footer,
	...rest
}) => {
	return (
		<div
			className={cardClasses(className)}
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
			className={`
				${cardClasses(className)}
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
	className
}) => {
	return (
		<div className="w-full">
			<Image
				src={image || image.src}
				width={image.width ? image.width : null}
				height={image.height ? image.height : null}
				alt={alt ?? ''}
				className={`
					w-full h-auto
					${className ?? ''}
				`}
			/>
		</div>
	);
};

export const CardBody = ({
	children,
	className
}) => {
	return (
		<div
			className={`
				flex-auto p-4 md:px-6 lg:px-8
				${className ?? ''}
			`}
		>
			{children}
		</div>
	);
};

export const CardTitle = ({
	children,
	className
}) => {
	return (
		<h3
			className={`
				text-2xl font-bold
				${className ?? ''}
			`}
		>
			{children}
		</h3>
	);
};

export const CardFooter = ({
	children,
	className
}) => {
	return (
		<div
			className={`
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
Card.Footer = CardFooter;

export default Card;
