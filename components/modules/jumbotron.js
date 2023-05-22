import Image from 'next/image';

const Jumbotron = ({
	className,
	contentClasses,
	image,
	children,
	...rest
}) => {
	return (
		<section
			className={`
				relative grid grid-cols-1 auto-rows-min md:grid-rows-1 overflow-hidden bg-gray-800 text-white
				${className ?? ''}
			`}
			{...rest}
		>
			<div
				className={`
					md:row-span-full col-span-full grid place-content-center relative z-10 container p-4
					${contentClasses ?? ''}
				`}
			>
				{children}
			</div>

			{image && image}
		</section>
	);
};

export const JumbotronTitle = ({
	className,
	children
}) => {
	return (
		<h1
			className={`
				text-3xl font-bold
				${className ?? ''}
			`}
		>
			{children}
		</h1>
	);
};

export const JumbotronImage = ({
	image,
	alt,
	className
}) => {
	return (
		<div className="relative order-first md:order-last row-span-full col-span-full">
			<Image
				src={image || image.src}
				width={image.width ? image.width : null}
				height={image.height ? image.height : null}
				alt={alt ?? ''}
				priority
				className={`
					md:col-start-1 h-full w-full object-cover object-center opacity-70 md:opacity-20
					${className ?? ''}
				`}
			/>
		</div>
	);
};

Jumbotron.Title = JumbotronTitle;
Jumbotron.Image = JumbotronImage;

export default Jumbotron;
