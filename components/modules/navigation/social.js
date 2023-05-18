import Icon from '~/components/modules/icon';

import site from '~/data/site.json';

const NavSocial = () => {
	const socials = site.social;

	return (
		<nav className="flex justify-self-end">
			{socials.map((data, index) => (
				<a
					key={`${index}`}
					href={data.url}
					target="_blank"
					className="px-4 py-5 transition-colors hover:text-gray-900 focus:text-gray-900"
				>
					<span className="sr-only">{data.label}</span>

					<Icon
						icon={data.icon}
						sizeClasses="w-4 h-4"
					/>
				</a>
			))}
		</nav>
	);
};

export default NavSocial;
