'use client';

import * as React from 'react';

import { cn } from '~/lib/utils';

type InputGroupProps = React.ComponentProps<'div'>;

type InputGroupTextProps = React.ComponentProps<'span'>;

type InputGroupIconProps = React.ComponentProps<'span'>;

function InputGroup({ className, ...props }: InputGroupProps) {
	return (
		<div
			data-slot="input-group"
			className={cn(
				'border-border bg-background focus-within:ring-ring/20 focus-within:border-ring flex items-stretch gap-2 rounded-md border px-3 py-2 transition-shadow focus-within:ring-[3px]',
				className
			)}
			{...props}
		/>
	);
}

function InputGroupText({ className, ...props }: InputGroupTextProps) {
	return (
		<span
			data-slot="input-group-text"
			className={cn('text-muted-foreground text-sm font-medium', className)}
			{...props}
		/>
	);
}

function InputGroupIcon({ className, ...props }: InputGroupIconProps) {
	return (
		<span
			data-slot="input-group-icon"
			className={cn('text-muted-foreground flex items-center', className)}
			{...props}
		/>
	);
}

export { InputGroup, InputGroupIcon, InputGroupText };
