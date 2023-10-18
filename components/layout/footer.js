import NavSocial from '~/components/modules/navigation/social';
import Button from '~/components/modules/button';

import site from '~/data/site.json';

const Footer = () => {
	return (
		<footer className="px-4 py-3 bg-slate-100 text-gray-700 text-center text-xs">
			<div className="container flex justify-between items-center">
				<p className="m-0">
					© {new Date().getFullYear()}. <a href={`${site.copyright.url}`} target="_blank">{site.copyright.name}</a>
				</p>

				<div className="flex items-center gap-3">
					<NavSocial />

					<Button.Scroll
						href="top"
						variant="icon"
						size="sq"
					>
						<span className="sr-only">To the top!</span>
						<Button.Icon
							icon="mdi:arrow-collapse-up"
							size="w-4 h-4"
						/>
					</Button.Scroll>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
