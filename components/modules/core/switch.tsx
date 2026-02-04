'use client';

import * as React from 'react';
import { Switch as SwitchPrimitive } from '@base-ui/react/switch';

import { cn } from '~/lib/utils';

const Switch = React.forwardRef<HTMLElement, SwitchPrimitive.Root.Props>(
	({ className, ...props }, ref) => {
		return (
			<SwitchPrimitive.Root
				ref={ref}
				data-slot="switch"
				className={cn(
					'focus-visible:ring-ring/50 focus-visible:border-ring data-checked:bg-primary data-unchecked:bg-muted inline-flex h-6 w-10 shrink-0 items-center rounded-full border border-transparent p-0.5 transition-colors outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
					className
				)}
				{...props}
			/>
		);
	}
);

Switch.displayName = 'Switch';

function SwitchThumb({ className, ...props }: SwitchPrimitive.Thumb.Props) {
	return (
		<SwitchPrimitive.Thumb
			data-slot="switch-thumb"
			className={cn(
				'bg-background data-checked:translate-x-4 data-unchecked:translate-x-0 block size-5 rounded-full shadow-sm transition-transform',
				className
			)}
			{...props}
		/>
	);
}

export { Switch, SwitchThumb };
