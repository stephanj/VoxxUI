import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { ButtonModule } from 'voxx-ui/button';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'raised-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText, ButtonModule],
    template: `
        <app-docsectiontext>
            <p>Raised buttons display a shadow to indicate elevation.</p>
        </app-docsectiontext>
        <div class="card flex flex-wrap gap-4 justify-center">
            <vx-button label="Primary" [raised]="true" />
            <vx-button label="Secondary" [raised]="true" severity="secondary" />
            <vx-button label="Success" [raised]="true" severity="success" />
            <vx-button label="Info" [raised]="true" severity="info" />
            <vx-button label="Warn" [raised]="true" severity="warn" />
            <vx-button label="Help" [raised]="true" severity="help" />
            <vx-button label="Danger" [raised]="true" severity="danger" />
            <vx-button label="Contrast" [raised]="true" severity="contrast" />
        </div>
        <app-code></app-code>
    `
})
export class RaisedDoc {}
