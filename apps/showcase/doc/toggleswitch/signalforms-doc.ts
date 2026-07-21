import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormField, validate } from '@angular/forms/signals';
import { MessageService } from 'voxx-ui/api';
import { ButtonModule } from 'voxx-ui/button';
import { MessageModule } from 'voxx-ui/message';
import { ToastModule } from 'voxx-ui/toast';
import { ToggleSwitchModule } from 'voxx-ui/toggleswitch';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'signalforms-doc',
    standalone: true,
    imports: [FormField, ToggleSwitchModule, ToastModule, MessageModule, ButtonModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                VoxxUI editable components implement the Angular v22 <i>FormValueControl</i> contract on top of their existing <i>ControlValueAccessor</i>, so they work natively with Signal Forms. Build a form with <i>form()</i>, then bind a control
                with the <i>[formField]</i> directive — value, disabled, touched and validation state are kept in sync automatically.
            </p>
        </app-docsectiontext>
        <vx-toast />
        <div class="card flex justify-center">
            <form class="flex flex-col gap-4 w-48" (submit)="onSubmit($event)">
                <div class="flex flex-col items-center gap-2">
                    <vx-toggleswitch [formField]="agreementForm.activation" />
                    @if (agreementForm.activation().touched() && agreementForm.activation().invalid()) {
                        <vx-message severity="error" size="small" variant="simple">Activation is required.</vx-message>
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
    model = signal({ activation: false });

    agreementForm = form(this.model, (path) => {
        // Custom "must be enabled" rule — the failing state flows into the control's `invalid` input.
        validate(path.activation, ({ value }) => (value() ? undefined : { kind: 'required', message: 'Activation is required.' }));
    });

    onSubmit(event: Event) {
        event.preventDefault();
        // Reveal validation messages by marking the tree touched.
        this.agreementForm().markAsTouched();
        if (this.agreementForm().valid()) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            this.model.set({ activation: false });
            this.agreementForm().reset();
        }
    }
}
