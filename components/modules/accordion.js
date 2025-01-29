import { forwardRef } from 'react';
import * as RadixAccordion from '@radix-ui/react-accordion';
import { twMerge } from 'tailwind-merge';

import Icon from '~/components/modules/icon';

import trackEvent from '~/hooks/useEventTracker';

const Accordion = ({
	className,
	variant = 'accordion-default',
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
			className={twMerge`
				accordion
				${variant}
				${className ?? ''}
			`}
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
				className={twMerge`
					accordion-item
					${className ?? ''}
				`}
				{...props}
			>
				{children}
			</RadixAccordion.Item>
		);
	}
);

export const AccordionTrigger = forwardRef(
	({ children, icon = 'mdi:chevron-down', className, ...props }, ref) => (
		<RadixAccordion.Header asChild>
			<RadixAccordion.Trigger
				ref={ref}
				className={twMerge`
					accordion-trigger group
					${className ?? ''}
				`}
				{...props}
			>
				{children}
				<Icon
					icon={icon}
					size="size-5"
					className="trigger-icon"
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
				accordion-content
				${className ?? ''}
			`}
			{...props}
		>
			<div
				className={twMerge`
					content-body
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
