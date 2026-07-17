import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { ChipModule } from 'voxx-ui/chip';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'basic-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText, ChipModule],
    template: `
        <app-docsectiontext>
            <p>
                A basic chip with a text is created with the <i>label</i> property. In addition when <i>removable</i> is added, a delete icon is displayed to remove a chip, the optional <i>onRemove</i> event is available to get notified when a chip
                is hidden.
            </p>
        </app-docsectiontext>
        <div class="card flex items-center gap-2 flex-wrap">
            <vx-chip label="Action" />
            <vx-chip label="Comedy" />
            <vx-chip label="Mystery" />
            <vx-chip label="Thriller" [removable]="true" />
        </div>
        <app-code></app-code>
    `
})
export class BasicDoc {}
