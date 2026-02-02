import type { ComponentPropsWithoutRef } from 'react';
import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';

type SlideInProps = ComponentPropsWithoutRef<typeof motion.div> & {
	delay?: number;
	opacity?: number;
	scale?: number;
	y?: number;
};

const SlideIn = ({
	children,
	delay = 0.05,
	opacity = 1,
	scale = 0.95,
	y = 50,
	...rest
}: SlideInProps) => {
	const ref = useRef<HTMLDivElement | null>(null);

	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ['start end', 'start 0.85']
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
