import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { ButtonModule } from 'voxx-ui/button';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'severity-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText, ButtonModule],
    template: `
        <app-docsectiontext>
            <p>Severity defines the type of button.</p>
        </app-docsectiontext>
        <div class="card flex flex-wrap gap-4 justify-center">
            <vx-button label="Primary" />
            <vx-button label="Secondary" severity="secondary" />
            <vx-button label="Success" severity="success" />
            <vx-button label="Info" severity="info" />
            <vx-button label="Warn" severity="warn" />
            <vx-button label="Help" severity="help" />
            <vx-button label="Danger" severity="danger" />
            <vx-button label="Contrast" severity="contrast" />
        </div>
        <app-code></app-code>
    `
})
export class SeverityDoc {}
