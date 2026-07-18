import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'voxx-ui/colorpicker';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'colorpicker-pt-viewer',
    standalone: true,
    imports: [AppDocPtViewer, ColorPickerModule, FormsModule],
    template: `
        <app-docptviewer [docs]="docs">
            <vx-colorpicker [(ngModel)]="color" [inline]="true"></vx-colorpicker>
        </app-docptviewer>
    `
})
export class PTViewer {
    color: string | undefined;

    docs = [{ data: getPTOptions('ColorPicker'), key: 'ColorPicker' }];
}
