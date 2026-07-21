/**
 * ────────────────────────────────────────────────────────────────────────────
 *  pt / `@angular/aria` precedence rule  (shared note — see issue #26 / #28)
 * ────────────────────────────────────────────────────────────────────────────
 *
 * VoxxUI components that delegate their accessibility semantics to an
 * `@angular/aria` primitive (via `hostDirectives`) let the aria directive OWN
 * the accessibility contract of the element it manages: `role`, every `aria-*`
 * attribute, `tabindex`, and `id`. The aria directive writes these as reactive
 * host bindings that reflect the interaction state it manages (roving focus,
 * selection, expansion, …).
 *
 * VoxxUI also exposes a `pt` / `vxBind` passthrough that lets users spray
 * arbitrary attributes onto internal DOM sections. On elements that are NOT
 * aria-managed, `pt` continues to work exactly as before. On an aria-MANAGED
 * element these two mechanisms collide.
 *
 * RULE (established here, referenced by #28):
 *
 *     The aria directive always wins. On an aria-managed element, `pt` /
 *     `vxBind` overrides of the aria-owned attributes (`role`, `aria-*`,
 *     `tabindex`, `id`) become NO-OPS — they are stripped before the
 *     passthrough is applied so they can never fight the directive's reactive
 *     bindings (which would otherwise flip-flop the attribute on every change
 *     detection pass and corrupt the a11y tree).
 *
 * Everything else in `pt` (classes, styles, `data-*`, event listeners, other
 * attributes) is untouched and applied normally.
 *
 * Components apply the rule by funnelling their host passthrough through
 * {@link withoutAriaOwnedAttrs} before handing it to the {@link Bind} directive.
 */

/** Exact attribute names owned by aria-managed hosts (case-insensitive). */
export const ARIA_OWNED_ATTRS = ['role', 'tabindex', 'id'] as const;

/**
 * Returns a shallow copy of a `pt`/`vxBind` attribute bag with the
 * aria-directive-owned keys (`role`, `tabindex`, `id`, and any `aria-*`)
 * removed, so passthrough can never override what the `@angular/aria`
 * directive manages on that element. `class`, `style`, `data-*`, event
 * handlers and all other keys are preserved.
 *
 * See the module doc block for the full precedence rule (#26 / #28).
 */
export function withoutAriaOwnedAttrs<T extends Record<string, any> | undefined>(attrs: T): T {
    if (!attrs) {
        return attrs;
    }

    let stripped: Record<string, any> | undefined;

    for (const key of Object.keys(attrs)) {
        const lower = key.toLowerCase();
        if (lower.startsWith('aria-') || (ARIA_OWNED_ATTRS as readonly string[]).includes(lower)) {
            // Lazily clone only when we actually need to drop something.
            stripped ??= { ...attrs };
            delete stripped[key];
        }
    }

    return (stripped ?? attrs) as T;
}
