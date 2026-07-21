import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, ElementRef, forwardRef, inject, InjectionToken, ViewEncapsulation } from '@angular/core';
import { Tab as AriaTab } from '@angular/aria/tabs';
import { SharedModule } from 'voxx-ui/api';
import { BaseComponent, PARENT_INSTANCE } from 'voxx-ui/basecomponent';
import { Bind, BindModule, withoutAriaOwnedAttrs } from 'voxx-ui/bind';
import { Ripple } from 'voxx-ui/ripple';
import { TabPassThrough } from 'voxx-ui/types/tabs';
import { TabStyle } from './style/tabstyle';
import { TabList } from './tablist';
import { Tabs } from './tabs';

const TAB_INSTANCE = new InjectionToken<Tab>('TAB_INSTANCE');

/**
 * Defines valid properties in Tab component.
 *
 * Accessibility (`role="tab"`, roving `tabindex`, `aria-selected`,
 * `aria-disabled`, `aria-controls`, `id`) and keyboard navigation
 * (arrows / Home / End / Enter / Space) are delegated to the `@angular/aria`
 * `[ngTab]` primitive applied as a host directive — VoxxUI no longer hand-rolls
 * them. The `value` and `disabled` inputs are re-exposed from the primitive, so
 * the public API is unchanged. See the pt/aria precedence note in
 * `voxx-ui/bind` (aria-precedence.ts).
 * @group Components
 */
@Component({
    selector: 'vx-tab',
    imports: [SharedModule, BindModule],
    template: ` <ng-content></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': 'cx("root")',
        // aria (`[ngTab]`) owns role / id / tabindex / aria-selected /
        // aria-disabled / aria-controls. VoxxUI keeps only styling data-hooks.
        '[attr.data-p-disabled]': 'disabled()',
        '[attr.data-p-active]': 'active()',
        '(focus)': 'onFocus()'
    },
    // Ordering: Ripple, then aria `[ngTab]` (owns the a11y attributes and
    // keyboard behavior, re-exposing `value`/`disabled`), then Bind (pt).
    hostDirectives: [Ripple, { directive: AriaTab, inputs: ['value', 'disabled'] }, Bind],
    providers: [TabStyle, { provide: TAB_INSTANCE, useExisting: Tab }, { provide: PARENT_INSTANCE, useExisting: Tab }]
})
export class Tab extends BaseComponent<TabPassThrough> {
    componentName = 'Tab';

    $pcTab: Tab | undefined = inject(TAB_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    /** The `@angular/aria` primitive that owns this tab's a11y + keyboard behavior. */
    aria = inject(AriaTab, { self: true });

    onAfterViewChecked(): void {
        // pt/aria precedence: strip aria-owned attrs so pt can't fight the primitive.
        this.bindDirectiveInstance.setAttrs(withoutAriaOwnedAttrs(this.ptms(['host', 'root'])));
    }

    pcTabs = inject(forwardRef(() => Tabs));

    pcTabList = inject(forwardRef(() => TabList));

    el = inject(ElementRef);

    _componentStyle = inject(TabStyle);

    ripple = computed(() => this.config.ripple());

    /**
     * Value of tab.
     * @defaultValue undefined
     * @group Props
     */
    value = computed(() => this.aria.value());
    /**
     * Whether the tab is disabled.
     * @defaultValue false
     * @group Props
     */
    disabled = computed(() => this.aria.disabled());

    active = computed(() => this.aria.selected());

    mutationObserver: MutationObserver | undefined;

    /**
     * VoxxUI-specific behavior not covered by the aria primitive: when
     * `selectOnFocus` is enabled, focusing a tab (via keyboard roving, Tab key,
     * or programmatically) selects it. `[ngTab]` only auto-selects on arrow
     * navigation in `follow` mode, never on plain focus, so this shim stays.
     */
    onFocus() {
        if (!this.disabled() && this.pcTabs.selectOnFocus()) {
            this.pcTabs.updateValue(this.value());
        }
    }

    onAfterViewInit(): void {
        this.bindMutationObserver();
    }

    bindMutationObserver() {
        if (isPlatformBrowser(this.platformId)) {
            this.mutationObserver = new MutationObserver((mutations) => {
                mutations.forEach(() => {
                    if (this.active()) {
                        this.pcTabList?.updateInkBar();
                    }
                });
            });
            this.mutationObserver.observe(this.el.nativeElement, { childList: true, characterData: true, subtree: true });
        }
    }

    unbindMutationObserver() {
        this.mutationObserver?.disconnect();
    }

    onDestroy() {
        if (this.mutationObserver) {
            this.unbindMutationObserver();
        }
    }
}
