import { useEffect, useRef } from 'react';

type EventTargetElement = Window | Document | HTMLElement;

type EventListener = (event: Event) => void;

const isBrowser = typeof window !== 'undefined';

const useEventListener = (
	eventType: string,
	callback: EventListener,
	element: EventTargetElement | null = isBrowser ? window : null
) => {
	const callbackRef = useRef<EventListener>(callback);

	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	useEffect(() => {
		if (!element) return undefined;
		const handler = (event: Event) => callbackRef.current(event);
		element.addEventListener(eventType, handler);

		return () => element.removeEventListener(eventType, handler);
	}, [eventType, element]);
};

export default useEventListener;
