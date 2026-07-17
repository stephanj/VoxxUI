import { DeferredDemo } from '@/components/demo/deferreddemo';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { TableModule } from 'voxx-ui/table';

@Component({
    selector: 'presort-doc',
    standalone: true,
    imports: [TableModule, AppDocSectionText, AppCode, DeferredDemo, CommonModule],
    template: `
        <app-docsectiontext>
            <p>
                Defining a default <i>sortField</i> and <i>sortOrder</i> displays data as sorted initially in single column sorting. In <i>multiple</i> sort mode, <i>multiSortMeta</i> should be used instead by providing an array of
                <i>DataTableSortMeta</i> objects.
            </p>
        </app-docsectiontext>
        <vx-deferred-demo (load)="loadDemoData()">
            <div class="card">
                <vx-table [value]="products" sortField="price" [sortOrder]="-1" [tableStyle]="{ 'min-width': '60rem' }">
                    <ng-template #header>
                        <tr>
                            <th vxSortableColumn="code" style="width:20%">
                                <div class="flex items-center gap-2">
                                    Code
                                    <vx-sortIcon field="code" />
                                </div>
                            </th>
                            <th vxSortableColumn="name" style="width:20%">
                                <div class="flex items-center gap-2">
                                    Name
                                    <vx-sortIcon field="name" />
                                </div>
                            </th>
                            <th vxSortableColumn="price" style="width:20%">
                                <div class="flex items-center gap-2">
                                    Price
                                    <vx-sortIcon field="price" />
                                </div>
                            </th>
                            <th vxSortableColumn="category" style="width:20%">
                                <div class="flex items-center gap-2">
                                    Category
                                    <vx-sortIcon field="category" />
                                </div>
                            </th>
                            <th vxSortableColumn="quantity" style="width:20%">
                                <div class="flex items-center gap-2">
                                    Quantity
                                    <vx-sortIcon field="quantity" />
                                </div>
                            </th>
                        </tr>
                    </ng-template>
                    <ng-template #body let-product>
                        <tr>
                            <td>{{ product.code }}</td>
                            <td>{{ product.name }}</td>
                            <td>{{ product.price | currency: 'USD' }}</td>
                            <td>{{ product.category }}</td>
                            <td>{{ product.quantity }}</td>
                        </tr>
                    </ng-template>
                </vx-table>
            </div>
        </vx-deferred-demo>
        <app-code [extFiles]="['Product']"></app-code>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreSortDoc {
    products!: Product[];

    constructor(
        private productService: ProductService,
        private cd: ChangeDetectorRef
    ) {}

    loadDemoData() {
        this.productService.getProductsMini().then((data) => {
            this.products = data;
            this.cd.markForCheck();
        });
    }

    extFiles = [
        {
            path: 'src/domain/product.ts',
            content: `
export interface Product {
    id?: string;
    code?: string;
    name?: string;
    description?: string;
    price?: number;
    quantity?: number;
    inventoryStatus?: string;
    category?: string;
    image?: string;
    rating?: number;
}`
        }
    ];
}
