import Layout from '~/components/layout/layout';
import PageHead from '~/components/util/page-head';
import Jumbotron from '~/components/modules/jumbotron';
import Section from '~/components/modules/section';
import Card from '~/components/modules/card';
import Accordion from '~/components/modules/accordion';
import SlideIn from '~/components/modules/animations/slidein';
import Grid from '~/components/modules/grid';

import JumbotronFpoImage from '~/images/jumbotron/fpo.png';
import FpoImage from '~/images/fpo.png';

const AboutPage = () => {

	return (
		<Layout>
			<PageHead
				title="About"
			/>

			<Jumbotron
				image={
					<Jumbotron.Image
						image={JumbotronFpoImage}
						alt="FPO image"
					/>
				}
			>
				<Jumbotron.Title className="text-center">About</Jumbotron.Title>
			</Jumbotron>

			<Section
				id="alpha"
				className="container px-4 my-12"
			>
				<h2 className="mb-4 text-xl font-bold">Alpha</h2>
				<Grid className="mb-12">
					<SlideIn>
						<Card.Default>
							<Card.Image
								image={FpoImage}
								alt="FPO image"
							/>
							<Card.Body>
								<p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat dolor inventore deserunt, perferendis asperiores quibusdam repudiandae.</p>
							</Card.Body>
							<Card.Footer>
								<p>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</p>
							</Card.Footer>
						</Card.Default>
					</SlideIn>
					<SlideIn>
						<Card.Link href="#">
							<Card.Image
								image={FpoImage}
								alt="FPO image"
							/>
							<Card.Body>
								<p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat dolor inventore deserunt, perferendis asperiores quibusdam repudiandae.</p>
							</Card.Body>
							<Card.Footer>
								<p>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</p>
							</Card.Footer>
						</Card.Link>
					</SlideIn>
				</Grid>
			</Section>

			<Section
				id="beta"
				className="container px-4 my-12"
			>
				<h2 className="mb-4 text-xl font-bold">Beta</h2>
				<Accordion defaultValue="item-1">
					<Accordion.Item
						id="item-1"
					>
						<Accordion.Trigger>Item 1</Accordion.Trigger>
						<Accordion.Content>
							<p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat dolor inventore deserunt, perferendis asperiores quibusdam repudiandae. Fugiat voluptatem blanditiis reiciendis earum repellat, qui dolor tenetur maiores at voluptate enim modi asperiores ab corrupti explicabo recusandae ea excepturi assumenda quae iure rem similique consectetur veritatis minima. Natus.</p>
						</Accordion.Content>
					</Accordion.Item>
					<Accordion.Item
						id="item-2"
					>
						<Accordion.Trigger>Item 2</Accordion.Trigger>
						<Accordion.Content>
							<p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat dolor inventore deserunt, perferendis asperiores quibusdam repudiandae. Fugiat voluptatem blanditiis reiciendis earum repellat, qui dolor tenetur maiores at voluptate enim modi asperiores ab corrupti explicabo recusandae ea excepturi assumenda quae iure rem similique consectetur veritatis minima. Natus.</p>
						</Accordion.Content>
					</Accordion.Item>
					<Accordion.Item
						id="item-3"
					>
						<Accordion.Trigger>Item 3</Accordion.Trigger>
						<Accordion.Content>
							<p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat dolor inventore deserunt, perferendis asperiores quibusdam repudiandae. Fugiat voluptatem blanditiis reiciendis earum repellat, qui dolor tenetur maiores at voluptate enim modi asperiores ab corrupti explicabo recusandae ea excepturi assumenda quae iure rem similique consectetur veritatis minima. Natus.</p>
						</Accordion.Content>
					</Accordion.Item>
				</Accordion>
			</Section>

			<Section
				id="charlie"
				className="container px-4 my-12"
			>
				<h2 className="mb-4 text-xl font-bold">Charlie</h2>
				<p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat dolor inventore deserunt, perferendis asperiores quibusdam repudiandae. Fugiat voluptatem blanditiis reiciendis earum repellat, qui dolor tenetur maiores at voluptate enim modi asperiores ab corrupti explicabo recusandae ea excepturi assumenda quae iure rem similique consectetur veritatis minima. Natus. Ipsa aliquam sapiente expedita quidem vitae sit architecto eveniet est id quaerat saepe modi unde esse sequi sint dolorem adipisci in eos, ducimus reprehenderit ea, iusto molestiae rem. Ad, ipsam. A quisquam ex dolor pariatur debitis sequi veritatis rem delectus facere totam, incidunt quibusdam fugiat provident repudiandae laborum mollitia dolorum odit? Molestiae alias, temporibus culpa fugiat libero incidunt perspiciatis voluptas. Quia, necessitatibus! Ipsam accusamus atque ipsum nisi dolor repudiandae officiis, cum accusantium iure inventore facilis magni debitis itaque blanditiis, placeat eum? Cupiditate error obcaecati soluta consectetur, in officiis quaerat aliquid! Rerum ut odio dolore excepturi ipsam ducimus sapiente quas consequuntur porro iure optio laborum, voluptas doloribus id rem tenetur eligendi delectus corporis aspernatur amet necessitatibus! Numquam officia sunt maxime nihil? Iure, asperiores beatae amet odit, autem, quidem id officia maxime debitis rerum unde distinctio. Ipsa, dolore quidem quibusdam nihil repellendus sapiente recusandae corrupti deserunt dolor ad a officia quis odio. Rem, natus sapiente! Modi enim quidem consequatur, nobis facere eligendi similique vero rerum praesentium fuga nesciunt, nihil velit. Repudiandae atque illo repellendus sunt nostrum nobis rerum soluta eos praesentium! Autem! Unde odio vero, nesciunt voluptas eius sit. Quia, ex earum beatae mollitia ipsum at, aliquam officiis cum minus molestiae error quos voluptatibus. Ipsam quod rem fugiat, voluptatum voluptas quasi non!  Recusandae ea excepturi dignissimos vel nisi voluptatum inventore sapiente est facilis, at modi provident, eius eligendi placeat error architecto odio? Explicabo soluta, culpa qui blanditiis alias officiis dolore eaque expedita?</p>
			</Section>
		</Layout>
	);
};

export default AboutPage;
