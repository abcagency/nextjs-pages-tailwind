import type { ChangeEvent, ComponentPropsWithoutRef } from 'react';
import { forwardRef } from 'react';
import { IMaskInput } from 'react-imask';

type PhoneInputProps = Omit<
	ComponentPropsWithoutRef<'input'>,
	'className' | 'name' | 'type'
> & {
	className?: string;
	required?: boolean;
	fieldName: string;
	showError?: boolean;
	placeholder?: string;
	isSubmitting?: boolean;
	disabled?: boolean;
	value?: ComponentPropsWithoutRef<'input'>['value'];
};

const PhoneInputField = forwardRef<HTMLInputElement, PhoneInputProps>(
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
		const maskedValue =
			typeof value === 'string' || typeof value === 'number'
				? String(value)
				: '';

		return (
			<IMaskInput
				{...rest}
				ref={ref}
				mask="(000) 000-0000"
				unmask={true}
				value={maskedValue}
				onAccept={(acceptedValue, maskInstance) => {
					if (onChange) {
						onChange({
							target: {
								name: fieldName,
								value: maskInstance.unmaskedValue
							}
						} as unknown as ChangeEvent<HTMLInputElement>);
					}
				}}
				onBlur={onBlur}
				type="tel"
				name={fieldName}
				placeholder={placeholder}
				className={`
					block w-full rounded-md px-4 bg-white border placeholder:text-gray-300 transition-colors
					${showError ? 'border-red-500' : 'border-gray-400'}
					${className ?? ''}
				`}
				aria-invalid={showError ? true : undefined}
				aria-describedby={showError ? `${fieldName}-error` : undefined}
				aria-required={required}
				disabled={disabled || isSubmitting}
			/>
		);
	}
);

PhoneInputField.displayName = 'PhoneInputField';

export default PhoneInputField;
