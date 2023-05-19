import Layout from '~/components/layout/layout';
import PageHead from '~/components/util/page-head';
import Section from '~/components/modules/section';
import Card from '~/components/modules/card';
import Accordion from '~/components/modules/accordion';

import FpoImage from '~/images/fpo.png';

const AboutPage = ({ router }) => {
	return (
		<Layout>
			<PageHead
				location={router}
				title=""
			/>

			<Section
				id="intro"
				className="container px-4 py-12 text-center"
			>
				<h1 className="text-3xl">About page</h1>
			</Section>

			<Section
				id="alpha"
				className="container px-4 my-12"
			>
				<h2 className="mb-4 text-xl font-bold">Alpha</h2>

				<div className="md:grid md:grid-cols-2 md:gap-4 mb-12">
					{["1", "2"].map(item => (
						<Card
							key={item}
							image={
								<Card.Image
									image={FpoImage}
									alt="FPO image"
								/>
							}
							body={
								<Card.Body>
									<p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat dolor inventore deserunt, perferendis asperiores quibusdam repudiandae.</p>
								</Card.Body>
							}
							footer={
								<Card.Footer>
									<p>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</p>
								</Card.Footer>
							}
						/>
					))}
				</div>
			</Section>

			<Section
				id="beta"
				className="container px-4 my-12"
			>
				<h2 className="mb-4 text-xl font-bold">Beta</h2>
				<Accordion defaultValue="item-1">
					<Accordion.Item
						id="item-1"
						trigger={<Accordion.Trigger>Item 1</Accordion.Trigger>}
					>
						<p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat dolor inventore deserunt, perferendis asperiores quibusdam repudiandae. Fugiat voluptatem blanditiis reiciendis earum repellat, qui dolor tenetur maiores at voluptate enim modi asperiores ab corrupti explicabo recusandae ea excepturi assumenda quae iure rem similique consectetur veritatis minima. Natus.</p>
					</Accordion.Item>
					<Accordion.Item
						id="item-2"
						trigger={<Accordion.Trigger>Item 2</Accordion.Trigger>}
					>
						<p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat dolor inventore deserunt, perferendis asperiores quibusdam repudiandae. Fugiat voluptatem blanditiis reiciendis earum repellat, qui dolor tenetur maiores at voluptate enim modi asperiores ab corrupti explicabo recusandae ea excepturi assumenda quae iure rem similique consectetur veritatis minima. Natus.</p>
					</Accordion.Item>
					<Accordion.Item
						id="item-3"
						trigger={<Accordion.Trigger>Item 3</Accordion.Trigger>}
					>
						<p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat dolor inventore deserunt, perferendis asperiores quibusdam repudiandae. Fugiat voluptatem blanditiis reiciendis earum repellat, qui dolor tenetur maiores at voluptate enim modi asperiores ab corrupti explicabo recusandae ea excepturi assumenda quae iure rem similique consectetur veritatis minima. Natus.</p>
					</Accordion.Item>
				</Accordion>
			</Section>
		</Layout>
	);
};

export default AboutPage;
