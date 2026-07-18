import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputMaskModule } from 'voxx-ui/inputmask';
import { InputText } from 'voxx-ui/inputtext';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'inputmask-pt-viewer',
    standalone: true,
    imports: [AppDocPtViewer, InputMaskModule, InputText, FormsModule],
    template: `
        <app-docptviewer [docs]="docs">
            <input vxInputText [(ngModel)]="value" vxInputMask="99-999999" placeholder="99-999999" />
        </app-docptviewer>
    `
})
export class PTViewer {
    value: string | null = null;

    docs = [
        {
            data: getPTOptions('InputMask'),
            key: 'InputMask'
        }
    ];
}
