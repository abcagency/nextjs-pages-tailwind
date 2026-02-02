import { useState, useEffect } from 'react';

type WindowSize = {
	width: number | undefined;
	height: number | undefined;
};

export default function useWindowSize(): WindowSize {
	const [windowSize, setWindowSize] = useState<WindowSize>({
		width: undefined,
		height: undefined
	});

	useEffect(() => {
		const handleResize = () => {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight
			});
		};

		const onResize = () => {
			window.requestAnimationFrame(handleResize);
		};

		window.addEventListener('resize', onResize);
		handleResize();

		return () => window.removeEventListener('resize', onResize);
	}, []);

	return windowSize;
}
