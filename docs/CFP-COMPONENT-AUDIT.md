# VoxxUI Component Audit — what cfp.dev actually uses

Evidence-based keep/delete list for pruning this fork down to what the CFP
platform needs, before any rename or Angular upgrade work.

## Method

Audited on 2026-07-17 against the production deployment at
**https://dvbe26.cfp.dev/** (Devoxx Belgium 2026 — the newest instance, running
the current build of the CFP app; `cfp.dev` itself now redirects to the
Squarespace marketing site and carries no app code).

1. Downloaded `main.*.js` plus all 76 lazy chunks listed in the webpack
   `runtime.*.js` chunk map (~8.9 MB of compiled app code).
2. Extracted every PrimeNG **component definition** compiled into the bundles
   via the Ivy pattern `selectors:[["p-..."]]` (case-insensitive, to catch
   camelCase aliases like `p-datePicker` / `p-multiSelect`).
3. Extracted every **attribute directive** definition via
   `selectors:[["","pXxx",""]]` (e.g. `pButton`, `pTooltip`, `pEditableColumn`).
4. A component whose definition is compiled into a bundle was imported by the
   app (Ivy tree-shakes unused standalone components / unimported modules), so
   definition-presence ≈ real usage. Bare CSS-class strings (e.g. `p-skeleton`
   appearing only in app stylesheets) were **not** counted as usage.

The bundle evidence also implies the app is already on **PrimeNG v21.x**
(new-generation selectors: `p-select`, `p-drawer`, `p-popover`,
`p-toggleswitch`, `p-tabs`/`p-tab` family, and `p-motion` which only exists in
v21) — so this fork's v21.1.9 baseline matches what the app runs today.

## Keep — 62 component entry points (evidence: compiled into cfp.dev bundles)

accordion, autocomplete, autofocus, avatar, avatargroup, badge, button, card,
chart, checkbox, chip, colorpicker, confirmdialog, dataview, datepicker,
dialog, drawer, dynamicdialog, editor, fileupload, floatlabel, fluid,
focustrap, iconfield, inputgroup, inputgroupaddon, inputicon, inputmask,
inputnumber, inputtext, listbox, menu, message, metergroup, motion,
multiselect, orderlist, overlay, paginator, panel, password, popover,
progressbar, progressspinner, radiobutton, rating, ripple, scroller,
scrollpanel, select, selectbutton, slider, splitbutton, splitter, steps,
styleclass, table, tabs, tag, tieredmenu, toast, togglebutton, toggleswitch,
tooltip

The table usage is heavy: the bundles contain the full edit/sort/reorder/filter
surface (`pEditableColumn`, `pEditableRow`, `pSortableColumn`,
`pResizableColumn`, `pRowToggler`, `p-columnfilter`, `p-tablecheckbox`,
`p-virtualscroller`) — treat `table` as the highest-risk component for the
Angular 22 / signal-forms migration.

## Keep — infrastructure (not user-facing, everything depends on it)

api, base, basecomponent, baseeditableholder, baseinput, basemodelholder,
bind, classnames, config, dom, icons, passthrough, ts-helpers, types,
usestyle, utils

## Delete — 37 entry points (no definition found in any bundle)

animateonscroll, blockui, breadcrumb, buttongroup, carousel, cascadeselect,
confirmpopup, contextmenu, divider, dock, dragdrop, fieldset, galleria,
iftalabel, image, imagecompare, inplace, inputotp, keyfilter, knob, megamenu,
menubar, organizationchart, overlaybadge, panelmenu, picklist, scrolltop,
skeleton, speeddial, stepper, terminal, textarea, timeline, toolbar, tree,
treeselect, treetable

### Borderline notes

- **skeleton, divider** — the strings `p-skeleton` / `p-divider` appear in the
  app's own CSS, but no component definition is compiled in: the app styles
  those class names itself without importing the components. Safe to delete;
  trivial to restore from upstream later if the app adopts them properly.
- **textarea, keyfilter** — tiny directive-only entry points the app doesn't
  use today but commonly gets adopted in form work. Cheap to keep if preferred;
  listed as delete because the evidence says unused.
- **confirmpopup** — unused; the app uses `confirmdialog` instead.

## Closure check (already verified)

The keep-set is closed under internal imports: no kept entry point contains a
`from 'primeng/<x>'` import where `<x>` is on the delete list (verified by
grep across all kept directories). Deleting the 37 directories cannot break
compilation of the kept library code. The showcase app **does** reference
deleted components (doc pages, routes) — `scripts/voxx-prune.sh` handles the
`doc/` and `pages/` directories and prints a checklist for the router/menu
references it can't safely auto-edit.

## Caveat for the rename pass

The `.p-*` CSS class names and `--p-*` design tokens are **not defined in this
repository** — they come from the external `@primeuix/styles`,
`@primeuix/styled` and `@primeuix/themes` npm packages. A `.p-*` → `.vx-*`
class rename therefore means forking the PrimeUIX packages too, which is a
much larger undertaking. Recommended split:

- **Now** (repo-local, done by `scripts/voxx-rename.mjs`): package names,
  import paths, component/directive selectors (`p-*` → `vx-*`,
  `pXxx` → `vxXxx`), and the config API
  (`providePrimeNG` → `provideVoxxUI`, `PRIME_NG_CONFIG` → `VOXX_UI_CONFIG`).
- **Config-level**: the `--p-*` CSS *variable* prefix is configurable per app
  via the theme options (`theme: { options: { prefix: 'vx' } }`) — no fork
  needed.
- **Later, only if branding demands it**: fork `@primeuix/styles`/`themes` to
  rename the `.p-*` classes themselves. Until then they remain an internal
  implementation detail, which also keeps drop-in compatibility with existing
  cfp.dev custom CSS that targets `.p-*` classes.
