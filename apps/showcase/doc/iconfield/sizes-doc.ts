import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'voxx-ui/iconfield';
import { InputIconModule } from 'voxx-ui/inputicon';
import { InputTextModule } from 'voxx-ui/inputtext';
import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'sizes-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCodeModule, FormsModule, IconFieldModule, InputIconModule, InputTextModule],
    template: `
        <app-docsectiontext>
            <p>IconField is compatible with the vxSize setting of the input field.</p>
        </app-docsectiontext>
        <div class="card flex flex-col items-center gap-4">
            <vx-iconfield>
                <vx-inputicon class="pi pi-search" />
                <input vxInputText [(ngModel)]="value1" placeholder="Small" vxSize="small" />
            </vx-iconfield>

            <vx-iconfield>
                <input vxInputText [(ngModel)]="value2" placeholder="Normal" />
                <vx-inputicon class="pi pi-user" />
            </vx-iconfield>

            <vx-iconfield>
                <vx-inputicon class="pi pi-lock" />
                <input vxInputText [(ngModel)]="value3" placeholder="Large" vxSize="large" />
                <vx-inputicon class="pi pi-spin pi-spinner" />
            </vx-iconfield>
        </div>
        <app-code></app-code>
    `
})
export class SizesDoc {
    value1 = null;

    value2 = null;

    value3 = null;
}
