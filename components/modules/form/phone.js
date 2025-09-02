import { forwardRef } from 'react';
import { IMaskInput } from 'react-imask';

const PhoneInputField = forwardRef((props, ref) => {
	const {
		className,
		type = 'text',
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
	} = props;

	return (
		<IMaskInput
			{...rest}
			ref={ref}
			mask={'(000) 000-0000'}
			unmask={true}
			value={value || ''}
			onAccept={(value, maskInstance) => {
				// Call onChange with proper event structure for react-hook-form
				if (onChange) {
					onChange({
						target: {
							name: fieldName,
							value: maskInstance.unmaskedValue
						}
					});
				}
			}}
			onBlur={onBlur}
			type="tel"
			name={fieldName}
			placeholder={placeholder}
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
});

PhoneInputField.displayName = 'PhoneInputField';

export default PhoneInputField;
