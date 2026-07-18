import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'voxx-ui/selectbutton';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'selectbutton-pt-viewer',
    standalone: true,
    imports: [FormsModule, AppDocPtViewer, SelectButtonModule],
    template: `
        <app-docptviewer [docs]="docs">
            <vx-selectbutton [(ngModel)]="value" [options]="options" />
        </app-docptviewer>
    `
})
export class PTViewer {
    value: string = 'One-Way';

    options: string[] = ['One-Way', 'Return'];

    docs = [
        {
            data: getPTOptions('SelectButton'),
            key: 'SelectButton'
        }
    ];
}
