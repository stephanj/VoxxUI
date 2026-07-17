import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'voxx-ui/iconfield';
import { InputIconModule } from 'voxx-ui/inputicon';
import { InputTextModule } from 'voxx-ui/inputtext';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'iconfield-pt-viewer',
    standalone: true,
    imports: [CommonModule, FormsModule, AppDocPtViewer, IconFieldModule, InputIconModule, InputTextModule],
    template: `
        <app-docptviewer [docs]="docs">
            <vx-iconfield>
                <vx-inputicon class="pi pi-search" />
                <input vxInputText [(ngModel)]="value" placeholder="Search" />
            </vx-iconfield>
        </app-docptviewer>
    `
})
export class PTViewer {
    value: string | null = null;

    docs = [
        {
            data: getPTOptions('IconField'),
            key: 'IconField'
        },
        {
            data: getPTOptions('InputIcon'),
            key: 'InputIcon'
        }
    ];
}
