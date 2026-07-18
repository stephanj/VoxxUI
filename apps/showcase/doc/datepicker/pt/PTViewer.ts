import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'voxx-ui/datepicker';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'datepicker-pt-viewer',
    standalone: true,
    imports: [AppDocPtViewer, DatePickerModule, FormsModule],
    template: `
        <app-docptviewer [docs]="docs">
            <vx-datepicker [(ngModel)]="date" [showTime]="true" [showButtonBar]="true" [showIcon]="true" [iconDisplay]="'button'" placeholder="Select a date" class="w-full md:w-80" />
        </app-docptviewer>
    `
})
export class PTViewer {
    date: Date | undefined;

    docs = [
        {
            data: getPTOptions('DatePicker'),
            key: 'DatePicker'
        }
    ];
}
