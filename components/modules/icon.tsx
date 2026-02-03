import type { ComponentProps } from 'react';
import { Icon } from '@iconify-icon/react';
import { twMerge } from 'tailwind-merge';

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
			className={twMerge(
				'inline-flex align-middle',
				className ?? '',
				size ?? ''
			)}
		>
			<Icon
				icon={icon}
				inline={inline}
				height="100%"
				width="100%"
				className={twMerge(iconClassName ?? '', size ?? '')}
				{...iconProps}
			/>
		</span>
	);
};

export default IconContained;
