import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'voxx-ui/api';
import { ButtonModule } from 'voxx-ui/button';
import { MessageModule } from 'voxx-ui/message';
import { ToastModule } from 'voxx-ui/toast';
import { ToggleButtonModule } from 'voxx-ui/togglebutton';

@Component({
    selector: 'templatedrivenforms-doc',
    standalone: true,
    imports: [CommonModule, FormsModule, ToggleButtonModule, ToastModule, MessageModule, ButtonModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext> </app-docsectiontext>
        <vx-toast />
        <div class="card flex justify-center">
            <form #exampleForm="ngForm" (ngSubmit)="onSubmit(exampleForm)" class="flex flex-col items-center gap-4">
                <div class="flex flex-col items-center gap-1">
                    <vx-togglebutton #model="ngModel" [(ngModel)]="checked" [invalid]="model.invalid && (model.touched || exampleForm.submitted)" name="country" onLabel="Accept All" offLabel="Reject All" required class="min-w-40" />
                    @if (model.invalid && (model.touched || exampleForm.submitted)) {
                        <vx-message severity="error" size="small" variant="simple">Consent is mandatory.</vx-message>
                    }
                </div>
                <button vxButton type="submit">
                    <span vxButtonLabel>Submit</span>
                </button>
            </form>
        </div>
        <app-code></app-code>
    `
})
export class TemplateDrivenFormsDoc {
    messageService = inject(MessageService);

    checked: boolean;

    onSubmit(form: any) {
        if (form.valid) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form Submitted', life: 3000 });
            form.resetForm();
        }
    }
}
