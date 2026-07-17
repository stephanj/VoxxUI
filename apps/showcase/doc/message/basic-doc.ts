import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MessageModule } from 'voxx-ui/message';
import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'basic-doc',
    standalone: true,
    imports: [MessageModule, AppCodeModule, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>Message component requires a content to display.</p>
        </app-docsectiontext>
        <div class="card">
            <vx-message>Message Content</vx-message>
        </div>
        <app-code></app-code>
    `
})
export class BasicDoc {}
