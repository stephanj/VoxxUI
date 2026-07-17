import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'voxx-ui/datepicker';
import { InputMaskModule } from 'voxx-ui/inputmask';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'mask-doc',
    standalone: true,
    imports: [FormsModule, DatePickerModule, InputMaskModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>DatePicker can be used with the <i>vxInputMask</i> directive to enforce a specific input format.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <vx-datepicker [(ngModel)]="date" dateFormat="dd/mm/yy" placeholder="dd/mm/yyyy" vxInputMask="99/99/9999" />
        </div>
        <app-code></app-code>
    `
})
export class MaskDoc {
    date: Date | undefined;
}
