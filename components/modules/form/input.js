import { forwardRef } from 'react';

const InputField = forwardRef(
	(
		{
			className,
			type = 'text',
			required = false,
			fieldName,
			showError,
			placeholder,
			isSubmitting,
			disabled = false,
			...rest
		},
		ref
	) => {
		return (
			<input
				{...rest}
				ref={ref}
				type={type}
				name={fieldName}
				placeholder={placeholder}
				className={`
				form-field
				${showError ? 'field-hasErrors' : ''}
				${className ?? ''}
			`}
				aria-invalid={showError ? 'true' : null}
				aria-describedby={showError ? `${fieldName}-error` : null}
				aria-required={required}
				disabled={disabled || isSubmitting}
			/>
		);
	}
);

InputField.displayName = 'InputField';

export default InputField;
