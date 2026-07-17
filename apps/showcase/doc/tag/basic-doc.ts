import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { TagModule } from 'voxx-ui/tag';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'basic-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText, TagModule],
    template: `
        <app-docsectiontext>
            <p>Label of the tag is defined with the <i>value</i> property.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <vx-tag value="New" />
        </div>
        <app-code></app-code>
    `
})
export class BasicDoc {}
