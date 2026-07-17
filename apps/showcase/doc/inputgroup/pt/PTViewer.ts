import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'voxx-ui/inputgroup';
import { InputGroupAddonModule } from 'voxx-ui/inputgroupaddon';
import { InputTextModule } from 'voxx-ui/inputtext';

@Component({
    selector: 'inputgroup-pt-viewer',
    standalone: true,
    imports: [CommonModule, AppDocPtViewer, InputGroupModule, InputGroupAddonModule, InputTextModule, FormsModule],
    template: `
        <app-docptviewer [docs]="docs">
            <vx-inputgroup>
                <vx-inputgroup-addon>
                    <i class="pi pi-user"></i>
                </vx-inputgroup-addon>
                <input vxInputText [(ngModel)]="value" placeholder="Username" />
            </vx-inputgroup>
        </app-docptviewer>
    `
})
export class PTViewer {
    value: number | null = null;

    docs = [
        {
            data: getPTOptions('InputGroup'),
            key: 'InputGroup'
        },
        {
            data: getPTOptions('InputGroupAddon'),
            key: 'InputGroupAddon'
        }
    ];
}
