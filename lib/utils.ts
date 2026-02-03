import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import routes from '~/data/routes';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function RouteGroups(group: string) {
	return routes.children.reduce(
		(nav: any[], link: { useIn: string | string[] }) =>
			link.useIn?.includes(group) ? (nav.push(link), nav) : nav,
		[]
	);
}
