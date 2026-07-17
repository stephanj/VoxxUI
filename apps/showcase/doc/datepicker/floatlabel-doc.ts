import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DatePickerModule } from 'voxx-ui/datepicker';
import { FloatLabelModule } from 'voxx-ui/floatlabel';

@Component({
    selector: 'floatlabel-doc',
    standalone: true,
    imports: [FormsModule, RouterModule, DatePickerModule, FloatLabelModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                A floating label appears on top of the input field when focused. Visit
                <a routerLink="/floatlabel">FloatLabel</a> documentation for more information.
            </p>
        </app-docsectiontext>
        <div class="card flex flex-wrap justify-center items-end gap-4">
            <vx-floatlabel>
                <vx-datepicker [(ngModel)]="value1" inputId="over_label" showIcon iconDisplay="input" />
                <label for="over_label">Over Label</label>
            </vx-floatlabel>

            <vx-floatlabel variant="in">
                <vx-datepicker [(ngModel)]="value2" inputId="in_label" showIcon iconDisplay="input" />
                <label for="in_label">In Label</label>
            </vx-floatlabel>

            <vx-floatlabel variant="on">
                <vx-datepicker [(ngModel)]="value3" inputId="on_label" showIcon iconDisplay="input" />
                <label for="on_label">On Label</label>
            </vx-floatlabel>
        </div>
        <app-code></app-code>
    `
})
export class FloatLabelDoc {
    value1: Date | undefined;

    value2: Date | undefined;

    value3: Date | undefined;
}
