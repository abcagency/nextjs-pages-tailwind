import type { ComponentPropsWithoutRef } from 'react';
import { useEffect, useState, forwardRef } from 'react';

type CheckboxOption = {
	value: string;
	label: string;
};

type CheckboxGroupProps = Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> & {
	name: string;
	options?: CheckboxOption[];
	value?: string[];
	onChange?: (values: string[]) => void;
	onBlur?: ComponentPropsWithoutRef<'input'>['onBlur'];
	className?: string;
	labelClassName?: string;
	disabled?: boolean;
	required?: boolean;
	isSubmitting?: boolean;
	showError?: boolean;
	layout?: 'vertical' | 'horizontal';
	orientation?: 'vertical' | 'horizontal';
};

const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(
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
			layout = 'vertical',
			orientation,
			...rest
		},
		ref
	) => {
		const resolvedLayout = orientation || layout;
		const isHorizontal = resolvedLayout === 'horizontal';
		const [selectedValues, setSelectedValues] = useState<string[]>(value);

		useEffect(() => {
			setSelectedValues(value);
		}, [value]);

		const handleCheckboxChange = (optionValue: string) => {
			let newValues: string[];
			if (selectedValues.includes(optionValue)) {
				newValues = selectedValues.filter(val => val !== optionValue);
			} else {
				newValues = [...selectedValues, optionValue];
			}

			setSelectedValues(newValues);
			onChange?.(newValues);
		};

		return (
			<div
				ref={ref}
				role="group"
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
