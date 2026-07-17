import { Component, inject } from '@angular/core';
import { MessageService } from 'voxx-ui/api';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'voxx-ui/inputtext';
import { ButtonModule } from 'voxx-ui/button';
import { ToastModule } from 'voxx-ui/toast';
import { MessageModule } from 'voxx-ui/message';
import { AppCodeModule } from '@/components/doc/app.code';

@Component({
    selector: 'reactiveforms-doc',
    standalone: true,
    imports: [ReactiveFormsModule, InputTextModule, ButtonModule, ToastModule, MessageModule, AppCodeModule],
    template: `
        <vx-toast />
        <div class="card flex justify-center">
            <form [formGroup]="exampleForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4 w-full sm:w-56">
                <div class="flex flex-col gap-1">
                    <input vxInputText type="text" id="username" placeholder="Username" formControlName="username" [invalid]="isInvalid('username')" />
                    @if (isInvalid('username')) {
                        <vx-message severity="error" size="small" variant="simple">Username is required.</vx-message>
                    }
                </div>
                <div class="flex flex-col gap-1">
                    <input vxInputText type="email" id="email" placeholder="Email" formControlName="email" [invalid]="isInvalid('email')" />
                    @if (isInvalid('email')) {
                        @if (exampleForm.get('email')?.errors?.['required']) {
                            <vx-message severity="error" size="small" variant="simple">Email is required.</vx-message>
                        }
                        @if (exampleForm.get('email')?.errors?.['email']) {
                            <vx-message severity="error" size="small" variant="simple">Please enter a valid email.</vx-message>
                        }
                    }
                </div>
                <button vxButton severity="secondary" type="submit"><span vxButtonLabel>Submit</span></button>
            </form>
        </div>
        <app-code></app-code>
    `
})
export class ReactiveFormsDoc {
    messageService = inject(MessageService);

    exampleForm: FormGroup;

    formSubmitted = false;

    constructor(private fb: FormBuilder) {
        this.exampleForm = this.fb.group({
            username: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]]
        });
    }

    onSubmit() {
        this.formSubmitted = true;
        if (this.exampleForm.valid) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form Submitted', life: 3000 });
            this.exampleForm.reset();
            this.formSubmitted = false;
        }
    }

    isInvalid(controlName: string) {
        const control = this.exampleForm.get(controlName);
        return control?.invalid && (control.touched || this.formSubmitted);
    }
}
