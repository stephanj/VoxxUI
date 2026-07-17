import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputMaskModule } from 'voxx-ui/inputmask';
import { InputText } from 'voxx-ui/inputtext';
import { FloatLabelModule } from 'voxx-ui/floatlabel';
import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'floatlabel-doc',
    standalone: true,
    imports: [FormsModule, RouterModule, InputMaskModule, InputText, FloatLabelModule, AppCodeModule, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>FloatLabel visually integrates a label with its form element. Visit <a routerLink="/floatlabel">FloatLabel</a> documentation for more information.</p>
        </app-docsectiontext>
        <div class="card flex flex-wrap justify-center items-end gap-4">
            <vx-floatlabel>
                <input vxInputText id="over_label" [(ngModel)]="value1" vxInputMask="999-99-9999" />
                <label for="over_label">Over Label</label>
            </vx-floatlabel>

            <vx-floatlabel variant="in">
                <input vxInputText id="in_label" [(ngModel)]="value2" vxInputMask="999-99-9999" />
                <label for="in_label">In Label</label>
            </vx-floatlabel>

            <vx-floatlabel variant="on">
                <input vxInputText id="on_label" [(ngModel)]="value3" vxInputMask="999-99-9999" />
                <label for="on_label">On Label</label>
            </vx-floatlabel>
        </div>
        <app-code></app-code>
    `
})
export class FloatlabelDoc {
    value1: string | undefined;

    value2: string | undefined;

    value3: string | undefined;
}
