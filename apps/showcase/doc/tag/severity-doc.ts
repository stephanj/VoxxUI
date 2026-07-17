import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { TagModule } from 'voxx-ui/tag';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'severity-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText, TagModule],
    template: `
        <app-docsectiontext>
            <p>Severity defines the color of the tag, possible values are <i>success</i>, <i>info</i>, <i>warn</i> and <i>danger</i> in addition to the default theme color.</p>
        </app-docsectiontext>
        <div class="card flex justify-center gap-2">
            <vx-tag value="Primary" />
            <vx-tag severity="secondary" value="Secondary" />
            <vx-tag severity="success" value="Success" />
            <vx-tag severity="info" value="Info" />
            <vx-tag severity="warn" value="Warn" />
            <vx-tag severity="danger" value="Danger" />
            <vx-tag severity="contrast" value="Contrast" />
        </div>
        <app-code></app-code>
    `
})
export class SeverityDoc {}
