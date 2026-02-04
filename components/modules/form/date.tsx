'use client';

import type { ComponentPropsWithoutRef, MutableRefObject, Ref } from 'react';
import { forwardRef, useEffect, useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';

import { Button } from '~/components/modules/core/button';
import { Calendar } from '~/components/modules/core/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '~/components/modules/core/popover';
import Icon from '~/components/modules/icon';
import Input from '~/components/modules/form/input';
import TimeInput from '~/components/modules/form/time';
import { cn } from '~/lib/utils';

type DateInputMode = 'auto' | 'native' | 'calendar';
type DateInputVariant = 'default' | 'input' | 'dob';

export type DateRangeValue = {
	start?: string;
	end?: string;
};

type DateInputProps = Omit<
	ComponentPropsWithoutRef<'input'>,
	'onChange' | 'value' | 'type'
> & {
	value?: string;
	onChange?: (value: string) => void;
	mode?: DateInputMode;
	variant?: DateInputVariant;
	showError?: boolean;
	name?: string;
	fieldName?: string;
	placeholder?: string;
};

type DateRangeInputProps = Omit<
	ComponentPropsWithoutRef<'input'>,
	'onChange' | 'value' | 'type'
> & {
	value?: DateRangeValue;
	onChange?: (value: DateRangeValue) => void;
	mode?: DateInputMode;
	showError?: boolean;
	name?: string;
	fieldName?: string;
	placeholder?: string;
};

type DateTimeInputProps = DateInputProps & {
	timeValue?: string;
	onTimeChange?: (value: string) => void;
	timeName?: string;
	timePlaceholder?: string;
	timeRef?: Ref<HTMLInputElement>;
};

const DATE_FORMAT = /^\d{4}-\d{2}-\d{2}$/;

const formatDate = (date: Date) => {
	const year = date.getFullYear();
	const month = `${date.getMonth() + 1}`.padStart(2, '0');
	const day = `${date.getDate()}`.padStart(2, '0');
	return `${year}-${month}-${day}`;
};

const parseDate = (value?: string) => {
	if (!value || !DATE_FORMAT.test(value)) {
		return undefined;
	}

	const [year, month, day] = value.split('-').map(Number);
	if (!year || !month || !day) {
		return undefined;
	}

	return new Date(year, month - 1, day);
};

const formatDisplayDate = (value?: string) => {
	const date = parseDate(value);
	if (!date) {
		return undefined;
	}

	return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(
		date
	);
};

const resolveAutoMode = () => {
	if (typeof window === 'undefined') {
		return 'calendar';
	}

	const coarsePointer = window.matchMedia?.('(pointer: coarse)')?.matches;
	const touchPoints = navigator.maxTouchPoints ?? 0;
	return coarsePointer || touchPoints > 0 ? 'native' : 'calendar';
};

const mergeRefs =
	<T,>(...refs: Array<Ref<T> | undefined>) =>
	(node: T | null) => {
		refs.forEach(ref => {
			if (!ref) {
				return;
			}
			if (typeof ref === 'function') {
				ref(node);
				return;
			}
			(ref as MutableRefObject<T | null>).current = node;
		});
	};

const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
	(
		{
			className,
			mode = 'auto',
			variant = 'default',
			name,
			fieldName,
			placeholder = 'Select a date…',
			showError,
			value,
			onChange,
			disabled,
			required,
			min,
			max,
			id,
			'aria-describedby': ariaDescribedBy,
			'aria-invalid': ariaInvalid,
			...rest
		},
		ref
	) => {
		const [resolvedMode, setResolvedMode] = useState<DateInputMode>(
			mode === 'auto' ? 'calendar' : mode
		);
		const [draftValue, setDraftValue] = useState(value ?? '');
		const inputName = fieldName ?? name;

		useEffect(() => {
			if (mode !== 'auto') {
				setResolvedMode(mode);
				return;
			}

			setResolvedMode(resolveAutoMode());
		}, [mode]);

		useEffect(() => {
			setDraftValue(value ?? '');
		}, [value]);

		const selectedDate = useMemo(() => parseDate(value), [value]);
		const displayValue =
			formatDisplayDate(value) ?? (value ? value : undefined);
		const isDob = variant === 'dob';
		const dobStartYear = 1900;
		const dobEndYear = new Date().getFullYear();

		if (resolvedMode === 'native') {
			return (
				<Input
					{...rest}
					ref={ref}
					type="date"
					name={inputName}
					id={id}
					value={value ?? ''}
					onChange={event => onChange?.(event.target.value)}
					placeholder={placeholder}
					min={min}
					max={max}
					disabled={disabled}
					required={required}
					aria-describedby={ariaDescribedBy}
					aria-invalid={ariaInvalid ?? (showError ? true : undefined)}
					showError={showError}
					className={className}
				/>
			);
		}

		const triggerClassName = cn(
			'border-border bg-background text-foreground focus-visible:ring-ring/20 focus-visible:border-ring flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
			showError && 'border-destructive focus-visible:ring-destructive/20',
			className
		);

		return (
			<div className="flex flex-col gap-2">
				{inputName && (
					<input type="hidden" name={inputName} value={value ?? ''} />
				)}
				<Popover>
					<PopoverTrigger
						nativeButton={variant === 'input' ? false : true}
						render={triggerProps => {
							if (variant === 'input') {
								const triggerRef = (
									triggerProps as { ref?: Ref<HTMLInputElement> }
								).ref;
								const mergedRef = mergeRefs(
									ref as Ref<HTMLInputElement>,
									triggerRef
								);

								return (
									<Input
										{...triggerProps}
										ref={mergedRef}
										id={id}
										type="text"
										value={draftValue}
										onChange={event => {
											const next = event.target.value;
											setDraftValue(next);
											if (DATE_FORMAT.test(next)) {
												onChange?.(next);
											}
										}}
										onBlur={event => {
											if (!event.target.value) {
												onChange?.('');
											}
										}}
										placeholder="YYYY-MM-DD…"
										disabled={disabled}
										required={required}
										aria-describedby={ariaDescribedBy}
										aria-invalid={ariaInvalid ?? (showError ? true : undefined)}
										showError={showError}
										className={className}
									/>
								);
							}

							const triggerRef = (
								triggerProps as { ref?: Ref<HTMLButtonElement> }
							).ref;
							const mergedRef = mergeRefs(
								ref as Ref<HTMLButtonElement>,
								triggerRef
							);

							return (
								<Button
									{...triggerProps}
									ref={mergedRef}
									type="button"
									variant="outline"
									size="default"
									className={triggerClassName}
									disabled={disabled}
									aria-describedby={ariaDescribedBy}
									aria-invalid={ariaInvalid ?? (showError ? true : undefined)}
									aria-required={required}
								>
									<span
										className={cn(
											'truncate text-left',
											displayValue ? 'text-foreground' : 'text-muted-foreground'
										)}
									>
										{displayValue ?? placeholder}
									</span>
									<Icon icon="ph:calendar" className="text-muted-foreground" />
								</Button>
							);
						}}
					/>
					<PopoverContent className="w-auto p-0">
						<Calendar
							mode="single"
							selected={selectedDate}
							onSelect={nextDate => {
								const formatted = nextDate ? formatDate(nextDate) : '';
								onChange?.(formatted);
							}}
							disabled={isDob ? { after: new Date() } : undefined}
							captionLayout={isDob ? 'dropdown' : 'label'}
							fromYear={isDob ? dobStartYear : undefined}
							toYear={isDob ? dobEndYear : undefined}
							defaultMonth={
								isDob ? new Date(dobEndYear - 25, 0, 1) : selectedDate
							}
						/>
					</PopoverContent>
				</Popover>
			</div>
		);
	}
);

