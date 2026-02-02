import { createContext, useContext, useState } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';

type HeadroomContextValue = {
	headroomIsPinned: boolean;
	setHeadroomIsPinned: Dispatch<SetStateAction<boolean>>;
	headroomIsDisabled: boolean;
	setHeadroomIsDisabled: Dispatch<SetStateAction<boolean>>;
};

export const HeadroomContext = createContext<HeadroomContextValue | null>(null);

export const useHeadroom = () => {
	const context = useContext(HeadroomContext);
	if (!context) {
		throw new Error('useHeadroom must be used within a HeadroomProvider');
	}
	return context;
};

export const HeadroomProvider = ({ children }: { children: ReactNode }) => {
	const [headroomIsPinned, setHeadroomIsPinned] = useState(false);
	const [headroomIsDisabled, setHeadroomIsDisabled] = useState(false);

	return (
		<HeadroomContext.Provider
			value={{
				headroomIsDisabled,
				setHeadroomIsDisabled,
				headroomIsPinned,
				setHeadroomIsPinned
			}}
		>
			{children}
		</HeadroomContext.Provider>
	);
};

export default HeadroomContext;
