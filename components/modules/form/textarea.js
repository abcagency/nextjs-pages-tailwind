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
				form-field form-field--textarea
				${showError ? 'field-hasErrors' : ''}
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
