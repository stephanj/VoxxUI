import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'voxx-ui/colorpicker';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'inline-doc',
    standalone: true,
    imports: [FormsModule, ColorPickerModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>ColorPicker is displayed as a popup by default, add <i>inline</i> property to customize this behavior.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <vx-colorpicker [(ngModel)]="color" [inline]="true" />
        </div>
        <app-code></app-code>
    `
})
export class InlineDoc {
    color: string | undefined;
}
