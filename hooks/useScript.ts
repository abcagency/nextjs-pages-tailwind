import { useEffect, useState } from 'react';

const isBrowser = typeof window !== 'undefined';

type ScriptStatus = 'idle' | 'loading' | 'ready' | 'error';

function useScript(src?: string | null): ScriptStatus {
	const [status, setStatus] = useState<ScriptStatus>(src ? 'loading' : 'idle');

	useEffect(() => {
		if (!isBrowser || !src) {
			setStatus('idle');
			return;
		}

		let script = document.querySelector(
			`script[src="${src}"]`
		) as HTMLScriptElement | null;

		if (!script) {
			script = document.createElement('script');
			script.src = src;
			script.async = true;
			script.setAttribute('data-status', 'loading');
			document.body.appendChild(script);

			const setAttributeFromEvent = (event: Event) => {
				script?.setAttribute(
					'data-status',
					event.type === 'load' ? 'ready' : 'error'
				);
			};

			script.addEventListener('load', setAttributeFromEvent);
			script.addEventListener('error', setAttributeFromEvent);
		} else {
			setStatus((script.getAttribute('data-status') as ScriptStatus) || 'idle');
		}

		const setStateFromEvent = (event: Event) => {
			setStatus(event.type === 'load' ? 'ready' : 'error');
		};

		script.addEventListener('load', setStateFromEvent);
		script.addEventListener('error', setStateFromEvent);

		return () => {
			script?.removeEventListener('load', setStateFromEvent);
			script?.removeEventListener('error', setStateFromEvent);
		};
	}, [src]);

	return status;
}

export default useScript;
