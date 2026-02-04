'use client';

import * as React from 'react';
import {
	DayFlag,
	DayPicker,
	type DayPickerProps,
	SelectionState,
	UI
} from 'react-day-picker';

import { cn } from '~/lib/utils';
import Icon from '~/components/modules/icon';

type CalendarProps = DayPickerProps;

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	...props
}: CalendarProps) {
	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			className={cn('p-3', className)}
			classNames={{
				[UI.Months]: 'flex flex-col gap-4',
				[UI.Month]: 'space-y-4',
				[UI.MonthCaption]: 'flex items-center justify-between gap-2',
				[UI.CaptionLabel]:
					'inline-flex items-center gap-1 text-sm font-semibold',
				[UI.Dropdowns]: 'flex items-center gap-2',
				[UI.DropdownRoot]:
					'border-border bg-background relative inline-flex items-center rounded-md border px-2 py-1 text-sm shadow-xs',
				[UI.Dropdown]:
					'absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0',
				[UI.MonthsDropdown]: 'appearance-none',
				[UI.YearsDropdown]: 'appearance-none',
				[UI.Chevron]: 'text-muted-foreground',
				[UI.Nav]: 'flex items-center gap-2',
				[UI.PreviousMonthButton]:
					'border-border text-foreground hover:bg-muted flex size-8 items-center justify-center rounded-md border transition-colors',
				[UI.NextMonthButton]:
					'border-border text-foreground hover:bg-muted flex size-8 items-center justify-center rounded-md border transition-colors',
				[UI.MonthGrid]: 'w-full border-collapse space-y-1',
				[UI.Weekdays]: 'flex',
				[UI.Weekday]:
					'text-muted-foreground w-9 text-center text-xs font-medium',
				[UI.Weeks]: 'flex w-full flex-col gap-2',
				[UI.Week]: 'flex w-full',
				[UI.Day]: 'relative h-9 w-9 p-0 text-center text-sm',
				[UI.DayButton]:
					'hover:bg-muted focus-visible:ring-ring/30 focus-visible:ring-[3px] flex size-9 items-center justify-center rounded-md transition-colors outline-none',
				[SelectionState.selected]:
					'bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus-visible:ring-primary/30',
				[DayFlag.today]: 'bg-primary/10 rounded-md text-primary',
				[DayFlag.outside]: 'text-muted-foreground/60 opacity-60',
				[DayFlag.disabled]: 'text-muted-foreground/40 opacity-50',
				[SelectionState.range_middle]: 'bg-primary/10 text-primary',
				[SelectionState.range_end]: 'bg-primary text-primary-foreground',
				[SelectionState.range_start]: 'bg-primary text-primary-foreground',
				...classNames
			}}
			components={{
				Chevron: ({ orientation = 'left', className }) => {
					const icon =
						orientation === 'left'
							? 'ph:caret-left'
							: orientation === 'right'
								? 'ph:caret-right'
								: orientation === 'up'
									? 'ph:caret-up'
									: 'ph:caret-down';

					return (
						<Icon
							icon={icon}
							size="size-4"
							className={cn('text-foreground', className)}
							aria-hidden="true"
						/>
					);
				}
			}}
			{...props}
		/>
	);
}

export { Calendar };
