'use client';

import type { ComponentPropsWithoutRef } from 'react';
import { forwardRef } from 'react';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectItemIndicator,
	SelectItemText,
	SelectList,
	SelectTrigger,
	SelectValue
} from '~/components/modules/core/select';
import { cn } from '~/lib/utils';

export type SelectOption = {
	value: string;
	label: string;
	disabled?: boolean;
};

type SelectFieldProps = Omit<
	ComponentPropsWithoutRef<'select'>,
	'className' | 'name' | 'value' | 'onChange'
> & {
	className?: string;
	name?: string;
	fieldName?: string;
	showError?: boolean;
	placeholder?: string;
	options: SelectOption[];
	value?: string;
	onChange?: (value: string) => void;
};

const SelectField = forwardRef<HTMLButtonElement, SelectFieldProps>(
	(
		{
			className,
			fieldName,
			name,
			showError,
			placeholder,
			options,
			value,
			onChange,
			...rest
		},
		ref
	) => {
		const inputName = fieldName ?? name;
		const resolveLabel = (selectedValue: string | null) =>
			options.find(option => option.value === selectedValue)?.label ??
			selectedValue;

		return (
			<Select
				value={value ?? ''}
				onValueChange={nextValue => onChange?.(nextValue ?? '')}
				name={inputName}
			>
				<SelectTrigger
					ref={ref}
					className={cn(
						showError && 'border-destructive focus-visible:ring-destructive/20',
						className
					)}
				>
					<SelectValue>
						{selectedValue =>
							selectedValue ? (
								resolveLabel(selectedValue)
							) : (
								<span className="text-muted-foreground">
									{placeholder ?? 'Select an option…'}
								</span>
							)
						}
					</SelectValue>
				</SelectTrigger>
				<SelectContent>
					<SelectList>
						{options.map(option => (
							<SelectItem
								key={option.value}
								value={option.value}
								disabled={option.disabled}
							>
								<SelectItemText>{option.label}</SelectItemText>
								<SelectItemIndicator>Selected</SelectItemIndicator>
							</SelectItem>
						))}
					</SelectList>
				</SelectContent>
			</Select>
		);
	}
);

SelectField.displayName = 'SelectField';

export default SelectField;
