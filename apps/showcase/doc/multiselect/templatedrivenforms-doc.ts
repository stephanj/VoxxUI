import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'voxx-ui/api';
import { MultiSelectModule } from 'voxx-ui/multiselect';
import { ButtonModule } from 'voxx-ui/button';
import { ToastModule } from 'voxx-ui/toast';
import { MessageModule } from 'voxx-ui/message';
import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { CommonModule } from '@angular/common';

interface City {
    name: string;
    code: string;
}

@Component({
    selector: 'templatedrivenforms-doc',
    standalone: true,
    imports: [FormsModule, MultiSelectModule, ButtonModule, ToastModule, MessageModule, AppCodeModule, AppDocSectionText, CommonModule],
    providers: [MessageService],
    template: `
        <app-docsectiontext></app-docsectiontext>
        <vx-toast />
        <div class="card flex justify-center">
            <form #exampleForm="ngForm" (ngSubmit)="onSubmit(exampleForm)" class="flex justify-center flex-col gap-4 w-full md:w-80">
                <div class="flex flex-col gap-1">
                    <vx-multiselect
                        #city="ngModel"
                        [(ngModel)]="selectedCity"
                        [options]="cities"
                        optionLabel="name"
                        name="city"
                        placeholder="Select Cities"
                        [maxSelectedLabels]="3"
                        [invalid]="city.invalid && (city.touched || exampleForm.submitted)"
                        fluid
                        required
                    />
                    @if (city.invalid && (city.touched || exampleForm.submitted)) {
                        <vx-message severity="error" size="small" variant="simple">City is required.</vx-message>
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

    cities: City[] = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];

    selectedCity: City | undefined;

    onSubmit(form: any) {
        if (form.valid) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form Submitted', life: 3000 });
            form.resetForm();
        }
    }
}
