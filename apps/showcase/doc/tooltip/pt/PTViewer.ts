import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonModule } from 'voxx-ui/button';
import { TooltipModule } from 'voxx-ui/tooltip';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'tooltip-pt-viewer',
    standalone: true,
    imports: [CommonModule, AppDocPtViewer, ButtonModule, TooltipModule],
    template: `
        <app-docptviewer [docs]="docs">
            <vx-button vxTooltip="Confirm to proceed" [hideDelay]="300000" severity="secondary" label="Tooltip" />
        </app-docptviewer>
    `
})
export class PTViewer {
    docs = [
        {
            data: getPTOptions('Tooltip'),
            key: 'Tooltip'
        }
    ];
}
