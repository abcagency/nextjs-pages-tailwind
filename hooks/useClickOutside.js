import useEventListener from '~/hooks/useEventListener';

const isBrowser = typeof window !== "undefined";

const useClickOutside = (ref, cb) => {
	useEventListener(
		'click',
		e => {
			if (ref.current == null || ref.current.contains(e.target)) return;
			cb(e);
		},
		isBrowser ? document : null
	);
};

export default useClickOutside;