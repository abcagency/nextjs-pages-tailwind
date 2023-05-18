import { useState, useEffect } from 'react';
import useWindowSize from './useWindowSize';

export default function useRefScrollProgress({ inputRef }) {
	const ref = inputRef;
	const [start, setStart] = useState(null);
	const [end, setEnd] = useState(null);
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
