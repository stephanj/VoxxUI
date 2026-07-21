import { NgTemplateOutlet } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, contentChild, forwardRef, inject, InjectionToken, input, TemplateRef, ViewEncapsulation } from '@angular/core';
import { TabPanel as AriaTabPanel } from '@angular/aria/tabs';
import { BaseComponent, PARENT_INSTANCE } from 'voxx-ui/basecomponent';
import { Bind, BindModule, withoutAriaOwnedAttrs } from 'voxx-ui/bind';
import { TabPanelStyle } from './style/tabpanelstyle';
import { Tabs } from './tabs';
import { TabPanelPassThrough } from 'voxx-ui/types/tabs';

const TABPANEL_INSTANCE = new InjectionToken<TabPanel>('TABPANEL_INSTANCE');

/**
 * TabPanel is a helper component for Tabs component.
 *
 * `role="tabpanel"`, `id`, `aria-labelledby`, `tabindex` and the `inert` hidden
 * state are owned by the `@angular/aria` `[ngTabPanel]` primitive (host
 * directive). VoxxUI keeps its own visual hide (`[hidden]`) — aria only applies
 * `inert`, which does not visually hide — and its own `lazy` rendering. `value`
 * is re-exposed from the primitive so the public API is unchanged.
 * @group Components
 */
@Component({
    selector: 'vx-tabpanel',
    imports: [NgTemplateOutlet, BindModule],
    template: `
        <ng-template #defaultContent>
            <ng-content />
        </ng-template>

        @if (shouldRender()) {
            <ng-container *ngTemplateOutlet="content() ? content() : defaultContent" />
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [TabPanelStyle, { provide: TABPANEL_INSTANCE, useExisting: TabPanel }, { provide: PARENT_INSTANCE, useExisting: TabPanel }],
    host: {
        '[class]': 'cx("root")',
        // aria (`[ngTabPanel]`) owns role / id / aria-labelledby / tabindex / inert.
        '[attr.data-p-active]': 'active()',
        '[hidden]': '!active()'
    },
    hostDirectives: [{ directive: AriaTabPanel, inputs: ['value'] }, Bind]
})
export class TabPanel extends BaseComponent<TabPanelPassThrough> {
    componentName = 'TabPanel';

    $pcTabPanel: TabPanel | undefined = inject(TABPANEL_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    /** The `@angular/aria` primitive that owns this panel's a11y wiring. */
    aria = inject(AriaTabPanel, { self: true });

    pcTabs = inject<Tabs>(forwardRef(() => Tabs));

    onAfterViewChecked(): void {
        // pt/aria precedence: strip aria-owned attrs (see voxx-ui/bind aria-precedence.ts).
        this.bindDirectiveInstance.setAttrs(withoutAriaOwnedAttrs(this.ptms(['host', 'root'])));
    }

    /**
     * When enabled, tab is not rendered until activation.
     * @type boolean
     * @defaultValue false
     * @group Props
     */
    lazy = input(false, { transform: booleanAttribute });
    /**
     * Value of the active tab.
     * @defaultValue undefined
     * @group Props
     */
    value = computed(() => this.aria.value());
    /**
     * Template for initializing complex content when lazy is enabled.
     * @group Templates
     */
    content = contentChild<TemplateRef<any>>('content');

    active = computed(() => this.aria.visible());

    isLazyEnabled = computed(() => this.pcTabs.lazy() || this.lazy());

    private hasBeenRendered = false;

    shouldRender = computed(() => {
        if (!this.isLazyEnabled() || this.hasBeenRendered) {
            return true;
        }

        if (this.active()) {
            this.hasBeenRendered = true;
            return true;
        }

        return false;
    });

    _componentStyle = inject(TabPanelStyle);
}
