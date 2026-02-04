'use client';

import * as React from 'react';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';

import { cn } from '~/lib/utils';

type DrawerSide = 'bottom' | 'left' | 'right' | 'top';

type DrawerContentProps = DialogPrimitive.Popup.Props & {
	side?: DrawerSide;
};

function Drawer({ ...props }: DialogPrimitive.Root.Props) {
	return <DialogPrimitive.Root data-slot="drawer" {...props} />;
}

function DrawerTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
	return <DialogPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerClose({ ...props }: DialogPrimitive.Close.Props) {
	return <DialogPrimitive.Close data-slot="drawer-close" {...props} />;
}

function DrawerOverlay({
	className,
	...props
}: DialogPrimitive.Backdrop.Props) {
	return (
		<DialogPrimitive.Backdrop
			data-slot="drawer-overlay"
			className={cn(
				'bg-black/50 data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 fixed inset-0 z-50',
				className
			)}
			{...props}
		/>
	);
}

const DrawerContent = React.forwardRef<HTMLDivElement, DrawerContentProps>(
	({ className, side = 'bottom', ...props }, ref) => {
		const viewportClassName = cn(
			'fixed inset-0 z-50 flex',
			side === 'bottom' && 'items-end justify-center',
			side === 'top' && 'items-start justify-center',
			side === 'left' && 'items-stretch justify-start',
			side === 'right' && 'items-stretch justify-end'
		);

		const contentClassName = cn(
			'bg-background text-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 shadow-lg outline-none',
			side === 'bottom' &&
				'data-open:slide-in-from-bottom-4 data-closed:slide-out-to-bottom-4 w-full max-w-4xl rounded-t-2xl border border-border',
			side === 'top' &&
				'data-open:slide-in-from-top-4 data-closed:slide-out-to-top-4 w-full max-w-4xl rounded-b-2xl border border-border',
			side === 'left' &&
				'data-open:slide-in-from-left-4 data-closed:slide-out-to-left-4 h-full w-96 max-w-[90vw] rounded-r-2xl border-y border-r border-border',
			side === 'right' &&
				'data-open:slide-in-from-right-4 data-closed:slide-out-to-right-4 h-full w-96 max-w-[90vw] rounded-l-2xl border-y border-l border-border',
			className
		);

		return (
			<DialogPrimitive.Portal>
				<DrawerOverlay />
				<DialogPrimitive.Viewport
					data-slot="drawer-viewport"
					className={viewportClassName}
				>
					<DialogPrimitive.Popup
						ref={ref}
						data-slot="drawer-content"
						data-side={side}
						className={contentClassName}
						{...props}
					/>
				</DialogPrimitive.Viewport>
			</DialogPrimitive.Portal>
		);
	}
);

DrawerContent.displayName = 'DrawerContent';

function DrawerHeader({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="drawer-header"
			className={cn(
				'flex flex-col gap-1 border-b border-border px-6 pb-4 pt-6',
				className
			)}
			{...props}
		/>
	);
}

function DrawerFooter({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="drawer-footer"
			className={cn(
				'flex flex-wrap items-center justify-end gap-3 border-t border-border px-6 py-4',
				className
			)}
			{...props}
		/>
	);
}

function DrawerTitle({ className, ...props }: DialogPrimitive.Title.Props) {
	return (
		<DialogPrimitive.Title
			data-slot="drawer-title"
			className={cn('text-lg font-semibold', className)}
			{...props}
		/>
	);
}

function DrawerDescription({
	className,
	...props
}: DialogPrimitive.Description.Props) {
	return (
		<DialogPrimitive.Description
			data-slot="drawer-description"
			className={cn('text-sm text-muted-foreground', className)}
			{...props}
		/>
	);
}

export {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerTitle,
	DrawerTrigger
};
