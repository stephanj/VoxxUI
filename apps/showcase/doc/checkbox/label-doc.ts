import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'voxx-ui/checkbox';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'label-doc',
    standalone: true,
    imports: [FormsModule, CheckboxModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>The label attribute provides a label text for the checkbox. This label is also clickable and toggles the checked state.</p>
        </app-docsectiontext>
        <div class="card flex justify-center gap-4">
            <vx-checkbox name="groupname" value="val1" label="Value 1" [(ngModel)]="selectedValues"></vx-checkbox>
            <vx-checkbox name="groupname" value="val2" label="Value 2" [(ngModel)]="selectedValues"></vx-checkbox>
        </div>
        <app-code></app-code>
    `
})
export class LabelDoc {
    selectedValues: string[] = [];
}
