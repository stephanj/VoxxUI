import { CommonModule } from '@angular/common';
import { AppDocPtViewer } from '@/components/doc/app.docptviewer';
import { getPTOptions } from '@/components/doc/app.docptviewer';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SliderModule } from 'voxx-ui/slider';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'slider-pt-viewer',
    standalone: true,
    imports: [CommonModule, AppDocPtViewer, SliderModule, FormsModule],
    template: `
        <app-docptviewer [docs]="docs">
            <vx-slider [(ngModel)]="value" class="w-56"></vx-slider>
        </app-docptviewer>
    `
})
export class PTViewer {
    value!: number;

    docs = [{ data: getPTOptions('Slider'), key: 'Slider' }];
}
