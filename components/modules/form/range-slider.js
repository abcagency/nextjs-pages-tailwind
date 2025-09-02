import { forwardRef } from 'react';

const formatNumber = (num, options = {}) => {
	const { maxValue = null } = options;

	let formattedNum = num;

	// Apply maximum value constraint
	const isAtMax = maxValue && num >= maxValue;

	if (isAtMax) {
		formattedNum = maxValue;
	}

	if (!formattedNum && formattedNum !== 0) {
		return '';
	}

	return (
		formattedNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
		(isAtMax ? '+' : '')
	);
};

const parseNumberInput = value => {
	// Remove commas and parse
	return parseInt(value.toString().replace(/,/g, '')) || 0;
};

const RangeSlider = forwardRef(
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
			maxValue = null,
			step = 1,
			fieldValue,
			setFieldValue,
			setValue,
			value, // This comes from the Controller
			onChange, // This comes from the Controller
			...rest
		},
		ref
	) => {
		const effectiveMax = maxValue || max;
		// Use the Controller's value if available, otherwise fallback to fieldValue
		const displayValue = value !== undefined ? value : fieldValue || min;

		const handleRangeChange = newValue => {
			const numValue = parseInt(newValue);
			// Call the Controller's onChange if available
			if (onChange) {
				onChange(numValue);
			}
			// Also update local state if setFieldValue is provided
			if (setFieldValue) {
				setFieldValue(numValue);
			}
			if (setValue) {
				setValue(fieldName, numValue, { shouldValidate: true });
			}
		};

		const handleInputChange = inputValue => {
			const numValue = parseNumberInput(inputValue);
			// Clamp value to min/max range
			const clampedValue = Math.min(Math.max(numValue, min), effectiveMax);
			// Call the Controller's onChange if available
			if (onChange) {
				onChange(clampedValue);
			}
			// Also update local state if setFieldValue is provided
			if (setFieldValue) {
				setFieldValue(clampedValue);
			}
			if (setValue) {
				setValue(fieldName, clampedValue, { shouldValidate: true });
			}
		};

		return (
			<>
				<input
					{...rest}
					ref={ref}
					value={displayValue}
					type="hidden"
					name={fieldName}
				/>
				<div
					className={`
					flex items-center gap-2 py-1.5 px-4 bg-white ring-1 rounded transition-colors
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
						onChange={e => handleRangeChange(e.target.value)}
						disabled={disabled || isSubmitting}
						className="w-full accent-blue-500 cursor-grab active:cursor-grabbing"
					/>
					<div className="w-[6rem] flex items-center gap-0.5">
						<input
							type="text"
							value={formatNumber(displayValue, { maxValue })}
							onChange={e => handleInputChange(e.target.value)}
							onFocus={e => e.target.select()}
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
