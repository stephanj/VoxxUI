import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'voxx-ui/api';
import { EditorModule } from 'voxx-ui/editor';
import { ToastModule } from 'voxx-ui/toast';
import { MessageModule } from 'voxx-ui/message';
import { ButtonModule } from 'voxx-ui/button';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'templatedrivenforms-doc',
    standalone: true,
    imports: [FormsModule, EditorModule, ToastModule, MessageModule, ButtonModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext> </app-docsectiontext>
        <vx-toast />
        <div class="card">
            <form #exampleForm="ngForm" (ngSubmit)="onSubmit(exampleForm)" class="flex flex-col gap-4">
                <div class="flex flex-col gap-1">
                    <vx-editor #content="ngModel" [(ngModel)]="text" [invalid]="content.invalid && (content.touched || exampleForm.submitted)" name="content" [style]="{ height: '320px' }" required />
                    @if (content.invalid && (content.touched || exampleForm.submitted)) {
                        <vx-message severity="error" size="small" variant="simple">Content is required.</vx-message>
                    }
                </div>
                <button vxButton severity="secondary" type="submit"><span vxButtonLabel>Submit</span></button>
            </form>
        </div>
        <app-code></app-code>
    `
})
export class TemplateDrivenFormsDoc {
    messageService = inject(MessageService);

    text: string | undefined;

    onSubmit(form: any) {
        if (form.valid) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form Submitted', life: 3000 });
            form.resetForm();
        }
    }
}
