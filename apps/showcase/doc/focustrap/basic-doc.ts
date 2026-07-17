import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AutoFocusModule } from 'voxx-ui/autofocus';
import { ButtonModule } from 'voxx-ui/button';
import { CheckboxModule } from 'voxx-ui/checkbox';
import { FocusTrapModule } from 'voxx-ui/focustrap';
import { IconFieldModule } from 'voxx-ui/iconfield';
import { InputIconModule } from 'voxx-ui/inputicon';
import { InputTextModule } from 'voxx-ui/inputtext';

@Component({
    selector: 'basic-doc',
    standalone: true,
    imports: [FormsModule, AppCode, AppDocSectionText, AutoFocusModule, ButtonModule, CheckboxModule, FocusTrapModule, IconFieldModule, InputIconModule, InputTextModule],
    template: `
        <app-docsectiontext>
            <p>FocusTrap is applied to a container element with the <i>vxFocusTrap</i> directive.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <div vxFocusTrap class="w-full sm:w-80 flex flex-col gap-6">
                <vx-iconfield>
                    <vx-inputicon>
                        <i class="pi pi-user"></i>
                    </vx-inputicon>
                    <input type="text" vxInputText id="input" [(ngModel)]="name" type="text" placeholder="Name" [vxAutoFocus]="true" [fluid]="true" />
                </vx-iconfield>

                <vx-iconfield>
                    <vx-inputicon>
                        <i class="pi pi-envelope"> </i>
                    </vx-inputicon>
                    <input type="text" vxInputText id="email" [(ngModel)]="email" type="email" placeholder="Email" [fluid]="true" />
                </vx-iconfield>

                <div class="flex items-center gap-2">
                    <vx-checkbox id="accept" [(ngModel)]="accept" name="accept" value="Accept" />
                    <label for="accept">I agree to the terms and conditions.</label>
                </div>

                <vx-button type="submit" label="Submit" class="mt-2" styleClass="w-full" />
            </div>
        </div>
        <app-code></app-code>
    `
})
export class BasicDoc {
    name: string = '';

    email: string = '';

    accept: boolean = false;
}
