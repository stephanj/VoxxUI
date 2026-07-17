import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { ButtonModule } from 'voxx-ui/button';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'buttonset-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText, ButtonModule],
    template: `
        <app-docsectiontext>
            <p>Multiple buttons are grouped when wrapped inside an element with <i>p-buttonset</i> class.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <span class="p-buttonset">
                <button vxButton vxRipple label="Save" icon="pi pi-check"></button>
                <button vxButton vxRipple label="Delete" icon="pi pi-trash"></button>
                <button vxButton vxRipple label="Cancel" icon="pi pi-times"></button>
            </span>
        </div>
        <app-code></app-code>
    `
})
export class ButtonsetDoc {}
