'use client';

import type { ComponentPropsWithoutRef } from 'react';
import { forwardRef } from 'react';

import Input from '~/components/modules/form/input';

type CurrencyInputProps = ComponentPropsWithoutRef<typeof Input>;

const currencyMask = {
	mask: Number,
	scale: 2,
	radix: '.',
	thousandsSeparator: ',',
	normalizeZeros: true,
	padFractionalZeros: false,
	signed: false,
	prefix: '$'
};

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
	({ inputMode, autoComplete, ...props }, ref) => {
		return (
			<Input
				{...props}
				ref={ref}
				type="text"
				inputMode={inputMode ?? 'decimal'}
				autoComplete={autoComplete ?? 'off'}
				mask={currencyMask}
				unmask="typed"
			/>
		);
	}
);

CurrencyInput.displayName = 'CurrencyInput';

export default CurrencyInput;
