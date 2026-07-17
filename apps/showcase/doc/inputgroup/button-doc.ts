import { Component } from '@angular/core';
import { MenuItem } from 'voxx-ui/api';
import { InputGroupModule } from 'voxx-ui/inputgroup';
import { InputGroupAddonModule } from 'voxx-ui/inputgroupaddon';
import { InputTextModule } from 'voxx-ui/inputtext';
import { ButtonModule } from 'voxx-ui/button';
import { MenuModule } from 'voxx-ui/menu';
import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'button-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCodeModule, InputGroupModule, InputGroupAddonModule, InputTextModule, ButtonModule, MenuModule],
    template: `
        <app-docsectiontext>
            <p>Buttons can be placed at either side of an input element.</p>
        </app-docsectiontext>
        <div class="card flex flex-col md:flex-row gap-4">
            <vx-inputgroup>
                <vx-button label="Search" />
                <input vxInputText placeholder="Keyword" />
            </vx-inputgroup>

            <vx-inputgroup>
                <input vxInputText placeholder="Keyword" />
                <vx-inputgroup-addon>
                    <vx-button icon="pi pi-search" severity="secondary" variant="text" (click)="menu.toggle($event)" />
                </vx-inputgroup-addon>
            </vx-inputgroup>
            <vx-menu #menu [model]="items" popup styleClass="!min-w-fit" />

            <vx-inputgroup>
                <vx-inputgroup-addon>
                    <vx-button icon="pi pi-check" severity="secondary" />
                </vx-inputgroup-addon>
                <input vxInputText placeholder="Vote" />
                <vx-inputgroup-addon>
                    <vx-button icon="pi pi-times" severity="secondary" />
                </vx-inputgroup-addon>
            </vx-inputgroup>
        </div>
        <app-code></app-code>
    `
})
export class ButtonDoc {
    items: MenuItem[] | undefined;

    ngOnInit() {
        this.items = [{ label: 'Web Search' }, { label: 'AI Assistant' }, { label: 'History' }];
    }
}
