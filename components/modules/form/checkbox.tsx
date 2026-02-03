import type { ComponentPropsWithoutRef } from 'react';
import { forwardRef } from 'react';

type CheckboxProps = Omit<
	ComponentPropsWithoutRef<'input'>,
	'className' | 'type' | 'name' | 'value'
> & {
	className?: string;
	required?: boolean;
	fieldName: string;
	showError?: boolean;
	displayName: string;
	isSubmitting?: boolean;
	disabled?: boolean;
	value?: boolean;
};

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
	(
		{
			className,
			required = false,
			fieldName,
			showError,
			displayName,
			isSubmitting,
			disabled = false,
			value,
			onChange,
			onBlur,
			...rest
		},
		ref
	) => {
		const id = `${fieldName}-checkbox`;

		return (
			<label
				htmlFor={id}
				className={`
					flex items-start gap-2 cursor-pointer group
					${className ?? ''}
				`}
			>
				<input
					{...rest}
					ref={ref}
					id={id}
					type="checkbox"
					name={fieldName}
					checked={Boolean(value)}
					onChange={onChange}
					onBlur={onBlur}
					disabled={disabled || isSubmitting}
					className={`
						mt-0.5 size-4 rounded-xs text-primary focus:ring-primary
						${disabled || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
						${showError ? 'border-destructive' : 'border-ring'}
					`}
					aria-invalid={showError ? 'true' : undefined}
					aria-describedby={showError ? `${fieldName}-error` : undefined}
					aria-required={required}
				/>
				<span
					className={`
						text-sm leading-5
						${disabled ? 'text-muted-foreground' : 'text-foreground'}
					`}
				>
					{displayName}
					{required && <span className="text-destructive ml-1">*</span>}
				</span>
			</label>
		);
	}
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
