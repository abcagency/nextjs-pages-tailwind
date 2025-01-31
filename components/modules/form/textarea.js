import { forwardRef } from 'react';

const Textarea = forwardRef(
	(
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
				block w-full min-h-48 field-sizing-content rounded-md bg-white border placeholder:text-gray-300 transition-colors
				${showError ? 'border-red-500' : 'border-gray-400'}
				${className ?? ''}
			`}
				aria-invalid={showError ? 'true' : null}
				aria-describedby={showError ? `${fieldName}-error` : null}
				aria-required={required}
				disabled={isSubmitting}
			/>
		);
	}
);

Textarea.displayName = 'Textarea';

export default Textarea;
