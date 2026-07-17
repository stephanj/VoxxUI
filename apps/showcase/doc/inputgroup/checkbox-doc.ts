import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'voxx-ui/inputgroup';
import { InputGroupAddonModule } from 'voxx-ui/inputgroupaddon';
import { InputTextModule } from 'voxx-ui/inputtext';
import { CheckboxModule } from 'voxx-ui/checkbox';
import { RadioButtonModule } from 'voxx-ui/radiobutton';
import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'checkbox-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCodeModule, FormsModule, InputGroupModule, InputGroupAddonModule, InputTextModule, CheckboxModule, RadioButtonModule],
    template: `
        <app-docsectiontext>
            <p>Checkbox and RadioButton components can be combined with an input element under the same group.</p>
        </app-docsectiontext>
        <div class="card flex flex-col md:flex-row gap-4">
            <vx-inputgroup>
                <input type="text" vxInputText placeholder="Price" />
                <vx-inputgroup-addon><vx-radiobutton [(ngModel)]="radioValue1" name="rb1" value="rb1" /></vx-inputgroup-addon>
            </vx-inputgroup>

            <vx-inputgroup>
                <vx-inputgroup-addon><vx-checkbox [(ngModel)]="checked1" [binary]="true" /></vx-inputgroup-addon>
                <input type="text" vxInputText placeholder="Username" />
            </vx-inputgroup>

            <vx-inputgroup>
                <vx-inputgroup-addon><vx-checkbox [(ngModel)]="checked2" [binary]="true" /></vx-inputgroup-addon>
                <input type="text" vxInputText placeholder="Website" />
                <vx-inputgroup-addon><vx-radiobutton name="rb2" value="rb2" [(ngModel)]="category" /></vx-inputgroup-addon>
            </vx-inputgroup>
        </div>
        <app-code></app-code>
    `
})
export class CheckboxDoc {
    radioValue1: boolean = false;

    checked1: boolean = false;

    checked2: boolean = false;

    category: string | undefined;
}
