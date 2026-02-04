'use client';

import type { ComponentPropsWithoutRef } from 'react';
import { forwardRef, useMemo, useState } from 'react';

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
	icon?: string;
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
		const selectedOption = useMemo(
			() => options.find(option => option.value === value),
			[options, value]
		);
		const [query, setQuery] = useState('');
		const normalizedQuery = query.trim().toLowerCase();
		const matchedOptions = useMemo(() => {
			if (!normalizedQuery) {
				return options;
			}

			return options.filter(option =>
				option.label.toLowerCase().includes(normalizedQuery)
			);
		}, [options, normalizedQuery]);
		const showEmpty = normalizedQuery.length > 0 && matchedOptions.length === 0;
		const displayOptions = showEmpty ? options : matchedOptions;
		const groupedOptions = useMemo(() => {
			const groups = new Map<string, ComboboxOption[]>();

			displayOptions.forEach(option => {
				const group = option.group ?? 'Options';
				if (!groups.has(group)) {
					groups.set(group, []);
				}
				groups.get(group)?.push(option);
			});

			return Array.from(groups.entries());
		}, [displayOptions]);

		return (
			<Combobox
				value={value ?? ''}
				onValueChange={nextValue => onChange?.(nextValue ?? '')}
				onInputValueChange={nextValue => setQuery(nextValue)}
				filter={null}
				name={inputName}
				disabled={disabled}
			>
				<div className="relative">
					{selectedOption?.icon ? (
						<Icon
							icon={selectedOption.icon}
							size="size-4"
							className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2"
							aria-hidden="true"
						/>
					) : null}
					<ComboboxInput
						{...rest}
						ref={ref}
						id={id}
						placeholder={placeholder}
						disabled={disabled}
						className={cn(
							selectedOption?.icon ? 'pl-9' : 'pl-3',
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
						{showEmpty && (
							<>
								<div className="text-muted-foreground px-2 py-2 text-sm">
									{emptyText}
								</div>
								<div className="border-border my-1 border-t" />
							</>
						)}
						{groupedOptions.map(([group, groupOptions]) => (
							<ComboboxGroup key={group}>
								<ComboboxGroupLabel>{group}</ComboboxGroupLabel>
								{groupOptions.map(option => (
									<ComboboxItem
										key={option.value}
										value={option.value}
										disabled={option.disabled}
									>
										{option.icon ? (
											<Icon
												icon={option.icon}
												size="size-4"
												className="text-muted-foreground"
												aria-hidden="true"
											/>
										) : null}
										<span>{option.label}</span>
										<ComboboxItemIndicator />
									</ComboboxItem>
								))}
							</ComboboxGroup>
						))}
					</ComboboxList>
				</ComboboxContent>
			</Combobox>
		);
	}
);

ComboboxField.displayName = 'ComboboxField';

export default ComboboxField;
