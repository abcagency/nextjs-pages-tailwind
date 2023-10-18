import Button from '~/components/modules/button';

import site from '~/data/site.json';

const NavSocial = () => {
	const socials = site.social;

	return (
		<nav className="flex justify-self-end gap-3">
			{socials.map((data, index) => (
				<Button.Anchor
					key={`${index}`}
					href={data.url}
					variant="icon"
					size="sq"
				>
					<span className="sr-only">{data.label}</span>

					<Button.Icon
						icon={data.icon}
						size="w-4 h-4"
					/>
				</Button.Anchor>
			))}
		</nav>
	);
};

export default NavSocial;
