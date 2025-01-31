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
				block w-full rounded-md bg-white border placeholder:text-gray-300 transition-colors
				${showError ? 'border-red-500' : 'border-gray-400'}
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
