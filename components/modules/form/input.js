import { forwardRef } from 'react';

const InputField = forwardRef((
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
				w-full rounded-md transition-colors bg-white border placeholder:text-gray-300
				${showError ? 'border-red-500' : 'border-gray-600'}
				${className ?? ''}
			`}
			aria-invalid={showError ? 'true' : null}
			aria-describedby={showError ? `${fieldName}-error` : null}
			aria-required={required}
			disabled={disabled || isSubmitting}
		/>
	);
});

InputField.displayName = 'InputField';

export default InputField;
