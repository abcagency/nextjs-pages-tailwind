const routes = {
	id: 'home',
	slug: '/',
	title: 'Home',
	children: [
		{
			slug: '/about',
			title: 'About',
			useIn: ['navbar', 'error']
		},
		{
			slug: '/contact',
			title: 'Contact',
			useIn: ['navbar', 'error']
		}
	]
};

export default routes;
