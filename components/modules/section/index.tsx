import { useContext, useEffect, useRef } from 'react';
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

import SectionContext from '~/components/util/context/section';

type SectionProps = ComponentPropsWithoutRef<'section'> & {
	track?: boolean;
};

const Section = ({
	children,
	className,
	id,
	track = true,
	...props
}: SectionProps) => {
	const context = useContext(SectionContext);
	const sectionRef = useRef<HTMLElement>(null);
	const registerSection = context?.registerSection;

	useEffect(() => {
		if (!track || !id || !sectionRef.current || !registerSection) return;
		return registerSection(id, sectionRef.current);
	}, [id, track, registerSection]);

	return (
		<section
			ref={sectionRef}
			id={id}
			className={`scroll-mt-20 ${className ?? ''}`}
			{...props}
		>
			{children}
		</section>
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
