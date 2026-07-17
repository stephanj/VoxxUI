import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'voxx-ui/radiobutton';

@Component({
    selector: 'radiobutton-pt-viewer',
    standalone: true,
    imports: [CommonModule, AppDocPtViewer, RadioButtonModule, FormsModule],
    template: `
        <app-docptviewer [docs]="docs">
            <vx-radiobutton name="pt-demo" value="1" [(ngModel)]="value"></vx-radiobutton>
        </app-docptviewer>
    `
})
export class PTViewer {
    value: any = null;

    docs = [
        {
            data: getPTOptions('RadioButton'),
            key: 'RadioButton'
        }
    ];
}
