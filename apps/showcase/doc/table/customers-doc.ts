import { DeferredDemo } from '@/components/demo/deferreddemo';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Customer, Representative } from '@/domain/customer';
import { CustomerService } from '@/service/customerservice';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'voxx-ui/button';
import { IconFieldModule } from 'voxx-ui/iconfield';
import { InputIconModule } from 'voxx-ui/inputicon';
import { InputTextModule } from 'voxx-ui/inputtext';
import { MultiSelectModule } from 'voxx-ui/multiselect';
import { ProgressBarModule } from 'voxx-ui/progressbar';
import { SelectModule } from 'voxx-ui/select';
import { SliderModule } from 'voxx-ui/slider';
import { Table, TableModule } from 'voxx-ui/table';
import { TagModule } from 'voxx-ui/tag';

@Component({
    selector: 'customers-doc',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, IconFieldModule, InputIconModule, InputTextModule, MultiSelectModule, SelectModule, TagModule, SliderModule, ProgressBarModule, AppDocSectionText, AppCode, DeferredDemo],
    template: ` <app-docsectiontext>
            <p>DataTable with selection, pagination, filtering, sorting and templating.</p>
        </app-docsectiontext>
        <vx-deferred-demo (load)="loadDemoData()">
            <div class="card">
                <vx-table
                    #dt
                    [value]="customers"
                    [(selection)]="selectedCustomers"
                    dataKey="id"
                    [rowHover]="true"
                    [rows]="10"
                    [showCurrentPageReport]="true"
                    [rowsPerPageOptions]="[10, 25, 50]"
                    [loading]="loading"
                    [paginator]="true"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                    [filterDelay]="0"
                    [globalFilterFields]="['name', 'country.name', 'representative.name', 'status']"
                >
                    <ng-template #caption>
                        <div class="flex justify-between">
                            <vx-button [outlined]="true" icon="pi pi-filter-slash" label="Clear" (click)="clear(dt)" />
                            <vx-iconField iconPosition="left">
                                <vx-inputIcon>
                                    <i class="pi pi-search"></i>
                                </vx-inputIcon>
                                <input vxInputText type="text" [(ngModel)]="searchValue" (input)="dt.filterGlobal($event.target.value, 'contains')" placeholder="Keyboard Search" />
                            </vx-iconField>
                        </div>
                    </ng-template>
                    <ng-template #header>
                        <tr>
                            <th style="width: 4rem">
                                <vx-tableHeaderCheckbox />
                            </th>
                            <th vxSortableColumn="name" style="min-width: 14rem">
                                <div class="flex justify-between items-center gap-2">
                                    Name
                                    <vx-sortIcon field="name" />
                                    <vx-columnFilter type="text" field="name" display="menu" class="ml-auto" />
                                </div>
                            </th>
                            <th vxSortableColumn="country.name" style="min-width: 14rem">
                                <div class="flex justify-between items-center gap-2">
                                    Country
                                    <vx-sortIcon field="country.name" />
                                    <vx-columnFilter type="text" field="country.name" display="menu" class="ml-auto" />
                                </div>
                            </th>
                            <th vxSortableColumn="representative.name" style="min-width: 14rem">
                                <div class="flex justify-between items-center gap-2">
                                    Agent
                                    <vx-sortIcon field="representative.name" />
                                    <vx-columnFilter field="representative" matchMode="in" display="menu" [showMatchModes]="false" [showOperator]="false" [showAddButton]="false" class="ml-auto">
                                        <ng-template #filter let-value let-filter="filterCallback">
                                            <vx-multiselect [filter]="false" [(ngModel)]="value" [options]="representatives" placeholder="Any" (onChange)="filter($event.value)" optionLabel="name" class="w-full">
                                                <ng-template let-option #item>
                                                    <div class="flex items-center gap-2">
                                                        <img [alt]="option.label" src="https://primefaces.org/cdn/primeng/images/demo/avatar/{{ option.image }}" style="width: 32px" />
                                                        <span>{{ option.name }}</span>
                                                    </div>
                                                </ng-template>
                                            </vx-multiselect>
                                        </ng-template>
                                    </vx-columnFilter>
                                </div>
                            </th>
                            <th vxSortableColumn="date" style="min-width: 14rem">
                                <div class="flex justify-between items-center gap-2">
                                    Date
                                    <vx-sortIcon field="date" />
                                    <vx-columnFilter type="date" field="date" display="menu" class="ml-auto" />
                                </div>
                            </th>
                            <th vxSortableColumn="balance" style="min-width: 14rem">
                                <div class="flex justify-between items-center gap-2">
                                    Balance
                                    <vx-sortIcon field="balance" />
                                    <vx-columnFilter type="numeric" field="balance" display="menu" currency="USD" class="ml-auto" />
                                </div>
                            </th>
                            <th vxSortableColumn="status" style="min-width: 14rem">
                                <div class="flex justify-between items-center gap-2">
                                    Status
                                    <vx-sortIcon field="status" />
                                    <vx-columnFilter field="status" matchMode="equals" display="menu" class="ml-auto">
                                        <ng-template #filter let-value let-filter="filterCallback">
                                            <vx-select [(ngModel)]="value" [options]="statuses" (onChange)="filter($event.value)" placeholder="Any">
                                                <ng-template let-option #item>
                                                    <vx-tag [value]="option.label" [severity]="getSeverity(option.label)" />
                                                </ng-template>
                                            </vx-select>
                                        </ng-template>
                                    </vx-columnFilter>
                                </div>
                            </th>
                            <th vxSortableColumn="activity" style="min-width: 14rem">
                                <div class="flex justify-between items-center gap-2">
                                    Activity
                                    <vx-sortIcon field="activity" />
                                    <vx-columnFilter field="activity" matchMode="between" display="menu" [showMatchModes]="false" [showOperator]="false" [showAddButton]="false" class="ml-auto">
                                        <ng-template #filter let-filter="filterCallback">
                                            <vx-slider [(ngModel)]="activityValues" [range]="true" (onSlideEnd)="filter($event.values)" class="m-4"></vx-slider>
                                            <div class="flex items-center justify-between px-2">
                                                <span>{{ activityValues[0] }}</span>
                                                <span>{{ activityValues[1] }}</span>
                                            </div>
                                        </ng-template>
                                    </vx-columnFilter>
                                </div>
                            </th>
                            <th style="width: 5rem"></th>
                        </tr>
                    </ng-template>
                    <ng-template #body let-customer>
                        <tr class="p-selectable-row">
                            <td>
                                <vx-tableCheckbox [value]="customer" />
                            </td>
                            <td>
                                {{ customer.name }}
                            </td>
                            <td>
                                <div class="flex items-center gap-2">
                                    <img src="https://primefaces.org/cdn/primeng/images/demo/flag/flag_placeholder.png" [class]="'flag flag-' + customer.country.code" style="width: 20px" />
                                    <span class="ml-1 align-middle">{{ customer.country.name }}</span>
                                </div>
                            </td>
                            <td>
                                <div class="flex items-center gap-2">
                                    <img [alt]="customer.representative.name" src="https://primefaces.org/cdn/primeng/images/demo/avatar/{{ customer.representative.image }}" width="32" style="vertical-align: middle" />
                                    <span class="ml-1 align-middle">{{ customer.representative.name }}</span>
                                </div>
                            </td>
                            <td>
                                {{ customer.date | date: 'MM/dd/yyyy' }}
                            </td>
                            <td>
                                {{ customer.balance | currency: 'USD' : 'symbol' }}
                            </td>
                            <td>
                                <vx-tag [value]="customer.status" [severity]="getSeverity(customer.status)" />
                            </td>
                            <td>
                                <vx-progressBar [value]="customer.activity" [showValue]="false" />
                            </td>
                            <td style="text-align: center">
                                <vx-button rounded icon="pi pi-cog" />
                            </td>
                        </tr>
                    </ng-template>
                    <ng-template #emptymessage>
                        <tr>
                            <td colspan="8">No customers found.</td>
                        </tr>
                    </ng-template>
                </vx-table>
            </div>
        </vx-deferred-demo>
        <app-code [extFiles]="['Customer']"></app-code>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomersDoc {
    customers!: Customer[];

    selectedCustomers!: Customer[];

    representatives!: Representative[];

    statuses!: any[];

    loading: boolean = true;

    activityValues: number[] = [0, 100];

    searchValue: string | undefined;

    constructor(
        private customerService: CustomerService,
        private cd: ChangeDetectorRef
    ) {}

    loadDemoData() {
        this.customerService.getCustomersLarge().then((customers) => {
            this.customers = customers;
            this.loading = false;

            this.customers.forEach((customer) => (customer.date = new Date(<Date>customer.date)));
            this.cd.markForCheck();
        });

        this.representatives = [
            { name: 'Amy Elsner', image: 'amyelsner.png' },
            { name: 'Anna Fali', image: 'annafali.png' },
            { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
            { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
            { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
            { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
            { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
            { name: 'Onyama Limba', image: 'onyamalimba.png' },
            { name: 'Stephen Shaw', image: 'stephenshaw.png' },
            { name: 'Xuxue Feng', image: 'xuxuefeng.png' }
        ];

        this.statuses = [
            { label: 'Unqualified', value: 'unqualified' },
            { label: 'Qualified', value: 'qualified' },
            { label: 'New', value: 'new' },
            { label: 'Negotiation', value: 'negotiation' },
            { label: 'Renewal', value: 'renewal' },
            { label: 'Proposal', value: 'proposal' }
        ];
    }

    clear(dt: Table) {
        this.searchValue = '';
        dt.reset();
    }

    getSeverity(status: string) {
        switch (status) {
            case 'unqualified':
                return 'danger';

            case 'qualified':
                return 'success';

            case 'new':
                return 'info';

            case 'negotiation':
                return 'warn';

            case 'renewal':
                return null;
        }
    }
}
