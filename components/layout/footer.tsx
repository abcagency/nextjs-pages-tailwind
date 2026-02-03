import Link from 'next/link';

import NavSocial from '~/components/modules/navigation/social';
import Icon from '~/components/modules/icon';
import { Button } from '~/components/modules/core/button';

import site from '~/data/site.json';

type CopyrightData = {
	name: string;
	url: string;
};

const Footer = () => {
	const copyright = site.copyright as CopyrightData;

	return (
		<footer className="px-4 py-3 bg-slate-100 text-gray-700 text-center text-xs">
			<div className="container flex justify-between items-center">
				<p className="m-0">
					© {new Date().getFullYear()}.{' '}
					<a href={copyright.url} target="_blank" rel="noreferrer">
						{copyright.name}
					</a>
				</p>

				<div className="flex items-center gap-3">
					<NavSocial />

					<Button
						variant="ghost"
						size="icon"
						render={
							<Link href="#top" aria-label="To the top!">
								<Icon icon="mdi:arrow-collapse-up" />
							</Link>
						}
					/>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
