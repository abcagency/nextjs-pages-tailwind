'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '~/lib/utils';

const itemVariants = cva('rounded-md px-3 py-2 text-sm', {
	variants: {
		variant: {
			default: 'bg-muted text-foreground',
			ghost: 'text-foreground'
		},
		density: {
			default: 'py-2',
			compact: 'py-1.5'
		}
	},
	defaultVariants: {
		variant: 'default',
		density: 'default'
	}
});

type ItemProps<T extends React.ElementType = 'div'> = {
	as?: T;
} & React.ComponentPropsWithoutRef<T> &
	VariantProps<typeof itemVariants>;

function Item<T extends React.ElementType = 'div'>({
	as,
	className,
	variant,
	density,
	...props
}: ItemProps<T>) {
	const Component = as ?? 'div';

	return (
		<Component
			data-slot="item"
			className={cn(itemVariants({ variant, density }), className)}
			{...props}
		/>
	);
}

export { Item };
