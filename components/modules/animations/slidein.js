import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

const SlideIn = ({
	as = "div",
	children,
	delay = 0.05,
	opacity = 1,
	scale = 0.95,
	y = 50,
	...rest
}) => {
	const ref = useRef();

	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start end", `start 0.85`]
	});

	const scaleContained = useTransform(scrollYProgress, [0, 1], [scale, 1]);

	const scaleSpring = useSpring(scaleContained, {
		damping: 100,
		stiffness: 1000
	});

	return (
		<motion.div
			ref={ref}
			className="h-full"
			style={{
				scale: scaleSpring
			}}
			{...rest}
		>
			{children}
		</motion.div>
	);
};

export default SlideIn;
