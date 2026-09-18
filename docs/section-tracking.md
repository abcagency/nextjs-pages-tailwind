# Section tracking

`SectionProvider` owns one window-viewport tracker per page URL (pathname and
query). Hash changes keep the provider mounted. Home and About register their
`alpha` and `beta` sections; Home's `intro` explicitly uses `track={false}` to
preserve its existing exclusion. Sections without an ID do not register.

The shared context exposes:

- `currentSection`: the dominant visible section, updated on the next frame.
- `settledSection`: the last winner stable for 900 ms. Continued scrolling within
  that section does not restart the interval.
- `hashSection`: the registered ID in the actual URL. Section navigation uses
  only this value for highlighting.

`lib/section-tracking.ts` adapts the migrate-section-tracking reference to
TypeScript, page-specific URL scopes, encoded fragments, and separate internal
and displayed Next.js history URLs. It observes section sizes and window events,
and replaces history only after settlement. It never scrolls or calls the router
to synchronize a fragment. Analytics retain the `eventTracking` event with
category `Engagement`, action `View Section`, and the section ID as the label,
once per section per provider lifetime. Analytics errors cannot block URL updates.

`Section` registers its outer element and cleans up on removal. The old
`useSectionTracker` hook and writable `setCurrentSection` context API were removed;
consumers should read the appropriate context value instead.

`NavLink.Anchor` renders native anchors for same-document fragments, comparing
origin, pathname, and query. Other destinations retain Next.js navigation and
route-active styles. `NavLink.ScrollAnchor` accepts an ID or fragment and native
anchor props. Both use `hashSection` for section-active styles. Existing header
items remain About and Contact; no additional navigation items were introduced.
The footer's `#top` and the skip link remain native, untracked destinations.

## Verification

Run `npm run test:sections` with Node 22.18+ (native TypeScript stripping). The
tests import the production tracker and cover geometry, timers, history/events,
registration, URL scopes, link resolution, and cleanup. Run `npx tsc --noEmit`
for the React integration's types.

Browser acceptance remains necessary when a preview is available: clean
reload/direct bookmarks, desktop/mobile navigation, repeated clicks, boundary
scrolling, short sections, Back/Forward, and unrelated anchors. Sample the active
class, URL, and scroll position before and after settlement; a passive replacement
must leave scroll position unchanged. Unit tests alone do not establish browser
history restoration or absence of visual flicker.
