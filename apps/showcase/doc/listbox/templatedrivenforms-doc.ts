import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MessageService } from 'voxx-ui/api';
import { FormsModule } from '@angular/forms';
import { ListboxModule } from 'voxx-ui/listbox';
import { ButtonModule } from 'voxx-ui/button';
import { ToastModule } from 'voxx-ui/toast';
import { MessageModule } from 'voxx-ui/message';
import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

interface City {
    name: string;
    code: string;
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'templatedrivenforms-doc',
    standalone: true,
    imports: [FormsModule, ListboxModule, ButtonModule, ToastModule, MessageModule, AppCodeModule, AppDocSectionText],
    template: `
        <app-docsectiontext> </app-docsectiontext>
        <vx-toast />
        <div class="card flex justify-center">
            <form #exampleForm="ngForm" (ngSubmit)="onSubmit(exampleForm)" class="flex justify-center flex-col gap-4 md:w-56">
                <div class="flex flex-col gap-1">
                    <vx-listbox #city="ngModel" [options]="cities" [(ngModel)]="selectedCity" optionLabel="name" class="w-full md:w-56" [invalid]="city.invalid && exampleForm.submitted" name="city" required />
                    @if (city.invalid && exampleForm.submitted) {
                        <vx-message severity="error" size="small" variant="simple">City is required.</vx-message>
                    }
                </div>
                <button vxButton severity="secondary" type="submit"><span vxButtonLabel>Submit</span></button>
            </form>
        </div>
        <app-code></app-code>
    `
})
export class TemplateDrivenFormsDoc implements OnInit {
    messageService = inject(MessageService);

    selectedCity!: City;

    cities!: City[];

    ngOnInit() {
        this.cities = [
            { name: 'New York', code: 'NY' },
            { name: 'Rome', code: 'RM' },
            { name: 'London', code: 'LDN' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Paris', code: 'PRS' }
        ];
    }

    onSubmit(form: any) {
        if (form.valid) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form Submitted', life: 3000 });
            form.resetForm();
        }
    }
}
