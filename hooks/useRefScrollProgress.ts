import { useState, useEffect } from 'react';
import type { RefObject } from 'react';

import useWindowSize from './useWindowSize';

type RefScrollProgressInput = {
	inputRef: RefObject<HTMLElement | null>;
};

type RefScrollProgressResult = {
	ref: RefObject<HTMLElement | null>;
	start: number | null;
	end: number | null;
};

export default function useRefScrollProgress({
	inputRef
}: RefScrollProgressInput): RefScrollProgressResult {
	const ref = inputRef;
	const [start, setStart] = useState<number | null>(null);
	const [end, setEnd] = useState<number | null>(null);
	const size = useWindowSize();

	useEffect(() => {
		if (!ref.current) {
			return;
		}

		const rect = ref.current.getBoundingClientRect();
		const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		const offsetTop = rect.top + scrollTop;

		setStart(offsetTop / document.body.clientHeight);
		setEnd((offsetTop + rect.height) / document.body.clientHeight);
	}, [ref, size]);

	return { ref, start, end };
}
