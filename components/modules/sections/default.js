import { InView } from 'react-intersection-observer';

import useSectionTracker from '~/hooks/useSectionTracker';

const isBrowser = typeof window !== 'undefined';

const Section = ({
	children,
	className,
	...props
}) => {
	const sectionIsIntersecting = useSectionTracker();

	const onChange = (inView, entry) => {
		if (inView) {
			if (entry.intersectionRatio > 0 && sectionIsIntersecting) {
				sectionIsIntersecting(entry.target.id, entry.intersectionRatio, entry.intersectionRatio * entry.boundingClientRect.height / (isBrowser ? window.innerHeight : 1));
			}
		}
	};

	return (
		<InView
			as="section"
			threshold={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]}
			onChange={onChange}
			className={`
				scroll-mt-20
				${className ?? ''}
			`}
			{...props}
		>
			{children}
		</InView>
	);
};

export const SectionTitle = ({
	as = 'h2',
	children,
	className
}) => {
	const Title = as;

	return (
		<Title
			className={`
				mb-4 text-2xl
				${className ?? ''}
			`}
		>
			{children}
		</Title>
	);
};

Section.Title = SectionTitle;

export default Section;
