import type { ReactNode } from 'react';
import { Fragment, useState } from 'react';
import {
	Dialog,
	DialogPanel,
	DialogTitle,
	Transition,
	TransitionChild
} from '@headlessui/react';

import { Button } from '~/components/modules/core/button';
import Icon from '~/components/modules/icon';

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

	const closeDialog = () => {
		setDialogIsOpen(false);
		setIsOpen?.(false);
	};

	const openModal = () => {
		setDialogIsOpen(true);
		trackEvent(
			'Engagement',
			'Open Modal',
			title === button.text ? title : `${button.text}: ${title}`
		);
	};

	return (
		<>
			{!hideButton && (
				<Button
					size={button.size}
					variant={button.variant}
					className={button.className ?? ''}
					hasUnderline={button.hasUnderline}
					onClick={openModal}
				>
					{button.text}
					{button.icon && (
						<Icon icon={button.icon} className={button.iconClassName ?? ''} />
					)}
				</Button>
			)}

			<Transition appear show={isOpen || dialogIsOpen} as={Fragment}>
				<Dialog as="div" className="relative z-99" onClose={closeDialog}>
					<TransitionChild
						as={Fragment}
						enter="ease-out duration-1000"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-300"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black/50" />
					</TransitionChild>

					<div className="fixed inset-0 overflow-y-auto">
						<div
							className="flex min-h-full items-center justify-center p-4 text-center"
							style={{
								perspective: '1200px'
							}}
						>
							<TransitionChild
								as={Fragment}
								enter="ease-out duration-150"
								enterFrom="translate-y-[48%] scale-[0.96] opacity-0"
								enterTo="translate-y-0 scale-100 opacity-100"
								leave="ease-in duration-150"
								leaveFrom="translate-y-0 scale-100 opacity-100"
								leaveTo="translate-y-[-48%] scale-[0.96] opacity-0"
							>
								<DialogPanel
									className={`
										relative w-full p-4 transform overflow-hidden bg-white text-left align-middle shadow-xl transition-all rounded-lg
										${dialogWidth}
										${dialogBodyClasses ?? ''}
									`}
								>
									<div className="flex gap-2 justify-between items-start border-b border-gray-200 pb-2 mb-6">
										<DialogTitle className="text-xl font-semibold">
											{title}
										</DialogTitle>
									</div>
									<div className="md:px-4">{body}</div>
									{children}

									<Button
										variant="ghost"
										size="icon-sm"
										aria-label="Close"
										onClick={closeDialog}
										className="absolute top-1 right-1"
									>
										<Icon icon="mdi:times" />
									</Button>
								</DialogPanel>
							</TransitionChild>
						</div>
					</div>
				</Dialog>
			</Transition>
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
