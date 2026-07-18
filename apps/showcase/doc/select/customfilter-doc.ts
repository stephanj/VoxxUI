import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SelectFilterOptions } from 'voxx-ui/select';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'voxx-ui/select';
import { InputGroupModule } from 'voxx-ui/inputgroup';
import { InputGroupAddonModule } from 'voxx-ui/inputgroupaddon';
import { ButtonModule } from 'voxx-ui/button';
import { InputTextModule } from 'voxx-ui/inputtext';

interface City {
    name: string;
    code: string;
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'customfilter-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, FormsModule, SelectModule, InputGroupModule, InputGroupAddonModule, ButtonModule, InputTextModule],
    template: `
        <app-docsectiontext>
            <p>Custom filter can be applied with the <i>filterTemplate</i>.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <vx-select [options]="countries" [(ngModel)]="selectedCountry" optionLabel="name" [filter]="true" filterBy="name" [showClear]="true" placeholder="Select a Country">
                <ng-template vxTemplate="filter" let-options="options">
                    <div class="flex gap-1">
                        <vx-inputgroup (click)="$event.stopPropagation()">
                            <vx-inputgroup-addon><i class="pi pi-search"></i></vx-inputgroup-addon>
                            <input type="text" vxInputText placeholder="Filter" [(ngModel)]="filterValue" (keyup)="customFilterFunction($event, options)" />
                        </vx-inputgroup>
                        <vx-button icon="pi pi-times" (click)="resetFunction(options)" severity="secondary" />
                    </div>
                </ng-template>
                <ng-template vxTemplate="selectedItem" let-selectedOption>
                    <div class="flex items-center gap-2">
                        <img src="https://primefaces.org/cdn/primeng/images/demo/flag/flag_placeholder.png" [class]="'flag flag-' + selectedCountry.code.toLowerCase()" style="width: 18px" />
                        <div>{{ selectedOption.name }}</div>
                    </div>
                </ng-template>
                <ng-template let-country vxTemplate="item">
                    <div class="flex items-center gap-2">
                        <img src="https://primefaces.org/cdn/primeng/images/demo/flag/flag_placeholder.png" [class]="'flag flag-' + country.code.toLowerCase()" style="width: 18px" />
                        <div>{{ country.name }}</div>
                    </div>
                </ng-template>
            </vx-select>
        </div>
        <app-code></app-code>
    `
})
export class CustomFilterDoc implements OnInit {
    countries: City[] | undefined;

    selectedCountry: string | undefined;

    filterValue: string | undefined = '';

    ngOnInit() {
        this.countries = [
            { name: 'Australia', code: 'AU' },
            { name: 'Brazil', code: 'BR' },
            { name: 'China', code: 'CN' },
            { name: 'Egypt', code: 'EG' },
            { name: 'France', code: 'FR' },
            { name: 'Germany', code: 'DE' },
            { name: 'India', code: 'IN' },
            { name: 'Japan', code: 'JP' },
            { name: 'Spain', code: 'ES' },
            { name: 'United States', code: 'US' }
        ];
    }

    resetFunction(options: SelectFilterOptions) {
        options.reset();
        this.filterValue = '';
    }

    customFilterFunction(event: KeyboardEvent, options: SelectFilterOptions) {
        options.filter(event);
    }
}
