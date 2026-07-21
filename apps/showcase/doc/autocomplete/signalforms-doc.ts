import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormField, validate } from '@angular/forms/signals';
import { MessageService } from 'voxx-ui/api';
import { AutoCompleteModule } from 'voxx-ui/autocomplete';
import { ButtonModule } from 'voxx-ui/button';
import { MessageModule } from 'voxx-ui/message';
import { ToastModule } from 'voxx-ui/toast';

interface AutoCompleteCompleteEvent {
    originalEvent: Event;
    query: string;
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'signalforms-doc',
    standalone: true,
    imports: [FormField, AutoCompleteModule, ToastModule, MessageModule, ButtonModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                AutoComplete implements the Angular v22 <i>FormValueControl</i> contract on top of its existing <i>ControlValueAccessor</i>, so it works natively with Signal Forms. Build a form with <i>form()</i>, then bind the input with the
                <i>[formField]</i> directive — the selected value, disabled, touched and validation state are kept in sync automatically. This works the same in single mode (a scalar) and multiple mode (an array of chips).
            </p>
        </app-docsectiontext>
        <vx-toast />
        <div class="card flex justify-center">
            <form class="flex flex-col gap-4 w-full sm:w-56" (submit)="onSubmit($event)">
                <div class="flex flex-col gap-1">
                    <vx-autocomplete [formField]="cityForm.city" [suggestions]="filtered()" (completeMethod)="search($event)" placeholder="Search a City" fluid />
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

    cities: string[] = ['New York', 'Rome', 'London', 'Istanbul', 'Paris'];

    // Suggestions shown in the overlay, refreshed by the search() completeMethod.
    filtered = signal<string[]>([]);

    // A writable signal holds the model; `form()` derives a reactive FieldTree from it.
    model = signal<{ city: string | null }>({ city: null });

    cityForm = form(this.model, (path) => {
        // "Required" rule — the failing state flows into the AutoComplete's `invalid` input.
        validate(path.city, ({ value }) => (value() ? undefined : { kind: 'required', message: 'City is required.' }));
    });

    search(event: AutoCompleteCompleteEvent) {
        const query = event.query.toLowerCase();
        this.filtered.set(this.cities.filter((city) => city.toLowerCase().includes(query)));
    }

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
