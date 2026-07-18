import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'voxx-ui/checkbox';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'checkbox-pt-viewer',
    standalone: true,
    imports: [AppDocPtViewer, CheckboxModule, FormsModule],
    template: `
        <app-docptviewer [docs]="docs">
            <vx-checkbox [(ngModel)]="checked" [binary]="true" />
        </app-docptviewer>
    `
})
export class PTViewer {
    checked: boolean = false;

    docs = [
        {
            data: getPTOptions('Checkbox'),
            key: 'Checkbox'
        }
    ];
}
