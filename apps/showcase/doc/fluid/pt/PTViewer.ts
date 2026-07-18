import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FluidModule } from 'voxx-ui/fluid';
import { InputTextModule } from 'voxx-ui/inputtext';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'fluid-pt-viewer',
    standalone: true,
    imports: [AppDocPtViewer, FluidModule, InputTextModule],
    template: `
        <app-docptviewer [docs]="docs">
            <vx-fluid>
                <input type="text" vxInputText />
            </vx-fluid>
        </app-docptviewer>
    `
})
export class PTViewer {
    docs = [
        {
            data: getPTOptions('Fluid'),
            key: 'Fluid'
        }
    ];
}
