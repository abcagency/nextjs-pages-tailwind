'use client';

import { useState } from 'react';
import Link from 'next/link';

import NavLink from '~/components/modules/navigation/nav-link';
import Icon from '~/components/modules/icon';

import routes from '~/data/routes.json';
import site from '~/data/site.json';

const Navbar = ({ isPinned }) => {
	const [isExpanded, toggleExpansion] = useState(false);

	return (
		<div
			className={`
				px-4 transition-all bg-white/20 border-b border-gray-400/20 backdrop-blur
				${isPinned ? 'mb:bg-transparent md:border-0 md:backdrop-blur-[unset]' : ''}
			`}
		>
			<div
				className={`
					flex flex-wrap items-center justify-between py-2 px-6 container transition-all
					${isPinned ? 'md:translate-y-2 md:bg-white/20 md:border md:border-gray-400/20 md:!backdrop-blur md:rounded-full' : ''}
				`}
			>
				<Link
					href="/"
					className="flex gap-2 items-center"
				>
					<Icon
						icon="mdi:robot"
						sizeClasses="w-6 h-6"
					/>
					<h1 className="text-gray-800 font-bold text-md no-underline">
						{site.title}
					</h1>
				</Link>

				<button
					className={`
						block md:hidden px-3 py-2 transition-colors hover:text-indigo-700 focus:text-indigo-700
						${isExpanded ? 'text-indigo-700' : 'text-gray-800'}
					`}
					onClick={() => toggleExpansion(!isExpanded)}
				>
					<svg
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
						className={`
							block w-5 h-5 fill-current transition-transform
							${isExpanded ? `transform-gpu rotate-180` : ``}
						`}
					>
						<title>Menu</title>
						<rect
							y="3"
							width="20"
							height="2"
							className={`
								transition
								${isExpanded ? `transform-gpu rotate-45 translate-y-[0] translate-x-[6px]` : ``}
							`}
						/>
						<rect
							y="9"
							width="20"
							height="2"
							className={`
								transition
								${isExpanded ? `opacity-0` : ``}
							`}
						/>
						<rect
							y="15"
							width="20"
							height="2"
							className={`
								transition
								${isExpanded ? `transform-gpu -rotate-45 translate-y-[6px] translate-x-[-8px]` : ``}
							`}
						/>
					</svg>
				</button>

				<nav
					className={`
						md:flex md:items-center md:gap-2 w-full md:w-auto pt-2 md:pt-0
						${isExpanded ? 'block' : 'hidden'}
					`}
				>
					{routes.map(link => (
						<NavLink.Anchor
							key={link.title}
							href={link.route}
							className="block md:inline-block px-3.5 py-1.5 rounded-full border border-transparent text-xs text-gray-800 transition-colors hover:border-indigo-700 hover:text-indigo-700 focus:border-indigo-700  focus:text-indigo-700"
							activeClassName="bg-indigo-700 !text-white"
						>
							{link.title}
						</NavLink.Anchor>
					))}
				</nav>
			</div>
		</div>
	);
};

export default Navbar;
