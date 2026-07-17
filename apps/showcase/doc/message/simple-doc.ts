import { Component } from '@angular/core';
import { MessageModule } from 'voxx-ui/message';
import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'simple-doc',
    standalone: true,
    imports: [MessageModule, AppCodeModule, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>Configure the <i>variant</i> value as <i>simple</i> for messages without borders and backgrounds.</p>
        </app-docsectiontext>
        <div class="card flex flex-wrap gap-4 justify-center">
            <vx-message severity="success" variant="simple">Success Message</vx-message>
            <vx-message severity="info" variant="simple">Info Message</vx-message>
            <vx-message severity="warn" variant="simple">Warn Message</vx-message>
            <vx-message severity="error" variant="simple">Error Message</vx-message>
            <vx-message severity="secondary" variant="simple">Secondary Message</vx-message>
            <vx-message severity="contrast" variant="simple">Contrast Message</vx-message>
        </div>
        <app-code></app-code>
    `
})
export class SimpleDoc {}
