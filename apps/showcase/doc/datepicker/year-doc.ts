import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'voxx-ui/datepicker';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'year-doc',
    standalone: true,
    imports: [FormsModule, DatePickerModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>Specifying <i>view</i> as <i>year</i> in addition to a suitable <i>dateFormat</i> enables the year picker.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <vx-datepicker [(ngModel)]="date" view="year" dateFormat="yy" />
        </div>
        <app-code></app-code>
    `
})
export class YearDoc {
    date: Date[] | undefined;
}
