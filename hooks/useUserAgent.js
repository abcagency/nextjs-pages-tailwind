import { useState, useEffect } from 'react';
import UAParser from 'ua-parser-js';

const isBrowser = () => typeof window !== 'undefined';

const useUserAgent = () => {
	const [state, setState] = useState(null);

	useEffect(() => {
		if (!isBrowser) {
			return null;
		}

		let didRun = true;

		try {
			const uaParser = new UAParser.UAParser();
			uaParser.setUA(window.navigator.userAgent);
			const payload = {
				os: uaParser.getOS(),
				browser: uaParser.getBrowser(),
				cpu: uaParser.getCPU(),
				device: uaParser.getDevice(),
				engine: uaParser.getEngine()
			};
			if (didRun) {
				setState(payload);
			}
		} catch (err) {
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
