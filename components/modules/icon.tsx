'use client';

import type { ComponentProps } from 'react';
import { Icon } from '@iconify-icon/react';
import { ReactSVG } from 'react-svg';

import { cn } from '~/lib/utils';

type IconContainedProps = {
	className?: string;
	size?: string;
	icon: string;
	iconClassName?: string;
	inline?: boolean;
} & Omit<
	ComponentProps<typeof Icon>,
	'icon' | 'inline' | 'className' | 'height' | 'width' | 'size'
>;

const IconContained = ({
	className,
	size = 'size-4',
	icon,
	iconClassName,
	inline = false,
	...iconProps
}: IconContainedProps) => {
	return (
		<span
			className={cn('inline-flex align-middle', className ?? '', size ?? '')}
		>
			<Icon
				icon={icon}
				inline={inline}
				height="100%"
				width="100%"
				className={cn(iconClassName ?? '', size ?? '')}
				{...iconProps}
			/>
		</span>
	);
};

type IconDynamicProps = {
	className?: string;
	size?: string;
	iconUrl: string;
	iconClassName?: string;
};

export const DynamicIcon = ({
	iconUrl,
	size = 'size-4',
	className,
	iconClassName,
	...rest
}: IconDynamicProps) => {
	return (
		<span
			className={cn('inline-flex align-middle', className ?? '', size ?? '')}
		>
			<ReactSVG
				src={iconUrl}
				wrapper="span"
				className={cn(
					'fill-current inline-flex align-middle [&>span]:inline-flex [&>span]:align-middle [&>span]:w-full',
					iconClassName ?? '',
					size ?? ''
				)}
				{...rest}
			/>
		</span>
	);
};

IconContained.Dynamic = DynamicIcon;

export default IconContained;
