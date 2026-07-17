import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PasswordModule } from 'voxx-ui/password';
import { FloatLabelModule } from 'voxx-ui/floatlabel';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'floatlabel-doc',
    standalone: true,
    imports: [FormsModule, RouterModule, PasswordModule, FloatLabelModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                A floating label appears on top of the input field when focused. Visit
                <a routerLink="/floatlabel">FloatLabel</a> documentation for more information.
            </p>
        </app-docsectiontext>
        <div class="card flex flex-wrap justify-center items-end gap-4">
            <vx-floatlabel>
                <vx-password [(ngModel)]="value1" inputId="over_label" autocomplete="off" />
                <label for="over_label">Over Label</label>
            </vx-floatlabel>

            <vx-floatlabel variant="in">
                <vx-password [(ngModel)]="value2" inputId="in_label" autocomplete="off" />
                <label for="in_label">In Label</label>
            </vx-floatlabel>

            <vx-floatlabel variant="on">
                <vx-password [(ngModel)]="value3" inputId="on_label" autocomplete="off" />
                <label for="on_label">On Label</label>
            </vx-floatlabel>
        </div>
        <app-code></app-code>
    `
})
export class FloatLabelDoc {
    value1!: string;

    value2!: string;

    value3!: string;
}
