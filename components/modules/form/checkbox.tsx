'use client';

import type { ComponentPropsWithoutRef } from 'react';
import { forwardRef, useId } from 'react';
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';

import { Switch, SwitchThumb } from '~/components/modules/core/switch';
import { Toggle } from '~/components/modules/core/toggle';
import Icon from '~/components/modules/icon';
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
			id: idProp,
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
		const controlId = idProp ?? generatedId;
		const descriptionId = description ? `${controlId}-description` : undefined;

		if (display === 'toggle') {
			return (
				<Toggle
					ref={ref as React.Ref<HTMLButtonElement>}
					type="button"
					id={controlId}
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
					id={controlId}
					checked={checked}
					onCheckedChange={onCheckedChange}
					name={inputName}
					disabled={disabled}
					aria-describedby={descriptionId}
					className={cn(showError && 'ring-destructive/30 ring-2', className)}
				>
					<SwitchThumb />
				</Switch>
			) : (
				<BaseCheckbox.Root
					ref={ref}
					id={controlId}
					name={inputName}
					disabled={disabled}
					required={required}
					checked={checked}
					onCheckedChange={onCheckedChange}
					aria-describedby={descriptionId}
					className={cn(
						'border-border data-checked:bg-primary data-checked:border-primary focus-visible:ring-ring/30 inline-flex size-4.5 items-center justify-center rounded-sm border transition-colors focus-visible:ring-[3px] self-start mt-0.5',
						showError && 'border-destructive',
						className
					)}
					{...rest}
				>
					<BaseCheckbox.Indicator className="text-primary-foreground flex items-center justify-center">
						<Icon icon="ph:check-bold" size="size-3" aria-hidden="true" />
					</BaseCheckbox.Indicator>
				</BaseCheckbox.Root>
			);

		if (!label && !description) {
			return control;
		}

		return (
			<div className="flex items-start gap-2">
				{control}
				<div className="flex flex-col">
					{label && (
						<label
							htmlFor={controlId}
							className={cn(
								'text-sm font-medium leading-5',
								disabled
									? 'text-muted-foreground cursor-not-allowed'
									: 'text-foreground cursor-pointer'
							)}
						>
							{label}
							{required && <span className="text-destructive ml-1">*</span>}
						</label>
					)}
					{description && (
						<span id={descriptionId} className="text-xs text-muted-foreground">
							{description}
						</span>
					)}
				</div>
			</div>
		);
	}
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
