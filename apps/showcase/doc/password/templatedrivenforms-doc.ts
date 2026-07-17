import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MessageService } from 'voxx-ui/api';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'voxx-ui/password';
import { ButtonModule } from 'voxx-ui/button';
import { ToastModule } from 'voxx-ui/toast';
import { MessageModule } from 'voxx-ui/message';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'templatedrivenforms-doc',
    standalone: true,
    imports: [FormsModule, PasswordModule, ButtonModule, ToastModule, MessageModule, AppCode, AppDocSectionText],
    providers: [MessageService],
    template: `
        <app-docsectiontext> </app-docsectiontext>
        <vx-toast />
        <div class="card flex justify-center">
            <form #exampleForm="ngForm" (ngSubmit)="onSubmit(exampleForm)" class="flex justify-center flex-col gap-4 md:w-56">
                <div class="flex flex-col gap-1">
                    <vx-password #model="ngModel" [(ngModel)]="value" [invalid]="model.invalid && (model.touched || exampleForm.submitted)" name="password" [feedback]="false" autocomplete="off" required fluid />

                    @if (model.invalid && (model.touched || exampleForm.submitted)) {
                        <vx-message severity="error" size="small" variant="simple">Password is required.</vx-message>
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

    value: any;

    onSubmit(form: any) {
        if (form.valid) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form Submitted', life: 3000 });
            form.resetForm();
        }
    }
}
