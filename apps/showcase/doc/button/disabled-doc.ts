import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { ButtonModule } from 'voxx-ui/button';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'disabled-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText, ButtonModule],
    template: `
        <app-docsectiontext>
            <p>When <i>disabled</i> is present, the element cannot be edited and focused.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <vx-button label="Submit" [disabled]="true" />
        </div>
        <app-code></app-code>
    `
})
export class DisabledDoc {}
