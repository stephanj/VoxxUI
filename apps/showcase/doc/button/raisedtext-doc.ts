import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { ButtonModule } from 'voxx-ui/button';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'raisedtext-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText, ButtonModule],
    template: `
        <app-docsectiontext>
            <p>Text buttons can be displayed as raised for elevation.</p>
        </app-docsectiontext>
        <div class="card flex flex-wrap gap-4 justify-center">
            <vx-button label="Primary" variant="text" [raised]="true" />
            <vx-button label="Secondary" variant="text" [raised]="true" severity="secondary" />
            <vx-button label="Success" variant="text" [raised]="true" severity="success" />
            <vx-button label="Info" variant="text" [raised]="true" severity="info" />
            <vx-button label="Warn" variant="text" [raised]="true" severity="warn" />
            <vx-button label="Help" variant="text" [raised]="true" severity="help" />
            <vx-button label="Danger" variant="text" [raised]="true" severity="danger" />
            <vx-button label="Plain" variant="text" [raised]="true" />
        </div>
        <app-code></app-code>
    `
})
export class RaisedTextDoc {}
