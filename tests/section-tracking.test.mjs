import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import {
	createSectionTracker,
	pickDominantSection,
	registerSectionElement,
	resolveSectionLink
} from '../lib/section-tracking.ts';

const entry = (id, top, bottom) => ({ id, rect: { top, bottom } });

test('scores short sections against their height and tall sections against the viewport', () => {
	assert.equal(
		pickDominantSection(
			[entry('tall', -1000, 800), entry('short', 800, 1000)],
			1000,
			'tall'
		),
		'short'
	);
	assert.equal(
		pickDominantSection(
			[entry('tall', -100, 1200), entry('hidden', 1200, 1300)],
			1000,
			null
		),
		'tall'
	);
	assert.equal(
		pickDominantSection([entry('tiny', 20, 30)], 1000, null),
		'tiny'
	);
});

test('equal scores retain the active section, then prefer top proximity and document order', () => {
	const sections = [entry('first', 0, 100), entry('second', 100, 200)];
	assert.equal(pickDominantSection(sections, 1000, 'second'), 'second');
	assert.equal(pickDominantSection(sections, 1000, null), 'first');
	assert.equal(
		pickDominantSection(
			[entry('first', 20, 120), entry('second', 20, 120)],
			1000,
			null
		),
		'first'
	);
});

test('ignores invisible and zero-height sections', () => {
	assert.equal(
		pickDominantSection(
			[
				entry('above', -200, 0),
				entry('below', 1000, 1200),
				entry('empty', 10, 10)
			],
			1000,
			null
		),
		null
	);
});

function harness(initialUrl = '/') {
	let time = 0;
	let sequence = 0;
	const jobs = new Map();
	const browserEvents = new EventEmitter();
	const events = new EventEmitter();
	const changes = [];
	const settlements = [];
	const hashes = [];
	const views = [];
	const writes = [];
	const observed = new Set();
	let resizeCallback;
	const enqueue = (fn, delay) => {
		const id = ++sequence;
		jobs.set(id, { fn, at: time + delay });
		return id;
	};
	const viewport = {
		location: new URL(initialUrl, 'https://example.test'),
		innerHeight: 1000,
		performance: { now: () => time },
		setTimeout: enqueue,
		clearTimeout: id => jobs.delete(id),
		requestAnimationFrame: fn => enqueue(fn, 16),
		cancelAnimationFrame: id => jobs.delete(id),
		addEventListener: (name, fn) => browserEvents.on(name, fn),
		removeEventListener: (name, fn) => browserEvents.off(name, fn),
		ResizeObserver: class {
			constructor(fn) {
				resizeCallback = fn;
			}
			observe(element) {
				observed.add(element);
			}
			unobserve(element) {
				observed.delete(element);
			}
			disconnect() {
				observed.clear();
			}
		}
	};
	const locate = url => {
		viewport.location = new URL(url, viewport.location);
	};
	const initialState = {
		__N: true,
		key: 'entry-key',
		url: initialUrl,
		as: initialUrl,
		options: { scroll: false },
		custom: 'preserved'
	};
	viewport.scrollX = 0;
	viewport.scrollY = 123;
	viewport.history = {
		state: initialState,
		replaceState(state, title, url) {
			writes.push({ state, title, url });
			this.state = state;
			locate(url);
		}
	};
	const router = {
		events,
		isReady: true,
		asPath: initialUrl,
		replace() {
			throw new Error('Passive tracking must not trigger a router render');
		}
	};
	const sections = new Map();
	function add(id, top, bottom, order = sections.size) {
		const element = {
			isConnected: true,
			visible: true,
			checkVisibility() {
				return this.visible;
			},
			order,
			rect: { top, bottom },
			getBoundingClientRect() {
				return this.rect;
			},
			compareDocumentPosition(other) {
				return this.order < other.order ? 4 : this.order > other.order ? 2 : 0;
			}
		};
		sections.set(id, element);
		return element;
	}
	const a = add('a', 0, 1000);
	const b = add('b', 1000, 2000);
	const tracker = createSectionTracker({
		viewport,
		router,
		sections,
		onChange: id => changes.push(id),
		onSettled: id => settlements.push(id),
		onHashChange: id => hashes.push(id),
		onView: id => views.push(id)
	});
	async function tick(ms) {
		const end = time + ms;
		while (true) {
			const next = [...jobs]
				.filter(([, job]) => job.at <= end)
				.sort((x, y) => x[1].at - y[1].at)[0];
			if (!next) break;
			const [id, job] = next;
			jobs.delete(id);
			time = job.at;
			job.fn();
		}
		time = end;
		for (let i = 0; i < 6; i++) await Promise.resolve();
	}
	function show(id) {
		a.rect = id === 'a' ? { top: 0, bottom: 1000 } : { top: -1000, bottom: 0 };
		b.rect =
			id === 'b' ? { top: 0, bottom: 1000 } : { top: 1000, bottom: 2000 };
	}
	return {
		viewport,
		router,
		events,
		browserEvents,
		changes,
		settlements,
		hashes,
		views,
		writes,
		observed,
		jobs,
		sections,
		tracker,
		add,
		a,
		b,
		tick,
		show,
		locate,
		resize: () => resizeCallback()
	};
}

