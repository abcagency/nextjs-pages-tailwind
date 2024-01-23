import Layout from '~/components/layout/layout';
import PageHead from '~/components/util/page-head';
import Jumbotron from '~/components/modules/jumbotron';
import Section from '~/components/modules/section';
import Card from '~/components/modules/card';
import Accordion from '~/components/modules/accordion';
import SlideIn from '~/components/modules/animations/slidein';
import Grid from '~/components/modules/grid';
import VideoPlayer from '~/components/modules/video-player';

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

				<div className="max-w-2xl mx-auto mb-12">
					<VideoPlayer
						url="https://cdn.flowplayer.com/token:eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhZGM0ZGEzMC1iOWJiLTQ1MWItYWJiNS0zY2RkYjQzMjZiNjQiLCJuYmYiOjE3MDYwMjM3MTksImlzcyI6Imh0dHBzOi8vd3d3LmZsb3dwbGF5ZXIuY29tIiwiZXhwIjoxNzA2MTEwMTE5LCJpYXQiOjE3MDYwMjM3MTl9.opGnkoSwJk9naZUrXL5ZBkScJBzIO9YSTc6NaMw8JppoDfWN8uxEuZe-Zv34Dp0P1iYBtM-bTt--6YHrp-uI48w9Af1P8WK3kwM09huGIHkD6XOswT6zgiarKEmPAC0__MOwGTwB1XOuCl0Ok9bxTLZwc30r7ipEKkJEk952AezPh2XHtYc1tZClg9mqhcd4XAmuGSD5tdMeMFHuQZpsEDsoyZ_VVrMZ3unGHYvuMpPL25LS15AOROCEv5qMBQMdJexlFM3yjPULwx4nN58f_seVLgTqGM74U0AEHNx3oON_8bA410ND47ZY_2dzxupdKsNjc43dNp3ayo1BqUw_GUgV30tVbtw013iHwxnma4Y2MPg69QTdTvq9LXgocUv2sIRCyOJbugXVNos8T778UedS7TZJgmubZVYTpDJ6Ew02wn6ZZgzRMa0B3s4-Nuinfm1DAWVcbz4OCM2kcRS2bgzIwUcPwnSMBFv88T-C5b8J-_KrEhXRZ8T0gnZKasPHVQxJ0ijx4KSXQKfTJpkz1JBta0q5A9T1hq5skG1Ef4iGCoUcofWIywJuPFgb0kQGCpajo3uvhQByXnLUjh01MZfH6hMdlOUalNLSicbsiQmYZ44ySnV7G7ZoilLXPCjt-fJdS_Ldwa0xnE8XCC3VRuDGNKHqLd30U0YFSTFTSUM/6c7629eb-c3af-4165-80d3-96cce8c83f78/hls/adc4da30-b9bb-451b-abb5-3cddb4326b64/playlist.m3u8"
						title="Test Video"
						placeholder="https://cdn.flowplayer.com/6c7629eb-c3af-4165-80d3-96cce8c83f78/i/v-i-adc4da30-b9bb-451b-abb5-3cddb4326b64-1.jpg"
						playsinline={true}
						controls={true}
					/>
				</div>
				<p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat dolor inventore deserunt, perferendis asperiores quibusdam repudiandae. Fugiat voluptatem blanditiis reiciendis earum repellat, qui dolor tenetur maiores at voluptate enim modi asperiores ab corrupti explicabo recusandae ea excepturi assumenda quae iure rem similique consectetur veritatis minima. Natus. Ipsa aliquam sapiente expedita quidem vitae sit architecto eveniet est id quaerat saepe modi unde esse sequi sint dolorem adipisci in eos, ducimus reprehenderit ea, iusto molestiae rem. Ad, ipsam. A quisquam ex dolor pariatur debitis sequi veritatis rem delectus facere totam, incidunt quibusdam fugiat provident repudiandae laborum mollitia dolorum odit? Molestiae alias, temporibus culpa fugiat libero incidunt perspiciatis voluptas. Quia, necessitatibus! Ipsam accusamus atque ipsum nisi dolor repudiandae officiis, cum accusantium iure inventore facilis magni debitis itaque blanditiis, placeat eum? Cupiditate error obcaecati soluta consectetur, in officiis quaerat aliquid! Rerum ut odio dolore excepturi ipsam ducimus sapiente quas consequuntur porro iure optio laborum, voluptas doloribus id rem tenetur eligendi delectus corporis aspernatur amet necessitatibus! Numquam officia sunt maxime nihil? Iure, asperiores beatae amet odit, autem, quidem id officia maxime debitis rerum unde distinctio. Ipsa, dolore quidem quibusdam nihil repellendus sapiente recusandae corrupti deserunt dolor ad a officia quis odio. Rem, natus sapiente! Modi enim quidem consequatur, nobis facere eligendi similique vero rerum praesentium fuga nesciunt, nihil velit. Repudiandae atque illo repellendus sunt nostrum nobis rerum soluta eos praesentium! Autem! Unde odio vero, nesciunt voluptas eius sit. Quia, ex earum beatae mollitia ipsum at, aliquam officiis cum minus molestiae error quos voluptatibus. Ipsam quod rem fugiat, voluptatum voluptas quasi non!  Recusandae ea excepturi dignissimos vel nisi voluptatum inventore sapiente est facilis, at modi provident, eius eligendi placeat error architecto odio? Explicabo soluta, culpa qui blanditiis alias officiis dolore eaque expedita?</p>
			</Section>
		</Layout>
	);
};

export default AboutPage;
