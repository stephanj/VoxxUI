import { Component } from '@angular/core';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { TagModule } from 'voxx-ui/tag';

@Component({
    selector: 'pill-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText, TagModule],
    template: `
        <app-docsectiontext>
            <p>Enabling <i>rounded</i>, displays a tag as a pill.</p>
        </app-docsectiontext>
        <div class="card flex justify-center gap-2">
            <vx-tag value="Primary" [rounded]="true" />
            <vx-tag severity="secondary" value="Secondary" [rounded]="true" />
            <vx-tag severity="success" value="Success" [rounded]="true" />
            <vx-tag severity="info" value="Info" [rounded]="true" />
            <vx-tag severity="warn" value="Warn" [rounded]="true" />
            <vx-tag severity="danger" value="Danger" [rounded]="true" />
            <vx-tag severity="contrast" value="Contrast" [rounded]="true" />
        </div>
        <app-code></app-code>
    `
})
export class PillDoc {}
