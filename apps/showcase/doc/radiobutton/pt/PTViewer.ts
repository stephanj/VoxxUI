import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'voxx-ui/radiobutton';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'radiobutton-pt-viewer',
    standalone: true,
    imports: [AppDocPtViewer, RadioButtonModule, FormsModule],
    template: `
        <app-docptviewer [docs]="docs">
            <vx-radiobutton name="pt-demo" value="1" [(ngModel)]="value"></vx-radiobutton>
        </app-docptviewer>
    `
})
export class PTViewer {
    value: any = null;

    docs = [
        {
            data: getPTOptions('RadioButton'),
            key: 'RadioButton'
        }
    ];
}
