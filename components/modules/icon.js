import { Icon } from '@iconify-icon/react';
import { twMerge } from 'tailwind-merge';

const IconContained = ({
	className,
	size,
	icon,
	iconClassName,
	inline = false,
	...iconProps
}) => {
	return (
		<span
			className={twMerge`
				inline-flex align-middle
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
					${iconClassName ?? ''}
					${size ?? ''}
				`}
				{...iconProps}
			/>
		</span>
	);
};

export default IconContained;
