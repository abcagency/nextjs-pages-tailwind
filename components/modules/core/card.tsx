import * as React from 'react';
import Image, { type ImageProps } from 'next/image';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '~/lib/utils';

const cardVariants = cva(
	'gap-6 overflow-hidden rounded-xl py-6 text-sm shadow-xs has-[>img:first-child]:pt-0 data-[size=sm]:gap-4 data-[size=sm]:py-4 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl group/card flex flex-col',
	{
		variants: {
			variant: {
				none: '',
				default: 'bg-card text-card-foreground',
				secondary: 'bg-secondary text-secondary-foreground'
			},
			hasBorder: {
				false: null,
				true: 'ring-1 ring-foreground/10'
			}
		},
		defaultVariants: {
			variant: 'default',
			hasBorder: true
		}
	}
);

type CardProps<T extends React.ElementType = 'div'> = {
	as?: T;
	size?: 'default' | 'sm';
	variant?: VariantProps<typeof cardVariants>['variant'];
	hasBorder?: VariantProps<typeof cardVariants>['hasBorder'];
} & React.ComponentPropsWithoutRef<T>;

function Card<T extends React.ElementType = 'div'>({
	as,
	className,
	size = 'default',
	variant = 'default',
	hasBorder = true,
	...props
}: CardProps<T>) {
	const Container = as ?? 'div';

	return (
		<Container
			data-slot="card"
			data-size={size}
			className={cn(cardVariants({ variant, hasBorder }), className)}
			{...props}
		/>
	);
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="card-header"
			className={cn(
				'gap-1 rounded-t-xl px-6 group-data-[size=sm]/card:px-4 [.border-b]:pb-6 group-data-[size=sm]/card:[.border-b]:pb-4 group/card-header @container/card-header grid auto-rows-min items-start has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]',
				className
			)}
			{...props}
		/>
	);
}

function CardImage({ className, alt, ...props }: ImageProps) {
	return (
		<Image
			data-slot="card-image"
			className={cn('w-full h-auto', className)}
			alt={alt ?? ''}
			{...props}
		/>
	);
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="card-title"
			className={cn(
				'text-base leading-normal font-medium group-data-[size=sm]/card:text-sm',
				className
			)}
			{...props}
		/>
	);
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="card-description"
			className={cn('text-muted-foreground text-sm', className)}
			{...props}
		/>
	);
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="card-action"
			className={cn(
				'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
				className
			)}
			{...props}
		/>
	);
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="card-content"
			className={cn('flex-auto px-6 group-data-[size=sm]/card:px-4', className)}
			{...props}
		/>
	);
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="card-footer"
			className={cn(
				'rounded-b-xl px-6 group-data-[size=sm]/card:px-4 [.border-t]:pt-6 group-data-[size=sm]/card:[.border-t]:pt-4 flex items-center',
				className
			)}
			{...props}
		/>
	);
}

export {
	Card,
	CardHeader,
	CardImage,
	CardFooter,
	CardTitle,
	CardAction,
	CardDescription,
	CardContent
};