async function settle(h) {
	await h.tick(16);
	await h.tick(916);
}

test('context updates on the first frame; URL and analytics wait 900 ms', async () => {
	const h = harness('/?source=test');
	await h.tick(16);
	assert.deepEqual(h.changes, ['a']);
	assert.deepEqual(h.views, []);
	assert.equal(h.writes.length, 0);
	await h.tick(899);
	assert.deepEqual(h.views, []);
	assert.equal(h.writes.length, 0);
	await h.tick(17);
	assert.deepEqual(h.views, ['a']);
	assert.equal(h.writes.length, 1);
	assert.equal(h.writes[0].url, '/?source=test#a');
	assert.deepEqual(h.writes[0].state, {
		__N: true,
		key: 'entry-key',
		url: '/?source=test#a',
		as: '/?source=test#a',
		options: { scroll: false },
		custom: 'preserved'
	});
	assert.equal(h.viewport.scrollY, 123);
	assert.equal(h.viewport.scrollX, 0);
	await h.tick(2000);
	assert.equal(h.writes.length, 1);
	h.tracker.dispose();
});

test('rapid A to B to A updates context each time and restarts the side-effect timer', async () => {
	const h = harness();
	await h.tick(516);
	h.show('b');
	h.browserEvents.emit('scroll');
	await h.tick(516);
	assert.deepEqual(h.changes, ['a', 'b']);
	assert.deepEqual(h.views, []);
	assert.deepEqual(h.writes, []);
	h.show('a');
	h.browserEvents.emit('scroll');
	await h.tick(16);
	assert.deepEqual(h.changes, ['a', 'b', 'a']);
	await h.tick(899);
	assert.deepEqual(h.views, []);
	assert.deepEqual(h.writes, []);
	await h.tick(17);
	assert.deepEqual(h.views, ['a']);
	assert.equal(h.writes.length, 1);
	assert.equal(h.viewport.location.hash, '#a');
	h.tracker.dispose();
});

test('the timer remeasures geometry even without a second scroll event', async () => {
	const h = harness();
	await h.tick(16);
	h.show('b');
	await h.tick(916);
	assert.deepEqual(h.changes, ['a', 'b']);
	assert.deepEqual(h.views, []);
	assert.deepEqual(h.writes, []);
	await h.tick(916);
	assert.deepEqual(h.views, ['b']);
	assert.equal(h.viewport.location.hash, '#b');
	h.tracker.dispose();
});

test('navigation cancels pending effects; an instant jump updates context without another scroll', async () => {
	const h = harness();
	await h.tick(516);
	h.events.emit('hashChangeStart', '/#b', { shallow: false });
	await h.tick(1500);
	assert.deepEqual(h.changes, ['a']);
	assert.deepEqual(h.views, []);
	assert.deepEqual(h.writes, []);
	h.locate('/#b');
	h.router.asPath = '/#b';
	h.show('b');
	h.events.emit('hashChangeComplete', '/#b', { shallow: false });
	await h.tick(16);
	assert.deepEqual(h.changes, ['a', 'b']);
	assert.deepEqual(h.views, []);
	await h.tick(916);
	assert.deepEqual(h.views, ['b']);
	assert.deepEqual(h.writes, []);
	h.tracker.dispose();
});

