import { forwardRef } from 'react';

const Checkbox = forwardRef(
	(
		{
			className,
			required = false,
			fieldName,
			showError,
			displayName,
			isSubmitting,
			disabled = false,
			value,
			onChange,
			onBlur,
			...rest
		},
		ref
	) => {
		const id = `${fieldName}-checkbox`;

		return (
			<label
				htmlFor={id}
				className={`
					flex items-start gap-2 cursor-pointer group
					${className ?? ''}
				`}
			>
				<input
					{...rest}
					ref={ref}
					id={id}
					type="checkbox"
					name={fieldName}
					checked={!!value}
					onChange={onChange}
					onBlur={onBlur}
					disabled={disabled || isSubmitting}
					className={`
						mt-0.5 size-4 rounded-xs text-blue-600 focus:ring-blue-500
						${disabled || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
						${showError ? 'border-red-500' : 'border-gray-400'}
					`}
					aria-invalid={showError ? 'true' : null}
					aria-describedby={showError ? `${fieldName}-error` : null}
					aria-required={required}
				/>
				<span
					className={`
						text-sm leading-5
						${disabled ? 'text-gray-400' : 'text-gray-700 group-hover:text-gray-900'}
					`}
				>
					{displayName}
					{required && <span className="text-red-500 ml-1">*</span>}
				</span>
			</label>
		);
	}
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
