import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'voxx-ui/api';
import { MenuModule } from 'voxx-ui/menu';
import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'basic-doc',
    standalone: true,
    imports: [MenuModule, AppCodeModule, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>Menu requires a collection of menuitems as its <i>model</i>.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <vx-menu [model]="items" />
        </div>
        <app-code></app-code>
    `
})
export class BasicDoc implements OnInit {
    items: MenuItem[] | undefined;

    ngOnInit() {
        this.items = [
            { label: 'New', icon: 'pi pi-plus' },
            { label: 'Search', icon: 'pi pi-search' }
        ];
    }
}
