import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MenuItem } from 'voxx-ui/api';
import { SplitButtonModule } from 'voxx-ui/splitbutton';
import { ToastModule } from 'voxx-ui/toast';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'splitbutton-pt-viewer',
    standalone: true,
    imports: [CommonModule, AppDocPtViewer, SplitButtonModule, ToastModule],
    template: `
        <app-docptviewer [docs]="docs">
            <vx-toast />
            <vx-splitbutton label="Save" icon="pi pi-check" dropdownIcon="pi pi-cog" [model]="items" />
        </app-docptviewer>
    `
})
export class PTViewer {
    items: MenuItem[];

    constructor() {
        this.items = [
            {
                label: 'Update'
            },
            {
                label: 'Delete'
            },
            { label: 'Angular.dev', url: 'https://angular.dev' }
        ];
    }

    docs = [
        {
            data: getPTOptions('SplitButton'),
            key: 'SplitButton'
        }
    ];
}
