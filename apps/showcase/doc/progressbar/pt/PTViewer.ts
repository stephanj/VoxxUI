import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProgressBarModule } from 'voxx-ui/progressbar';

@Component({
    selector: 'progressbar-pt-viewer',
    standalone: true,
    imports: [CommonModule, AppDocPtViewer, ProgressBarModule],
    template: `
        <app-docptviewer [docs]="docs">
            <div class="w-full">
                <vx-progressbar [value]="50"></vx-progressbar>
            </div>
        </app-docptviewer>
    `
})
export class PTViewer {
    docs = [
        {
            data: getPTOptions('ProgressBar'),
            key: 'ProgressBar'
        }
    ];
}
