import { useState, useEffect, forwardRef } from 'react';

const CheckboxGroup = forwardRef(
	(
		{
			name,
			options = [],
			value = [],
			onChange,
			onBlur,
			className = '',
			labelClassName = '',
			disabled = false,
			required = false,
			isSubmitting = false,
			showError = false,
			layout = 'vertical', // 'vertical' | 'horizontal'
			orientation, // alias of layout
			...rest
		},
		ref
	) => {
		const resolvedLayout = orientation || layout;
		const isHorizontal = resolvedLayout === 'horizontal';
		const [selectedValues, setSelectedValues] = useState(value);

		useEffect(() => {
			setSelectedValues(value);
		}, [value]);

		const handleCheckboxChange = optionValue => {
			let newValues;
			if (selectedValues.includes(optionValue)) {
				// Remove the value
				newValues = selectedValues.filter(val => val !== optionValue);
			} else {
				// Add the value
				newValues = [...selectedValues, optionValue];
			}

			setSelectedValues(newValues);
			if (onChange) {
				onChange(newValues);
			}
		};

		return (
			<div
				ref={ref}
				role="radiogroup"
				aria-required={required}
				aria-invalid={showError ? 'true' : undefined}
				aria-describedby={showError ? `${name}-error` : undefined}
				className={`
					flex
					${isHorizontal ? 'flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4' : 'flex-col items-start gap-3'}
					${showError ? 'ring-1 ring-red-500 rounded-md p-2' : ''}
					${className ?? ''}
				`}
				{...rest}
			>
				{options.map(option => {
					const id = `${name}-${String(option.value).replace(/\s+/g, '-')}`;
					const checked = value === option.value;

					return (
						<label
							key={option.value}
							htmlFor={id}
							className={`inline-flex items-start gap-2 cursor-pointer group ${labelClassName ?? ''}`}
						>
							<input
								id={id}
								type="checkbox"
								name={name}
								value={option.value}
								checked={selectedValues.includes(option.value)}
								onChange={() => handleCheckboxChange(option.value)}
								onBlur={onBlur}
								disabled={disabled || isSubmitting}
								className={`
									mt-0.5 size-4 rounded-xs text-blue-600 border-gray-400 focus:ring-blue-500
									${disabled || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
								`}
							/>
							<span
								className={`
									text-sm leading-5
									${disabled ? 'text-gray-400' : 'text-gray-700 group-hover:text-gray-900'}
								`}
							>
								{option.label}
							</span>
						</label>
					);
				})}
			</div>
		);
	}
);

CheckboxGroup.displayName = 'CheckboxGroup';

export default CheckboxGroup;
