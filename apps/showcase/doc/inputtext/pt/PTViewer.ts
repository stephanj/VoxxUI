import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'voxx-ui/inputtext';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'inputtext-pt-viewer',
    standalone: true,
    imports: [AppDocPtViewer, InputTextModule, FormsModule],
    template: `
        <app-docptviewer [docs]="docs">
            <input vxInputText [(ngModel)]="value" placeholder="Username" />
        </app-docptviewer>
    `
})
export class PTViewer {
    value: string | null = null;

    docs = [
        {
            data: getPTOptions('InputText'),
            key: 'InputText'
        }
    ];
}
