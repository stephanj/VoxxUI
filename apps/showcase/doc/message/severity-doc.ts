import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MessageModule } from 'voxx-ui/message';
import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'severity-doc',
    standalone: true,
    imports: [MessageModule, AppCodeModule, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>The <i>severity</i> option specifies the type of the message.</p>
        </app-docsectiontext>
        <div class="card flex flex-wrap gap-4 justify-center">
            <vx-message severity="success">Success Message</vx-message>
            <vx-message severity="info">Info Message</vx-message>
            <vx-message severity="warn">Warn Message</vx-message>
            <vx-message severity="error">Error Message</vx-message>
            <vx-message severity="secondary">Secondary Message</vx-message>
            <vx-message severity="contrast">Contrast Message</vx-message>
        </div>
        <app-code></app-code>
    `
})
export class SeverityDoc {}
