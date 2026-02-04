'use client';

import * as React from 'react';

import { cn } from '~/lib/utils';

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg';

type SpinnerProps = React.ComponentProps<'svg'> & {
	size?: SpinnerSize;
};

const sizeClasses: Record<SpinnerSize, string> = {
	xs: 'size-3',
	sm: 'size-4',
	md: 'size-5',
	lg: 'size-6'
};

function Spinner({ className, size = 'md', ...props }: SpinnerProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			aria-hidden="true"
			className={cn(
				'motion-safe:animate-spin motion-reduce:animate-none text-current',
				sizeClasses[size],
				className
			)}
			{...props}
		>
			<circle
				className="opacity-20"
				cx="12"
				cy="12"
				r="10"
				stroke="currentColor"
				strokeWidth="4"
				fill="none"
			/>
			<path
				className="opacity-80"
				fill="currentColor"
				d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
			/>
		</svg>
	);
}

export { Spinner };
