import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'voxx-ui/checkbox';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'indeterminate-doc',
    standalone: true,
    imports: [FormsModule, CheckboxModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>The <i>indeterminate</i> state indicates that a checkbox is neither "on" or "off".</p>
        </app-docsectiontext>
        <div class="card flex justify-center gap-4">
            <vx-checkbox [(ngModel)]="checked" [binary]="true" [indeterminate]="true" />
        </div>
        <app-code></app-code>
    `
})
export class IndeterminateDoc {
    checked: any = null;
}
