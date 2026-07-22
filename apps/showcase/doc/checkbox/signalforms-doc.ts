import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormField, validate } from '@angular/forms/signals';
import { MessageService } from 'voxx-ui/api';
import { ButtonModule } from 'voxx-ui/button';
import { CheckboxModule } from 'voxx-ui/checkbox';
import { MessageModule } from 'voxx-ui/message';
import { ToastModule } from 'voxx-ui/toast';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'signalforms-doc',
    standalone: true,
    imports: [FormField, CheckboxModule, ToastModule, MessageModule, ButtonModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                A <i>binary</i> VoxxUI checkbox implements the Angular v22 <i>FormCheckboxControl</i> contract on top of its existing <i>ControlValueAccessor</i>, so it works natively with Signal Forms. Build a form with <i>form()</i>, then bind the
                checkbox with the <i>[formField]</i> directive — the boolean checked state, disabled, touched and validation state are kept in sync automatically. Group (array) mode keeps using its <i>value</i> input with <i>ngModel</i>/reactive
                forms.
            </p>
        </app-docsectiontext>
        <vx-toast />
        <div class="card flex justify-center">
            <form class="flex flex-col gap-4 w-60" (submit)="onSubmit($event)">
                <div class="flex items-center gap-2">
                    <vx-checkbox binary inputId="agree" [formField]="agreementForm.accept" />
                    <label for="agree" class="text-sm">I accept the terms and conditions</label>
                </div>
                @if (agreementForm.accept().touched() && agreementForm.accept().invalid()) {
                    <vx-message severity="error" size="small" variant="simple">You must accept the terms.</vx-message>
                }
                <button vxButton severity="secondary" type="submit"><span vxButtonLabel>Submit</span></button>
            </form>
        </div>
        <app-code></app-code>
    `
})
export class SignalFormsDoc {
    messageService = inject(MessageService);

    // A writable signal holds the model; `form()` derives a reactive FieldTree from it.
    model = signal({ accept: false });

    agreementForm = form(this.model, (path) => {
        // Custom "must be accepted" rule — the failing state flows into the control's `invalid` input.
        validate(path.accept, ({ value }) => (value() ? undefined : { kind: 'required', message: 'You must accept the terms.' }));
    });

    onSubmit(event: Event) {
        event.preventDefault();
        // Reveal validation messages by marking the tree touched.
        this.agreementForm().markAsTouched();
        if (this.agreementForm().valid()) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            this.model.set({ accept: false });
            this.agreementForm().reset();
        }
    }
}
