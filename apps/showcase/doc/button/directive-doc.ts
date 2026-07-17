import { Component } from '@angular/core';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { ButtonModule } from 'voxx-ui/button';

@Component({
    selector: 'directive-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText, ButtonModule],
    template: `
        <app-docsectiontext>
            <p>Button can also be used as directive using <i>vxButton</i> along with <i>vxButtonLabel</i> and <i>vxButtonIcon</i> helper directives.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <button vxButton>
                <i class="pi pi-check" vxButtonIcon></i>
                <span vxButtonLabel>Save</span>
            </button>
        </div>
        <app-code></app-code>
    `
})
export class DirectiveDoc {}
