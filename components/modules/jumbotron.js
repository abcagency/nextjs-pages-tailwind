import { forwardRef } from 'react';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

const Jumbotron = forwardRef(
	(
		{ variant = 'primary', className, contentClasses, children, ...rest },
		ref
	) => {
		return (
			<section
				ref={ref}
				className={twMerge`
					jumbotron
					${variant ? `jumbotron-${variant}` : ''}
					${className ?? ''}
				`}
				{...rest}
			>
				{children}
			</section>
		);
	}
);

export const JumbotronBody = ({ className, children }) => {
	return (
		<div
			className={twMerge`
				jumbotron-body
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
				jumbotron-title text-pretty
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
				jumbotron-image-container
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
					jumbotron-image
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
