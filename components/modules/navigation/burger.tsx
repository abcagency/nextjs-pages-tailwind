import { Button } from '~/components/modules/core/button';

import { cn } from '~/lib/utils';

type BurgerButtonProps = React.ComponentProps<typeof Button> & {
	isExpanded: boolean;
	toggleExpansion: (expanded: boolean) => void;
};

function BurgerButton({
	className,
	isExpanded,
	toggleExpansion,
	...props
}: BurgerButtonProps) {
	return (
		<Button
			className={cn(
				'block md:hidden px-3 py-2 transition-colors hover:text-primary focus:text-primary',
				isExpanded ? 'text-primary' : 'text-foreground',
				className
			)}
			variant="none"
			size="none"
			aria-label="Toggle navigation"
			aria-expanded={isExpanded}
			onClick={() => toggleExpansion(!isExpanded)}
			{...props}
		>
			<svg
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
				className={cn(
					'block w-5 h-5 fill-current transition-transform',
					isExpanded ? 'transform-gpu rotate-180' : ''
				)}
			>
				<title>Menu</title>
				<rect
					y="3"
					width="20"
					height="2"
					className={cn(
						'transition',
						isExpanded
							? 'transform-gpu rotate-45 translate-y-0 translate-x-[6px]'
							: ''
					)}
				/>
				<rect
					y="9"
					width="20"
					height="2"
					className={cn('transition', isExpanded ? 'opacity-0' : '')}
				/>
				<rect
					y="15"
					width="20"
					height="2"
					className={cn(
						'transition',
						isExpanded
							? 'transform-gpu -rotate-45 translate-y-[6px] translate-x-[-8px]'
							: ''
					)}
				/>
			</svg>
		</Button>
	);
}

export { BurgerButton };
