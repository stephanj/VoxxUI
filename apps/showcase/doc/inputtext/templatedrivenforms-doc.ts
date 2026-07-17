import { Component, inject } from '@angular/core';
import { MessageService } from 'voxx-ui/api';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'voxx-ui/inputtext';
import { ButtonModule } from 'voxx-ui/button';
import { ToastModule } from 'voxx-ui/toast';
import { MessageModule } from 'voxx-ui/message';
import { AppCodeModule } from '@/components/doc/app.code';

@Component({
    selector: 'templatedrivenforms-doc',
    standalone: true,
    imports: [FormsModule, InputTextModule, ButtonModule, ToastModule, MessageModule, AppCodeModule],
    template: `
        <vx-toast />
        <div class="card flex justify-center">
            <form #exampleForm="ngForm" (ngSubmit)="onSubmit(exampleForm)" class="flex flex-col gap-4 w-full sm:w-56">
                <div class="flex flex-col gap-1">
                    <input vxInputText type="text" id="username" placeholder="Username" name="username" [(ngModel)]="user.username" #username="ngModel" [invalid]="username.invalid && (username.touched || exampleForm.submitted)" required />
                    @if (username.invalid && (username.touched || exampleForm.submitted)) {
                        <vx-message severity="error" size="small" variant="simple">Username is required.</vx-message>
                    }
                </div>
                <div class="flex flex-col gap-1">
                    <input vxInputText type="email" id="email" name="email" placeholder="Email" [(ngModel)]="user.email" #email="ngModel" required email [invalid]="email.invalid && (email.touched || exampleForm.submitted)" />
                    @if (email.invalid && (email.touched || exampleForm.submitted)) {
                        <vx-message severity="error" size="small" variant="simple">
                            @if (email.hasError('required')) {
                                Email is Required.
                            }
                            @if (email.hasError('email')) {
                                Please enter a valid email.
                            }
                        </vx-message>
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

    user = {
        username: '',
        email: ''
    };

    onSubmit(form: any) {
        if (form.valid) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form Submitted', life: 3000 });
            form.resetForm();
        }
    }
}
