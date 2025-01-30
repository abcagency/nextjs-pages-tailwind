import { forwardRef } from 'react';

const Textarea = forwardRef((
	{
		className,
		required = false,
		fieldName,
		showError,
		placeholder,
		rows = '8',
		isSubmitting,
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
			className={`
				block w-full min-h-48 rounded-md transition-colors bg-white border placeholder:text-gray-300 field-sizing-content
				${showError ? 'border-red-500' : 'border-gray-600'}
				${className ?? ''}
			`}
			aria-invalid={showError ? 'true' : null}
			aria-describedby={showError ? `${fieldName}-error` : null}
			aria-required={required}
			disabled={isSubmitting}
		/>
	);
});

Textarea.displayName = 'Textarea';

export default Textarea;
