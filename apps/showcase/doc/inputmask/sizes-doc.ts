import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputMaskModule } from 'voxx-ui/inputmask';
import { InputText } from 'voxx-ui/inputtext';
import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'sizes-doc',
    standalone: true,
    imports: [FormsModule, InputMaskModule, InputText, AppCodeModule, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>InputMask provides <i>small</i> and <i>large</i> sizes as alternatives to the base.</p>
        </app-docsectiontext>
        <div class="card flex flex-col items-center gap-4">
            <input vxInputText [(ngModel)]="value1" placeholder="Small" vxSize="small" vxInputMask="99-999999" />
            <input vxInputText [(ngModel)]="value2" placeholder="Normal" vxInputMask="99-999999" />
            <input vxInputText [(ngModel)]="value3" placeholder="Large" vxSize="large" vxInputMask="99-999999" />
        </div>
        <app-code></app-code>
    `
})
export class SizesDoc {
    value1: string | undefined;

    value2: string | undefined;

    value3: string | undefined;
}
