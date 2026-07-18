import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Car } from '@/domain/car';
import { CarService } from '@/service/carservice';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FilterMatchMode, FilterService, SelectItem } from 'voxx-ui/api';
import { TableModule } from 'voxx-ui/table';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'tableintegration-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText, TableModule],
    template: `
        <app-docsectiontext>
            <p>A custom equals filter that checks for exact case sensitive value is registered and defined as a match mode of a column filter.</p>
        </app-docsectiontext>
        <div class="card">
            <vx-table #dt [columns]="cols" [value]="cars" [paginator]="true" [rows]="10" [tableStyle]="{ 'min-width': '75rem' }">
                <ng-template vxTemplate="header" let-columns>
                    <tr>
                        @for (col of columns; track col) {
                            <th [style.width]="'25%'">{{ col.header }}</th>
                        }
                    </tr>
                    <tr>
                        @for (col of columns; track col) {
                            <th>
                                <vx-columnFilter type="text" [field]="col.field" [matchModeOptions]="matchModeOptions" [matchMode]="'custom-equals'" />
                            </th>
                        }
                    </tr>
                </ng-template>
                <ng-template vxTemplate="body" let-rowData let-columns="columns">
                    <tr [vxSelectableRow]="rowData">
                        @for (col of columns; track col) {
                            <td>{{ rowData[col.field] }}</td>
                        }
                    </tr>
                </ng-template>
            </vx-table>
        </div>
        <app-code [extFiles]="['Product', 'Car']"></app-code>
    `,
    providers: [FilterService]
})
export class TableIntegrationDoc implements OnInit {
    cars: Car[];

    cols: any[];

    matchModeOptions: SelectItem[];

    constructor(
        private carService: CarService,
        private filterService: FilterService,
        private cd: ChangeDetectorRef
    ) {}

    ngOnInit() {
        const customFilterName = 'custom-equals';

        this.filterService.register(customFilterName, (value, filter): boolean => {
            if (filter === undefined || filter === null || filter.trim() === '') {
                return true;
            }

            if (value === undefined || value === null) {
                return false;
            }

            return value.toString() === filter.toString();
        });

        this.cols = [
            { field: 'year', header: 'Year' },
            { field: 'brand', header: 'Brand' },
            { field: 'color', header: 'Color' },
            { field: 'vin', header: 'Vin' }
        ];

        this.matchModeOptions = [
            { label: 'Custom Equals', value: customFilterName },
            { label: 'Starts With', value: FilterMatchMode.STARTS_WITH },
            { label: 'Contains', value: FilterMatchMode.CONTAINS }
        ];

        this.carService.getCarsMedium().then((cars) => {
            this.cars = cars;

            this.cd.markForCheck();
        });
    }
}
