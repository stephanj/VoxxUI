import { Component } from '@angular/core';
import { IconFieldModule } from 'voxx-ui/iconfield';
import { InputIconModule } from 'voxx-ui/inputicon';
import { InputTextModule } from 'voxx-ui/inputtext';
import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'basic-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCodeModule, IconFieldModule, InputIconModule, InputTextModule],
    template: `
        <app-docsectiontext>
            <p>
                A group is created by wrapping the input and icon with the <i>IconField</i> component. Each icon is defined as a child of <i>InputIcon</i> component. In addition, position of the icon can be changed using <i>iconPosition</i> property
                that the default value is <i>right</i> and also <i>left</i> option is available.
            </p>
        </app-docsectiontext>
        <div class="card flex flex-wrap justify-center gap-4">
            <vx-iconfield>
                <vx-inputicon class="pi pi-search" />
                <input type="text" vxInputText placeholder="Search" />
            </vx-iconfield>
            <vx-iconfield>
                <input type="text" vxInputText />
                <vx-inputicon class="pi pi-spinner pi-spin" />
            </vx-iconfield>
        </div>
        <app-code></app-code>
    `
})
export class BasicDoc {}
