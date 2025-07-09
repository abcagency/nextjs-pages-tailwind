import { Fragment, useState } from 'react';
import {
	Dialog,
	DialogPanel,
	DialogTitle,
	Transition,
	TransitionChild
} from '@headlessui/react';

import Button from '~/components/modules/button';

import trackEvent from '~/hooks/useEventTracker';

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
}) => {
	let [dialogIsOpen, setDialogIsOpen] = useState(false);

	const closeDialog = () => {
		setDialogIsOpen(false);
		setIsOpen && setIsOpen(false);
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
				<Button.Btn
					as="button"
					size={button.size}
					variant={button.variant}
					className={button.className ?? ''}
					hasUnderline={button.hasUnderline}
					onClick={openModal}
				>
					{button.variant === 'link' ? (
						<>
							{button.text}
							{button.icon && (
								<Button.Icon
									icon={button.icon}
									className={button.iconClassName ?? ''}
								/>
							)}
						</>
					) : (
						<Button.Body>
							{button.text}
							{button.icon && (
								<Button.Icon
									icon={button.icon}
									className={button.iconClassName ?? ''}
								/>
							)}
						</Button.Body>
					)}
				</Button.Btn>
			)}

			<Transition appear show={isOpen || dialogIsOpen} as={Fragment}>
				<Dialog as="div" className="relative z-[99]" onClose={closeDialog}>
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

									<Button.Btn
										variant="icon"
										size="sq"
										aria-label="Close"
										onClick={closeDialog}
										className="absolute top-1.5 right-0"
									>
										<Button.Body>
											<span className="sr-only">Close</span>
											<Button.Icon icon="mdi:times" />
										</Button.Body>
									</Button.Btn>
								</DialogPanel>
							</TransitionChild>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	);
};

export const DialogBody = ({ children, className, ...props }) => {
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
