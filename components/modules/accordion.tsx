import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';
import { forwardRef } from 'react';
import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import { twMerge } from 'tailwind-merge';

import Icon from '~/components/modules/icon';
import trackEvent from '~/hooks/useEventTracker';

type AccordionRootProps = ComponentPropsWithoutRef<typeof BaseAccordion.Root>;

type AccordionProps = Omit<AccordionRootProps, 'defaultValue' | 'multiple'> & {
	className?: string;
	type?: 'single' | 'multiple';
	defaultValue?: string | string[];
	children?: ReactNode;
};

const Accordion = ({
	className,
	type = 'single',
	defaultValue,
	children,
	...rest
}: AccordionProps) => {
	return (
		<BaseAccordion.Root
			multiple={type === 'multiple'}
			defaultValue={
				defaultValue
					? Array.isArray(defaultValue)
						? defaultValue
						: [defaultValue]
					: undefined
			}
			className={className ?? ''}
			onValueChange={value =>
				trackEvent(
					'Engagement',
					'Open Accordion',
					Array.isArray(value) ? value.join(',') : value
				)
			}
			{...rest}
		>
			{children}
		</BaseAccordion.Root>
	);
};

type AccordionItemProps = Omit<
	ComponentPropsWithoutRef<typeof BaseAccordion.Item>,
	'value' | 'className'
> & {
	id: string;
	className?: string;
};

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
	({ id, children, className, ...props }, ref) => {
		return (
			<BaseAccordion.Item
				ref={ref}
				value={id}
				className={className ?? ''}
				{...props}
			>
				{children}
			</BaseAccordion.Item>
		);
	}
);

type AccordionTriggerProps = Omit<
	ComponentPropsWithoutRef<typeof BaseAccordion.Trigger>,
	'className'
> & {
	className?: string;
	iconClassName?: string;
};

export const AccordionTrigger = forwardRef<
	HTMLButtonElement,
	AccordionTriggerProps
>(({ children, className, iconClassName, ...props }, ref) => (
	<BaseAccordion.Header>
		<BaseAccordion.Trigger
			ref={ref}
			className={twMerge(
				'group flex justify-between w-full p-4 font-bold text-left text-gray-700 bg-gray-100 focus:outline-hidden focus-visible:ring-3 focus-visible:ring-purple-500 focus-visible:ring-opacity-75 hover:bg-gray-200 focus:bg-gray-200 transition-colors border-b border-white data-panel-open:bg-gray-200',
				className ?? ''
			)}
			{...props}
		>
			{children}
			<Icon
				icon="mdi:chevron-down"
				size="size-5"
				className={twMerge(
					'transition-transform transform! translate-y-1! group-data-panel-open:rotate-180!',
					iconClassName ?? ''
				)}
				aria-hidden="true"
			/>
		</BaseAccordion.Trigger>
	</BaseAccordion.Header>
));

type AccordionContentProps = Omit<
	ComponentPropsWithoutRef<typeof BaseAccordion.Panel>,
	'className'
> & {
	className?: string;
	bodyClassName?: string;
};

export const AccordionContent = forwardRef<
	HTMLDivElement,
	AccordionContentProps
>(({ children, className, bodyClassName, ...props }, ref) => (
	<BaseAccordion.Panel
		ref={ref}
		keepMounted={true}
		className={twMerge(
			'h-(--accordion-panel-height) overflow-hidden transition-[height] duration-600 ease-(--slide-timing-function) data-ending-style:h-0 data-starting-style:h-0',
			className ?? ''
		)}
		{...props}
	>
		<div
			className={twMerge(
				'px-4 py-2 border border-gray-200',
				bodyClassName ?? ''
			)}
		>
			{children}
		</div>
	</BaseAccordion.Panel>
));

type AccordionCompound = ((props: AccordionProps) => ReactElement | null) & {
	Item: typeof AccordionItem;
	Trigger: typeof AccordionTrigger;
	Content: typeof AccordionContent;
};

const AccordionCompound = Accordion as AccordionCompound;

AccordionCompound.Item = AccordionItem;
AccordionCompound.Trigger = AccordionTrigger;
AccordionCompound.Content = AccordionContent;

AccordionItem.displayName = 'AccordionItem';
AccordionTrigger.displayName = 'AccordionTrigger';
AccordionContent.displayName = 'AccordionContent';

export default AccordionCompound;
