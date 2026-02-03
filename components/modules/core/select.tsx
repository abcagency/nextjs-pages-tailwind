'use client';

import * as React from 'react';
import { Select as SelectPrimitive } from '@base-ui/react/select';

import Icon from '~/components/modules/icon';
import { cn } from '~/lib/utils';

type SelectProps<Value, Multiple extends boolean | undefined = false> =
	SelectPrimitive.Root.Props<Value, Multiple>;

function Select<Value, Multiple extends boolean | undefined = false>(
	props: SelectProps<Value, Multiple>
) {
	return <SelectPrimitive.Root {...props} />;
}

const SelectTrigger = React.forwardRef<
	HTMLButtonElement,
	SelectPrimitive.Trigger.Props
>(({ className, children, ...props }, ref) => {
	return (
		<SelectPrimitive.Trigger
			ref={ref}
			data-slot="select-trigger"
			className={cn(
				'border-border bg-background text-foreground focus-visible:ring-ring/20 focus-visible:border-ring inline-flex h-10 w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
				className
			)}
			{...props}
		>
			{children}
			<Icon icon="ph:caret-down" className="text-muted-foreground" />
		</SelectPrimitive.Trigger>
	);
});

SelectTrigger.displayName = 'SelectTrigger';

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
	return (
		<SelectPrimitive.Value
			data-slot="select-value"
			className={cn('text-left', className)}
			{...props}
		/>
	);
}

function SelectContent({
	className,
	align = 'start',
	side = 'bottom',
	sideOffset = 4,
	...props
}: SelectPrimitive.Popup.Props &
	Pick<SelectPrimitive.Positioner.Props, 'align' | 'side' | 'sideOffset'>) {
	return (
		<SelectPrimitive.Portal>
			<SelectPrimitive.Positioner
				align={align}
				side={side}
				sideOffset={sideOffset}
				className="isolate z-50"
			>
				<SelectPrimitive.Popup
					data-slot="select-content"
					className={cn(
						'bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 w-[var(--select-trigger-width,260px)] rounded-md border border-border p-1 text-sm shadow-md outline-none',
						className
					)}
					{...props}
				/>
			</SelectPrimitive.Positioner>
		</SelectPrimitive.Portal>
	);
}

function SelectList({ className, ...props }: SelectPrimitive.List.Props) {
	return (
		<SelectPrimitive.List
			data-slot="select-list"
			className={cn('max-h-60 overflow-auto', className)}
			{...props}
		/>
	);
}

function SelectItem({ className, ...props }: SelectPrimitive.Item.Props) {
	return (
		<SelectPrimitive.Item
			data-slot="select-item"
			className={cn(
				'data-highlighted:bg-muted data-disabled:opacity-50 data-disabled:pointer-events-none flex cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm outline-none',
				className
			)}
			{...props}
		/>
	);
}

function SelectItemText({
	className,
	...props
}: SelectPrimitive.ItemText.Props) {
	return (
		<SelectPrimitive.ItemText
			data-slot="select-item-text"
			className={cn('text-left', className)}
			{...props}
		/>
	);
}

function SelectItemIndicator({
	className,
	...props
}: SelectPrimitive.ItemIndicator.Props) {
	return (
		<SelectPrimitive.ItemIndicator
			data-slot="select-item-indicator"
			className={cn('text-primary flex items-center justify-center', className)}
			{...props}
		>
			<Icon icon="ph:check-bold" size="size-3" aria-hidden="true" />
		</SelectPrimitive.ItemIndicator>
	);
}

export {
	Select,
	SelectContent,
	SelectItem,
	SelectItemIndicator,
	SelectItemText,
	SelectList,
	SelectTrigger,
	SelectValue
};
