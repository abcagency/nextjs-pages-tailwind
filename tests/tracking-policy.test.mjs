import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import {
	createTrackingPolicy,
	resolveTrackingPolicy,
	exclusionCookie,
	UNRESOLVED_POLICY
} from '../lib/tracking-policy.ts';

const environment = {
	production: true,
	productionHostname: 'www.example.com',
	deployContext: 'production'
};
const resolve = (
	query = '',
	cookie = '',
	env = environment,
	host = 'www.example.com'
) => resolveTrackingPolicy(new URL(`https://${host}/${query}`), cookie, env);

function harness(path = '/') {
	let cookie = '';
	const writes = [];
	const browser = {
		location: {
			href: `https://www.example.com${path}`
		},
		document: {
			get cookie() {
				return cookie;
			},
			set cookie(value) {
				writes.push(value);
				cookie = value.includes('Max-Age=0;') ? '' : value.split(';')[0];
			}
		}
	};
	const policy = createTrackingPolicy(environment);
	const visit = path => {
		browser.location.href = new URL(path, browser.location.href).href;
		const nextPolicy = createTrackingPolicy(environment);
		nextPolicy.resolve(browser);
		return nextPolicy;
	};
	return { browser, policy, writes, visit };
}

test('only exact query controls override stored preference', () => {
	assert.equal(resolve('?exclude=true').excluded, true);
	assert.equal(
		resolve('?exclude=false', 'other=1; hc_tracking_excluded=true').excluded,
		false
	);
	for (const query of ['', '?exclude=TRUE', '?exclude=', '?exclude=1']) {
		assert.equal(resolve(query, 'hc_tracking_excluded=true').excluded, true);
		assert.equal(resolve(query).excluded, false);
	}
	assert.equal(resolve('', 'other_hc_tracking_excluded=true').excluded, false);
	assert.equal(resolve('?exclude=true&exclude=false').excluded, true);
});

test('host-only cookies cover all paths with ten-year lifetime, HTTPS secure and matching deletion', () => {
	assert.equal(
		exclusionCookie(true, true),
		'hc_tracking_excluded=true; Path=/; Max-Age=315360000; SameSite=Lax; Secure'
	);
	assert.equal(
		exclusionCookie(false, true),
		'hc_tracking_excluded=; Path=/; Max-Age=0; SameSite=Lax; Secure'
	);
	assert.equal(exclusionCookie(true, false).includes('Secure'), false);
	assert.equal(exclusionCookie(true, true).includes('Domain'), false);
	const h = harness('/?exclude=true');
	h.policy.resolve(h.browser);
	assert.equal(h.policy.getSnapshot().excluded, true);
	const returningPolicy = h.visit('/other?campaign=1#details');
	assert.equal(h.writes.length, 2);
	assert.equal(returningPolicy.getSnapshot().excluded, true);
	const clearedPolicy = h.visit('/other?exclude=false');
	assert.equal(h.browser.document.cookie, '');
	assert.equal(clearedPolicy.getSnapshot().excluded, false);
	const count = h.writes.length;
	h.visit('/?exclude=unknown');
	assert.equal(h.writes.length, count);
});

test('only production builds on the exact production host and production deployment can track', () => {
	assert.equal(resolve().allowed, true);
	assert.equal(resolve('?exclude=true').allowed, false);
	assert.equal(
		resolve('', '', { ...environment, production: false }).allowed,
		false
	);
	for (const deployContext of [
		'deploy-preview',
		'branch-deploy',
		'preview',
		'development'
	]) {
		assert.equal(
			resolve('', '', { ...environment, deployContext }).allowed,
			false
		);
	}
	for (const host of [
		'localhost',
		'127.0.0.1',
		'[::1]',
		'site.local',
		'site.test',
		'deploy-preview-12--site.netlify.app',
		'branch--site.netlify.app',
		'staging.example.com',
		'preview.example.com'
	]) {
		assert.equal(resolve('', '', environment, host).allowed, false);
		assert.equal(
			resolve(
				'?exclude=false',
				'',
				{ ...environment, productionHostname: host },
				host
			).allowed,
			false
		);
	}
});

test('canonical Netlify production widgets can track; preview context and explicit exclusion still win', () => {
	const h = harness();
	h.browser.location.href = 'https://widget.netlify.app/?exclude=false';
	const widgetEnvironment = {
		...environment,
		productionHostname: 'widget.netlify.app'
	};
	const policy = createTrackingPolicy(widgetEnvironment);
	policy.resolve(h.browser);
	assert.equal(policy.getSnapshot().allowed, true);
	assert.equal(policy.getSnapshot().excluded, false);
	let starts = 0;
	policy.initialize(() => starts++);
	policy.pushEvent(h.browser, { event: 'netlify' });
	assert.equal(starts, 1);
	assert.deepEqual(h.browser.dataLayer, [{ event: 'netlify' }]);
	for (const deployContext of ['deploy-preview', 'branch-deploy']) {
		assert.equal(
			resolve(
				'?exclude=false',
				'',
				{ ...widgetEnvironment, deployContext },
				'widget.netlify.app'
			).allowed,
			false
		);
	}
	assert.equal(
		resolve('?exclude=true', '', widgetEnvironment, 'widget.netlify.app')
			.allowed,
		false
	);
	assert.equal(
		resolve(
			'',
			'hc_tracking_excluded=true',
			widgetEnvironment,
			'widget.netlify.app'
		).allowed,
		false
	);
});

