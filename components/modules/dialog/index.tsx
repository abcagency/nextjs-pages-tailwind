import type { ReactNode } from 'react';
import { useState } from 'react';

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle
} from '~/components/modules/core/dialog';
import { Button } from '~/components/modules/core/button';
import Icon from '~/components/modules/icon';
import { cn } from '~/lib/utils';
import trackEvent from '~/hooks/useEventTracker';

type DialogButton = {
	text: string;
	icon?: string;
	iconClassName?: string;
	size?:
		| 'none'
		| 'xs'
		| 'sm'
		| 'default'
		| 'lg'
		| 'link'
		| 'icon'
		| 'icon-xs'
		| 'icon-sm'
		| 'icon-lg';
	variant?:
		| 'none'
		| 'default'
		| 'outline'
		| 'secondary'
		| 'ghost'
		| 'destructive'
		| 'link';
	className?: string;
	hasUnderline?: boolean;
};

type DialogProps = {
	button: DialogButton;
	hideButton?: boolean;
	dialogWidth?: string;
	title: string;
	body?: ReactNode;
	children?: ReactNode;
	isOpen?: boolean;
	setIsOpen?: (value: boolean) => void;
	dialogBodyClasses?: string;
};

const DialogDefault = ({
	button,
	hideButton = false,
	dialogWidth = 'max-w-3xl',
	title,
	body,
	children,
	isOpen = false,
	setIsOpen,
	dialogBodyClasses
}: DialogProps) => {
	const [dialogIsOpen, setDialogIsOpen] = useState(false);

	const isControlled = setIsOpen !== undefined;
	const open = isControlled ? isOpen : dialogIsOpen;

	const handleOpenChange = (nextOpen: boolean) => {
		if (!isControlled) {
			setDialogIsOpen(nextOpen);
		}
		setIsOpen?.(nextOpen);
		if (nextOpen) {
			trackEvent(
				'Engagement',
				'Open Modal',
				title === button.text ? title : `${button.text}: ${title}`
			);
		}
	};

	return (
		<>
			{!hideButton && (
				<Button
					size={button.size}
					variant={button.variant}
					className={button.className ?? ''}
					hasUnderline={button.hasUnderline}
					onClick={() => handleOpenChange(true)}
				>
					{button.text}
					{button.icon && (
						<Icon icon={button.icon} className={button.iconClassName ?? ''} />
					)}
				</Button>
			)}

			<Dialog open={open} onOpenChange={handleOpenChange}>
				<DialogContent
					className={cn(
						'relative w-full max-w-3xl',
						dialogWidth,
						dialogBodyClasses
					)}
				>
					<DialogHeader>
						<DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
					</DialogHeader>
					<div className="px-6 pb-6">{body}</div>
					{children}
					<DialogClose
						render={closeProps => (
							<Button
								{...closeProps}
								variant="ghost"
								size="icon-sm"
								aria-label="Close"
								className="absolute right-3 top-3"
							>
								<Icon icon="mdi:times" />
							</Button>
						)}
					/>
				</DialogContent>
			</Dialog>
		</>
	);
};

type DialogBodyProps = {
	children?: ReactNode;
	className?: string;
};

export const DialogBody = ({
	children,
	className,
	...props
}: DialogBodyProps) => {
	return (
		<div
			className={`
				md:px-4
				${className ?? ''}
			`}
			{...props}
		>
			{children}
		</div>
	);
};

export default DialogDefault;
