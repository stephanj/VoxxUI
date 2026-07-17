import { DeferredDemo } from '@/components/demo/deferreddemo';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'voxx-ui/api';
import { ButtonModule } from 'voxx-ui/button';
import { RatingModule } from 'voxx-ui/rating';
import { RippleModule } from 'voxx-ui/ripple';
import { TableModule, TableRowCollapseEvent, TableRowExpandEvent } from 'voxx-ui/table';
import { TagModule } from 'voxx-ui/tag';
import { ToastModule } from 'voxx-ui/toast';

@Component({
    selector: 'rowexpansion-doc',
    standalone: true,
    imports: [TableModule, ToastModule, ButtonModule, FormsModule, RippleModule, AppDocSectionText, AppCode, DeferredDemo, CommonModule, RatingModule, TagModule],
    template: ` <app-docsectiontext>
            <p>
                Row expansion allows displaying detailed content for a particular row. To use this feature, define a <i>dataKey</i>, add a template named <i>expandedrow</i> and use the <i>vxRowToggler</i> directive on an element as the target to
                toggle an expansion. This enables providing your custom UI such as buttons, links and so on. Example below uses an anchor with an icon as a toggler. Setting <i>vxRowTogglerDisabled</i> as true disables the toggle event for the
                element.
            </p>
        </app-docsectiontext>
        <vx-deferred-demo (load)="loadDemoData()">
            <div class="card">
                <vx-toast />
                <vx-table [value]="products" dataKey="id" [tableStyle]="{ 'min-width': '60rem' }" [expandedRowKeys]="expandedRows" (onRowExpand)="onRowExpand($event)" (onRowCollapse)="onRowCollapse($event)">
                    <ng-template #caption>
                        <div class="flex flex-wrap justify-end gap-2">
                            <vx-button label="Expand All" icon="pi pi-plus" text (onClick)="expandAll()" />
                            <vx-button label="Collapse All" icon="pi pi-minus" text (onClick)="collapseAll()" />
                        </div>
                    </ng-template>
                    <ng-template #header>
                        <tr>
                            <th style="width: 5rem"></th>
                            <th>Name</th>
                            <th>Image</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Reviews</th>
                            <th>Status</th>
                        </tr>
                    </ng-template>
                    <ng-template #body let-product let-expanded="expanded">
                        <tr>
                            <td>
                                <vx-button type="button" vxRipple [vxRowToggler]="product" [text]="true" severity="secondary" [rounded]="true" [icon]="expanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right'" />
                            </td>
                            <td>{{ product.name }}</td>
                            <td>
                                <img [src]="'https://primefaces.org/cdn/primeng/images/demo/product/' + product.image" [alt]="product.name" width="50" class="shadow-lg" />
                            </td>
                            <td>{{ product.price | currency: 'USD' }}</td>
                            <td>{{ product.category }}</td>
                            <td>
                                <vx-rating [(ngModel)]="product.rating" [readonly]="true" [cancel]="false" />
                            </td>
                            <td>
                                <vx-tag [value]="product.inventoryStatus" [severity]="getSeverity(product.inventoryStatus)" />
                            </td>
                        </tr>
                    </ng-template>
                    <ng-template #expandedrow let-product>
                        <tr>
                            <td colspan="7">
                                <div class="p-4">
                                    <h5>Orders for {{ product.name }}</h5>
                                    <vx-table [value]="product.orders" dataKey="id">
                                        <ng-template #header>
                                            <tr>
                                                <th vxSortableColumn="id">
                                                    <div class="flex items-center gap-2">
                                                        Id
                                                        <vx-sortIcon field="price" />
                                                    </div>
                                                </th>
                                                <th vxSortableColumn="customer">
                                                    <div class="flex items-center gap-2">
                                                        Customer
                                                        <vx-sortIcon field="customer" />
                                                    </div>
                                                </th>
                                                <th vxSortableColumn="date">
                                                    <div class="flex items-center gap-2">
                                                        Date
                                                        <vx-sortIcon field="date" />
                                                    </div>
                                                </th>
                                                <th vxSortableColumn="amount">
                                                    <div class="flex items-center gap-2">
                                                        Amount
                                                        <vx-sortIcon field="amount" />
                                                    </div>
                                                </th>
                                                <th vxSortableColumn="status">
                                                    <div class="flex items-center gap-2">
                                                        Status
                                                        <vx-sortIcon field="status" />
                                                    </div>
                                                </th>
                                                <th style="width: 4rem"></th>
                                            </tr>
                                        </ng-template>
                                        <ng-template #body let-order>
                                            <tr>
                                                <td>{{ order.id }}</td>
                                                <td>{{ order.customer }}</td>
                                                <td>{{ order.date }}</td>
                                                <td>{{ order.amount | currency: 'USD' }}</td>
                                                <td>
                                                    <vx-tag [value]="order.status" [severity]="getStatusSeverity(order.status)" />
                                                </td>
                                                <td>
                                                    <vx-button type="button" icon="pi pi-search" />
                                                </td>
                                            </tr>
                                        </ng-template>
                                        <ng-template #emptymessage>
                                            <tr>
                                                <td colspan="6">There are no order for this product yet.</td>
                                            </tr>
                                        </ng-template>
                                    </vx-table>
                                </div>
                            </td>
                        </tr>
                    </ng-template>
                </vx-table>
            </div>
        </vx-deferred-demo>
        <app-code [extFiles]="['Product']"></app-code>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [MessageService]
})
export class RowExpansionDoc {
    products!: Product[];

    expandedRows = {};

    constructor(
        private productService: ProductService,
        private cd: ChangeDetectorRef,
        private messageService: MessageService
    ) {}

    loadDemoData() {
        this.productService.getProductsWithOrdersSmall().then((data) => {
            this.products = data;
            this.cd.markForCheck();
        });
    }

    expandAll() {
        this.expandedRows = this.products.reduce((acc, p) => (acc[p.id] = true) && acc, {});
    }

    collapseAll() {
        this.expandedRows = {};
    }

    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warn';
            case 'OUTOFSTOCK':
                return 'danger';
        }
    }

    getStatusSeverity(status: string) {
        switch (status) {
            case 'PENDING':
                return 'warn';
            case 'DELIVERED':
                return 'success';
            case 'CANCELLED':
                return 'danger';
        }
    }

    onRowExpand(event: TableRowExpandEvent) {
        this.messageService.add({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
    }

    onRowCollapse(event: TableRowCollapseEvent) {
        this.messageService.add({
            severity: 'success',
            summary: 'Product Collapsed',
            detail: event.data.name,
            life: 3000
        });
    }
}
