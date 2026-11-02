import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormField, validate } from '@angular/forms/signals';
import { MessageService } from 'voxx-ui/api';
import { ButtonModule } from 'voxx-ui/button';
import { DatePickerModule } from 'voxx-ui/datepicker';
import { MessageModule } from 'voxx-ui/message';
import { ToastModule } from 'voxx-ui/toast';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'signalforms-doc',
    standalone: true,
    imports: [FormField, DatePickerModule, ToastModule, MessageModule, ButtonModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                DatePicker implements the Angular v22 <i>FormValueControl</i> contract on top of its existing <i>ControlValueAccessor</i>, so it works natively with Signal Forms. Bind it with the <i>[formField]</i> directive — value, disabled,
                touched and validation state are kept in sync automatically. The field holds the same value the classic forms API receives: a <i>Date</i> (or <i>Date[]</i> for multiple and range selection) by default, or formatted string(s) when
                <i>dataType="string"</i>.
            </p>
        </app-docsectiontext>
        <vx-toast />
        <div class="card flex justify-center">
            <form class="flex flex-col gap-4 w-64" (submit)="onSubmit($event)">
                <div class="flex flex-col gap-1">
                    <vx-datepicker [formField]="talkForm.date" [showClear]="true" placeholder="Talk date" />
                    @if (talkForm.date().touched() && talkForm.date().invalid()) {
                        <vx-message severity="error" size="small" variant="simple">{{ talkForm.date().errors()[0].message }}</vx-message>
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
    model = signal<{ date: Date | null }>({ date: null });

    talkForm = form(this.model, (path) => {
        validate(path.date, ({ value }) => {
            const date = value();
            if (!date) {
                return { kind: 'required', message: 'Date is required.' };
            }
            const day = date.getDay();
            return day === 0 || day === 6 ? { kind: 'weekday', message: 'Pick a weekday.' } : undefined;
        });
    });

    onSubmit(event: Event) {
        event.preventDefault();
        // Reveal validation messages by marking the tree touched.
        this.talkForm().markAsTouched();
        if (this.talkForm().valid()) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            this.model.set({ date: null });
            this.talkForm().reset();
        }
    }
}
