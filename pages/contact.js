import Layout from '~/components/layout/layout';
import PageHead from '~/components/util/page-head';
import Jumbotron from '~/components/modules/jumbotron';
import Section from '~/components/modules/section';
import Form from '~/components/modules/form';

import JumbotronFpoImage from '~/images/jumbotron/fpo.png';

const ContactPage = () => {
	return (
		<Layout>
			<PageHead
				title="Contact"
			/>

			<Jumbotron
				image={
					<Jumbotron.Image
						image={JumbotronFpoImage}
						alt="FPO image"
					/>
				}
			>
				<Jumbotron.Title className="text-center">Contact</Jumbotron.Title>
			</Jumbotron>

			<Section className="container px-4 py-12">
				<Form />
			</Section>
		</Layout>
	);
};

export default ContactPage;
