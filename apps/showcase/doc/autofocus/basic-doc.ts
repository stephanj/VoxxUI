import { Component } from '@angular/core';
import { AutoFocusModule } from 'voxx-ui/autofocus';
import { InputTextModule } from 'voxx-ui/inputtext';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'basic-doc',
    standalone: true,
    imports: [AutoFocusModule, InputTextModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>AutoFocus is applied to any focusable input element with the <i>vxAutoFocus</i> directive.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <input type="text" vxInputText [vxAutoFocus]="true" placeholder="Automatically focused" />
        </div>
        <app-code></app-code>
    `
})
export class BasicDoc {}
