'use client';

import type { ComponentPropsWithoutRef } from 'react';
import { forwardRef } from 'react';
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group';
import { Radio } from '@base-ui/react/radio';

import { cn } from '~/lib/utils';

export type RadioOption = {
	value: string;
	label: string;
	description?: string;
};

type RadioGroupProps = Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> & {
	name: string;
	options?: RadioOption[];
	value?: string;
	onChange?: (value: string) => void;
	className?: string;
	labelClassName?: string;
	disabled?: boolean;
	required?: boolean;
	showError?: boolean;
	layout?: 'vertical' | 'horizontal';
};

const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
	(
		{
			name,
			options = [],
			value,
			onChange,
			className,
			labelClassName,
			disabled = false,
			required = false,
			showError = false,
			layout = 'vertical',
			...rest
		},
		ref
	) => {
		const isHorizontal = layout === 'horizontal';

		return (
			<RadioGroupPrimitive
				ref={ref}
				name={name}
				value={value}
				onValueChange={nextValue => onChange?.(String(nextValue))}
				disabled={disabled}
				required={required}
				className={cn(
					'flex gap-3',
					isHorizontal ? 'flex-row flex-wrap' : 'flex-col',
					showError && 'ring-1 ring-destructive rounded-md p-2',
					className
				)}
				{...rest}
			>
				{options.map(option => (
					<label
						key={option.value}
						className={cn(
							'flex items-start gap-2',
							disabled ? 'opacity-60' : 'cursor-pointer',
							labelClassName
						)}
					>
						<Radio.Root
							value={option.value}
							disabled={disabled}
							required={required}
							className={cn(
								'border-border data-checked:border-primary data-checked:bg-primary focus-visible:ring-ring/30 inline-flex size-4 items-center justify-center rounded-full border transition-colors focus-visible:ring-[3px] self-start mt-0.5'
							)}
						>
							<Radio.Indicator className="text-primary-foreground size-2 rounded-full bg-primary-foreground" />
						</Radio.Root>
						<div className="flex flex-col">
							<span className="text-sm font-medium text-foreground leading-5">
								{option.label}
							</span>
							{option.description && (
								<span className="text-xs text-muted-foreground">
									{option.description}
								</span>
							)}
						</div>
					</label>
				))}
			</RadioGroupPrimitive>
		);
	}
);

RadioGroup.displayName = 'RadioGroup';

export default RadioGroup;
