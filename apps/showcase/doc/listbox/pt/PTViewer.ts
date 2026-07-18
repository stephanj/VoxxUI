import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Listbox } from 'voxx-ui/listbox';

interface City {
    name: string;
    code: string;
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'listbox-pt-viewer',
    standalone: true,
    imports: [AppDocPtViewer, Listbox, FormsModule],
    template: `
        <app-docptviewer [docs]="docs">
            <vx-listbox [(ngModel)]="selectedCity" [options]="cities" [multiple]="true" [checkbox]="true" [filter]="true" optionLabel="name" class="w-full md:w-56" />
        </app-docptviewer>
    `
})
export class PTViewer {
    cities: City[] = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];

    selectedCity!: City;

    docs = [
        {
            data: getPTOptions('Listbox'),
            key: 'Listbox'
        }
    ];
}
