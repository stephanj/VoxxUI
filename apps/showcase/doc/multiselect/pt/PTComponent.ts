import { AppDocPtTable } from '@/components/doc/app.docpttable';
import { getPTOptions } from '@/components/doc/app.docptviewer';
import { AppDocSection } from '@/components/doc/app.docsection';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PTViewer } from './PTViewer';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'multiselect-pt-component',
    standalone: true,
    imports: [AppDocSection],
    template: `<div class="doc-main">
        <div class="doc-intro">
            <h1>MultiSelect Pass Through</h1>
        </div>
        <app-docsection [docs]="docs" />
    </div>`
})
export class PTComponent {
    docs = [
        {
            id: 'pt.viewer',
            label: 'Viewer',
            component: PTViewer
        },
        {
            id: 'pt.doc.multiselect',
            label: 'MultiSelect PT Options',
            component: AppDocPtTable,
            data: getPTOptions('MultiSelect')
        }
    ];
}
