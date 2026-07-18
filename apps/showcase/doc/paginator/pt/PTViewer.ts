import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PaginatorModule } from 'voxx-ui/paginator';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'paginator-pt-viewer',
    standalone: true,
    imports: [AppDocPtViewer, PaginatorModule],
    template: `
        <app-docptviewer [docs]="docs">
            <div class="w-full">
                <vx-paginator [rows]="10" [totalRecords]="120" [rowsPerPageOptions]="[10, 20, 30]"></vx-paginator>
            </div>
        </app-docptviewer>
    `
})
export class PTViewer {
    docs = [
        {
            data: getPTOptions('Paginator'),
            key: 'Paginator'
        }
    ];
}
