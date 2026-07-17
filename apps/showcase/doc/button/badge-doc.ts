import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { ButtonModule } from 'voxx-ui/button';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'badge-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText, ButtonModule],
    template: `
        <app-docsectiontext>
            <p>Buttons have built-in <i>badge</i> support with badge and <i>badgeClass</i> properties.</p>
        </app-docsectiontext>
        <div class="card flex justify-center flex-wrap gap-4">
            <vx-button label="Emails" badge="2" styleClass="m-0" />
            <vx-button label="Messages" icon="pi pi-users" badge="2" badgeSeverity="contrast" styleClass="m-0" [outlined]="true" />
        </div>
        <app-code></app-code>
    `
})
export class BadgeDoc {}
