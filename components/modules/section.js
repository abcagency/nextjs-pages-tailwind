import { InView } from 'react-intersection-observer';
import { useContext } from 'react';
import { SectionContext } from '~/components/modules/sectionContext';

const isBrowser = typeof window !== 'undefined';

const Section = ({
	children,
	className,
	...props
}) => {
	const setCurrentSection = useContext(SectionContext);

	const onChange = (inView, entry) => {
		if (inView) {
			if (entry.intersectionRatio > 0 && setCurrentSection) {
				setCurrentSection(entry.target.id, entry.intersectionRatio, entry.intersectionRatio * entry.boundingClientRect.height / (isBrowser ? window.innerHeight : 1));
			}
		}
	};

	return (
		<InView
			as="section"
			threshold={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]}
			onChange={onChange}
			className={`
				scroll-mt-6
				${className ?? ''}
			`}
			{...props}
		>
			{children}
		</InView>
	);
};

export default Section;
