import type { ComponentProps, ElementType, ReactNode } from 'react';
import { InView } from 'react-intersection-observer';

import useSectionTracker from '~/hooks/useSectionTracker';

const isBrowser = typeof window !== 'undefined';

type InViewComponentProps = ComponentProps<typeof InView>;

type SectionProps = Omit<InViewComponentProps, 'onChange'> & {
	children?: ReactNode;
	className?: string;
	onChange?: InViewComponentProps['onChange'];
	id?: string;
};

const Section = ({ children, className, onChange, ...props }: SectionProps) => {
	const sectionIsIntersecting = useSectionTracker();

	const handleChange: InViewComponentProps['onChange'] = (inView, entry) => {
		if (inView) {
			if (entry.intersectionRatio > 0 && sectionIsIntersecting) {
				sectionIsIntersecting(
					entry.target.id,
					entry.intersectionRatio,
					(entry.intersectionRatio * entry.boundingClientRect.height) /
						(isBrowser ? window.innerHeight : 1)
				);
			}
		}

		onChange?.(inView, entry);
	};

	return (
		<InView
			as="section"
			threshold={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]}
			onChange={handleChange}
			className={`scroll-mt-20 ${className ?? ''}`}
			{...props}
		>
			{children}
		</InView>
	);
};

type SectionTitleProps = {
	as?: ElementType;
	children?: ReactNode;
	className?: string;
};

export const SectionTitle = ({
	as: Title = 'h2',
	children,
	className
}: SectionTitleProps) => {
	const Heading = Title as ElementType;

	return (
		<Heading
			className={`mb-4 text-xl md:text-2xl text-pretty ${className ?? ''}`}
		>
			{children}
		</Heading>
	);
};

Section.Title = SectionTitle;

export default Section;
