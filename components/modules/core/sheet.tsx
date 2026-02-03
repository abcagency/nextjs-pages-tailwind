'use client';

import * as React from 'react';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';

import { cn } from '~/lib/utils';

type SheetSide = 'left' | 'right' | 'top' | 'bottom';

type SheetContentProps = DialogPrimitive.Popup.Props & {
	side?: SheetSide;
};

function Sheet({ ...props }: DialogPrimitive.Root.Props) {
	return <DialogPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
	return <DialogPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({ ...props }: DialogPrimitive.Close.Props) {
	return <DialogPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetOverlay({ className, ...props }: DialogPrimitive.Backdrop.Props) {
	return (
		<DialogPrimitive.Backdrop
			data-slot="sheet-overlay"
			className={cn(
				'bg-black/50 data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 fixed inset-0 z-50',
				className
			)}
			{...props}
		/>
	);
}

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
	({ className, side = 'right', ...props }, ref) => {
		const viewportClassName = cn(
			'fixed inset-0 z-50 flex',
			side === 'left' && 'items-stretch justify-start',
			side === 'right' && 'items-stretch justify-end',
			side === 'top' && 'items-start justify-center',
			side === 'bottom' && 'items-end justify-center'
		);

		const contentClassName = cn(
			'bg-background text-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 shadow-lg outline-none',
			side === 'right' &&
				'data-open:slide-in-from-right-4 data-closed:slide-out-to-right-4 h-full w-96 max-w-[90vw] border-y border-l border-border',
			side === 'left' &&
				'data-open:slide-in-from-left-4 data-closed:slide-out-to-left-4 h-full w-96 max-w-[90vw] border-y border-r border-border',
			side === 'top' &&
				'data-open:slide-in-from-top-4 data-closed:slide-out-to-top-4 w-full max-w-5xl border-b border-border',
			side === 'bottom' &&
				'data-open:slide-in-from-bottom-4 data-closed:slide-out-to-bottom-4 w-full max-w-5xl border-t border-border',
			className
		);

		return (
			<DialogPrimitive.Portal>
				<SheetOverlay />
				<DialogPrimitive.Viewport
					data-slot="sheet-viewport"
					className={viewportClassName}
				>
					<DialogPrimitive.Popup
						ref={ref}
						data-slot="sheet-content"
						data-side={side}
						className={contentClassName}
						{...props}
					/>
				</DialogPrimitive.Viewport>
			</DialogPrimitive.Portal>
		);
	}
);

SheetContent.displayName = 'SheetContent';

function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="sheet-header"
			className={cn(
				'flex flex-col gap-1 border-b border-border px-6 pb-4 pt-6',
				className
			)}
			{...props}
		/>
	);
}

function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="sheet-footer"
			className={cn(
				'flex flex-wrap items-center justify-end gap-3 border-t border-border px-6 py-4',
				className
			)}
			{...props}
		/>
	);
}

function SheetTitle({ className, ...props }: DialogPrimitive.Title.Props) {
	return (
		<DialogPrimitive.Title
			data-slot="sheet-title"
			className={cn('text-lg font-semibold', className)}
			{...props}
		/>
	);
}

function SheetDescription({
	className,
	...props
}: DialogPrimitive.Description.Props) {
	return (
		<DialogPrimitive.Description
			data-slot="sheet-description"
			className={cn('text-sm text-muted-foreground', className)}
			{...props}
		/>
	);
}

export {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetOverlay,
	SheetTitle,
	SheetTrigger
};
