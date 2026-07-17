import { Component } from '@angular/core';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { ButtonModule } from 'voxx-ui/button';

@Component({
    selector: 'outlined-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText, ButtonModule],
    template: `
        <app-docsectiontext>
            <p>Outlined buttons display a border without a background initially.</p>
        </app-docsectiontext>
        <div class="card flex flex-wrap gap-4 justify-center">
            <vx-button label="Primary" variant="outlined" />
            <vx-button label="Secondary" variant="outlined" severity="secondary" />
            <vx-button label="Success" variant="outlined" severity="success" />
            <vx-button label="Info" variant="outlined" severity="info" />
            <vx-button label="Warn" variant="outlined" severity="warn" />
            <vx-button label="Help" variant="outlined" severity="help" />
            <vx-button label="Danger" variant="outlined" severity="danger" />
            <vx-button label="Contrast" variant="outlined" severity="contrast" />
        </div>
        <app-code></app-code>
    `
})
export class OutlinedDoc {}
