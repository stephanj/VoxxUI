import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TagModule } from 'voxx-ui/tag';

@Component({
    selector: 'tag-pt-viewer',
    standalone: true,
    imports: [CommonModule, AppDocPtViewer, TagModule],
    template: `
        <app-docptviewer [docs]="docs">
            <vx-tag icon="pi pi-user" value="Primary"></vx-tag>
        </app-docptviewer>
    `
})
export class PTViewer {
    docs = [
        {
            data: getPTOptions('Tag'),
            key: 'Tag'
        }
    ];
}
