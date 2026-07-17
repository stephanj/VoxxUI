import { Component } from '@angular/core';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { ButtonModule } from 'voxx-ui/button';

@Component({
    selector: 'text-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText, ButtonModule],
    template: `
        <app-docsectiontext>
            <p>Text buttons are displayed as textual elements.</p>
        </app-docsectiontext>
        <div class="card flex flex-wrap gap-4 justify-center">
            <vx-button label="Primary" variant="text" />
            <vx-button label="Secondary" variant="text" severity="secondary" />
            <vx-button label="Success" variant="text" severity="success" />
            <vx-button label="Info" variant="text" severity="info" />
            <vx-button label="Warn" variant="text" severity="warn" />
            <vx-button label="Help" variant="text" severity="help" />
            <vx-button label="Danger" variant="text" severity="danger" />
            <vx-button label="Plain" variant="text" />
        </div>
        <app-code></app-code>
    `
})
export class TextDoc {}
