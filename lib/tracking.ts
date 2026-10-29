import site from '~/data/site.json';
import { createTrackingPolicy } from './tracking-policy';

export const tracking = createTrackingPolicy({
	production: process.env.NODE_ENV === 'production',
	productionHostname: new URL(site.url).hostname,
	deployContext: process.env.NEXT_PUBLIC_TRACKING_DEPLOY_CONTEXT ?? 'production'
});
