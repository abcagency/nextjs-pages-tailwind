import { forwardRef } from 'react';
import { IMaskInput } from 'react-imask';

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
			mask,
			unmask = true,
			value,
			onChange,
			onBlur,
			...rest
		},
		ref
	) => {
		const baseProps = {
			name: fieldName,
			placeholder,
			className: `
				block w-full rounded px-4 bg-white border placeholder:text-gray-300 transition-colors
				${showError ? 'border-red-500' : 'border-gray-400'}
				${className ?? ''}
			`,
			'aria-invalid': showError ? 'true' : null,
			'aria-describedby': showError ? `${fieldName}-error` : null,
			'aria-required': required,
			disabled: disabled || isSubmitting
		};

		// If mask is provided, use IMaskInput
		if (mask) {
			return (
				<IMaskInput
					{...baseProps}
					ref={ref}
					mask={mask}
					unmask={unmask}
					value={value || ''}
					onAccept={(value, maskInstance) => {
						// Call onChange with proper event structure for react-hook-form
						if (onChange) {
							onChange({
								target: {
									name: fieldName,
									value: unmask ? maskInstance.unmaskedValue : value
								}
							});
						}
					}}
					onBlur={onBlur}
					type={type === 'phone' ? 'tel' : type}
					{...rest}
				/>
			);
		}

		// Regular input without mask
		return (
			<input
				{...baseProps}
				ref={ref}
				type={type === 'phone' ? 'tel' : type}
				{...(value !== undefined ? { value: value || '' } : {})}
				onChange={onChange}
				onBlur={onBlur}
				{...rest}
			/>
		);
	}
);

InputField.displayName = 'InputField';

export default InputField;
