import type { ComponentPropsWithoutRef, RefObject } from 'react';
import { forwardRef, useState } from 'react';
import {
	Popover,
	PopoverContent,
	PopoverDescription,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger
} from '~/components/modules/core/popover';
import { DayPicker } from 'react-day-picker';

import Button from '~/components/modules/button';
import DisplayDate from '~/components/modules/display-date';

type DateInputProps = Omit<
	ComponentPropsWithoutRef<'input'>,
	'className' | 'name' | 'type'
> & {
	className?: string;
	container?: RefObject<HTMLElement | null>;
	required?: boolean;
	disabled?: boolean;
	fieldName: string;
	showError?: boolean;
	placeholder?: Date | string;
	isSubmitting?: boolean;
	fieldValue?: string | number | Date;
	setFieldValue?: (value: Date | undefined) => void;
	setValue?: (field: string, value: Date | undefined) => void;
};

const DateInputField = forwardRef<HTMLInputElement, DateInputProps>(
	(
		{
			className,
			container,
			required = false,
			disabled = false,
			fieldName,
			showError,
			placeholder,
			isSubmitting,
			fieldValue,
			setFieldValue,
			setValue,
			...rest
		},
		ref
	) => {
		const [date, setDate] = useState<Date | undefined>(undefined);
		const displayValue = date ?? placeholder;
		const defaultMonth =
			typeof placeholder === 'string' || !placeholder ? undefined : placeholder;

		return (
			<>
				<input
					{...rest}
					ref={ref}
					value={fieldValue as string | number | undefined}
					type="hidden"
					aria-required={required}
					name={fieldName}
				/>
				<Popover>
					<PopoverTrigger
						render={
							<Button.Btn
								variant="none"
								size="none"
								className={`
									block w-full px-3 py-2 rounded bg-white border text-left font-normal shadow-sm
									hover:bg-gray-100 focus:hover:bg-gray-100
									${!date && 'text-gray-400'}
									${showError ? 'border-red-500' : 'border-gray-400'}
									${className ?? ''}
								`}
								disabled={disabled || isSubmitting}
							>
								<Button.Body className="justify-between">
									<DisplayDate
										date={displayValue || new Date()}
										format="MM/DD/YYYY"
									/>
									<Button.Icon
										icon="uil:calendar"
										className="mt-0.5 text-gray-850"
									/>
								</Button.Body>
							</Button.Btn>
						}
					/>

					<PopoverContent>
						<DayPicker
							mode="single"
							captionLayout="dropdown"
							defaultMonth={defaultMonth}
							selected={date}
							onSelect={selectedDate => {
								setDate(selectedDate);
								setFieldValue?.(selectedDate);
								setValue?.(fieldName, selectedDate);
							}}
							hideNavigation={true}
							classNames={{
								months: 'relative',
								month: 'space-y-4',
								caption_label: 'hidden',
								dropdowns: 'flex gap-2',
								dropdown_root: 'flex-1 [&:nth-child(2)]:flex-initial',
								dropdown:
									'py-0 px-2 border-0 border-b border-gray-200 z-2 w-full bg-none',
								table: 'w-full border-collapse space-y-1',
								head_row: 'flex',
								weekdays: 'text-xs font-semibold text-gray-850/30',
								head_cell:
									'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
								month_grid: 'w-full',
								row: 'flex w-full mt-2',
								day: 'size-8 p-0 font-normal aria-selected:opacity-100 text-center text-sm rounded-sm cursor-pointer hover:bg-blue-600/10 focus:bg-blue-600/10',
								day_button: 'cursor-pointer block w-full h-full pt-1',
								selected:
									'bg-blue-600 text-white hover:bg-blue-600! focus:bg-blue-600!',
								today: 'bg-blue-400/5 text-blue-400',
								day_disabled: 'text-gray-850/40 opacity-50',
								day_hidden: 'hidden',
								outside: 'pointer-events-none'
							}}
						/>
					</PopoverContent>
				</Popover>
			</>
		);
	}
);

DateInputField.displayName = 'DateInputField';

export default DateInputField;
