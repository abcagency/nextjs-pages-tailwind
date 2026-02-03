import type { ComponentPropsWithoutRef } from 'react';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

type TextareaProps = Omit<
	ComponentPropsWithoutRef<'textarea'>,
	'className' | 'name'
> & {
	className?: string;
	required?: boolean;
	fieldName: string;
	showError?: boolean;
	placeholder?: string;
	isSubmitting?: boolean;
	value?: ComponentPropsWithoutRef<'textarea'>['value'];
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	(
		{
			className,
			required = false,
			fieldName,
			showError,
			placeholder,
			rows = 8,
			isSubmitting,
			value,
			onChange,
			onBlur,
			...rest
		},
		ref
	) => {
		return (
			<textarea
				{...rest}
				ref={ref}
				name={fieldName}
				placeholder={placeholder}
				rows={rows}
				{...(value !== undefined ? { value } : {})}
				onChange={onChange}
				onBlur={onBlur}
				className={twMerge(
					'block w-full min-h-32 px-4 field-sizing-content rounded bg-white border placeholder:text-gray-300 transition-colors',
					showError ? 'border-red-500' : 'border-gray-400',
					className ?? ''
				)}
				aria-invalid={showError ? true : undefined}
				aria-describedby={showError ? `${fieldName}-error` : undefined}
				aria-required={required}
				disabled={isSubmitting}
			/>
		);
	}
);

Textarea.displayName = 'Textarea';

export default Textarea;
