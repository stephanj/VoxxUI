import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';
import { TabsModule } from 'voxx-ui/tabs';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'tabmenu-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, TabsModule],
    template: `
        <app-docsectiontext>
            <p>
                A navigation menu is implemented using tabs without the panels where the content of a tab is provided by a route component like
                <a href="https://angular.dev/api/router/RouterOutlet?tab=description" target="_blank" rel="noopener noreferrer">router-outlet</a>. For the purpose of this demo, <i>router-outlet</i> is not included.
            </p>
        </app-docsectiontext>
        <div class="card">
            <vx-tabs value="dashboard">
                <vx-tablist>
                    @for (tab of tabs; track tab.route) {
                        <vx-tab [value]="tab.route" class="flex items-center !gap-2 text-inherit">
                            <i [class]="tab.icon"></i>
                            <span>{{ tab.label }}</span>
                        </vx-tab>
                    }
                </vx-tablist>
            </vx-tabs>
            <!--<router-outlet></router-outlet>-->
        </div>
        <app-code></app-code>
    `
})
export class TabmenuDoc {
    tabs = [
        { route: 'dashboard', label: 'Dashboard', icon: 'pi pi-home' },
        { route: 'transactions', label: 'Transactions', icon: 'pi pi-chart-line' },
        { route: 'products', label: 'Products', icon: 'pi pi-list' },
        { route: 'messages', label: 'Messages', icon: 'pi pi-inbox' }
    ];
}
