import { Icon } from '@iconify-icon/react';
import { twMerge } from 'tailwind-merge';

const IconContained = ({
	className,
	size = 'size-4',
	icon,
	iconClassName,
	inline = false,
	...iconProps
}) => {
	return (
		<span
			className={twMerge`
				icon-container
				${className ?? ''}
				${size ?? ''}
			`}
		>
			<Icon
				icon={icon}
				inline={inline}
				height="100%"
				width="100%"
				className={`
					icon
					${iconClassName ?? ''}
					${size ?? ''}
				`}
				{...iconProps}
			/>
		</span>
	);
};

export default IconContained;
