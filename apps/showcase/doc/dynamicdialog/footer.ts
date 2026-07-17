import { Component } from '@angular/core';
import { DynamicDialogRef } from 'voxx-ui/dynamicdialog';
import { ButtonModule } from 'voxx-ui/button';

@Component({
    selector: 'footer',
    standalone: true,
    imports: [ButtonModule],
    template: `
        <div class="flex w-full justify-end mt-4">
            <vx-button type="button" label="Cancel" icon="pi pi-times" (click)="closeDialog({ buttonType: 'Cancel', summary: 'No Product Selected' })"></vx-button>
        </div>
    `
})
export class Footer {
    constructor(public ref: DynamicDialogRef) {}

    closeDialog(data) {
        this.ref.close(data);
    }
}
