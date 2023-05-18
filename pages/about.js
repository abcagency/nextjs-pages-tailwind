import Layout from '~/components/layout/layout';
import PageHead from '~/components/util/page-head';

const AboutPage = ({ router }) => {
	return (
		<Layout>
			<PageHead
				location={router}
				title=""
			/>

			<section className="container px-4 py-12 text-center">
				<h1 className="text-3xl">About page</h1>
			</section>
		</Layout>
	);
};

export default AboutPage;
