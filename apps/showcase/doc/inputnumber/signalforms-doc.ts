import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormField, min, validate } from '@angular/forms/signals';
import { MessageService } from 'voxx-ui/api';
import { ButtonModule } from 'voxx-ui/button';
import { InputNumberModule } from 'voxx-ui/inputnumber';
import { MessageModule } from 'voxx-ui/message';
import { ToastModule } from 'voxx-ui/toast';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'signalforms-doc',
    standalone: true,
    imports: [FormField, InputNumberModule, ToastModule, MessageModule, ButtonModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                InputNumber implements the Angular v22 <i>FormValueControl&lt;number | null&gt;</i> contract on top of its existing <i>ControlValueAccessor</i>, so it works natively with Signal Forms. Build a form with <i>form()</i>, then bind the
                control with the <i>[formField]</i> directive — value, disabled, touched and validation state are kept in sync automatically. Every user-input path (typing, spinner buttons, clear) flows straight into the bound field.
            </p>
        </app-docsectiontext>
        <vx-toast />
        <div class="card flex justify-center">
            <form class="flex flex-col gap-4 w-64" (submit)="onSubmit($event)">
                <div class="flex flex-col gap-1">
                    <vx-inputnumber [formField]="quantityForm.quantity" [showButtons]="true" mode="decimal" />
                    @if (quantityForm.quantity().touched() && quantityForm.quantity().invalid()) {
                        <vx-message severity="error" size="small" variant="simple">Quantity must be at least 1.</vx-message>
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

    // A writable signal holds the model; `form()` derives a reactive FieldTree from it.
    model = signal<{ quantity: number | null }>({ quantity: null });

    quantityForm = form(this.model, (path) => {
        // Built-in `min` plus a custom "required" rule — the failing state flows into the control's `invalid` input.
        validate(path.quantity, ({ value }) => (value() != null ? undefined : { kind: 'required', message: 'Quantity is required.' }));
        min(path.quantity, 1, { message: 'Quantity must be at least 1.' });
    });

    onSubmit(event: Event) {
        event.preventDefault();
        // Reveal validation messages by marking the tree touched.
        this.quantityForm().markAsTouched();
        if (this.quantityForm().valid()) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            this.model.set({ quantity: null });
            this.quantityForm().reset();
        }
    }
}
