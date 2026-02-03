import type { ComponentPropsWithoutRef } from 'react';
import { forwardRef } from 'react';

type TimeInputProps = Omit<
	ComponentPropsWithoutRef<'input'>,
	'className' | 'name' | 'type'
> & {
	className?: string;
	required?: boolean;
	fieldName: string;
	showError?: boolean;
	placeholder?: string;
	isSubmitting?: boolean;
	disabled?: boolean;
	value?: ComponentPropsWithoutRef<'input'>['value'];
};

const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>(
	(
		{
			className,
			required = false,
			fieldName,
			showError,
			placeholder,
			isSubmitting,
			disabled = false,
			value,
			onChange,
			onBlur,
			...rest
		},
		ref
	) => {
		return (
			<input
				{...rest}
				ref={ref}
				type="time"
				name={fieldName}
				placeholder={placeholder}
				{...(value !== undefined ? { value } : {})}
				onChange={onChange}
				onBlur={onBlur}
				className={`
					block w-full rounded-md px-4 bg-white border placeholder:text-muted-foreground transition-colors
					${showError ? 'border-destructive' : 'border-ring'}
					${className ?? ''}
				`}
				aria-invalid={showError ? true : undefined}
				aria-describedby={showError ? `${fieldName}-error` : undefined}
				aria-required={required}
				disabled={disabled || isSubmitting}
			/>
		);
	}
);

TimeInput.displayName = 'TimeInput';

export default TimeInput;
