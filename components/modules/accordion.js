import { forwardRef } from 'react';
import { Accordion as RadixAccordion } from 'radix-ui';
import { twMerge } from 'tailwind-merge';

import Icon from '~/components/modules/icon';

import trackEvent from '~/hooks/useEventTracker';

const Accordion = ({
	className,
	type = 'single',
	defaultValue,
	collapsible = true,
	children
}) => {
	return (
		<RadixAccordion.Root
			type={type}
			defaultValue={defaultValue ?? null}
			collapsible={collapsible}
			className={className ?? ''}
			onValueChange={value => trackEvent('Engagement', 'Open Accordion', value)}
		>
			{children}
		</RadixAccordion.Root>
	);
};

export const AccordionItem = forwardRef(
	({ id, children, className, ...props }, ref) => {
		return (
			<RadixAccordion.Item
				ref={ref}
				value={id}
				className={className ?? ''}
				{...props}
			>
				{children}
			</RadixAccordion.Item>
		);
	}
);

export const AccordionTrigger = forwardRef(
	({ children, className, ...props }, ref) => (
		<RadixAccordion.Header asChild>
			<RadixAccordion.Trigger
				ref={ref}
				className={twMerge`
					group flex justify-between w-full p-4 font-bold text-left text-gray-700 focus:outline-hidden focus-visible:ring-3 focus-visible:ring-purple-500 focus-visible:ring-opacity-75 hover:bg-gray-200 focus:bg-gray-200 transition-colors border-b border-white data-[state=closed]:bg-gray-100 data-[state=open]:bg-gray-200
					${className ?? ''}
				`}
				{...props}
			>
				{children}
				<Icon
					icon="mdi:chevron-down"
					size="w-4 h-4"
					className="transition-transform transform! translate-y-1! group-data-[state=open]:rotate-180!"
					aria-hidden="true"
				/>
			</RadixAccordion.Trigger>
		</RadixAccordion.Header>
	)
);

export const AccordionContent = forwardRef(
	({ children, className, bodyClassName, ...props }, ref) => (
		<RadixAccordion.Content
			ref={ref}
			className={twMerge`
				data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden
				${className ?? ''}
			`}
			{...props}
		>
			<div
				className={twMerge`
					px-4 py-2 border border-gray-200
					${bodyClassName ?? ''}
				`}
			>
				{children}
			</div>
		</RadixAccordion.Content>
	)
);

Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Content = AccordionContent;

AccordionItem.displayName = 'AccordionItem';
AccordionTrigger.displayName = 'AccordionTrigger';
AccordionContent.displayName = 'AccordionContent';

export default Accordion;
