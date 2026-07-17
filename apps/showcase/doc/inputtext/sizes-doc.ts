import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'voxx-ui/inputtext';
import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'sizes-doc',
    standalone: true,
    imports: [FormsModule, InputTextModule, AppCodeModule, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>InputText provides <i>small</i> and <i>large</i> sizes as alternatives to the standard.</p>
        </app-docsectiontext>
        <div class="card flex flex-col items-center gap-4 ">
            <input vxInputText [(ngModel)]="value1" type="text" vxSize="small" placeholder="Small" />
            <input vxInputText [(ngModel)]="value2" type="text" placeholder="Normal" />
            <input vxInputText [(ngModel)]="value3" type="text" vxSize="large" placeholder="Large" />
        </div>
        <app-code></app-code>
    `
})
export class SizesDoc {
    value1: string | undefined;

    value2: string | undefined;

    value3: string | undefined;
}