test('unresolved and excluded policies never initialize scripts or create/push dataLayer', () => {
	const h = harness('/?exclude=true');
	let starts = 0;
	assert.equal(h.policy.getSnapshot(), UNRESOLVED_POLICY);
	h.policy.initialize(() => starts++);
	h.policy.pushEvent(h.browser, { event: 'early' });
	assert.equal(h.browser.dataLayer, undefined);
	h.policy.resolve(h.browser);
	h.policy.initialize(() => starts++);
	h.policy.pushEvent(h.browser, { event: 'excluded' });
	assert.equal(starts, 0);
	assert.equal(h.browser.dataLayer, undefined);
	h.browser.dataLayer = [];
	h.policy.pushEvent(h.browser, { event: 'excluded' });
	assert.deepEqual(h.browser.dataLayer, []);
});

test('page-load policy resolves once and initializes production tracking once', () => {
	const h = harness();
	h.policy.resolve(h.browser);
	let starts = 0;
	h.policy.initialize(() => starts++);
	h.policy.initialize(() => starts++);
	assert.equal(starts, 1);
	h.policy.pushEvent(h.browser, { event: 'allowed' });
	assert.deepEqual(h.browser.dataLayer, [{ event: 'allowed' }]);
	const snapshot = h.policy.getSnapshot();
	h.browser.location.href = 'https://www.example.com/?exclude=true';
	h.policy.resolve(h.browser);
	assert.equal(h.policy.getSnapshot(), snapshot);
	assert.equal(h.writes.length, 0);
});

test('full page loads enable, persist and clear exclusion before scripts initialize', () => {
	const h = harness('/?exclude=true');
	h.policy.resolve(h.browser);
	h.policy.initialize(() =>
		assert.fail('Excluded page must not start scripts')
	);
	const returningPolicy = h.visit('/contact?campaign=staff#form');
	assert.equal(returningPolicy.getSnapshot().excluded, true);
	returningPolicy.initialize(() =>
		assert.fail('Returning excluded page must not start scripts')
	);
	const clearedPolicy = h.visit('/contact?exclude=false&campaign=staff#form');
	assert.equal(h.browser.document.cookie, '');
	assert.equal(clearedPolicy.getSnapshot().allowed, true);
	let starts = 0;
	clearedPolicy.initialize(() => starts++);
	assert.equal(starts, 1);
	assert.equal(
		h.browser.location.href,
		'https://www.example.com/contact?exclude=false&campaign=staff#form'
	);
});

test('nonproduction suppresses custom events and scripts without showing explicit exclusion', () => {
	const h = harness();
	const policy = createTrackingPolicy({ ...environment, production: false });
	policy.resolve(h.browser);
	policy.initialize(() => assert.fail('Must not start'));
	policy.pushEvent(h.browser, { event: 'dev' });
	assert.equal(h.browser.dataLayer, undefined);
	assert.equal(policy.getSnapshot().excluded, false);
});

test('query exclusion still works if cookie writes are blocked', () => {
	const h = harness('/?exclude=true');
	Object.defineProperty(h.browser.document, 'cookie', {
		get: () => '',
		set: () => {
			throw new Error('Storage blocked');
		}
	});
	h.policy.resolve(h.browser);
	assert.equal(h.policy.getSnapshot().excluded, true);
	assert.equal(h.policy.getSnapshot().allowed, false);
});

test('configured redirects retain query controls using Next destination handling', async () => {
	const require = createRequire(import.meta.url);
	const config = require('../next.config.js');
	const {
		prepareDestination
	} = require('next/dist/shared/lib/router/utils/prepare-destination.js');
	const redirects = await config.redirects();
	// This starter currently has no redirects. Exercise the framework path too.
	for (const rule of [...redirects, { destination: '/contact' }]) {
		for (const exclude of ['true', 'false']) {
			const { parsedDestination } = prepareDestination({
				destination: rule.destination,
				params: {},
				query: { exclude, campaign: 'staff' },
				appendParamsToQuery: false
			});
			assert.equal(parsedDestination.query.exclude, exclude);
			assert.equal(parsedDestination.query.campaign, 'staff');
		}
	}
});

test('app and event entry points use the shared policy without eager dataLayer creation', () => {
	const app = readFileSync(
		new URL('../pages/_app.tsx', import.meta.url),
		'utf8'
	);
	assert.match(app, /<Tracking \/>/);
	assert.doesNotMatch(app, /<Script|dataLayer/);
	const events = readFileSync(
		new URL('../hooks/useEventTracker.ts', import.meta.url),
		'utf8'
	);
	assert.match(events, /tracking.pushEvent\(window/);
	assert.doesNotMatch(events, /window.dataLayer\s*=/);
});
