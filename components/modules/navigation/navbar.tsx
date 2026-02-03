'use client';

import { useState } from 'react';
import Link from 'next/link';

import NavLink from '~/components/modules/navigation/nav-link';
import { BurgerButton } from '~/components/modules/navigation/burger';

import { RouteGroups } from '~/lib/utils';
import site from '~/data/site.json';

import Horns from '~/images/inline/horns.svg';

type NavbarProps = {
	isPinned: boolean;
};

const Navbar = ({ isPinned }: NavbarProps) => {
	const [isExpanded, toggleExpansion] = useState(false);
	const navbarRoutes = RouteGroups('navbar');

	return (
		<div className="bg-background border-b border-border">
			<div className="flex flex-wrap items-center justify-between py-2 px-4 container">
				<Link href="/" className="flex gap-2 items-center">
					<Horns role="img" aria-hidden="true" className="size-6" />
					<h1 className="text-foreground font-bold text-md no-underline">
						{site.title}
					</h1>
				</Link>

				<BurgerButton
					isExpanded={isExpanded}
					toggleExpansion={toggleExpansion}
				/>

				<nav
					className={
						'md:flex md:items-center md:gap-2 w-full md:w-auto pt-2 md:pt-0' +
						(isExpanded ? ' block' : ' hidden')
					}
				>
					{navbarRoutes.map((route: { title: string; slug: string }) => (
						<NavLink.Anchor
							key={route.title}
							href={route.slug}
							className="block md:inline-block px-3.5 py-1.5 rounded-md border border-transparent text-xs text-foreground transition-colors hover:border-primary hover:text-primary focus:border-primary focus:text-primary"
							activeClassName="bg-primary text-white!"
						>
							{route.title}
						</NavLink.Anchor>
					))}
				</nav>
			</div>
		</div>
	);
};

export default Navbar;
