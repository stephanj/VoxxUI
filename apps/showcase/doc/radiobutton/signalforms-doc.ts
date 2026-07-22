import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { MessageService } from 'voxx-ui/api';
import { ButtonModule } from 'voxx-ui/button';
import { MessageModule } from 'voxx-ui/message';
import { RadioButtonModule } from 'voxx-ui/radiobutton';
import { ToastModule } from 'voxx-ui/toast';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'signalforms-doc',
    standalone: true,
    imports: [FormField, RadioButtonModule, ToastModule, MessageModule, ButtonModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                A radio button represents one option of a group; the group's selected value is the form value. Because a single radio does not fit either the <i>FormValueControl</i> (its <i>value</i> input is the option identity) or
                <i>FormCheckboxControl</i> (its checked state is a boolean, not the group value) contract, Signal Forms binds a radio group the same way as native <i>&lt;input type="radio"&gt;</i>: bind <b>every</b> radio in the group to the
                <b>same</b> field with <i>[formField]</i>. VoxxUI radios ship a <i>ControlValueAccessor</i>, so selecting one writes its <i>value</i> into the field and the field value checks the matching radio — <i>[(ngModel)]</i> and reactive forms
                keep working too.
            </p>
        </app-docsectiontext>
        <vx-toast />
        <div class="card flex justify-center">
            <form class="flex flex-col gap-4" (submit)="onSubmit($event)">
                @for (category of categories; track category.key) {
                    <div class="flex items-center gap-2">
                        <vx-radiobutton [inputId]="category.key" name="category" [value]="category.key" [formField]="pizzaForm.category" />
                        <label [for]="category.key" class="text-sm">{{ category.name }}</label>
                    </div>
                }
                @if (pizzaForm.category().touched() && pizzaForm.category().invalid()) {
                    <vx-message severity="error" size="small" variant="simple">Please pick a category.</vx-message>
                }
                <button vxButton severity="secondary" type="submit"><span vxButtonLabel>Submit</span></button>
            </form>
        </div>
        <app-code></app-code>
    `
})
export class SignalFormsDoc {
    messageService = inject(MessageService);

    categories = [
        { name: 'Accounting', key: 'A' },
        { name: 'Marketing', key: 'M' },
        { name: 'Production', key: 'P' },
        { name: 'Research', key: 'R' }
    ];

    // A writable signal holds the model; `form()` derives a reactive FieldTree from it.
    model = signal({ category: '' });

    pizzaForm = form(this.model, (path) => {
        // Built-in required rule — the failing state flows into every bound radio's `invalid` input.
        required(path.category, { message: 'Please pick a category.' });
    });

    onSubmit(event: Event) {
        event.preventDefault();
        // Reveal validation messages by marking the tree touched.
        this.pizzaForm().markAsTouched();
        if (this.pizzaForm().valid()) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            this.model.set({ category: '' });
            this.pizzaForm().reset();
        }
    }
}
