import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormField, validate } from '@angular/forms/signals';
import { MessageService } from 'voxx-ui/api';
import { ButtonModule } from 'voxx-ui/button';
import { InputMaskModule } from 'voxx-ui/inputmask';
import { MessageModule } from 'voxx-ui/message';
import { ToastModule } from 'voxx-ui/toast';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'signalforms-doc',
    standalone: true,
    imports: [FormField, InputMaskModule, ToastModule, MessageModule, ButtonModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                InputMask implements the Angular v22 <i>FormValueControl&lt;string | null&gt;</i> contract on top of its existing <i>ControlValueAccessor</i>, so it works natively with Signal Forms. Bind it with the <i>[formField]</i> directive —
                value, disabled, touched and validation state are kept in sync automatically. The field holds the masked text, or only the raw characters when <i>unmask</i> is enabled.
            </p>
        </app-docsectiontext>
        <vx-toast />
        <div class="card flex justify-center">
            <form class="flex flex-col gap-4 w-64" (submit)="onSubmit($event)">
                <div class="flex flex-col gap-1">
                    <vx-inputmask [formField]="contactForm.phone" mask="(999) 999-9999" [unmask]="true" placeholder="(999) 999-9999" />
                    @if (contactForm.phone().touched() && contactForm.phone().invalid()) {
                        <vx-message severity="error" size="small" variant="simple">Enter a 10 digit phone number.</vx-message>
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

    // With `unmask`, the field receives only the digits, e.g. "5551234567".
    model = signal<{ phone: string | null }>({ phone: null });

    contactForm = form(this.model, (path) => {
        validate(path.phone, ({ value }) => (value()?.length === 10 ? undefined : { kind: 'phone', message: 'Enter a 10 digit phone number.' }));
    });

    onSubmit(event: Event) {
        event.preventDefault();
        // Reveal validation messages by marking the tree touched.
        this.contactForm().markAsTouched();
        if (this.contactForm().valid()) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            this.model.set({ phone: null });
            this.contactForm().reset();
        }
    }
}