test('repeated clicks restart effects and stale completion cannot release a newer navigation', async () => {
	const h = harness();
	h.events.emit('hashChangeStart', '/#a', {});
	h.events.emit('hashChangeStart', '/#b', {});
	h.events.emit('hashChangeComplete', '/#a', {});
	await settle(h);
	assert.deepEqual(h.changes, []);
	h.show('b');
	h.events.emit('hashChangeComplete', '/#b', {});
	await h.tick(516);
	assert.deepEqual(h.changes, ['b']);
	h.events.emit('hashChangeStart', '/#b', {});
	h.events.emit('hashChangeComplete', '/#b', {});
	await h.tick(516);
	assert.deepEqual(h.changes, ['b']);
	assert.deepEqual(h.views, []);
	assert.deepEqual(h.writes, []);
	await h.tick(416);
	assert.deepEqual(h.views, ['b']);
	h.tracker.dispose();
});

test('cancelled navigation resumes measurement and reconciles an unchanged active section', async () => {
	const h = harness();
	await settle(h);
	h.events.emit('routeChangeStart', '/other', {});
	h.locate('/#b');
	h.events.emit('routeChangeError', { cancelled: true }, '/other', {});
	await h.tick(516);
	assert.equal(h.viewport.location.hash, '#b');
	await h.tick(416);
	assert.equal(h.viewport.location.hash, '#a');
	assert.deepEqual(h.changes, ['a']);
	assert.deepEqual(h.views, ['a']);
	h.tracker.dispose();
});

test('native hashes and Back/Forward measure the viewport instead of activating hash IDs', async () => {
	for (const event of ['hashchange', 'popstate']) {
		const h = harness();
		await settle(h);
		h.locate('/#latest-videos');
		h.show('b');
		h.browserEvents.emit(event);
		await h.tick(16);
		assert.deepEqual(h.changes, ['a', 'b']);
		assert.deepEqual(h.views, ['a']);
		assert.equal(h.viewport.location.hash, '#latest-videos');
		await h.tick(500);
		await h.tick(416);
		assert.deepEqual(h.changes, ['a', 'b']);
		assert.equal(h.viewport.location.hash, '#b');
		h.tracker.dispose();
	}
});

test('no visible section clears context immediately and the tracked hash after settling', async () => {
	const h = harness();
	await settle(h);
	h.show(null);
	h.browserEvents.emit('scroll');
	await h.tick(16);
	assert.deepEqual(h.changes, ['a', null]);
	assert.equal(h.viewport.location.hash, '#a');
	await h.tick(916);
	assert.equal(h.viewport.location.hash, '');
	h.locate('/#latest-videos');
	h.browserEvents.emit('hashchange');
	await settle(h);
	assert.equal(h.viewport.location.hash, '#latest-videos');
	h.tracker.dispose();
});

test('resize, registration, and removal reevaluate; DOM order wins over registration order', async () => {
	const h = harness();
	h.a.rect = { top: 20, bottom: 120 };
	h.add('earlier', 20, 120, -1);
	h.tracker.refreshSections();
	await settle(h);
	assert.equal(h.changes.at(-1), 'earlier');
	h.sections.delete('earlier');
	h.tracker.refreshSections();
	assert.equal(h.observed.size, 2);
	await settle(h);
	assert.equal(h.changes.at(-1), 'a');
	h.show('b');
	h.resize();
	await settle(h);
	assert.equal(h.changes.at(-1), 'b');
	h.tracker.dispose();
});

test('section views fire only once and disposal removes listeners, observations, frames, and timers', async () => {
	const h = harness();
	await settle(h);
	for (const id of ['b', 'a']) {
		h.show(id);
		h.browserEvents.emit('scroll');
		await settle(h);
	}
	assert.deepEqual(h.views, ['a', 'b']);
	h.show('b');
	h.browserEvents.emit('scroll');
	await h.tick(16);
	h.browserEvents.emit('resize');
	h.tracker.dispose();
	assert.equal(h.jobs.size, 0);
	assert.equal(h.observed.size, 0);
	assert.equal(h.browserEvents.eventNames().length, 0);
	assert.equal(h.events.eventNames().length, 0);
	await h.tick(2000);
	assert.deepEqual(h.changes, ['a', 'b', 'a', 'b']);
});

test('a tracker never rewrites another page URL', async () => {
	const h = harness();
	h.locate('/other#unrelated');
	h.events.emit('routeChangeComplete', '/other#unrelated');
	await settle(h);
	assert.deepEqual(h.writes, []);
	h.tracker.dispose();
});

