import Link from 'next/link';

import Layout from '~/components/layout/layout';
import PageHead from '~/components/util/page-head';
import Icon from '~/components/modules/icon';

import Abduction from '~/images/abduction-illustration.svg';

const NotFoundPage = ({ router }) => {
	return (
		<Layout>
			<PageHead
				location={router}
				title="404: Not found"
			/>

			<Abduction
				className="block mx-auto w-1/2"
				aria-hidden="true"
				role="img"
			/>

			<div className="bg-pink-200 text-center px-3 py-5">
				<div className="container">
					<h2 className="text-gray-800 text-xl font-bold">Looks like this page is a ghost that got abducted <span className="whitespace-nowrap">by aliens...</span></h2>

					<Link
						href="/"
						className="group inline-flex items-center gap-2 mt-8 px-8 py-3 text-lg rounded-lg border-2 border-gray-900 font-bold text-gray-900 no-underline transition-colors hover:bg-pink-500 hover:border-pink-500 hover:text-white focus:bg-pink-500 focus:border-pink-500 focus:text-white"
					>
						<Icon
							icon="mdi:home"
							sizeClasses="w-6 h-6"
							className="inline-block"
						/>
						Head home
					</Link>
				</div>
				<i className="absolute top-0 left-1/2 -translate-x-1/2 rounded-[100px_/_50px] h-12 w-1/2 bg-pink-200/40 blur-2xl" />
			</div>
		</Layout>
	);
};

export default NotFoundPage;
