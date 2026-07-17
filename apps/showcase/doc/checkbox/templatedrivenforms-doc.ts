import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MessageService } from 'voxx-ui/api';
import { CheckboxModule } from 'voxx-ui/checkbox';
import { ButtonModule } from 'voxx-ui/button';
import { ToastModule } from 'voxx-ui/toast';
import { MessageModule } from 'voxx-ui/message';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'templatedrivenforms-doc',
    standalone: true,
    imports: [CommonModule, FormsModule, CheckboxModule, ButtonModule, ToastModule, MessageModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext> </app-docsectiontext>
        <vx-toast />
        <div class="card flex justify-center">
            <form #form="ngForm" (ngSubmit)="onSubmit(form)" class="flex flex-col gap-4">
                <div class="flex flex-wrap gap-4">
                    @for (item of formKeys; track item) {
                        <div class="flex items-center gap-2">
                            <vx-checkbox [inputId]="item" [name]="item" [(ngModel)]="formModel[item]" [binary]="true" [invalid]="isInvalid()"></vx-checkbox>
                            <label [for]="item">{{ item | titlecase }}</label>
                        </div>
                    }
                </div>
                @if (isInvalid()) {
                    <vx-message severity="error" size="small" variant="simple"> At least one ingredient must be selected. </vx-message>
                }

                <button vxButton severity="secondary" type="submit">
                    <span vxButtonLabel>Submit</span>
                </button>
            </form>
        </div>

        <app-code></app-code>
    `
})
export class TemplateDrivenFormsDoc {
    messageService = inject(MessageService);

    formSubmitted: boolean = false;

    formModel = {
        cheese: false,
        mushroom: false,
        pepper: false,
        onion: false
    };

    get formKeys(): string[] {
        return Object.keys(this.formModel);
    }

    isInvalid(): boolean {
        return this.formSubmitted && !this.isAtLeastOneSelected();
    }

    isAtLeastOneSelected(): boolean {
        return Object.values(this.formModel).some((value) => value === true);
    }

    onSubmit(form: NgForm) {
        this.formSubmitted = true;

        if (this.isAtLeastOneSelected()) {
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Form is submitted',
                life: 3000
            });

            this.formModel = {
                cheese: false,
                mushroom: false,
                pepper: false,
                onion: false
            };
            form.resetForm(this.formModel);

            this.formSubmitted = false;
        }
    }
}
