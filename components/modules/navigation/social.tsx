import { Button } from '~/components/modules/core/button';
import Icon from '~/components/modules/icon';

import site from '~/data/site.json';

type SocialLink = {
	platform: string;
	url: string;
	label: string;
	icon: string;
};

const NavSocial = () => {
	const socials = site.social as SocialLink[];

	return (
		<nav className="flex justify-self-end gap-3">
			{socials.map(social => (
				<Button
					key={social.platform}
					variant="ghost"
					size="icon"
					render={
						<a href={social.url} rel="noreferrer">
							<span className="sr-only">{social.label}</span>
							<Icon icon={social.icon} />
						</a>
					}
				/>
			))}
		</nav>
	);
};

export default NavSocial;
