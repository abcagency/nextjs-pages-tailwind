import { createContext, useContext, useState } from 'react';

export const HeadroomContext = createContext(null);

export const useHeadroom = () => {
	const context = useContext(HeadroomContext);
	if (!context) {
		throw new Error('useHeadroom must be used within a HeadroomProvider');
	}
	return context;
};

export const HeadroomProvider = ({ children }) => {
	const [headroomIsPinned, setHeadroomIsPinned] = useState(false);
	const [headroomIsDisabled, setHeadroomIsDisabled] = useState();

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
