import Balancer from 'react-wrap-balancer';

import Layout from '~/components/layout/layout';
import PageHead from '~/components/util/page-head';
import Jumbotron from '~/components/modules/jumbotron';
import Section from '~/components/modules/section';
import Button from '~/components/modules/button';

import Next from '~/images/inline/next.svg';

const Home = () => {
	return (
		<Layout>
			<PageHead
				title=""
			/>

			<Jumbotron className="bg-transparent !text-gray-800">
				<div className="flex flex-col items-center justify-between pt-32 pb-40">
					<div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-transparent before:to-blue-700 before:opacity-20 before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-900 after:via-[#0141ff] after:opacity-60 after:blur-2xl after:content-[''] before:lg:h-[360px] before:bg-gradient-to-br">
						<Next
							className="relative w-44"
							aria-hidden="true"
							role="img"
						/>
					</div>
				</div>
			</Jumbotron>

			<Section
				id="intro"
				className="container px-4 mb-24"
			>
				<div className="text-center mt-16">
					<h1 className="mb-6 text-4xl font-bold text-center">Hello, world!</h1>
					<p className="max-w-lg mx-auto">
						<Balancer>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat dolor inventore deserunt, perferendis asperiores quibusdam repudiandae.</Balancer>
					</p>
				</div>
			</Section>

			<Section
				id="alpha"
				className="container px-4 my-12"
			>
				<h2 className="mb-4 text-xl font-bold">Alpha</h2>
				<p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. <Button.Anchor href="/" variant="link" hasUnderline>Placeat dolor inventore deserunt, perferendis asperiores quibusdam repudiandae <Button.Icon icon="fa-brands:instagram" /></Button.Anchor>. Fugiat voluptatem blanditiis reiciendis earum repellat, qui dolor tenetur maiores at voluptate enim modi asperiores ab corrupti explicabo recusandae ea excepturi assumenda quae iure rem similique consectetur veritatis minima. Natus. Ipsa aliquam sapiente expedita quidem vitae sit architecto eveniet est id quaerat saepe modi unde esse sequi sint dolorem adipisci in eos, ducimus reprehenderit ea, iusto molestiae rem. Ad, ipsam. A quisquam ex dolor pariatur debitis sequi veritatis rem delectus facere totam, incidunt quibusdam fugiat provident repudiandae laborum mollitia dolorum odit? Molestiae alias, temporibus culpa fugiat libero incidunt perspiciatis voluptas. Quia, necessitatibus! Ipsam accusamus atque ipsum nisi dolor repudiandae officiis, cum accusantium iure inventore facilis magni debitis itaque blanditiis, placeat eum? Cupiditate error obcaecati soluta consectetur, in officiis quaerat aliquid! Rerum ut odio dolore excepturi ipsam ducimus sapiente quas consequuntur porro iure optio laborum, voluptas doloribus id rem tenetur eligendi delectus corporis aspernatur amet necessitatibus! Numquam officia sunt maxime nihil? Iure, asperiores beatae amet odit, autem, quidem id officia maxime debitis rerum unde distinctio. Ipsa, dolore quidem quibusdam nihil repellendus sapiente recusandae corrupti deserunt dolor ad a officia quis odio. Rem, natus sapiente! Modi enim quidem consequatur, nobis facere eligendi similique vero rerum praesentium fuga nesciunt, nihil velit. Repudiandae atque illo repellendus sunt nostrum nobis rerum soluta eos praesentium! Autem! Unde odio vero, nesciunt voluptas eius sit. Quia, ex earum beatae mollitia ipsum at, aliquam officiis cum minus molestiae error quos voluptatibus. Ipsam quod rem fugiat, voluptatum voluptas quasi non!  Recusandae ea excepturi dignissimos vel nisi voluptatum inventore sapiente est facilis, at modi provident, eius eligendi placeat error architecto odio? Explicabo soluta, culpa qui blanditiis alias officiis dolore eaque expedita?</p>
			</Section>

			<Section
				id="beta"
				className="container px-4 my-12"
			>
				<h2 className="mb-4 text-xl font-bold">Beta</h2>
				<p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. <Button.Anchor href="/" variant="link" hasUnderline>Placeat dolor inventore deserunt, perferendis asperiores quibusdam repudiandae <Button.Icon icon="fa-brands:instagram" /></Button.Anchor>. Fugiat voluptatem blanditiis reiciendis earum repellat, qui dolor tenetur maiores at voluptate enim modi asperiores ab corrupti explicabo recusandae ea excepturi assumenda quae iure rem similique consectetur veritatis minima. Natus. Ipsa aliquam sapiente expedita quidem vitae sit architecto eveniet est id quaerat saepe modi unde esse sequi sint dolorem adipisci in eos, ducimus reprehenderit ea, iusto molestiae rem. Ad, ipsam. A quisquam ex dolor pariatur debitis sequi veritatis rem delectus facere totam, incidunt quibusdam fugiat provident repudiandae laborum mollitia dolorum odit? Molestiae alias, temporibus culpa fugiat libero incidunt perspiciatis voluptas. Quia, necessitatibus! Ipsam accusamus atque ipsum nisi dolor repudiandae officiis, cum accusantium iure inventore facilis magni debitis itaque blanditiis, placeat eum? Cupiditate error obcaecati soluta consectetur, in officiis quaerat aliquid! Rerum ut odio dolore excepturi ipsam ducimus sapiente quas consequuntur porro iure optio laborum, voluptas doloribus id rem tenetur eligendi delectus corporis aspernatur amet necessitatibus! Numquam officia sunt maxime nihil? Iure, asperiores beatae amet odit, autem, quidem id officia maxime debitis rerum unde distinctio. Ipsa, dolore quidem quibusdam nihil repellendus sapiente recusandae corrupti deserunt dolor ad a officia quis odio. Rem, natus sapiente! Modi enim quidem consequatur, nobis facere eligendi similique vero rerum praesentium fuga nesciunt, nihil velit. Repudiandae atque illo repellendus sunt nostrum nobis rerum soluta eos praesentium! Autem! Unde odio vero, nesciunt voluptas eius sit. Quia, ex earum beatae mollitia ipsum at, aliquam officiis cum minus molestiae error quos voluptatibus. Ipsam quod rem fugiat, voluptatum voluptas quasi non!  Recusandae ea excepturi dignissimos vel nisi voluptatum inventore sapiente est facilis, at modi provident, eius eligendi placeat error architecto odio? Explicabo soluta, culpa qui blanditiis alias officiis dolore eaque expedita?</p>
			</Section>

			<Section
				id="charlie"
				className="container px-4 my-12"
			>
				<h2 className="mb-4 text-xl font-bold">Charlie</h2>
				<p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. <Button.Anchor href="/" variant="link" hasUnderline>Placeat dolor inventore deserunt, perferendis asperiores quibusdam repudiandae <Button.Icon icon="fa-brands:instagram" /></Button.Anchor>. Fugiat voluptatem blanditiis reiciendis earum repellat, qui dolor tenetur maiores at voluptate enim modi asperiores ab corrupti explicabo recusandae ea excepturi assumenda quae iure rem similique consectetur veritatis minima. Natus. Ipsa aliquam sapiente expedita quidem vitae sit architecto eveniet est id quaerat saepe modi unde esse sequi sint dolorem adipisci in eos, ducimus reprehenderit ea, iusto molestiae rem. Ad, ipsam. A quisquam ex dolor pariatur debitis sequi veritatis rem delectus facere totam, incidunt quibusdam fugiat provident repudiandae laborum mollitia dolorum odit? Molestiae alias, temporibus culpa fugiat libero incidunt perspiciatis voluptas. Quia, necessitatibus! Ipsam accusamus atque ipsum nisi dolor repudiandae officiis, cum accusantium iure inventore facilis magni debitis itaque blanditiis, placeat eum? Cupiditate error obcaecati soluta consectetur, in officiis quaerat aliquid! Rerum ut odio dolore excepturi ipsam ducimus sapiente quas consequuntur porro iure optio laborum, voluptas doloribus id rem tenetur eligendi delectus corporis aspernatur amet necessitatibus! Numquam officia sunt maxime nihil? Iure, asperiores beatae amet odit, autem, quidem id officia maxime debitis rerum unde distinctio. Ipsa, dolore quidem quibusdam nihil repellendus sapiente recusandae corrupti deserunt dolor ad a officia quis odio. Rem, natus sapiente! Modi enim quidem consequatur, nobis facere eligendi similique vero rerum praesentium fuga nesciunt, nihil velit. Repudiandae atque illo repellendus sunt nostrum nobis rerum soluta eos praesentium! Autem! Unde odio vero, nesciunt voluptas eius sit. Quia, ex earum beatae mollitia ipsum at, aliquam officiis cum minus molestiae error quos voluptatibus. Ipsam quod rem fugiat, voluptatum voluptas quasi non!  Recusandae ea excepturi dignissimos vel nisi voluptatum inventore sapiente est facilis, at modi provident, eius eligendi placeat error architecto odio? Explicabo soluta, culpa qui blanditiis alias officiis dolore eaque expedita?</p>
			</Section>
		</Layout>
	);
};

export default Home;
