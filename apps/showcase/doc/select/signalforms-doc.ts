import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormField, validate } from '@angular/forms/signals';
import { MessageService } from 'voxx-ui/api';
import { ButtonModule } from 'voxx-ui/button';
import { MessageModule } from 'voxx-ui/message';
import { SelectModule } from 'voxx-ui/select';
import { ToastModule } from 'voxx-ui/toast';

interface City {
    name: string;
    code: string;
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'signalforms-doc',
    standalone: true,
    imports: [FormField, SelectModule, ToastModule, MessageModule, ButtonModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                Select implements the Angular v22 <i>FormValueControl</i> contract on top of its existing <i>ControlValueAccessor</i>, so it works natively with Signal Forms. Build a form with <i>form()</i>, then bind the select with the
                <i>[formField]</i> directive — the selected value, disabled, touched and validation state are kept in sync automatically.
            </p>
        </app-docsectiontext>
        <vx-toast />
        <div class="card flex justify-center">
            <form class="flex flex-col gap-4 w-full sm:w-56" (submit)="onSubmit($event)">
                <div class="flex flex-col gap-1">
                    <vx-select [formField]="cityForm.city" [options]="cities" optionLabel="name" optionValue="code" placeholder="Select a City" class="w-full md:w-56" />
                    @if (cityForm.city().touched() && cityForm.city().invalid()) {
                        <vx-message severity="error" size="small" variant="simple">City is required.</vx-message>
                    }
                </div>
                <button vxButton severity="secondary" type="submit"><span vxButtonLabel>Submit</span></button>
            </form>
        </div>
        <app-code></app-code>
    `
})
export class SignalFormsDoc {
    messageService = inject(MessageService);

    cities: City[] = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];

    // A writable signal holds the model; `form()` derives a reactive FieldTree from it.
    model = signal<{ city: string | null }>({ city: null });

    cityForm = form(this.model, (path) => {
        // "Required" rule — the failing state flows into the select's `invalid` input.
        validate(path.city, ({ value }) => (value() ? undefined : { kind: 'required', message: 'City is required.' }));
    });

    onSubmit(event: Event) {
        event.preventDefault();
        // Reveal validation messages by marking the tree touched.
        this.cityForm().markAsTouched();
        if (this.cityForm().valid()) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            this.model.set({ city: null });
            this.cityForm().reset();
        }
    }
}
