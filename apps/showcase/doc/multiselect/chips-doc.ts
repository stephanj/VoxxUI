import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'voxx-ui/multiselect';
import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

interface City {
    name: string;
    code: string;
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'chips-doc',
    standalone: true,
    imports: [FormsModule, MultiSelectModule, AppCodeModule, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>Selected values are displayed as a comma separated list by default, setting <i>display</i> as <i>chip</i> displays them as chips.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <vx-multiselect [options]="cities" [(ngModel)]="selectedCities" placeholder="Select Cities" optionLabel="name" display="chip" class="w-full md:w-80" />
        </div>
        <app-code></app-code>
    `
})
export class ChipsDoc implements OnInit {
    cities!: City[];

    selectedCities!: City[];

    ngOnInit() {
        this.cities = [
            { name: 'New York', code: 'NY' },
            { name: 'Rome', code: 'RM' },
            { name: 'London', code: 'LDN' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Paris', code: 'PRS' }
        ];
    }
}
