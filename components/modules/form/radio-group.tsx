import type { ComponentPropsWithoutRef } from 'react';
import { forwardRef } from 'react';

type RadioOption = {
	value: string;
	label: string;
};

type RadioGroupProps = Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> & {
	name: string;
	options?: RadioOption[];
	value?: string;
	onChange?: (value: string) => void;
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

const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
	(
		{
			name,
			options = [],
			value,
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

		return (
			<div
				ref={ref}
				role="radiogroup"
				aria-required={required}
				aria-invalid={showError ? 'true' : undefined}
				aria-describedby={showError ? `${name}-error` : undefined}
				className={`flex
					${isHorizontal ? 'flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4' : 'flex-col gap-3'}
					${showError ? 'ring-1 ring-destructive rounded-md p-2' : ''}
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
							className={`flex items-start gap-2 cursor-pointer group ${labelClassName ?? ''}`}
						>
							<input
								id={id}
								type="radio"
								name={name}
								value={option.value}
								checked={Boolean(checked)}
								onChange={() => onChange?.(option.value)}
								onBlur={onBlur}
								disabled={disabled || isSubmitting}
								className={`
									mt-0.5 size-4 text-primary border-ring focus:ring-primary
									${disabled || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
								`}
							/>
							<span
								className={`text-sm leading-5 ${disabled ? 'text-muted-foreground' : 'text-foreground'}`}
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

RadioGroup.displayName = 'RadioGroup';

export default RadioGroup;