test('disposal during delayed analytics prevents a subsequent URL write', async () => {
	const h = harness();
	// Dispose during the delayed analytics callback, before the URL write runs.
	const originalPush = h.views.push.bind(h.views);
	h.views.push = id => {
		originalPush(id);
		h.tracker.dispose();
	};
	await settle(h);
	assert.equal(h.writes.length, 0);
	assert.equal(h.jobs.size, 0);
});

test('direct bookmarks cannot activate an invisible target and obsolete tracked hashes clear on startup', async () => {
	const h = harness('/#b');
	await settle(h);
	assert.deepEqual(h.changes, ['a']);
	assert.equal(h.viewport.location.hash, '#a');
	h.tracker.dispose();
	const empty = harness('/#a');
	empty.show(null);
	await settle(empty);
	assert.equal(empty.viewport.location.hash, '');
	assert.deepEqual(empty.views, []);
	empty.tracker.dispose();
});

test('native nav jumps update context once, with no delayed router scroll back to the old hash', async () => {
	const h = harness('/#a');
	await settle(h);
	// Native anchor navigation changes location and geometry, without a router
	// render. The router's in-memory asPath intentionally still contains #a.
	h.locate('/#b');
	h.show('b');
	h.browserEvents.emit('hashchange');
	h.browserEvents.emit('scroll');
	await h.tick(16);
	assert.deepEqual(h.changes, ['a', 'b']);
	await h.tick(2000);
	assert.deepEqual(h.changes, ['a', 'b']);
	assert.deepEqual(h.writes, []);
	assert.equal(h.router.asPath, '/#a');
	assert.equal(h.viewport.location.hash, '#b');
	h.tracker.dispose();
});

test('passive updates preserve null and non-Next history state without adding router metadata', async () => {
	for (const state of [null, { custom: 'native-entry' }]) {
		const h = harness();
		h.viewport.history.state = state;
		await settle(h);
		assert.equal(h.viewport.history.state, state);
		assert.equal(h.viewport.location.hash, '#a');
		h.tracker.dispose();
	}
});

test('instant and settled values are independent, including settling to null', async () => {
	const h = harness();
	await h.tick(16);
	assert.deepEqual(h.changes, ['a']);
	assert.deepEqual(h.settlements, []);
	await h.tick(916);
	assert.deepEqual(h.settlements, ['a']);
	h.show('b');
	h.browserEvents.emit('scroll');
	await h.tick(16);
	assert.deepEqual(h.changes, ['a', 'b']);
	assert.deepEqual(h.settlements, ['a']);
	await h.tick(916);
	assert.deepEqual(h.settlements, ['a', 'b']);
	h.show(null);
	h.browserEvents.emit('scroll');
	await h.tick(16);
	assert.equal(h.changes.at(-1), null);
	assert.equal(h.settlements.at(-1), 'b');
	await h.tick(916);
	assert.equal(h.settlements.at(-1), null);
	h.tracker.dispose();
});

test('a fresh settlement is published even when a bookmark lands on the previously settled section', async () => {
	const h = harness();
	await settle(h);
	// A short target can lose to the same previously settled viewport winner.
	h.locate('/#b');
	h.browserEvents.emit('hashchange');
	await h.tick(16);
	assert.deepEqual(h.settlements, ['a']);
	await h.tick(916);
	assert.deepEqual(h.settlements, ['a', 'a']);
	assert.deepEqual(h.views, ['a']);
	h.tracker.dispose();
});

test('hashSection reflects a direct bookmark before measurement without changing viewport values', async () => {
	const h = harness('/#b');
	assert.deepEqual(h.hashes, ['b']);
	assert.deepEqual(h.changes, []);
	assert.deepEqual(h.settlements, []);
	await h.tick(16);
	assert.deepEqual(h.changes, ['a']);
	assert.deepEqual(h.hashes, ['b']);
	await h.tick(916);
	assert.deepEqual(h.settlements, ['a']);
	assert.deepEqual(h.hashes, ['b', 'a']);
	h.tracker.dispose();
});

