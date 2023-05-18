import Image from 'next/image';

const Card = ({
	className,
	image,
	body,
	children,
	footer
}) => {
	return (
		<div
			className={`
				relative flex flex-wrap flex-col bg-clip-border break-words bg-white border border-gray-100 shadow-lg
				${className ?? ''}
			`}
		>
			{image}
			{children}
			{body}
			{footer}
		</div>
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
	children
}) => {
	return (
		<div className="flex-auto p-4 md:px-6 lg:px-8">
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
	children
}) => {
	return (
		<div className="py-2 px-4 md:px-6 lg:px-8 bg-gray-100">
			{children}
		</div>
	);
};

Card.Image = CardImage;
Card.Body = CardBody;
Card.Title = CardTitle;
Card.Footer = CardFooter;

export default Card;
