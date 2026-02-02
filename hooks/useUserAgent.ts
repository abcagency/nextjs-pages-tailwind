import { useState, useEffect } from 'react';
import UAParser, { type IResult } from 'ua-parser-js';

const isBrowser = () => typeof window !== 'undefined';

type UserAgentState = IResult | null;

const useUserAgent = () => {
	const [state, setState] = useState<UserAgentState>(null);

	useEffect(() => {
		if (!isBrowser()) {
			return undefined;
		}

		let didRun = true;

		try {
			const uaParser = new UAParser(window.navigator.userAgent);
			const payload = uaParser.getResult();
			if (didRun) {
				setState(payload);
			}
		} catch {
			if (didRun) {
				setState(null);
			}
		}

		return () => {
			didRun = false;
		};
	}, []);

	return state;
};

export default useUserAgent;