test('native clicks publish hashSection immediately; transient geometry cannot flip it', async () => {
	const h = harness('/#a');
	await settle(h);
	h.locate('/#b');
	h.browserEvents.emit('hashchange');
	assert.deepEqual(h.hashes, ['a', 'b']);
	assert.deepEqual(h.changes, ['a']);
	h.show('b');
	await h.tick(16);
	h.show('a');
	h.browserEvents.emit('scroll');
	await h.tick(16);
	h.show('b');
	h.browserEvents.emit('scroll');
	await settle(h);
	assert.deepEqual(h.changes, ['a', 'b', 'a', 'b']);
	assert.deepEqual(h.hashes, ['a', 'b']);
	h.tracker.dispose();
});

test('passive scrolling changes hashSection only after replaceState, without hashchange events', async () => {
	const h = harness('/#a');
	await settle(h);
	h.show('b');
	h.browserEvents.emit('scroll');
	await h.tick(16);
	assert.deepEqual(h.changes, ['a', 'b']);
	assert.deepEqual(h.hashes, ['a']);
	await h.tick(899);
	assert.deepEqual(h.hashes, ['a']);
	await h.tick(17);
	assert.deepEqual(h.hashes, ['a', 'b']);
	assert.equal(h.viewport.location.hash, '#b');
	assert.equal(h.viewport.scrollY, 123);
	h.tracker.dispose();
});

test('Back/Forward, unrelated anchors, registration changes and route completion refresh hashSection', () => {
	const h = harness('/#a');
	h.locate('/#b');
	h.browserEvents.emit('popstate');
	assert.deepEqual(h.hashes, ['a', 'b']);
	h.locate('/#latest-videos');
	h.browserEvents.emit('hashchange');
	assert.equal(h.hashes.at(-1), null);
	h.locate('/#a');
	h.browserEvents.emit('popstate');
	h.sections.delete('a');
	h.tracker.refreshSections();
	assert.equal(h.hashes.at(-1), null);
	h.add('a', 0, 1000);
	h.tracker.refreshSections();
	assert.equal(h.hashes.at(-1), 'a');
	h.locate('/other#a');
	h.events.emit('routeChangeComplete', '/other#a');
	assert.equal(h.hashes.at(-1), null);
	h.tracker.dispose();
});

test('scrolling within one dominant section does not postpone settlement', async () => {
	const h = harness();
	await h.tick(16);
	for (let i = 0; i < 8; i++) {
		h.a.rect = { top: -i * 10, bottom: 1000 - i * 10 };
		h.browserEvents.emit('scroll');
		await h.tick(100);
	}
	assert.deepEqual(h.settlements, []);
	await h.tick(116);
	assert.deepEqual(h.settlements, ['a']);
	h.tracker.dispose();
});

test('disconnected and CSS-invisible elements cannot win', async () => {
	for (const property of ['isConnected', 'visible']) {
		const h = harness();
		h.a[property] = false;
		await settle(h);
		assert.deepEqual(h.changes, []);
		assert.deepEqual(h.settlements, [null]);
		assert.deepEqual(h.views, []);
		h.tracker.dispose();
	}
});

test('a late-mounted bookmark resolves before the next measurement; stale cleanup keeps the replacement', async () => {
	const h = harness('/#later');
	const original = h.add('later', 200, 300);
	const unregister = registerSectionElement(
		h.sections,
		h.tracker.refreshSections,
		'later',
		original
	);
	assert.equal(h.hashes.at(-1), 'later');
	assert.deepEqual(h.changes, []);
	const replacement = h.add('later', 200, 300);
	const unregisterReplacement = registerSectionElement(
		h.sections,
		h.tracker.refreshSections,
		'later',
		replacement
	);
	unregister();
	assert.equal(h.sections.get('later'), replacement);
	assert.equal(h.observed.has(original), false);
	assert.equal(h.observed.has(replacement), true);
	unregisterReplacement();
	assert.equal(h.hashes.at(-1), null);
	assert.equal(h.observed.has(replacement), false);
	h.tracker.dispose();
});

test('page scopes include About, locale/base paths, and query strings', async () => {
	for (const path of [
		'/about',
		'/en-US/about',
		'/base/en-US/about?source=test'
	]) {
		const h = harness(`${path}#b`);
		assert.deepEqual(h.hashes, ['b']);
		await settle(h);
		assert.equal(h.writes[0].url, `${path}#a`);
		h.locate(`${path}${path.includes('?') ? '&' : '?'}other=1#a`);
		h.browserEvents.emit('popstate');
		assert.equal(h.hashes.at(-1), null);
		await settle(h);
		assert.equal(h.writes.length, 1);
		h.tracker.dispose();
	}
});

