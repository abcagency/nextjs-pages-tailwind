import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

const Jumbotron = ({ className, children, ...rest }) => {
	return (
		<section
			className={twMerge`
				relative grid grid-cols-1 auto-rows-min md:grid-rows-1 overflow-hidden bg-gray-800 text-white
				${className ?? ''}
			`}
			{...rest}
		>
			{children}
		</section>
	);
};

export const JumbotronBody = ({ className, children }) => {
	return (
		<div
			className={twMerge`
				md:row-span-full col-span-full grid place-content-center relative z-10 container p-4
				${className ?? ''}
			`}
		>
			{children}
		</div>
	);
};

export const JumbotronTitle = ({ className, children }) => {
	return (
		<h1
			className={twMerge`
				text-2xl md:text-3xl font-bold text-pretty
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
	className,
	containerClassName,
	...rest
}) => {
	return (
		<div
			className={twMerge`
				relative order-first md:order-last row-span-full col-span-full
				${containerClassName ?? ''}
			`}
		>
			<Image
				src={image || image.src}
				width={image.width ? image.width : null}
				height={image.height ? image.height : null}
				alt={alt ?? ''}
				priority
				className={twMerge`
					md:col-start-1 h-full w-full object-cover object-center opacity-70 md:opacity-20
					${className ?? ''}
				`}
				{...rest}
			/>
		</div>
	);
};

Jumbotron.Body = JumbotronBody;
Jumbotron.Title = JumbotronTitle;
Jumbotron.Image = JumbotronImage;

export default Jumbotron;
