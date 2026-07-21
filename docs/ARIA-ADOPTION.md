# `@angular/aria` adoption

VoxxUI is incrementally delegating hand-rolled keyboard/focus/ARIA logic to
Angular's GA `@angular/aria` primitives (v22). This document records the
adoption policy, the `pt`/aria precedence rule, the current state, and the
upstream constraints that gate wider adoption.

Background analysis: issue #23 (spike). Implementation: #26 (Tabs, Accordion),
#27 (Listbox pilot), #28 (this groundwork).

## New-component policy

**New interactive components MUST build on the matching `@angular/aria` pattern
where one exists** (listbox, combobox, menu, tabs, tree, accordion, grid,
toolbar), rather than hand-rolling keyboard/focus/ARIA. Use the pattern-layer
escape hatch (the exported `*Pattern` objects with `SignalLike` inputs) when a
directive input can't be reached through `hostDirectives` (see constraints
below). Only hand-roll accessibility when no `@angular/aria` pattern covers the
interaction.

Existing components are migrated opportunistically and only when the trade is
favorable — see "Current state" for why that is component-specific.

## The `pt` / aria precedence rule

Implemented and documented in `packages/primeng/src/bind/aria-precedence.ts`
(exported from `voxx-ui/bind` as `withoutAriaOwnedAttrs()`).

When a component delegates its accessibility to an `@angular/aria` primitive via
`hostDirectives`, the aria directive **owns** the accessibility contract of the
element it manages: `role`, every `aria-*` attribute, `tabindex`, and `id`. It
writes these as reactive host bindings reflecting the interaction state it
manages (roving focus, active descendant, selection, expansion, …).

VoxxUI's `pt` / `vxBind` passthrough lets consumers spray arbitrary attributes
onto internal DOM sections. On aria-managed elements the two collide.

**Rule: the aria directive always wins.** On an aria-managed element, `pt`/`vxBind`
overrides of `role` / `aria-*` / `tabindex` / `id` become **no-ops** (stripped
before passthrough via `withoutAriaOwnedAttrs()`). Everything else a consumer
passes through `pt` — `class`, `style`, `data-*`, event bindings — is untouched.
This is a minor, documented breaking change limited to aria-attribute overrides
on the specific elements a migrated component hands to `@angular/aria`.

## Verified integration constraints

Discovered empirically while migrating Tabs (#26) and Listbox (#27); treat as
given for future migrations:

1. **A component cannot set a host-applied directive's input via host metadata**
   (throws NG0303), and `hostDirectives` cannot pass literal input values. To
   configure a primitive applied through `hostDirectives`, use the pattern-layer
   escape hatch (reassign the exported pattern object's fields, e.g.
   `_pattern.followFocus = signal(false)`) or expose an input the consumer binds.
2. **Aria's DI does not cross content projection.** The aria directive must sit
   on the projected-content **ancestor host**, not an inner view element, or its
   `inject()`-based wiring (e.g. `TAB_LIST`) fails.
3. **Runtime conventions:** aria matches keys off `event.key` (not `code`),
   handles keyboard at the **container** (synthetic test events must bubble),
   and hides inactive content with **`inert`**, not `hidden`/`display`. Visual
   hiding stays VoxxUI's responsibility.
4. **Value matching is `===` identity only** (no `compareWith`). Bridge to
   VoxxUI's `dataKey`/`optionValue` object-equality with a value-key adapter
   (see `listbox.ts`): map model values ↔ primitive keys, and route selection
   back through the component's existing `updateModel`/CVA path.
5. **The item registry is DOM-based** — only rendered `ngOption`s participate in
   navigation/typeahead, so aria cannot drive full-dataset keyboard nav under
   virtual scrolling. Keep the legacy engine on the virtual-scroll path.
6. **Click selection should stay VoxxUI-owned** for overlay controls: aria's
   click-toggle only fires when the active item *moves*, so a click on the
   already-active option is a silent no-op. Pattern: `stopPropagation()` +
   `gotoIndex()` + toggle through VoxxUI's own selection; keep keyboard
   selection aria-owned.

## Current state

| Component | Status | Notes |
|---|---|---|
| **Tabs** | ✅ Adopted (#26) | Clean −130 LOC win; no virtual scroll, single engine. |
| **Listbox** | ⚗️ Pilot landed, flag-guarded (#27) | `useAria = !virtualScroll && !metaKeySelection && !selectOnFocus`; legacy engine kept otherwise. Net **+301 LOC** (permanent dual path). |
| **Accordion** | ⛔ Blocked (#26) | Aria's `AccordionTrigger.panel` is `input.required` needing an object-ref to its panel; VoxxUI's trigger/content are separate projected siblings with no supported feed path. |
| **Select / MultiSelect / AutoComplete** | ⏸ On hold | Pilot (#27) shows **conditional GO**: viable, but overlay-driven + virtual-scroll-heavy ⇒ net-additive LOC and a permanent dual path. Adopt only if the goal is framework-maintained keyboard correctness, **not** code reduction. |
| **Menu / TieredMenu** | ⏸ Deferred | Model-driven `MenuItem[]` API + per-submenu overlays; low LOC win vs. rework (#23). |
| **DatePicker / Table** | ❌ Not adopting | No upstream calendar pattern; Table's grid win doesn't justify the risk (#23). |

**Key strategic finding (from the #27 pilot):** for the activedescendant/overlay
family, `@angular/aria` is **net-additive** — virtual scroll and
`metaKeySelection` force the hand-rolled engine to remain, so aria adds a second
engine rather than replacing one. This inverts the LOC-reduction motivation from
the #23 spike for that family. Tabs was a clean win because it has neither.

## Upstream constraints to track (angular/components)

Two `@angular/aria` limitations gate confident adoption across the
listbox/combobox family. Drafts to file upstream (see #28):

1. **Custom value equality for Listbox/Tree option matching.** `Listbox`/`Option`
   match selected values by `===` identity with no `compareWith`-style hook.
   Component libraries with object option values keyed by an id field (VoxxUI's
   `dataKey`) must maintain a value-key adapter. A `compareWith` / key-selector
   input on `ngListbox` would remove that adapter layer.

2. **Virtualization-aware item collections.** The item collection is built from
   rendered `ngOption` directives (`SortedCollection`), so under windowed virtual
   scrolling only the rendered slice participates in navigation, Home/End, and
   typeahead. An index/total-count-aware collection API (or a documented
   virtual-scroll integration) would let windowed lists keep full-dataset
   keyboard behavior, removing the dual-engine requirement.

Filing these is outside this repo's automation scope; the drafts live on issue
#28 for a maintainer to file.
