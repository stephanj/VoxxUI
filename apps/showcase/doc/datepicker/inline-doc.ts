import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'voxx-ui/datepicker';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'inline-doc',
    standalone: true,
    imports: [FormsModule, DatePickerModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>DatePicker is displayed as a popup by default, add <i>inline</i> property to customize this behavior.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <vx-datepicker class="max-w-full" [(ngModel)]="date" [inline]="true" [showWeek]="true" />
        </div>
        <app-code></app-code>
    `
})
export class InlineDoc {
    date: Date[] | undefined;
}
