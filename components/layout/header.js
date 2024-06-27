'use client';

import { useState } from 'react';
import Headroom from 'react-headroom';

import Navbar from '~/components/modules/navigation/navbar';

import { useHeadroom } from '~/components/util/context/headroom';

const Header = () => {
	const { headroomIsDisabled } = useHeadroom();

	const [isPinned, setIsPinned] = useState(false);

	return (
		<Headroom
			style={{ zIndex: 50 }}
			onPin={() => setIsPinned(true)}
			onUnpin={() => setIsPinned(false)}
			onUnfix={() => setIsPinned(false)}
			disable={headroomIsDisabled}
		>
			<header>
				<Navbar isPinned={isPinned} />
			</header>
		</Headroom>
	);
};

export default Header;
