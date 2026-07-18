import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonModule } from 'voxx-ui/button';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'button-pt-viewer',
    standalone: true,
    imports: [AppDocPtViewer, ButtonModule],
    template: `
        <app-docptviewer [docs]="docs">
            <vx-button label="Profile" icon="pi pi-user" severity="secondary" badge="2" badgeSeverity="contrast" />
        </app-docptviewer>
    `
})
export class PTViewer {
    docs = [
        {
            data: getPTOptions('Button'),
            key: 'Button'
        }
    ];
}
