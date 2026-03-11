import type {
	ComponentProps,
	ComponentPropsWithoutRef,
	ElementType,
	ReactNode
} from 'react';
import type { Variants } from 'motion/react';
import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

import { cn } from '~/lib/utils';

import Grid from '~/components/modules/grid';
import Icon from '~/components/modules/icon';

import { useScrollDirection } from '~/hooks/useScrollDirection';

const itemVariants: Variants = {
	hidden: {
		opacity: 0,
		y: 20
	},
	show: {
		opacity: 1,
		y: 0,
		transition: {
			type: 'spring',
			damping: 30,
			stiffness: 80
		}
	}
};

type ListProps = {
	as?: ElementType;
	children?: ReactNode;
	containerClassName?: string;
	icon?: string;
	iconSize?: string;
	iconClassName?: string;
	items?: Array<string | { title: string; content?: string; icon?: string }>;
} & Omit<ComponentPropsWithoutRef<'ul'>, 'className'> & {
		className?: string;
	};

const List = ({
	as = 'ul',
	className,
	containerClassName,
	icon,
	items,
	iconSize,
	iconClassName,
	children
}: ListProps) => {
	const Container = as;

	return (
		<ListContainer className={containerClassName ?? ''}>
			<Container className={cn('space-y-4', className)}>
				{items && items.length > 0 && (
					<ListItems
						items={items}
						icon={icon}
						iconSize={iconSize}
						iconClassName={iconClassName}
					/>
				)}
				{children}
			</Container>
		</ListContainer>
	);
};

type ListGridProps = {
	as?: ElementType;
	columns?: string;
	gap?: string;
	children?: ReactNode;
	containerClassName?: string;
	icon?: string;
	iconSize?: string;
	iconClassName?: string;
	items?: Array<string | { title: string; content?: string; icon?: string }>;
} & Omit<ComponentPropsWithoutRef<'ul'>, 'className'> & {
		className?: string;
	};

const ListGrid = ({
	as = 'ul',
	columns = 'md:grid-cols-2',
	gap = 'gap-x-12 md:gap-x-16 gap-y-8',
	containerClassName,
	className,
	items,
	icon,
	iconSize,
	iconClassName,
	children
}: ListGridProps) => {
	const Container = as;

	return (
		<ListContainer className={containerClassName ?? ''}>
			<Grid as={as} columns={columns} gap={gap} className={className ?? ''}>
				{items && items.length > 0 && (
					<ListItems
						items={items}
						icon={icon}
						iconSize={iconSize}
						iconClassName={iconClassName}
					/>
				)}
				{children}
			</Grid>
		</ListContainer>
	);
};

type ListContainer = {
	children?: ReactNode;
} & Omit<ComponentProps<typeof motion.div>, 'className'> & {
		className?: string;
	};

export const ListContainer = ({
	children,
	className,
	...props
}: ListContainer) => {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: false });
	const scrollDirection = useScrollDirection();

	const containerVariants = {
		show: {
			transition: {
				staggerChildren: 0.03,
				staggerDirection: scrollDirection === 'up' ? -1 : 1
			}
		}
	};

	return (
		<motion.div
			ref={ref}
			variants={containerVariants}
			initial="hidden"
			animate={isInView ? 'show' : 'hidden'}
			className={className ?? ''}
			{...props}
		>
			{children}
		</motion.div>
	);
};

type ListItemsProps = {
	icon?: string;
	iconSize?: string;
	iconClassName?: string;
	items?: Array<string | { title: string; content?: string; icon?: string }>;
} & Omit<ComponentProps<typeof motion.li>, 'className'> & {
		className?: string;
	};

export const ListItems = ({
	items,
	icon,
	iconSize,
	iconClassName
}: ListItemsProps) => {
	return (items ?? []).map(item => {
		const listData = (
			data: string | { title: string; content?: string; icon?: string }
		) => {
			if (typeof data === 'object') {
				return data.content || data.title;
			} else {
				return data;
			}
		};

		return (
			<motion.li
				key={listData(item)}
				variants={itemVariants}
				className="flex items-start gap-2"
			>
				<Icon
					icon={
						icon
							? icon
							: typeof item === 'object' && item.icon
								? item.icon
								: 'material-symbols:chevron-right'
					}
					size={iconSize ? iconSize : 'size-4'}
					className={cn('mt-1 text-blue-500', iconClassName)}
				/>
				<p className="self-center text-pretty">{listData(item)}</p>
			</motion.li>
		);
	});
};

type ListItemProps = {
	contentClassName?: string;
	showIcon?: boolean;
	icon?: string;
	iconUrl?: string;
	iconSize?: string;
	iconClassName?: string;
	items?: Array<string | { title: string; content?: string; icon?: string }>;
	children?: ReactNode;
} & Omit<ComponentProps<typeof motion.li>, 'className' | 'children'> & {
		className?: string;
	};

export const ListItem = ({
	className,
	contentClassName,
	children,
	showIcon = true,
	icon,
	iconUrl,
	iconSize,
	iconClassName,
	...rest
}: ListItemProps) => {
	return (
		<motion.li
			variants={itemVariants}
			className={cn('flex items-start gap-2', className)}
			{...rest}
		>
			{showIcon ? (
				<>
					{iconUrl ? (
						<Icon.Dynamic
							iconUrl={iconUrl}
							size={iconSize ? iconSize : 'size-4'}
							className={cn('mt-1 text-blue-500', iconClassName ?? '')}
						/>
					) : (
						<Icon
							icon={icon ? icon : 'material-symbols:chevron-right'}
							size={iconSize ? iconSize : 'size-4'}
							className={cn('mt-1 text-blue-500', iconClassName ?? '')}
						/>
					)}
					<div
						className={cn(
							`w-full text-pretty *:text-pretty`,
							contentClassName ?? ''
						)}
					>
						{children}
					</div>
				</>
			) : (
				<div
					className={cn(
						`w-full text-pretty *:text-pretty`,
						contentClassName ?? ''
					)}
				>
					{children}
				</div>
			)}
		</motion.li>
	);
};

List.Grid = ListGrid;
List.Items = ListItems;
List.Item = ListItem;

export default List;
