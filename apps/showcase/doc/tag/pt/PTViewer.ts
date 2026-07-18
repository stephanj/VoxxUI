import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TagModule } from 'voxx-ui/tag';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'tag-pt-viewer',
    standalone: true,
    imports: [AppDocPtViewer, TagModule],
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
