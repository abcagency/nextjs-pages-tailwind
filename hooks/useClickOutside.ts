import type { RefObject } from 'react';

import useEventListener from '~/hooks/useEventListener';

const isBrowser = typeof window !== 'undefined';

const useClickOutside = (
	ref: RefObject<HTMLElement | null>,
	cb: (event: MouseEvent) => void
) => {
	useEventListener(
		'click',
		event => {
			const target = event.target as Node | null;
			if (!ref.current || (target && ref.current.contains(target))) return;
			cb(event as MouseEvent);
		},
		isBrowser ? document : null
	);
};

export default useClickOutside;
