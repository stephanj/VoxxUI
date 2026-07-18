import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EditorModule } from 'voxx-ui/editor';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'editor-pt-viewer',
    standalone: true,
    imports: [AppDocPtViewer, EditorModule, FormsModule],
    template: `
        <app-docptviewer [docs]="docs">
            <vx-editor [(ngModel)]="value" [style]="{ height: '320px' }"></vx-editor>
        </app-docptviewer>
    `
})
export class PTViewer {
    value: any = '';
    docs = [{ data: getPTOptions('Editor'), key: 'Editor' }];
}
