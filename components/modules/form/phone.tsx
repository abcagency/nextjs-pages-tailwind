'use client';

import type { ComponentPropsWithoutRef } from 'react';
import { forwardRef } from 'react';

import Input from '~/components/modules/form/input';

type PhoneInputProps = ComponentPropsWithoutRef<typeof Input>;

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
	({ inputMode, autoComplete, ...props }, ref) => {
		return (
			<Input
				{...props}
				ref={ref}
				type="tel"
				inputMode={inputMode ?? 'tel'}
				autoComplete={autoComplete ?? 'tel'}
				mask="(000) 000-0000"
				unmask={true}
			/>
		);
	}
);

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;
