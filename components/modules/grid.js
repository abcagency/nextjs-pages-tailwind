import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

const Grid = forwardRef((props, ref) => {
	const {
		as = 'div',
		children,
		className,
		autoRows = true,
		columns = 'md:grid-cols-2',
		gap = 'gap-12 lg:gap-16',
		...rest
	} = props;

	const Container = as;

	return (
		<Container
			ref={ref}
			className={twMerge`
				grid grid-cols-1
				${gap}
				${autoRows ? 'auto-rows-min' : ''}
				${columns}
				${className ?? ''}
			`}
			{...rest}
		>
			{children}
		</Container>
	);
});

export const GridItem = ({ as = 'div', children, className }) => {
	const Container = as;

	return <Container className={className ?? ''}>{children}</Container>;
};

Grid.Item = GridItem;

Grid.displayName = 'Grid';
export default Grid;
