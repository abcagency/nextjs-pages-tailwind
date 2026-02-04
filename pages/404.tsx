import Link from 'next/link';

import Layout from '~/components/layout/layout';
import PageHead from '~/components/util/page-head';
import { Button } from '~/components/modules/core/button';

import { RouteGroups } from '~/lib/utils';

const NotFoundPage = () => {
	const errorRoutes = RouteGroups('error');

	return (
		<Layout>
			<PageHead title="404: Not found" />

			<section className="relative min-h-[50vh] md:min-h-[70vh] pt-[10vh] pb-12 overflow-clip bg-muted">
				<div className="relative z-10 container px-4 text-center">
					<h1 className="text-[clamp(3.34rem,25vw,23rem)] leading-tight font-extrabold text-pretty uppercase text-primary/30">
						Oops
					</h1>
					<p className="mb-8 text-lg md:text-xl lg:text-2xl font-bold text-pretty">
						This page could not be found
					</p>

					<nav className="max-w-xl mx-auto flex flex-wrap justify-center gap-4 font-semibold">
						<Button
							variant="link"
							hasUnderline
							nativeButton={false}
							render={<Link href="/">Home</Link>}
						/>
						{errorRoutes.map(route => (
							<Button
								key={route.slug}
								variant="link"
								hasUnderline
								nativeButton={false}
								render={<Link href={route.slug}>{route.title}</Link>}
							/>
						))}
					</nav>
				</div>
			</section>
		</Layout>
	);
};

export default NotFoundPage;
