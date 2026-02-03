import type { ChangeEvent, ComponentPropsWithoutRef } from 'react';
import { forwardRef } from 'react';
import { IMaskInput } from 'react-imask';

type MaskPattern = string | RegExp;

type InputFieldProps = Omit<
	ComponentPropsWithoutRef<'input'>,
	'className' | 'type' | 'name'
> & {
	className?: string;
	type?: string;
	required?: boolean;
	fieldName: string;
	showError?: boolean;
	placeholder?: string;
	isSubmitting?: boolean;
	disabled?: boolean;
	mask?: MaskPattern;
	unmask?: boolean | 'typed';
	value?: ComponentPropsWithoutRef<'input'>['value'];
};

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
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
				block w-full rounded-md px-4 bg-white border placeholder:text-muted-foreground transition-colors
				${showError ? 'border-destructive' : 'border-ring'}
				${className ?? ''}
			`,
			'aria-invalid': showError ? true : undefined,
			'aria-describedby': showError ? `${fieldName}-error` : undefined,
			'aria-required': required,
			disabled: disabled || isSubmitting
		};

		if (mask) {
			const maskedValue =
				typeof value === 'string' || typeof value === 'number'
					? String(value)
					: '';

			const sharedMaskedProps = {
				...baseProps,
				ref,
				unmask,
				value: maskedValue,
				onAccept: (
					acceptedValue: string,
					maskInstance: { unmaskedValue: string }
				) => {
					if (onChange) {
						onChange({
							target: {
								name: fieldName,
								value: unmask ? maskInstance.unmaskedValue : acceptedValue
							}
						} as unknown as ChangeEvent<HTMLInputElement>);
					}
				},
				onBlur,
				type: type === 'phone' ? 'tel' : type,
				...rest
			};

			if (typeof mask === 'string') {
				return <IMaskInput {...sharedMaskedProps} mask={mask} />;
			}

			return <IMaskInput mask={mask} {...sharedMaskedProps} />;
		}

		return (
			<input
				{...baseProps}
				ref={ref}
				type={type === 'phone' ? 'tel' : type}
				{...(value !== undefined ? { value } : {})}
				onChange={onChange}
				onBlur={onBlur}
				{...rest}
			/>
		);
	}
);

InputField.displayName = 'InputField';

export default InputField;
