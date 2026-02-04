'use client';

import * as React from 'react';
import { Tabs as TabsPrimitive } from '@base-ui/react/tabs';

import { cn } from '~/lib/utils';

function Tabs({ className, ...props }: TabsPrimitive.Root.Props) {
	return (
		<TabsPrimitive.Root
			data-slot="tabs"
			className={cn('flex w-full flex-col gap-4', className)}
			{...props}
		/>
	);
}

function TabsList({ className, ...props }: TabsPrimitive.List.Props) {
	return (
		<TabsPrimitive.List
			data-slot="tabs-list"
			className={cn(
				'bg-muted text-muted-foreground inline-flex w-full flex-wrap items-center gap-1 rounded-lg p-1',
				className
			)}
			{...props}
		/>
	);
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
	return (
		<TabsPrimitive.Tab
			data-slot="tabs-trigger"
			className={cn(
				'focus-visible:ring-ring/50 focus-visible:border-ring data-selected:bg-background data-selected:text-foreground flex-1 rounded-md border border-transparent px-3 py-2 text-sm font-medium transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50',
				className
			)}
			{...props}
		/>
	);
}

function TabsIndicator({ className, ...props }: TabsPrimitive.Indicator.Props) {
	return (
		<TabsPrimitive.Indicator
			data-slot="tabs-indicator"
			className={cn('bg-foreground/10 rounded-md', className)}
			{...props}
		/>
	);
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
	return (
		<TabsPrimitive.Panel
			data-slot="tabs-content"
			className={cn('outline-none', className)}
			{...props}
		/>
	);
}

export { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger };
