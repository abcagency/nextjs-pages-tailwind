'use client';

import * as React from 'react';
import { DayPicker, type DayPickerProps } from 'react-day-picker';

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
				months: 'flex flex-col gap-4',
				month: 'space-y-4',
				caption: 'flex items-center justify-between gap-2',
				caption_label: 'text-sm font-semibold',
				nav: 'flex items-center gap-2',
				nav_button:
					'border-border text-foreground hover:bg-muted flex size-8 items-center justify-center rounded-md border transition-colors',
				head_row: 'flex',
				head_cell: 'text-muted-foreground w-9 text-center text-xs font-medium',
				row: 'flex w-full mt-2',
				cell: 'relative h-9 w-9 p-0 text-center text-sm',
				day: 'hover:bg-muted focus-visible:ring-ring/30 focus-visible:ring-[3px] flex size-9 items-center justify-center rounded-md transition-colors outline-none',
				day_selected:
					'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary/30',
				day_today: 'bg-primary/10 text-primary',
				day_outside: 'text-muted-foreground/60 opacity-60',
				day_disabled: 'text-muted-foreground/40 opacity-50',
				day_range_middle: 'bg-primary/10 text-primary',
				day_range_end: 'bg-primary text-primary-foreground',
				day_range_start: 'bg-primary text-primary-foreground',
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
