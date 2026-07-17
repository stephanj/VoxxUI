import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BadgeModule } from 'primeng/badge';

@Component({
    selector: 'badge-pt-viewer',
    standalone: true,
    imports: [CommonModule, AppDocPtViewer, BadgeModule],
    template: `
        <app-docptviewer [docs]="docs">
            <div class="flex flex-wrap gap-8">
                <p-badge value="2"></p-badge>
            </div>
        </app-docptviewer>
    `
})
export class PTViewer {
    docs = [
        {
            data: getPTOptions('Badge'),
            key: 'Badge'
        }
    ];
}
