import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'voxx-ui/datepicker';

@Component({
    selector: 'multiple-doc',
    standalone: true,
    imports: [FormsModule, DatePickerModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>In order to choose multiple dates, set <i>selectionMode</i> as <i>multiple</i>. In this mode, the value binding should be an array.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <vx-datepicker [(ngModel)]="dates" selectionMode="multiple" [readonlyInput]="true" />
        </div>
        <app-code></app-code>
    `
})
export class MultipleDoc {
    dates: Date[] | undefined;
}
