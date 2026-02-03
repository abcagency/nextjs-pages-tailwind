'use client';

import type { ComponentPropsWithoutRef } from 'react';
import { forwardRef, useId } from 'react';
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';

import { Switch, SwitchThumb } from '~/components/modules/core/switch';
import { Toggle } from '~/components/modules/core/toggle';
import { cn } from '~/lib/utils';

export type CheckboxDisplay = 'checkbox' | 'switch' | 'toggle';

type CheckboxProps = Omit<
	ComponentPropsWithoutRef<typeof BaseCheckbox.Root>,
	'checked' | 'onCheckedChange'
> & {
	className?: string;
	name?: string;
	fieldName?: string;
	label?: string;
	description?: string;
	required?: boolean;
	disabled?: boolean;
	showError?: boolean;
	display?: CheckboxDisplay;
	checked?: boolean;
	onCheckedChange?: (checked: boolean) => void;
};

const Checkbox = forwardRef<HTMLElement, CheckboxProps>(
	(
		{
			className,
			name,
			fieldName,
			label,
			description,
			required = false,
			disabled = false,
			showError,
			display = 'checkbox',
			checked,
			onCheckedChange,
			...rest
		},
		ref
	) => {
		const inputName = fieldName ?? name;
		const generatedId = useId();
		const id = inputName ? `${inputName}-${generatedId}` : generatedId;

		const sharedLabel = (
			<div className="flex flex-col">
				{label && (
					<span
						className={cn(
							'text-sm font-medium',
							disabled ? 'text-muted-foreground' : 'text-foreground'
						)}
					>
						{label}
						{required && <span className="text-destructive ml-1">*</span>}
					</span>
				)}
				{description && (
					<span className="text-xs text-muted-foreground">{description}</span>
				)}
			</div>
		);

		if (display === 'toggle') {
			return (
				<Toggle
					ref={ref as React.Ref<HTMLButtonElement>}
					type="button"
					pressed={checked}
					onPressedChange={onCheckedChange}
					disabled={disabled}
					className={cn(
						showError && 'border-destructive text-destructive',
						className
					)}
				>
					{label ?? 'Toggle'}
				</Toggle>
			);
		}

		const control =
			display === 'switch' ? (
				<Switch
					ref={ref as React.Ref<HTMLElement>}
					checked={checked}
					onCheckedChange={onCheckedChange}
					name={inputName}
					disabled={disabled}
					className={cn(showError && 'ring-destructive/30 ring-2', className)}
				>
					<SwitchThumb />
				</Switch>
			) : (
				<BaseCheckbox.Root
					ref={ref}
					id={id}
					name={inputName}
					disabled={disabled}
					required={required}
					checked={checked}
					onCheckedChange={onCheckedChange}
					className={cn(
						'border-border data-checked:bg-primary data-checked:border-primary focus-visible:ring-ring/30 inline-flex size-4 items-center justify-center rounded-sm border transition-colors focus-visible:ring-[3px]',
						showError && 'border-destructive',
						className
					)}
					{...rest}
				>
					<BaseCheckbox.Indicator className="text-primary-foreground text-xs">
						✓
					</BaseCheckbox.Indicator>
				</BaseCheckbox.Root>
			);

		if (!label && !description) {
			return control;
		}

		return (
			<label
				htmlFor={display === 'checkbox' ? id : undefined}
				className="flex items-start gap-2"
			>
				{control}
				{sharedLabel}
			</label>
		);
	}
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
