import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { InView } from 'react-intersection-observer';

import { useScrollDirection } from '~/hooks/useScrollDirection';

const SlideIn = ({
	as = "div",
	children,
	delay = 0.05,
	opacity = 0,
	scale = 1,
	y = 25,
	...rest
}) => {
	const controls = useAnimation();
	const scrollDir = useScrollDirection();
	const [hidden, setHidden] = useState(true);
	const [wasAlwaysInView, setWasAlwaysInView] = useState(true);

	useEffect(() => {
		if (!wasAlwaysInView) {
			controls.start('loaded');
		}
		setHidden(true);
	}, [wasAlwaysInView, controls]);

	const onChange = (inView, entry) => {
		if (inView) {
			if (entry.intersectionRatio < 0.10) {
				if (!hidden) {
					controls.start(scrollDir === 'down' ? 'exitDown' : 'exitUp');
					setHidden(true);
				}
			} else {
				if (hidden) {
					controls.start('visible');
					setHidden(false);
				}
			}
		} else {
			setWasAlwaysInView(false);
		}
	};

	const variants = {
		initial: {
			opacity: 1,
			scale,
			y: 0
		},
		loaded: {
			opacity,
			scale,
			y,
			transition: {
				type: "spring",
				stiffness: 100,
				damping: 20
			}
		},
		exitUp: {
			opacity,
			scale,
			y,
			transition: {
				type: "spring",
				stiffness: 100,
				damping: 20
			}
		},
		exitDown: {
			opacity,
			scale,
			y: -1 * y,
			transition: {
				type: "spring",
				stiffness: 100,
				damping: 20
			}
		},
		visible: {
			opacity: 1,
			scale,
			y: 0,
			transition: {
				delay: delay,
				type: "spring",
				stiffness: 100,
				damping: 20
			}
		}
	};

	return (
		<InView
			as={as}
			fallbackInView={true}
			onChange={onChange}
			threshold={[0, 0.1, 0.2, 0.5, 0.7, 0.8, 0.9, 1]}
			{...rest}
		>
			<motion.div
				initial="initial"
				animate={controls}
				variants={variants}
				className="h-full"
			>
				{children}
			</motion.div>
		</InView>
	);
};

export default SlideIn;
