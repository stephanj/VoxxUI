import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormField, validate } from '@angular/forms/signals';
import { MessageService } from 'voxx-ui/api';
import { ButtonModule } from 'voxx-ui/button';
import { MessageModule } from 'voxx-ui/message';
import { MultiSelectModule } from 'voxx-ui/multiselect';
import { ToastModule } from 'voxx-ui/toast';

interface City {
    name: string;
    code: string;
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'signalforms-doc',
    standalone: true,
    imports: [FormField, MultiSelectModule, ToastModule, MessageModule, ButtonModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                MultiSelect implements the Angular v22 <i>FormValueControl&lt;T[]&gt;</i> contract on top of its existing <i>ControlValueAccessor</i>, so it works natively with Signal Forms. Build a form with <i>form()</i>, then bind the multiselect
                with the <i>[formField]</i> directive — the selected values, disabled, touched and validation state are kept in sync automatically. Every selection change (adding or removing a chip, select-all, clear) writes a new array back into the
                bound field.
            </p>
        </app-docsectiontext>
        <vx-toast />
        <div class="card flex justify-center">
            <form class="flex flex-col gap-4 w-full sm:w-80" (submit)="onSubmit($event)">
                <div class="flex flex-col gap-1">
                    <vx-multiselect [formField]="cityForm.cities" [options]="cities" optionLabel="name" optionValue="code" placeholder="Select Cities" display="chip" class="w-full md:w-80" />
                    @if (cityForm.cities().touched() && cityForm.cities().invalid()) {
                        <vx-message severity="error" size="small" variant="simple">At least one city is required.</vx-message>
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
    model = signal<{ cities: string[] }>({ cities: [] });

    cityForm = form(this.model, (path) => {
        // "At least one" rule — the failing state flows into the multiselect's `invalid` input.
        // Note: validation lives in the form schema because `[formField]` reserves the
        // `required`/`disabled` input names and they cannot be co-bound on the same element.
        validate(path.cities, ({ value }) => (value()?.length ? undefined : { kind: 'required', message: 'At least one city is required.' }));
    });

    onSubmit(event: Event) {
        event.preventDefault();
        // Reveal validation messages by marking the tree touched.
        this.cityForm().markAsTouched();
        if (this.cityForm().valid()) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            this.model.set({ cities: [] });
            this.cityForm().reset();
        }
    }
}
