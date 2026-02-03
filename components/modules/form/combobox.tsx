'use client';

import type { ComponentPropsWithoutRef } from 'react';
import { forwardRef, useMemo } from 'react';

import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxGroup,
	ComboboxGroupLabel,
	ComboboxInput,
	ComboboxItem,
	ComboboxItemIndicator,
	ComboboxList,
	ComboboxTrigger
} from '~/components/modules/core/combobox';
import Icon from '~/components/modules/icon';
import { cn } from '~/lib/utils';

export type ComboboxOption = {
	value: string;
	label: string;
	group?: string;
	disabled?: boolean;
};

type ComboboxFieldProps = Omit<
	ComponentPropsWithoutRef<'input'>,
	'className' | 'name' | 'value' | 'onChange'
> & {
	className?: string;
	name?: string;
	fieldName?: string;
	showError?: boolean;
	placeholder?: string;
	options: ComboboxOption[];
	value?: string;
	onChange?: (value: string) => void;
	emptyText?: string;
};

const ComboboxField = forwardRef<HTMLInputElement, ComboboxFieldProps>(
	(
		{
			className,
			name,
			fieldName,
			showError,
			placeholder,
			options,
			value,
			onChange,
			emptyText = 'No matches found.',
			disabled,
			id,
			...rest
		},
		ref
	) => {
		const inputName = fieldName ?? name;
		const groupedOptions = useMemo(() => {
			const groups = new Map<string, ComboboxOption[]>();

			options.forEach(option => {
				const group = option.group ?? 'Options';
				if (!groups.has(group)) {
					groups.set(group, []);
				}
				groups.get(group)?.push(option);
			});

			return Array.from(groups.entries());
		}, [options]);

		return (
			<Combobox
				value={value ?? ''}
				onValueChange={nextValue => onChange?.(nextValue ?? '')}
				name={inputName}
				disabled={disabled}
			>
				<div className="relative">
					<ComboboxInput
						{...rest}
						ref={ref}
						id={id}
						placeholder={placeholder}
						disabled={disabled}
						className={cn(
							showError &&
								'border-destructive focus-visible:ring-destructive/20',
							className
						)}
					/>
					<ComboboxTrigger aria-label="Toggle options">
						<Icon icon="ph:caret-down" className="text-muted-foreground" />
					</ComboboxTrigger>
				</div>
				<ComboboxContent>
					<ComboboxList>
						{groupedOptions.map(([group, groupOptions]) => (
							<ComboboxGroup key={group}>
								<ComboboxGroupLabel>{group}</ComboboxGroupLabel>
								{groupOptions.map(option => (
									<ComboboxItem
										key={option.value}
										value={option.value}
										disabled={option.disabled}
									>
										<span>{option.label}</span>
										<ComboboxItemIndicator>Selected</ComboboxItemIndicator>
									</ComboboxItem>
								))}
							</ComboboxGroup>
						))}
						<ComboboxEmpty>{emptyText}</ComboboxEmpty>
					</ComboboxList>
				</ComboboxContent>
			</Combobox>
		);
	}
);

ComboboxField.displayName = 'ComboboxField';

export default ComboboxField;
