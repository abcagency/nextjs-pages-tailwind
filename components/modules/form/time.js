import { forwardRef } from 'react';

const TimeInput = forwardRef(
	(
		{
			className,
			required = false,
			fieldName,
			showError,
			placeholder,
			isSubmitting,
			disabled = false,
			value,
			onChange,
			onBlur,
			...rest
		},
		ref
	) => {
		return (
			<input
				{...rest}
				ref={ref}
				type="time"
				name={fieldName}
				placeholder={placeholder}
				{...(value !== undefined ? { value: value || '' } : {})}
				onChange={onChange}
				onBlur={onBlur}
				className={`
					block w-full rounded px-4 bg-white border placeholder:text-gray-300 transition-colors
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

TimeInput.displayName = 'TimeInput';

export default TimeInput;
