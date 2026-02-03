'use client';

import * as React from 'react';
import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox';

import { cn } from '~/lib/utils';

type ComboboxProps<Value, Multiple extends boolean | undefined = false> =
	ComboboxPrimitive.Root.Props<Value, Multiple>;

function Combobox<Value, Multiple extends boolean | undefined = false>(
	props: ComboboxProps<Value, Multiple>
) {
	return <ComboboxPrimitive.Root {...props} />;
}

const ComboboxInput = React.forwardRef<
	HTMLInputElement,
	ComboboxPrimitive.Input.Props
>(({ className, ...props }, ref) => {
	return (
		<ComboboxPrimitive.Input
			ref={ref}
			data-slot="combobox-input"
			className={cn(
				'border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring/20 focus-visible:border-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
				className
			)}
			{...props}
		/>
	);
});

ComboboxInput.displayName = 'ComboboxInput';

function ComboboxTrigger({
	className,
	...props
}: ComboboxPrimitive.Trigger.Props) {
	return (
		<ComboboxPrimitive.Trigger
			data-slot="combobox-trigger"
			className={cn(
				'text-muted-foreground absolute right-2 top-1/2 -translate-y-1/2',
				className
			)}
			{...props}
		/>
	);
}

function ComboboxContent({
	className,
	align = 'start',
	side = 'bottom',
	sideOffset = 4,
	...props
}: ComboboxPrimitive.Popup.Props &
	Pick<ComboboxPrimitive.Positioner.Props, 'align' | 'side' | 'sideOffset'>) {
	return (
		<ComboboxPrimitive.Portal>
			<ComboboxPrimitive.Positioner
				align={align}
				side={side}
				sideOffset={sideOffset}
				className="isolate z-50"
			>
				<ComboboxPrimitive.Popup
					data-slot="combobox-content"
					className={cn(
						'bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 w-[var(--combobox-list-width,260px)] rounded-md border border-border p-1 text-sm shadow-md outline-none',
						className
					)}
					{...props}
				/>
			</ComboboxPrimitive.Positioner>
		</ComboboxPrimitive.Portal>
	);
}

function ComboboxList({ className, ...props }: ComboboxPrimitive.List.Props) {
	return (
		<ComboboxPrimitive.List
			data-slot="combobox-list"
			className={cn('max-h-60 overflow-auto', className)}
			{...props}
		/>
	);
}

function ComboboxItem({ className, ...props }: ComboboxPrimitive.Item.Props) {
	return (
		<ComboboxPrimitive.Item
			data-slot="combobox-item"
			className={cn(
				'data-highlighted:bg-muted data-disabled:opacity-50 data-disabled:pointer-events-none flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none',
				className
			)}
			{...props}
		/>
	);
}

function ComboboxItemIndicator({
	className,
	...props
}: ComboboxPrimitive.ItemIndicator.Props) {
	return (
		<ComboboxPrimitive.ItemIndicator
			data-slot="combobox-item-indicator"
			className={cn('text-primary ml-auto text-xs', className)}
			{...props}
		/>
	);
}

function ComboboxGroup({ className, ...props }: ComboboxPrimitive.Group.Props) {
	return (
		<ComboboxPrimitive.Group
			data-slot="combobox-group"
			className={cn('flex flex-col gap-1', className)}
			{...props}
		/>
	);
}

function ComboboxGroupLabel({
	className,
	...props
}: ComboboxPrimitive.GroupLabel.Props) {
	return (
		<ComboboxPrimitive.GroupLabel
			data-slot="combobox-group-label"
			className={cn(
				'text-muted-foreground px-2 py-1 text-xs font-semibold',
				className
			)}
			{...props}
		/>
	);
}

function ComboboxEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props) {
	return (
		<ComboboxPrimitive.Empty
			data-slot="combobox-empty"
			className={cn('text-muted-foreground px-2 py-2 text-sm', className)}
			{...props}
		/>
	);
}

export {
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
};
