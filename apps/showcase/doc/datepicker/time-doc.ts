import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'voxx-ui/datepicker';
import { FluidModule } from 'voxx-ui/fluid';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'time-doc',
    standalone: true,
    imports: [FormsModule, DatePickerModule, FluidModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>A time picker is displayed when <i>showTime</i> is enabled where 12/24 hour format is configured with <i>hourFormat</i> property. In case, only time needs to be selected, add <i>timeOnly</i> to hide the date section.</p>
        </app-docsectiontext>

        <vx-fluid class="card flex flex-wrap gap-4">
            <div class="flex-auto">
                <label for="calendar-12h" class="font-bold block mb-2"> 12h Format </label>
                <vx-datepicker inputId="calendar-12h" [(ngModel)]="datetime12h" [showTime]="true" [hourFormat]="12" />
            </div>
            <div class="flex-auto">
                <label for="calendar-24h" class="font-bold block mb-2"> 24h Format </label>
                <vx-datepicker inputId="calendar-24h" [(ngModel)]="datetime24h" [showTime]="true" [hourFormat]="24" />
            </div>
            <div class="flex-auto">
                <label for="calendar-timeonly" class="font-bold block mb-2"> Time Only </label>
                <vx-datepicker inputId="calendar-timeonly" [(ngModel)]="time" [timeOnly]="true" />
            </div>
        </vx-fluid>

        <app-code></app-code>
    `
})
export class TimeDoc {
    datetime12h: Date[] | undefined;

    datetime24h: Date[] | undefined;

    time: Date[] | undefined;
}
