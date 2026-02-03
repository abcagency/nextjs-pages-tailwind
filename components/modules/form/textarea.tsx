'use client';

import type { ComponentPropsWithoutRef } from 'react';
import { forwardRef } from 'react';

import { cn } from '~/lib/utils';

type TextareaProps = Omit<
	ComponentPropsWithoutRef<'textarea'>,
	'className' | 'name'
> & {
	className?: string;
	name?: string;
	fieldName?: string;
	showError?: boolean;
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	(
		{
			className,
			fieldName,
			name,
			showError,
			rows = 6,
			value,
			onChange,
			onBlur,
			...rest
		},
		ref
	) => {
		const inputName = fieldName ?? name;

		return (
			<textarea
				{...rest}
				ref={ref}
				name={inputName}
				rows={rows}
				{...(value !== undefined ? { value } : {})}
				onChange={onChange}
				onBlur={onBlur}
				className={cn(
					'border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring/20 focus-visible:border-ring flex min-h-32 field-sizing-content w-full rounded-md border px-3 py-2 text-sm shadow-sm outline-none transition-colors focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
					showError && 'border-destructive focus-visible:ring-destructive/20',
					className
				)}
			/>
		);
	}
);

Textarea.displayName = 'Textarea';

export default Textarea;
