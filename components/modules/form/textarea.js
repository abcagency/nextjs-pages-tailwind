import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

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
			value,
			onChange,
			onBlur,
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
				{...(value !== undefined ? { value: value || '' } : {})}
				onChange={onChange}
				onBlur={onBlur}
				className={twMerge`
					block w-full min-h-32 px-4 field-sizing-content rounded bg-white border placeholder:text-gray-300 transition-colors
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
