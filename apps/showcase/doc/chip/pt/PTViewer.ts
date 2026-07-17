import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChipModule } from 'voxx-ui/chip';

@Component({
    selector: 'chip-pt-viewer',
    standalone: true,
    imports: [CommonModule, AppDocPtViewer, ChipModule],
    template: `
        <app-docptviewer [docs]="docs">
            <div class="flex flex-wrap gap-4">
                <vx-chip label="Action"></vx-chip>
                <vx-chip label="Comedy"></vx-chip>
                <vx-chip label="Mystery"></vx-chip>
                <vx-chip label="Thriller" [removable]="true"></vx-chip>
            </div>
        </app-docptviewer>
    `
})
export class PTViewer {
    docs = [
        {
            data: getPTOptions('Chip'),
            key: 'Chip'
        }
    ];
}
