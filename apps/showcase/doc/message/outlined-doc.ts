import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MessageModule } from 'voxx-ui/message';
import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'outlined-doc',
    standalone: true,
    imports: [MessageModule, AppCodeModule, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>Configure the <i>variant</i> value as <i>outlined</i> for messages with borders and no background.</p>
        </app-docsectiontext>
        <div class="card flex flex-wrap gap-4 justify-center">
            <vx-message severity="success" variant="outlined">Success Message</vx-message>
            <vx-message severity="info" variant="outlined">Info Message</vx-message>
            <vx-message severity="warn" variant="outlined">Warn Message</vx-message>
            <vx-message severity="error" variant="outlined">Error Message</vx-message>
            <vx-message severity="secondary" variant="outlined">Secondary Message</vx-message>
            <vx-message severity="contrast" variant="outlined">Contrast Message</vx-message>
        </div>
        <app-code></app-code>
    `
})
export class OutlinedDoc {}
