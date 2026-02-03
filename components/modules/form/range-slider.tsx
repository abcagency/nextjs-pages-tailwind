'use client';

import type { ComponentPropsWithoutRef } from 'react';
import { forwardRef } from 'react';
import type { UseFormSetValue } from 'react-hook-form';
import { Slider } from '@base-ui/react/slider';

import { cn } from '~/lib/utils';

const formatNumber = (
	num: number,
	options: { maxValue?: number | null } = {}
) => {
	const { maxValue } = options;

	let formattedNum = num;

	const isAtMax =
		maxValue !== undefined && maxValue !== null && num >= maxValue;

	if (isAtMax) {
		formattedNum = maxValue ?? num;
	}

	if (formattedNum === undefined || formattedNum === null) {
		return '';
	}

	return (
		formattedNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
		(isAtMax ? '+' : '')
	);
};

const parseNumberInput = (value: string) => {
	return parseInt(value.toString().replace(/,/g, ''), 10) || 0;
};

type RangeSliderProps = Omit<
	ComponentPropsWithoutRef<'input'>,
	'className' | 'name' | 'type' | 'onChange'
> & {
	className?: string;
	fieldClassName?: string;
	fieldName: string;
	showError?: boolean;
	min?: number;
	max?: number;
	maxValue?: number | null;
	step?: number;
	fieldValue?: number;
	setFieldValue?: (value: number) => void;
	setValue?: UseFormSetValue<Record<string, unknown>>;
	value?: number;
	onChange?: (value: number) => void;
};

const RangeSlider = forwardRef<HTMLInputElement, RangeSliderProps>(
	(
		{
			className,
			fieldClassName,
			fieldName,
			showError,
			min = 0,
			max = 100,
			maxValue,
			step = 1,
			fieldValue,
			setFieldValue,
			setValue,
			value,
			onChange,
			...rest
		},
		ref
	) => {
		const effectiveMax = maxValue ?? max;
		const displayValue = value ?? fieldValue ?? min;

		const handleRangeChange = (newValue: number) => {
			onChange?.(newValue);
			setFieldValue?.(newValue);
			setValue?.(fieldName, newValue, { shouldValidate: true });
		};

		const handleInputChange = (inputValue: string) => {
			const numValue = parseNumberInput(inputValue);
			const clampedValue = Math.min(Math.max(numValue, min), effectiveMax);
			handleRangeChange(clampedValue);
		};

		return (
			<div
				className={cn(
					'border-border bg-background flex w-full items-center gap-3 rounded-md border px-4 py-3',
					showError && 'border-destructive',
					className
				)}
			>
				<input
					{...rest}
					ref={ref}
					value={displayValue}
					type="hidden"
					name={fieldName}
				/>
				<Slider.Root
					value={displayValue}
					min={min}
					max={effectiveMax}
					step={step}
					onValueChange={nextValue =>
						handleRangeChange(
							Array.isArray(nextValue) ? (nextValue[0] ?? min) : nextValue
						)
					}
					className="flex w-full items-center"
				>
					<Slider.Control className="relative h-2 w-full">
						<Slider.Track className="bg-muted h-2 rounded-full">
							<Slider.Indicator className="bg-primary h-2 rounded-full" />
						</Slider.Track>
						<Slider.Thumb className="border-border bg-background ring-ring/20 size-4 rounded-full border shadow-sm ring-1" />
					</Slider.Control>
				</Slider.Root>
				<input
					type="text"
					value={formatNumber(displayValue, { maxValue })}
					onChange={event => handleInputChange(event.target.value)}
					onFocus={event => event.target.select()}
					className={cn(
						'border-border bg-muted text-foreground focus-visible:ring-ring/20 focus-visible:border-ring w-24 rounded-full border px-2 py-1 text-center text-sm outline-none focus-visible:ring-[3px]',
						fieldClassName
					)}
					placeholder="0…"
				/>
			</div>
		);
	}
);

RangeSlider.displayName = 'RangeSlider';

export default RangeSlider;
