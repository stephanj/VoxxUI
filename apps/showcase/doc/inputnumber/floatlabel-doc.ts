import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputNumberModule } from 'voxx-ui/inputnumber';
import { FloatLabelModule } from 'voxx-ui/floatlabel';
import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'floatlabel-doc',
    standalone: true,
    imports: [FormsModule, RouterModule, InputNumberModule, FloatLabelModule, AppCodeModule, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                A floating label appears on top of the input field when focused. Visit
                <a routerLink="/floatlabel">FloatLabel</a> documentation for more information.
            </p>
        </app-docsectiontext>
        <div class="card flex flex-wrap justify-center items-end gap-4">
            <vx-floatlabel>
                <vx-inputnumber [(ngModel)]="value1" inputId="over_label" mode="currency" currency="USD" locale="en-US" />
                <label for="over_label">Over Label</label>
            </vx-floatlabel>

            <vx-floatlabel variant="in">
                <vx-inputnumber [(ngModel)]="value2" inputId="in_label" mode="currency" currency="USD" locale="en-US" />
                <label for="in_label">In Label</label>
            </vx-floatlabel>

            <vx-floatlabel variant="on">
                <vx-inputnumber [(ngModel)]="value3" inputId="on_label" mode="currency" currency="USD" locale="en-US" />
                <label for="on_label">On Label</label>
            </vx-floatlabel>
        </div>
        <app-code></app-code>
    `
})
export class FloatlabelDoc {
    value1: number | undefined;

    value2: number | undefined;

    value3: number | undefined;
}
