import Layout from '~/components/layout/layout';
import PageHead from '~/components/util/page-head';
import Section from '~/components/modules/section';
import Form from '~/components/modules/form';

const ContactPage = ({ router }) => {
	return (
		<Layout>
			<PageHead
				location={router}
				title=""
			/>

			<Section className="container px-4 py-12 text-center">
				<h1 className="text-3xl">Contact page</h1>
			</Section>

			<Section className="container px-4 py-12">
				<Form />
			</Section>
		</Layout>
	);
};

export default ContactPage;
