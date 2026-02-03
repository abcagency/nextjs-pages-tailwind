import type { ChangeEvent, ComponentPropsWithoutRef, FocusEvent } from 'react';
import { forwardRef } from 'react';
import { IMaskInput } from 'react-imask';

type CurrencyInputProps = Omit<
	ComponentPropsWithoutRef<'input'>,
	'className' | 'name' | 'type'
> & {
	className?: string;
	required?: boolean;
	fieldName: string;
	showError?: boolean;
	placeholder?: string;
	isSubmitting?: boolean;
	trigger?: (fieldName: string) => void;
	value?: ComponentPropsWithoutRef<'input'>['value'];
};

const CurrencyInputField = forwardRef<HTMLInputElement, CurrencyInputProps>(
	(
		{
			className,
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
				mask="$num"
				unmask={true}
				blocks={{
					num: {
						mask: Number,
						thousandsSeparator: ','
					}
				}}
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
				onBlur={event => {
					trigger?.(fieldName);
					onBlur?.(event as FocusEvent<HTMLInputElement>);
				}}
				type="tel"
				name={fieldName}
				placeholder={placeholder}
				className={`
					block w-full rounded-md px-4 bg-white border placeholder:text-muted-foreground transition-colors
					${showError ? 'border-destructive' : 'border-ring'}
					${className ?? ''}
				`}
				aria-invalid={showError ? true : undefined}
				aria-describedby={showError ? `${fieldName}-error` : undefined}
				aria-required={required}
				disabled={isSubmitting}
			/>
		);
	}
);

CurrencyInputField.displayName = 'CurrencyInputField';

export default CurrencyInputField;
