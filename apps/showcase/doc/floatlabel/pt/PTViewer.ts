import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'voxx-ui/floatlabel';
import { InputTextModule } from 'voxx-ui/inputtext';

@Component({
    selector: 'floatlabel-pt-viewer',
    standalone: true,
    imports: [CommonModule, FormsModule, AppDocPtViewer, FloatLabelModule, InputTextModule],
    template: `
        <app-docptviewer [docs]="docs">
            <vx-floatlabel>
                <input vxInputText id="username" [(ngModel)]="value" autocomplete="off" />
                <label for="username">Username</label>
            </vx-floatlabel>
        </app-docptviewer>
    `
})
export class PTViewer {
    value: string | null = null;

    docs = [
        {
            data: getPTOptions('FloatLabel'),
            key: 'FloatLabel'
        }
    ];
}
