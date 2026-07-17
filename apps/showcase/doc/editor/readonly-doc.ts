import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EditorModule } from 'voxx-ui/editor';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'readonly-doc',
    standalone: true,
    imports: [FormsModule, EditorModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>When <i>readonly</i> is present, the value cannot be edited.</p>
        </app-docsectiontext>
        <div class="card">
            <vx-editor [(ngModel)]="text" [readonly]="true" [style]="{ height: '320px' }" />
        </div>
        <app-code></app-code>
    `
})
export class ReadOnlyDoc {
    text: string = 'Always bet on Prime!';
}
