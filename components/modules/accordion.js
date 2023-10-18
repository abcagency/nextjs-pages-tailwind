import { forwardRef, useEffect } from 'react';
import * as RadixAccordion from '@radix-ui/react-accordion';

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

export const AccordionItem = forwardRef((
	{
		id,
		trigger,
		children,
		bodyClasses,
		...props
	},
	forwardedRef
) => {
	return (
		<RadixAccordion.Item
			ref={forwardedRef}
			value={id}
			{...props}
		>
			{trigger}
			<AccordionContent className={bodyClasses ?? ''}>
				{children}
			</AccordionContent>
		</RadixAccordion.Item>
	);
});

export const AccordionTrigger = forwardRef((
	{
		children,
		className,
		...props
	},
	forwardedRef
) => (
	<RadixAccordion.Header asChild className="AccordionHeader">
		<RadixAccordion.Trigger
			ref={forwardedRef}
			className={`
				group flex justify-between w-full p-4 font-bold text-left text-gray-700 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 hover:bg-gray-200 focus:bg-gray-200 transition-colors border-b border-white data-[state=closed]:bg-gray-100 data-[state=open]:bg-gray-200
				${className ?? ''}
			`}
			{...props}
		>
			{children}
			<Icon
				icon="mdi:chevron-down"
				size="w-4 h-4"
				className="transition-transform !transform !translate-y-1 group-data-[state=open]:!rotate-180"
				aria-hidden="true"
			/>
		</RadixAccordion.Trigger>
	</RadixAccordion.Header>
));

export const AccordionContent = forwardRef((
	{
		children,
		className,
		...props
	},
	forwardedRef
) => (
	<RadixAccordion.Content
		ref={forwardedRef}
		className={`
			border border-gray-200 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden
			${className ?? ''}
		`}
		{...props}
	>
		<div className="p-4">{children}</div>
	</RadixAccordion.Content>
));

Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Content = AccordionContent;

AccordionItem.displayName = 'AccordionItem';
AccordionTrigger.displayName = 'AccordionTrigger';
AccordionContent.displayName = 'AccordionContent';

export default Accordion;
