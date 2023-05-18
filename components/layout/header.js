'use client';

import { useState } from 'react';
import Headroom from 'react-headroom';

import Navbar from '~/components/modules/navigation/navbar';

const Header = () => {
	const [position, setPosition] = useState(false);

	const PosMap = {
		PINNED: 'PINNED',
		DEFAULT: 'DEFAULT'
	};

	return (
		<Headroom
			style={{ zIndex: 50 }}
			onPin={() => setPosition(PosMap.PINNED)}
			onUnfix={() => setPosition(PosMap.DEFAULT)}
		>
			<header>
				<Navbar position={position} />
			</header>
		</Headroom>
	);
};

export default Header;
