import { Component } from '@angular/core';
import { MessageModule } from 'voxx-ui/message';
import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'closable-doc',
    standalone: true,
    imports: [MessageModule, AppCodeModule, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>Enable <i>closable</i> option to display an icon to remove a message.</p>
        </app-docsectiontext>
        <div class="card">
            <vx-message closable>Closable Message</vx-message>
        </div>
        <app-code></app-code>
    `
})
export class ClosableDoc {}
