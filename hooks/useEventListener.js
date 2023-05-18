import { useEffect, useRef } from 'react';

const isBrowser = typeof window !== "undefined";

const useEventListener = (
	eventType,
	callback,
	element = isBrowser ?? window
) => {
	const callbackRef = useRef(callback);

	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	useEffect(() => {
		if (element == null) return;
		const handler = e => callbackRef.current(e);
		element.addEventListener(eventType, handler);

		return () => element.removeEventListener(eventType, handler);
	}, [eventType, element]);
};

export default useEventListener;
