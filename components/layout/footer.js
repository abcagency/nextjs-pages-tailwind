import NavSocial from '~/components/modules/navigation/social';
import Icon from '~/components/modules/icon';

import site from '~/data/site.json';

const Footer = () => {
	return (
		<footer className="px-4 py-1 bg-slate-100 text-gray-700 text-center text-xs">
			<div className="container flex justify-between items-center">
				<p className="m-0">
					© {new Date().getFullYear()}. <a href={`${site.copyright.url}`} target="_blank">{site.copyright.name}</a>
				</p>

				<div className="flex">
					<NavSocial />

					<a
						href="#top"
						className="px-4 py-5 transition-colors hover:text-gray-900 focus:text-gray-900"
					>
						<span className="sr-only">To the top!</span>
						<Icon
							icon="mdi:arrow-collapse-up"
							sizeClasses="w-4 h-4"
						/>
					</a>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
