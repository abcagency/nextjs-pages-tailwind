import { forwardRef } from 'react';

const SelectField = forwardRef(
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
			...rest
		},
		ref
	) => {
		return (
			<select
				{...rest}
				ref={ref}
				name={fieldName}
				className={`
				form-field form-field--select
				${showError ? 'field-hasErrors' : ''}
				${className ?? ''}
			`}
				aria-invalid={showError ? 'true' : null}
				aria-describedby={showError ? `${fieldName}-error` : null}
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
