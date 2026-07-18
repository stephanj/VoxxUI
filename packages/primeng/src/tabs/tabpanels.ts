import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, InjectionToken, ViewEncapsulation } from '@angular/core';
import { BaseComponent, PARENT_INSTANCE } from 'voxx-ui/basecomponent';
import { Bind, BindModule } from 'voxx-ui/bind';
import { TabPanelsStyle } from './style/tabpanelsstyle';
import { TabPanelsPassThrough } from 'voxx-ui/types/tabs';

const TABPANELS_INSTANCE = new InjectionToken<TabPanels>('TABPANELS_INSTANCE');

/**
 * TabPanels is a helper component for Tabs component.
 * @group Components
 */
@Component({
    selector: 'vx-tabpanels',
    imports: [CommonModule, BindModule],
    template: ` <ng-content></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': 'cx("root")',
        '[attr.role]': '"presentation"'
    },
    providers: [TabPanelsStyle, { provide: TABPANELS_INSTANCE, useExisting: TabPanels }, { provide: PARENT_INSTANCE, useExisting: TabPanels }],
    hostDirectives: [Bind]
})
export class TabPanels extends BaseComponent<TabPanelsPassThrough> {
    componentName = 'TabPanels';

    $pcTabPanels: TabPanels | undefined = inject(TABPANELS_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(TabPanelsStyle);

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }
}
