import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RatingModule } from 'voxx-ui/rating';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'rating-pt-viewer',
    standalone: true,
    imports: [CommonModule, AppDocPtViewer, RatingModule, FormsModule],
    template: `
        <app-docptviewer [docs]="docs">
            <vx-rating [(ngModel)]="value"></vx-rating>
        </app-docptviewer>
    `
})
export class PTViewer {
    value: number | null = null;

    docs = [
        {
            data: getPTOptions('Rating'),
            key: 'Rating'
        }
    ];
}
