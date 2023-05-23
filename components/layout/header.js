'use client';

import { useState } from 'react';
import Headroom from 'react-headroom';

import Navbar from '~/components/modules/navigation/navbar';

const Header = () => {
	const [isPinned, setIsPinned] = useState(false);

	return (
		<Headroom
			style={{ zIndex: 50 }}
			onPin={() => setIsPinned(true)}
			onUnfix={() => setIsPinned(false)}
		>
			<header>
				<Navbar isPinned={isPinned} />
			</header>
		</Headroom>
	);
};

export default Header;
