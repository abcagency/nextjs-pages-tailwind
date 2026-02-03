'use client';

import * as React from 'react';
import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';

import { cn } from '~/lib/utils';

const Toggle = React.forwardRef<HTMLButtonElement, TogglePrimitive.Props>(
	({ className, ...props }, ref) => {
		return (
			<TogglePrimitive
				ref={ref}
				data-slot="toggle"
				className={cn(
					'focus-visible:ring-ring/50 focus-visible:border-ring data-pressed:bg-primary data-pressed:text-primary-foreground hover:bg-muted text-muted-foreground inline-flex items-center justify-center rounded-md border border-transparent px-3 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50',
					className
				)}
				{...props}
			/>
		);
	}
);

Toggle.displayName = 'Toggle';

export { Toggle };
