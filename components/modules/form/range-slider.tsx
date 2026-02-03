import type { ComponentPropsWithoutRef } from 'react';
import { forwardRef } from 'react';
import type { UseFormSetValue } from 'react-hook-form';

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
	required?: boolean;
	fieldName: string;
	disabled?: boolean;
	placeholder?: string;
	showError?: boolean;
	isSubmitting?: boolean;
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
			required = false,
			fieldName,
			disabled = false,
			placeholder,
			showError,
			isSubmitting,
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
			onChange?.(clampedValue);
			setFieldValue?.(clampedValue);
			setValue?.(fieldName, clampedValue, { shouldValidate: true });
		};

		return (
			<>
				<input
					{...rest}
					ref={ref}
					value={displayValue}
					type="hidden"
					name={fieldName}
					aria-required={required}
				/>
				<div
					className={`
						flex items-center gap-2 py-1.5 px-4 bg-white ring-1 rounded-md transition-colors
						${showError ? 'ring-red-500' : 'ring-gray-400'}
						${disabled || isSubmitting ? 'opacity-50 pointer-events-none' : ''}
						${className ?? ''}
					`}
				>
					<input
						type="range"
						min={min}
						max={effectiveMax}
						step={step}
						value={displayValue}
						onChange={event => handleRangeChange(Number(event.target.value))}
						disabled={disabled || isSubmitting}
						className="w-full accent-blue-500 cursor-grab active:cursor-grabbing"
					/>
					<div className="w-24 flex items-center gap-0.5">
						<input
							type="text"
							value={formatNumber(displayValue, { maxValue })}
							onChange={event => handleInputChange(event.target.value)}
							onFocus={event => event.target.select()}
							disabled={disabled || isSubmitting}
							placeholder={placeholder}
							className={`
								block w-full py-0.5 pl-1 pr-0 text-center rounded-full bg-gray-50 border border-gray-400 transition-colors focus:bg-white
								${fieldClassName ?? ''}
							`}
						/>
					</div>
				</div>
			</>
		);
	}
);

RangeSlider.displayName = 'RangeSlider';

export default RangeSlider;
