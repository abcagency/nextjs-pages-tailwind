'use client';

import * as React from 'react';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';

import { cn } from '~/lib/utils';

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
	return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
	return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
	return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
	className,
	...props
}: DialogPrimitive.Backdrop.Props) {
	return (
		<DialogPrimitive.Backdrop
			data-slot="dialog-overlay"
			className={cn(
				'bg-black/50 data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 fixed inset-0 z-50',
				className
			)}
			{...props}
		/>
	);
}

const DialogContent = React.forwardRef<
	HTMLDivElement,
	DialogPrimitive.Popup.Props
>(({ className, ...props }, ref) => {
	return (
		<DialogPrimitive.Portal>
			<DialogOverlay />
			<DialogPrimitive.Viewport
				data-slot="dialog-viewport"
				className="fixed inset-0 z-50 flex items-center justify-center p-4"
			>
				<DialogPrimitive.Popup
					ref={ref}
					data-slot="dialog-content"
					className={cn(
						'data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 bg-background text-foreground w-full max-w-2xl rounded-xl border border-border shadow-lg outline-none',
						className
					)}
					{...props}
				/>
			</DialogPrimitive.Viewport>
		</DialogPrimitive.Portal>
	);
});

DialogContent.displayName = 'DialogContent';

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="dialog-header"
			className={cn(
				'flex flex-col gap-1 border-b border-border px-6 pb-4 pt-6',
				className
			)}
			{...props}
		/>
	);
}

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="dialog-footer"
			className={cn(
				'flex flex-wrap items-center justify-end gap-3 border-t border-border px-6 py-4',
				className
			)}
			{...props}
		/>
	);
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
	return (
		<DialogPrimitive.Title
			data-slot="dialog-title"
			className={cn('text-lg font-semibold', className)}
			{...props}
		/>
	);
}

function DialogDescription({
	className,
	...props
}: DialogPrimitive.Description.Props) {
	return (
		<DialogPrimitive.Description
			data-slot="dialog-description"
			className={cn('text-sm text-muted-foreground', className)}
			{...props}
		/>
	);
}

export {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogTitle,
	DialogTrigger
};
