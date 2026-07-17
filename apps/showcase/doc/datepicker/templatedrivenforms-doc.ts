import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'voxx-ui/api';
import { ButtonModule } from 'voxx-ui/button';
import { DatePickerModule } from 'voxx-ui/datepicker';
import { MessageModule } from 'voxx-ui/message';
import { ToastModule } from 'voxx-ui/toast';

@Component({
    selector: 'templatedrivenforms-doc',
    standalone: true,
    imports: [FormsModule, DatePickerModule, MessageModule, ToastModule, ButtonModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext> </app-docsectiontext>
        <vx-toast />
        <div class="card flex justify-center">
            <form #exampleForm="ngForm" (ngSubmit)="onSubmit(exampleForm)" class="flex flex-col gap-4">
                <div class="flex flex-col gap-1">
                    <vx-datepicker name="date" [invalid]="dateModel.invalid && (dateModel.touched || exampleForm.submitted)" #dateModel="ngModel" [(ngModel)]="date" required />
                    @if (dateModel.invalid && (dateModel.touched || exampleForm.submitted)) {
                        <vx-message severity="error" size="small" variant="simple">Date is required.</vx-message>
                    }
                </div>
                <button vxButton severity="secondary" type="submit"><span vxButtonLabel>Submit</span></button>
            </form>
        </div>

        <app-code></app-code>
    `
})
export class TemplateDrivenFormsDoc {
    messageService = inject(MessageService);

    date: Date | undefined;

    onSubmit(form: any) {
        if (form.valid) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            form.resetForm();
        }
    }
}
