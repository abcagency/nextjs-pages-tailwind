import { useSyncExternalStore } from 'react';
import { tracking } from '~/lib/tracking';
import { UNRESOLVED_POLICY } from '~/lib/tracking-policy';

export function useTrackingPolicy() {
	return useSyncExternalStore(
		tracking.subscribe,
		tracking.getSnapshot,
		() => UNRESOLVED_POLICY
	);
}
