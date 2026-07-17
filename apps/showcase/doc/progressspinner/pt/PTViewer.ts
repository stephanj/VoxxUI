import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProgressSpinnerModule } from 'voxx-ui/progressspinner';

@Component({
    selector: 'progressspinner-pt-viewer',
    standalone: true,
    imports: [CommonModule, AppDocPtViewer, ProgressSpinnerModule],
    template: `
        <app-docptviewer [docs]="docs">
            <vx-progressspinner />
        </app-docptviewer>
    `
})
export class PTViewer {
    docs = [
        {
            data: getPTOptions('ProgressSpinner'),
            key: 'ProgressSpinner'
        }
    ];
}
