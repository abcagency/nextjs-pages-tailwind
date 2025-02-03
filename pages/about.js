import Layout from '~/components/layout/layout';
import PageHead from '~/components/util/page-head';
import Jumbotron from '~/components/modules/jumbotron';
import Section from '~/components/modules/section';
import Card from '~/components/modules/card';
import Accordion from '~/components/modules/accordion';
import SlideIn from '~/components/modules/animations/slidein';
import Grid from '~/components/modules/grid';
import Button from '~/components/modules/button';
import VideoPlayer from '~/components/modules/video-player';

import JumbotronFpoImage from '~/images/jumbotron/fpo.png';
import FpoImage from '~/images/fpo.png';

const AboutPage = () => {
	return (
		<Layout>
			<PageHead title="About" />

			<Jumbotron>
				<Jumbotron.Body>
					<Jumbotron.Title className="text-center">About</Jumbotron.Title>
				</Jumbotron.Body>

				<Jumbotron.Image image={JumbotronFpoImage} alt="FPO image" />
			</Jumbotron>

			<Section id="accordion">
				<Section.Title>Accordion</Section.Title>
				<Accordion defaultValue="item-1">
					<Accordion.Item id="item-1">
						<Accordion.Trigger>Item 1</Accordion.Trigger>
						<Accordion.Content>
							<p>
								Lorem ipsum, dolor sit amet consectetur adipisicing elit.
								Placeat dolor inventore deserunt, perferendis asperiores
								quibusdam repudiandae. Fugiat voluptatem blanditiis reiciendis
								earum repellat, qui dolor tenetur maiores at voluptate enim modi
								asperiores ab corrupti explicabo recusandae ea excepturi
								assumenda quae iure rem similique consectetur veritatis minima.
								Natus.
							</p>
						</Accordion.Content>
					</Accordion.Item>
					<Accordion.Item id="item-2">
						<Accordion.Trigger>Item 2</Accordion.Trigger>
						<Accordion.Content>
							<p>
								Lorem ipsum, dolor sit amet consectetur adipisicing elit.
								Placeat dolor inventore deserunt, perferendis asperiores
								quibusdam repudiandae. Fugiat voluptatem blanditiis reiciendis
								earum repellat, qui dolor tenetur maiores at voluptate enim modi
								asperiores ab corrupti explicabo recusandae ea excepturi
								assumenda quae iure rem similique consectetur veritatis minima.
								Natus.
							</p>
						</Accordion.Content>
					</Accordion.Item>
					<Accordion.Item id="item-3">
						<Accordion.Trigger>Item 3</Accordion.Trigger>
						<Accordion.Content>
							<p>
								Lorem ipsum, dolor sit amet consectetur adipisicing elit.
								Placeat dolor inventore deserunt, perferendis asperiores
								quibusdam repudiandae. Fugiat voluptatem blanditiis reiciendis
								earum repellat, qui dolor tenetur maiores at voluptate enim modi
								asperiores ab corrupti explicabo recusandae ea excepturi
								assumenda quae iure rem similique consectetur veritatis minima.
								Natus.
							</p>
						</Accordion.Content>
					</Accordion.Item>
				</Accordion>
			</Section>

			<Section id="button">
				<Section.Title>Button</Section.Title>
				<nav className="flex flex-wrap gap-4 items-start">
					<Button.Btn>Default/Primary</Button.Btn>
					<Button.Btn variant="primary" size="lg">
						Large
					</Button.Btn>
					<Button.Btn variant="secondary" size="sm">
						Secondary/Sm
					</Button.Btn>
					<Button.Btn size="xs">XSmall</Button.Btn>
					<Button.Btn variant="icon" size="sq">
						<Button.Body>
							<span className="sr-only">Instagram</span>
							<Button.Icon icon="fa-brands:instagram" />
						</Button.Body>
					</Button.Btn>
					<Button.Btn isBlock>Block</Button.Btn>
				</nav>
			</Section>

			<Section id="card">
				<Section.Title>Card</Section.Title>
				<Grid className="mb-12">
					<SlideIn>
						<Card.Default>
							<Card.Image image={FpoImage} alt="FPO image" />
							<Card.Body>
								<p>
									Lorem ipsum, dolor sit amet consectetur adipisicing elit.
									Placeat dolor inventore deserunt, perferendis asperiores
									quibusdam repudiandae.
								</p>
							</Card.Body>
							<Card.Footer>
								<p>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</p>
							</Card.Footer>
						</Card.Default>
					</SlideIn>
					<SlideIn>
						<Card.Link href="#">
							<Card.Image image={FpoImage} alt="FPO image" />
							<Card.Body>
								<p>
									Lorem ipsum, dolor sit amet consectetur adipisicing elit.
									Placeat dolor inventore deserunt, perferendis asperiores
									quibusdam repudiandae.
								</p>
							</Card.Body>
							<Card.Footer>
								<p>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</p>
							</Card.Footer>
						</Card.Link>
					</SlideIn>
				</Grid>
			</Section>

			<Section id="video-player" variant="primary">
				<Section.Container>
					<Section.Title>Video Player</Section.Title>
					<VideoPlayer
						title="Sample video"
						url="https://cdn.flowplayer.com/token:eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhNzVkODliYi0wMzRlLTQxODAtYTY1NC0yN2NlYWIzOWFiOTciLCJuYmYiOjE3MzgyNDYwMDAsImlzcyI6Imh0dHBzOi8vd3d3LmZsb3dwbGF5ZXIuY29tIiwiZXhwIjoxNzM4MzMyNDAwLCJpYXQiOjE3MzgyNDYwMDB9.XIkI9P_cCY3ySvP0FAr7lALIwktPt5SaZIbH71TRhJmyEUvmx3tEfrKB7ZksTSHN2W-NHf3qJC-jFwBWvQgh1ZMBlhnNN70wqxeArwh05TmlKhVI9airdEmBzeiLu32WqTfP-uakay5GXsUZmgS9JzvktrCz1eNBnC-JGLK5791WXGwV64_Z1hSGsHYm3rEIa98rC58jh_784-H0eDAzxT4HZ9v4T_h9I80ty19dVFY9zJK7GNnOvSztz0AvAuvDB2ZWDjjyFyLXd8XUmZMh7b7SBvk2RK1qA_m00QRlHcrbTWByWki6xqnnNPXfW1kgmFVBNmZtUthOmg6pkAvejGGUp2-xKKbglpjQxiefEv9-4yoaA22mldDYHfzvJPFwTL2nVDzzro1jiNSp9yR_InuyRUuOx5NTz2nkq8Sx0XZYtoE4ihse7Tgv4C4_eoziVTDY7gHuFhd5HLMKTJgU6FKKT_evp0U5BPg-G2wD_SvmWk8u35K-Y7xiQSa1dNI7Eo_t_K-0S5JMuGRiWC33LhgGH8xMcyuBATpVbvGfPKhO3mDbqAKYAxacy3L9WbHMIB2yTLs4pVH4wee78CxOvyJdOW9OwwqWNuVE6ahi06bCJAQJN7o2NABdDT4ZxlPlc1tkZk12skK4xHFMh-DgRUKKVM2DHcdX9x0o0eKnjvk/demo_videos/crashing_waves/hls/playlist.m3u8"
						placeholder="https://cdn.flowplayer.com/demo_videos/crashing_waves/1.jpg"
						controls={true}
					/>
				</Section.Container>
			</Section>
		</Layout>
	);
};

export default AboutPage;
