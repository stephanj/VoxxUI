import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MenuModule } from 'voxx-ui/menu';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'menu-pt-viewer',
    standalone: true,
    imports: [AppDocPtViewer, MenuModule],
    template: `
        <app-docptviewer [docs]="docs">
            <vx-menu [model]="items" />
        </app-docptviewer>
    `
})
export class PTViewer {
    items = [
        {
            label: 'Documents',
            items: [
                {
                    label: 'New',
                    icon: 'pi pi-plus'
                },
                {
                    label: 'Search',
                    icon: 'pi pi-search'
                }
            ]
        },
        {
            separator: true
        },
        {
            label: 'Profile',
            items: [
                {
                    label: 'Settings',
                    icon: 'pi pi-cog'
                },
                {
                    label: 'Logout',
                    icon: 'pi pi-sign-out'
                }
            ]
        }
    ];

    docs = [
        {
            data: getPTOptions('Menu'),
            key: 'Menu'
        }
    ];
}
