import { DeferredDemo } from '@/components/demo/deferreddemo';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Customer } from '@/domain/customer';
import { CustomerService } from '@/service/customerservice';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { IconFieldModule } from 'voxx-ui/iconfield';
import { InputIconModule } from 'voxx-ui/inputicon';
import { InputTextModule } from 'voxx-ui/inputtext';
import { TableModule } from 'voxx-ui/table';
import { TagModule } from 'voxx-ui/tag';

@Component({
    selector: 'stateful-doc',
    standalone: true,
    imports: [TableModule, InputTextModule, TagModule, IconFieldModule, InputIconModule, AppDocSectionText, AppCode, DeferredDemo],
    template: ` <app-docsectiontext>
            <p>Stateful table allows keeping the state such as page, sort and filtering either at local storage or session storage so that when the page is visited again, table would render the data using the last settings.</p>
            <p>
                Change the state of the table e.g paginate, navigate away and then return to this table again to test this feature, the setting is set as <i>session</i> with the <i>stateStorage</i> property so that Table retains the state until the
                browser is closed. Other alternative is <i>local</i> referring to <i>localStorage</i> for an extended lifetime.
            </p>
        </app-docsectiontext>
        <vx-deferred-demo (load)="loadDemoData()">
            <div class="card">
                <vx-table
                    #dt1
                    [value]="customers"
                    [globalFilterFields]="['name', 'country.name', 'representative.name', 'status']"
                    selectionMode="single"
                    [(selection)]="selectedCustomers"
                    dataKey="id"
                    [tableStyle]="{ 'min-width': '50rem' }"
                    [rows]="5"
                    [paginator]="true"
                    stateStorage="session"
                    stateKey="statedemo-session"
                >
                    <ng-template #caption>
                        <vx-iconfield iconPosition="left">
                            <vx-inputicon>
                                <i class="pi pi-search"></i>
                            </vx-inputicon>
                            <input vxInputText type="text" [value]="dt1.filters['global']?.value" (input)="dt1.filterGlobal($event.target.value, 'contains')" placeholder="Global Search" />
                        </vx-iconfield>
                    </ng-template>
                    <ng-template #header>
                        <tr>
                            <th vxSortableColumn="name" style="width:25%">
                                <div class="flex items-center gap-2">
                                    Name
                                    <vx-sortIcon field="name" />
                                </div>
                            </th>
                            <th vxSortableColumn="country.name" style="width:25%">
                                <div class="flex items-center gap-2">
                                    Country
                                    <vx-sortIcon field="country.name" />
                                </div>
                            </th>
                            <th vxSortableColumn="representative.name" style="width:25%">
                                <div class="flex items-center gap-2">
                                    Representative
                                    <vx-sortIcon field="representative.name" />
                                </div>
                            </th>
                            <th vxSortableColumn="status" style="width:25%">
                                <div class="flex items-center gap-2">
                                    Status
                                    <vx-sortIcon field="status" />
                                </div>
                            </th>
                        </tr>
                    </ng-template>
                    <ng-template #body let-customer>
                        <tr [vxSelectableRow]="customer">
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
                                <vx-tag [value]="customer.status" [severity]="getSeverity(customer.status)" />
                            </td>
                        </tr>
                    </ng-template>
                    <ng-template #body let-customer>
                        <tr [vxSelectableRow]="customer">
                            <td>
                                {{ customer.name }}
                            </td>
                            <td>
                                <img src="https://primefaces.org/cdn/primeng/images/demo/flag/flag_placeholder.png" [class]="'flag flag-' + customer.country.code" style="width: 20px" />
                                <span class="ml-1 align-middle">{{ customer.country.name }}</span>
                            </td>
                            <td>
                                <img [alt]="customer.representative.name" src="https://primefaces.org/cdn/primeng/images/demo/avatar/{{ customer.representative.image }}" width="32" style="vertical-align: middle" />
                                <span class="ml-1 align-middle">{{ customer.representative.name }}</span>
                            </td>
                            <td>
                                <vx-tag [value]="customer.status" [severity]="getSeverity(customer.status)" />
                            </td>
                        </tr>
                    </ng-template>
                    <ng-template #emptymessage>
                        <tr>
                            <td colspan="4">No customers found.</td>
                        </tr>
                    </ng-template>
                </vx-table>
            </div>
        </vx-deferred-demo>
        <app-code [extFiles]="['Customer']"></app-code>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatefulDoc {
    customers!: Customer[];

    selectedCustomers!: Customer;

    constructor(
        private customerService: CustomerService,
        private cd: ChangeDetectorRef
    ) {}

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

    loadDemoData() {
        this.customerService.getCustomersSmall().then((data) => {
            this.customers = data;
            this.cd.markForCheck();
        });
    }
}
