import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputMaskModule } from 'voxx-ui/inputmask';
import { InputTextModule } from 'voxx-ui/inputtext';
import { MessageModule } from 'voxx-ui/message';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'form-doc',
    standalone: true,
    imports: [FormsModule, MessageModule, InputTextModule, InputMaskModule, AppCodeModule, AppDocSectionText, CommonModule],
    template: `
        <app-docsectiontext>
            <p>Validation errors in a form are displayed with the <i>error</i> severity.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <div class="flex flex-col gap-4">
                <vx-message severity="error" icon="pi pi-times-circle" styleClass="mb-2">Validation Failed</vx-message>
                <div class="flex flex-col gap-1">
                    <input vxInputText placeholder="Username" [(ngModel)]="username" aria-label="username" [invalid]="!username" />
                    @if (!username) {
                        <vx-message severity="error" variant="simple" size="small">Username is required</vx-message>
                    }
                </div>
                <div class="flex flex-col gap-1">
                    <vx-inputmask mask="(999) 999-9999" [(ngModel)]="phone" placeholder="Phone" [invalid]="!phone" />
                    @if (!phone) {
                        <vx-message severity="error" variant="simple" size="small">Phone number is required</vx-message>
                    }
                </div>
            </div>
        </div>
        <app-code></app-code>
    `
})
export class FormDoc {
    username: string | undefined;

    phone: string | undefined;
}
