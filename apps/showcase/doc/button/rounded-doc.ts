import { Component } from '@angular/core';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { ButtonModule } from 'voxx-ui/button';

@Component({
    selector: 'rounded-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText, ButtonModule],
    template: `
        <app-docsectiontext>
            <p>Rounded buttons have a circular border radius.</p>
        </app-docsectiontext>
        <div class="card flex flex-wrap gap-4 justify-center">
            <vx-button label="Primary" [rounded]="true" />
            <vx-button label="Secondary" [rounded]="true" severity="secondary" />
            <vx-button label="Success" [rounded]="true" severity="success" />
            <vx-button label="Info" [rounded]="true" severity="info" />
            <vx-button label="Warn" [rounded]="true" severity="warn" />
            <vx-button label="Help" [rounded]="true" severity="help" />
            <vx-button label="Danger" [rounded]="true" severity="danger" />
            <vx-button label="Contrast" [rounded]="true" severity="contrast" />
        </div>
        <app-code></app-code>
    `
})
export class RoundedDoc {}
