import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BadgeModule } from 'voxx-ui/badge';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'badge-pt-viewer',
    standalone: true,
    imports: [CommonModule, AppDocPtViewer, BadgeModule],
    template: `
        <app-docptviewer [docs]="docs">
            <div class="flex flex-wrap gap-8">
                <vx-badge value="2"></vx-badge>
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
