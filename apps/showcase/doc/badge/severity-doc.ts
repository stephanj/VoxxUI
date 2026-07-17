import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BadgeModule } from 'voxx-ui/badge';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'severity-doc',
    standalone: true,
    imports: [BadgeModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>Severity defines the color of the badge, possible values are <i>success</i>, <i>info</i>, <i>warn</i> and <i>danger</i></p>
        </app-docsectiontext>
        <div class="card flex justify-center gap-2">
            <vx-badge value="2" />
            <vx-badge value="6" severity="secondary" />
            <vx-badge value="8" severity="success" />
            <vx-badge value="4" severity="info" />
            <vx-badge value="9" severity="warn" />
            <vx-badge value="3" severity="danger" />
            <vx-badge value="5" severity="contrast" />
        </div>
        <app-code></app-code>
    `
})
export class SeverityDoc {}
