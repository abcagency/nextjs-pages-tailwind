'use client';

import type { ComponentPropsWithoutRef } from 'react';
import { forwardRef } from 'react';
import { CheckboxGroup as CheckboxGroupPrimitive } from '@base-ui/react/checkbox-group';
import { Checkbox } from '@base-ui/react/checkbox';

import { cn } from '~/lib/utils';

export type CheckboxOption = {
	value: string;
	label: string;
	description?: string;
};

type CheckboxGroupProps = Omit<
	ComponentPropsWithoutRef<'div'>,
	'onChange' | 'defaultValue'
> & {
	name: string;
	options?: CheckboxOption[];
	value?: string[];
	defaultValue?: string[];
	onChange?: (values: string[]) => void;
	className?: string;
	labelClassName?: string;
	disabled?: boolean;
	required?: boolean;
	showError?: boolean;
	layout?: 'vertical' | 'horizontal';
};

const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(
	(
		{
			name,
			options = [],
			value = [],
			defaultValue,
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
			<CheckboxGroupPrimitive
				ref={ref}
				value={value}
				defaultValue={defaultValue}
				onValueChange={values => onChange?.(values)}
				allValues={options.map(option => option.value)}
				disabled={disabled}
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
						<Checkbox.Root
							name={name}
							value={option.value}
							required={required}
							disabled={disabled}
							className={cn(
								'border-border data-checked:bg-primary data-checked:border-primary focus-visible:ring-ring/30 inline-flex size-4 items-center justify-center rounded-sm border transition-colors focus-visible:ring-[3px]'
							)}
						>
							<Checkbox.Indicator className="text-primary-foreground text-xs">
								✓
							</Checkbox.Indicator>
						</Checkbox.Root>
						<div className="flex flex-col">
							<span className="text-sm font-medium text-foreground">
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
			</CheckboxGroupPrimitive>
		);
	}
);

CheckboxGroup.displayName = 'CheckboxGroup';

export default CheckboxGroup;
