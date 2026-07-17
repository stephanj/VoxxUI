import { DeferredDemo } from '@/components/demo/deferreddemo';
import { AppCode } from '@/components/doc/app.code';
import { Customer } from '@/domain/customer';
import { CustomerService } from '@/service/customerservice';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { TableModule } from 'voxx-ui/table';

@Component({
    selector: 'columnresizescrollablemode-doc',
    standalone: true,
    imports: [CommonModule, TableModule, AppCode, DeferredDemo],
    template: ` <vx-deferred-demo (load)="loadDemoData()">
            <div class="card">
                <vx-table [value]="customers" showGridlines [scrollable]="true" scrollHeight="400px" [resizableColumns]="true" [tableStyle]="{ 'min-width': '50rem' }">
                    <ng-template #header>
                        <tr>
                            <th vxResizableColumn>Name</th>
                            <th vxResizableColumn>Country</th>
                            <th vxResizableColumn>Company</th>
                            <th vxResizableColumn>Representative</th>
                        </tr>
                    </ng-template>
                    <ng-template #body let-customer>
                        <tr>
                            <td>{{ customer.name }}</td>
                            <td>{{ customer.country.name }}</td>
                            <td>{{ customer.company }}</td>
                            <td>{{ customer.representative.name }}</td>
                        </tr>
                    </ng-template>
                </vx-table>
            </div>
        </vx-deferred-demo>
        <app-code></app-code>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColumnResizeScrollableModeDoc {
    customers!: Customer[];

    constructor(
        private customerService: CustomerService,
        private cd: ChangeDetectorRef
    ) {}

    loadDemoData() {
        this.customerService.getCustomersLarge().then((customers) => {
            this.customers = customers;
            this.cd.markForCheck();
        });
    }
}