DateInput.displayName = 'DateInput';

const DateRangeInput = forwardRef<HTMLInputElement, DateRangeInputProps>(
	(
		{
			className,
			mode = 'auto',
			name,
			fieldName,
			placeholder = 'Select a date range…',
			showError,
			value,
			onChange,
			disabled,
			required,
			id,
			'aria-describedby': ariaDescribedBy,
			'aria-invalid': ariaInvalid,
			...rest
		},
		ref
	) => {
		const [resolvedMode, setResolvedMode] = useState<DateInputMode>(
			mode === 'auto' ? 'calendar' : mode
		);
		const inputName = fieldName ?? name;

		useEffect(() => {
			if (mode !== 'auto') {
				setResolvedMode(mode);
				return;
			}

			setResolvedMode(resolveAutoMode());
		}, [mode]);

		const selectedRange = useMemo<DateRange | undefined>(() => {
			if (!value?.start && !value?.end) {
				return undefined;
			}

			return {
				from: parseDate(value?.start),
				to: parseDate(value?.end)
			};
		}, [value]);

		if (resolvedMode === 'native') {
			return (
				<div className="grid gap-2 sm:grid-cols-2">
					<Input
						{...rest}
						ref={ref}
						type="date"
						name={inputName ? `${inputName}.start` : undefined}
						id={id}
						value={value?.start ?? ''}
						onChange={event =>
							onChange?.({
								start: event.target.value,
								end: value?.end
							})
						}
						placeholder="Start date…"
						disabled={disabled}
						required={required}
						aria-describedby={ariaDescribedBy}
						aria-invalid={ariaInvalid ?? (showError ? true : undefined)}
						showError={showError}
						className={className}
					/>
					<Input
						{...rest}
						type="date"
						name={inputName ? `${inputName}.end` : undefined}
						value={value?.end ?? ''}
						onChange={event =>
							onChange?.({
								start: value?.start,
								end: event.target.value
							})
						}
						placeholder="End date…"
						disabled={disabled}
						required={required}
						aria-describedby={ariaDescribedBy}
						aria-invalid={ariaInvalid ?? (showError ? true : undefined)}
						showError={showError}
						className={className}
					/>
				</div>
			);
		}

		const rangeLabel = selectedRange?.from
			? selectedRange.to
				? `${formatDisplayDate(value?.start)} – ${formatDisplayDate(
						value?.end
					)}`
				: formatDisplayDate(value?.start)
			: undefined;

		const triggerClassName = cn(
			'border-border bg-background text-foreground focus-visible:ring-ring/20 focus-visible:border-ring flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
			showError && 'border-destructive focus-visible:ring-destructive/20',
			className
		);

		return (
			<div className="flex flex-col gap-2">
				{inputName && (
					<>
						<input
							type="hidden"
							name={`${inputName}.start`}
							value={value?.start ?? ''}
						/>
						<input
							type="hidden"
							name={`${inputName}.end`}
							value={value?.end ?? ''}
						/>
					</>
				)}
				<Popover>
					<PopoverTrigger
						render={triggerProps => {
							const triggerRef = (
								triggerProps as { ref?: Ref<HTMLButtonElement> }
							).ref;
							const mergedRef = mergeRefs(
								ref as Ref<HTMLButtonElement>,
								triggerRef
							);

							return (
								<Button
									{...triggerProps}
									ref={mergedRef as Ref<HTMLButtonElement>}
									type="button"
									variant="outline"
									size="default"
									className={triggerClassName}
									disabled={disabled}
									id={id}
									aria-describedby={ariaDescribedBy}
									aria-invalid={ariaInvalid ?? (showError ? true : undefined)}
									aria-required={required}
								>
									<span
										className={cn(
											'truncate text-left',
											rangeLabel ? 'text-foreground' : 'text-muted-foreground'
										)}
									>
										{rangeLabel ?? placeholder}
									</span>
									<Icon icon="ph:calendar" className="text-muted-foreground" />
								</Button>
							);
						}}
					/>
					<PopoverContent className="w-auto p-0">
						<Calendar
							mode="range"
							selected={selectedRange}
							onSelect={nextRange => {
								onChange?.({
									start: nextRange?.from
										? formatDate(nextRange.from)
										: undefined,
									end: nextRange?.to ? formatDate(nextRange.to) : undefined
								});
							}}
							numberOfMonths={2}
						/>
					</PopoverContent>
				</Popover>
			</div>
		);
	}
);

DateRangeInput.displayName = 'DateRangeInput';

const DateTimeInput = forwardRef<HTMLInputElement, DateTimeInputProps>(
	(
		{
			timeValue,
			onTimeChange,
			timeName,
			timePlaceholder = 'Select a time…',
			timeRef,
			...props
		},
		ref
	) => {
		return (
			<div className="grid gap-3 sm:grid-cols-2">
				<DateInput {...props} ref={ref} />
				<TimeInput
					ref={timeRef}
					name={timeName}
					value={timeValue ?? ''}
					onChange={event => onTimeChange?.(event.target.value)}
					placeholder={timePlaceholder}
				/>
			</div>
		);
	}
);

DateTimeInput.displayName = 'DateTimeInput';

export { DateInput, DateRangeInput, DateTimeInput };
export default DateInput;
