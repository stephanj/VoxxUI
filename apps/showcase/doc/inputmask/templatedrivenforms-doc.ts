import { AppCodeModule } from '@/components/doc/app.code';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'voxx-ui/api';
import { ButtonModule } from 'voxx-ui/button';
import { FluidModule } from 'voxx-ui/fluid';
import { InputMaskModule } from 'voxx-ui/inputmask';
import { InputText } from 'voxx-ui/inputtext';
import { MessageModule } from 'voxx-ui/message';
import { ToastModule } from 'voxx-ui/toast';

@Component({
    selector: 'templatedrivenforms-doc',
    standalone: true,
    imports: [FormsModule, InputMaskModule, InputText, ButtonModule, ToastModule, MessageModule, FluidModule, AppCodeModule],
    template: `
        <vx-toast />
        <div class="card flex justify-center">
            <form #exampleForm="ngForm" (ngSubmit)="onSubmit(exampleForm)" class="flex justify-center flex-col gap-4 md:w-56">
                <div class="flex flex-col gap-1">
                    <input vxInputText name="serial" vxInputMask="99-999999" #serialNumber="ngModel" [(ngModel)]="value" placeholder="99-999999" [invalid]="serialNumber.invalid && (serialNumber.touched || exampleForm.submitted)" required fluid />
                    @if (serialNumber.invalid && (serialNumber.touched || exampleForm.submitted)) {
                        <vx-message severity="error" size="small" variant="simple">Serial number is required.</vx-message>
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

    items: any[] = [];

    value: any;

    onSubmit(form: any) {
        if (form.valid) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form Submitted', life: 3000 });
            form.resetForm();
        }
    }
}
