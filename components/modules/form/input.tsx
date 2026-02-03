'use client';

import type { ChangeEvent, ComponentPropsWithoutRef } from 'react';
import { forwardRef } from 'react';
import { Input as BaseInput } from '@base-ui/react/input';
import { IMaskInput } from 'react-imask';
import type { FactoryArg } from 'imask';

import { cn } from '~/lib/utils';

type MaskPattern = FactoryArg;

type InputFieldProps = Omit<
	ComponentPropsWithoutRef<'input'>,
	'className' | 'name'
> & {
	className?: string;
	name?: string;
	fieldName?: string;
	showError?: boolean;
	mask?: MaskPattern;
	unmask?: boolean | 'typed';
};

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
	(
		{
			className,
			fieldName,
			name,
			showError,
			mask,
			unmask = true,
			value,
			onChange,
			onBlur,
			...rest
		},
		ref
	) => {
		const inputName = fieldName ?? name;

		const baseClassName = cn(
			'border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring/20 focus-visible:border-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm shadow-sm outline-none transition-colors focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
			showError && 'border-destructive focus-visible:ring-destructive/20',
			className
		);

		if (mask) {
			const maskedValue =
				typeof value === 'string' || typeof value === 'number'
					? String(value)
					: '';

			return (
				<IMaskInput
					{...rest}
					ref={ref}
					name={inputName}
					className={baseClassName}
					value={maskedValue}
					unmask={unmask}
					onAccept={(acceptedValue, maskInstance) => {
						if (onChange) {
							const nextValue =
								unmask === 'typed'
									? maskInstance.typedValue
									: unmask
										? maskInstance.unmaskedValue
										: acceptedValue;

							onChange({
								target: {
									name: inputName ?? '',
									value: nextValue ?? ''
								}
							} as unknown as ChangeEvent<HTMLInputElement>);
						}
					}}
					onBlur={onBlur}
				/>
			);
		}

		return (
			<BaseInput
				{...rest}
				ref={ref}
				name={inputName}
				className={baseClassName}
				{...(value !== undefined ? { value } : {})}
				onChange={onChange}
				onBlur={onBlur}
			/>
		);
	}
);

InputField.displayName = 'InputField';

export default InputField;