test('preserves dynamic internal URLs separately from displayed URLs and history options', async () => {
	const h = harness('/base/en-US/projects/example?source=test#old');
	const state = {
		__N: true,
		key: 'dynamic-key',
		url: '/projects/[slug]?slug=example&source=test#old',
		as: '/base/en-US/projects/example?source=test#old',
		options: { locale: 'en-US', shallow: true },
		custom: { kept: true }
	};
	h.viewport.history.state = state;
	await settle(h);
	assert.deepEqual(h.writes[0].state, {
		...state,
		url: '/projects/[slug]?slug=example&source=test#a',
		as: '/base/en-US/projects/example?source=test#a'
	});
	assert.equal(h.writes[0].state.options, state.options);
	assert.equal(state.as.endsWith('#old'), true);
	h.tracker.dispose();
});

test('encoded IDs resolve and compare by decoded identity, and obsolete encoded hashes clear', async () => {
	const h = harness('/#caf%C3%A9%20%26%20tea');
	h.show(null);
	h.add('café & tea', 0, 100);
	h.tracker.refreshSections();
	assert.equal(h.hashes.at(-1), 'café & tea');
	await settle(h);
	assert.deepEqual(h.writes, []);
	h.sections.delete('café & tea');
	h.tracker.refreshSections();
	await settle(h);
	assert.equal(h.viewport.location.hash, '');
	h.add('café & tea', 0, 100);
	h.tracker.refreshSections();
	await settle(h);
	assert.equal(h.viewport.location.hash, '#caf%C3%A9%20%26%20tea');
	h.tracker.dispose();
	const equivalent = harness('/#%61');
	await settle(equivalent);
	assert.deepEqual(equivalent.hashes, ['a']);
	assert.deepEqual(equivalent.writes, []);
	equivalent.tracker.dispose();
});

test('malformed, empty, and unrelated fragments remain unselected and survive an empty viewport', async () => {
	for (const hash of [
		'#%E0%A4%A',
		'#',
		'#latest-videos',
		'#top',
		'#start-of-content',
		'#intro'
	]) {
		const h = harness(`/${hash}`);
		h.show(null);
		await settle(h);
		assert.deepEqual(h.hashes, []);
		assert.deepEqual(h.writes, []);
		h.tracker.dispose();
	}
});

test('late observer, navigation and registry callbacks after disposal do nothing', async () => {
	const h = harness();
	const onComplete = h.events.listeners('routeChangeComplete')[0];
	const onHash = h.browserEvents.listeners('hashchange')[0];
	h.tracker.dispose();
	h.locate('/#b');
	h.resize();
	onComplete('/#b');
	onHash();
	h.tracker.refreshSections();
	await h.tick(3000);
	assert.equal(h.jobs.size, 0);
	assert.equal(h.observed.size, 0);
	assert.deepEqual(h.hashes, []);
	assert.deepEqual(h.writes, []);
});

test('section links distinguish origin, pathname and query while preserving encoded fragments', () => {
	const current = 'https://example.test/base/en-US/about?source=test#old';
	for (const href of [
		'#a',
		'?source=test#a',
		'/base/en-US/about?source=test#a',
		'https://example.test/base/en-US/about?source=test#a'
	]) {
		assert.deepEqual(resolveSectionLink(href, current), {
			sameDocument: true,
			id: 'a'
		});
	}
	for (const href of [
		'/base/en-US/about#a',
		'/base/en-US/contact?source=test#a',
		'https://other.test/base/en-US/about?source=test#a',
		'?source=other#a',
		'/about',
		'https://['
	]) {
		assert.equal(resolveSectionLink(href, current).sameDocument, false);
	}
	assert.deepEqual(resolveSectionLink('#caf%C3%A9', current), {
		sameDocument: true,
		id: 'café'
	});
	assert.deepEqual(resolveSectionLink('#%E0%A4%A', current), {
		sameDocument: true,
		id: null
	});
	assert.deepEqual(resolveSectionLink('#a', null), {
		sameDocument: true,
		id: 'a'
	});
	assert.equal(resolveSectionLink('/about#a', null).sameDocument, false);
});
