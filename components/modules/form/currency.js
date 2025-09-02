import { forwardRef } from 'react';
import { IMaskInput } from 'react-imask';

const CurrencyInputField = forwardRef((props, ref) => {
	const {
		className,
		type = 'number',
		required = false,
		fieldName,
		showError,
		placeholder,
		isSubmitting,
		trigger,
		value,
		onChange,
		onBlur,
		...rest
	} = props;

	return (
		<IMaskInput
			{...rest}
			ref={ref}
			mask={'$num'}
			unmask={true}
			blocks={{
				num: {
					mask: Number,
					thousandsSeparator: ','
				}
			}}
			value={value || ''}
			onAccept={(value, mask) => {
				// Call onChange with proper event structure for react-hook-form
				if (onChange) {
					onChange({
						target: {
							name: fieldName,
							value: mask.unmaskedValue
						}
					});
				}
			}}
			onBlur={() => {
				if (trigger) {
					trigger(fieldName);
				}
				if (onBlur) {
					onBlur();
				}
			}}
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
			disabled={isSubmitting}
		/>
	);
});

CurrencyInputField.displayName = 'CurrencyInputField';

export default CurrencyInputField;
