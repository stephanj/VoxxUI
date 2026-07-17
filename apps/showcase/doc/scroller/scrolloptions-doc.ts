import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'scrolloptions-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>The properties of scroller component can be used like an object in it.</p>
        </app-docsectiontext>
        <app-code [hideToggleCode]="true"></app-code>
    `
})
export class ScrollOptionsDoc {}
