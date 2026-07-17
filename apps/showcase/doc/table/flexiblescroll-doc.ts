import { DeferredDemo } from '@/components/demo/deferreddemo';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Customer } from '@/domain/customer';
import { CustomerService } from '@/service/customerservice';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ButtonModule } from 'voxx-ui/button';
import { DialogModule } from 'voxx-ui/dialog';
import { TableModule } from 'voxx-ui/table';

@Component({
    selector: 'flexiblescroll-doc',
    standalone: true,
    imports: [TableModule, ButtonModule, DialogModule, AppDocSectionText, AppCode, DeferredDemo],
    template: ` <app-docsectiontext>
            <p>
                Flex scroll feature makes the scrollable viewport section dynamic instead of a fixed value so that it can grow or shrink relative to the parent size of the table. Click the button below to display a maximizable Dialog where data
                viewport adjusts itself according to the size changes.
            </p>
        </app-docsectiontext>
        <vx-deferred-demo (load)="loadDemoData()">
            <div class="card">
                <div class="flex justify-center">
                    <button type="button" (click)="showDialog()" vxButton icon="pi pi-external-link" label="Show"></button>
                </div>
                <vx-dialog header="Header" [resizable]="false" [modal]="true" [maximizable]="true" appendTo="body" [(visible)]="dialogVisible" [style]="{ width: '75vw' }" [contentStyle]="{ height: '300px' }">
                    <vx-table [value]="customers" [scrollable]="true" scrollHeight="flex" [tableStyle]="{ 'min-width': '50rem' }">
                        <ng-template #header>
                            <tr>
                                <th>Name</th>
                                <th>Country</th>
                                <th>Company</th>
                                <th>Representative</th>
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
                    <ng-template #footer>
                        <vx-button label="Ok" icon="pi pi-check" (onClick)="dialogVisible = false" />
                    </ng-template>
                </vx-dialog>
            </div>
        </vx-deferred-demo>
        <app-code [extFiles]="['Customer']"></app-code>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlexibleScrollDoc {
    customers!: Customer[];

    dialogVisible: boolean = false;

    constructor(
        private customerService: CustomerService,
        private cd: ChangeDetectorRef
    ) {}

    loadDemoData() {
        this.customerService.getCustomersMedium().then((data) => {
            this.customers = data;
        });
    }

    showDialog() {
        this.dialogVisible = true;
    }
}
