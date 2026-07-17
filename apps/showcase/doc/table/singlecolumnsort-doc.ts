import { DeferredDemo } from '@/components/demo/deferreddemo';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { TableModule } from 'voxx-ui/table';

@Component({
    selector: 'singlecolumnsort-doc',
    standalone: true,
    imports: [TableModule, AppDocSectionText, AppCode, DeferredDemo],
    template: `
        <app-docsectiontext>
            <p>
                A column can be made sortable by adding the <i>vxSortableColumn</i> directive whose value is the field to sort against and a sort indicator via <i>p-sortIcon</i> component. For dynamic columns, setting
                <i>vxSortableColumnDisabled</i> property as true disables sorting for that particular column.
            </p>
            <p>
                Default sorting is executed on a single column, in order to enable multiple field sorting, set <i>sortMode</i>
                property to "multiple" and use metakey when clicking on another column.
            </p>
        </app-docsectiontext>
        <vx-deferred-demo (load)="loadDemoData()">
            <div class="card">
                <vx-table [value]="products" [tableStyle]="{ 'min-width': '60rem' }">
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
export class SingleColumnSortDoc {
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
}
