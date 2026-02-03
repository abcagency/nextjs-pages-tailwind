import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

type GridProps = {
	as?: ElementType;
	children?: ReactNode;
	autoRows?: boolean;
	columns?: string;
	gap?: string;
} & Omit<ComponentPropsWithoutRef<'div'>, 'className'> & {
		className?: string;
	};

const GridBase = forwardRef<HTMLDivElement, GridProps>(
	(
		{
			as: Container = 'div',
			children,
			className,
			autoRows = true,
			columns = 'md:grid-cols-2',
			gap = 'gap-12 lg:gap-16',
			...rest
		},
		ref
	) => {
		return (
			<Container
				ref={ref}
				className={twMerge(
					'grid grid-cols-1',
					gap,
					autoRows ? 'auto-rows-min' : '',
					columns,
					className ?? ''
				)}
				{...rest}
			>
				{children}
			</Container>
		);
	}
);

type GridItemProps = {
	as?: ElementType;
	children?: ReactNode;
	className?: string;
} & Omit<ComponentPropsWithoutRef<'div'>, 'className'>;

const GridItem = forwardRef<HTMLDivElement, GridItemProps>(
	({ as: Container = 'div', children, className, ...rest }, ref) => {
		return (
			<Container ref={ref} className={className ?? ''} {...rest}>
				{children}
			</Container>
		);
	}
);

type GridComponent = typeof GridBase & {
	Item: typeof GridItem;
};

const Grid = GridBase as GridComponent;

Grid.Item = GridItem;

Grid.displayName = 'Grid';

export default Grid;
