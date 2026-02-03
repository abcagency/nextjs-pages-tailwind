import type { ComponentPropsWithoutRef } from 'react';
import { forwardRef } from 'react';

type SelectOption = {
	value: string;
	label: string;
};

type SelectFieldProps = Omit<
	ComponentPropsWithoutRef<'select'>,
	'className' | 'name'
> & {
	className?: string;
	required?: boolean;
	fieldName: string;
	showError?: boolean;
	placeholder?: string;
	isSubmitting?: boolean;
	disabled?: boolean;
	options: SelectOption[];
	value?: ComponentPropsWithoutRef<'select'>['value'];
};

const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
	(
		{
			className,
			required = false,
			fieldName,
			showError,
			placeholder,
			isSubmitting,
			disabled = false,
			options,
			value,
			onChange,
			onBlur,
			...rest
		},
		ref
	) => {
		return (
			<select
				{...rest}
				ref={ref}
				name={fieldName}
				{...(value !== undefined ? { value } : {})}
				onChange={onChange}
				onBlur={onBlur}
				className={`
					block w-full rounded-md px-4 bg-white border placeholder:text-gray-300 transition-colors
					${showError ? 'border-red-500' : 'border-gray-400'}
					${className ?? ''}
				`}
				aria-invalid={showError ? true : undefined}
				aria-describedby={showError ? `${fieldName}-error` : undefined}
				aria-required={required}
				disabled={disabled || isSubmitting}
			>
				<option value="">{placeholder}</option>
				{options.map(option => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		);
	}
);

SelectField.displayName = 'SelectField';

export default SelectField;
