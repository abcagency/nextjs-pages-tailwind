import Layout from '~/components/layout/layout';
import PageHead from '~/components/util/page-head';
import Form from '~/components/modules/form';

const ContactPage = ({ router }) => {
	return (
		<Layout>
			<PageHead
				location={router}
				title=""
			/>

			<section className="container px-4 py-12 text-center">
				<h1 className="text-3xl">Contact page</h1>
			</section>

			<section className="container px-4 py-12">
				<Form />
			</section>
		</Layout>
	);
};

export default ContactPage;
