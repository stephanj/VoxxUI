import { DeferredDemo } from '@/components/demo/deferreddemo';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { TableModule } from 'voxx-ui/table';

@Component({
    selector: 'multiplecolumnssort-doc',
    standalone: true,
    imports: [TableModule, AppDocSectionText, AppCode, DeferredDemo],
    template: `
        <app-docsectiontext>
            <p>Multiple columns can be sorted by defining <i>sortMode</i> as <i>multiple</i>. This mode requires metaKey (e.g. <i>⌘</i>) to be pressed when clicking a header.</p>
        </app-docsectiontext>
        <vx-deferred-demo (load)="loadDemoData()">
            <div class="card">
                <vx-table [value]="products" [tableStyle]="{ 'min-width': '60rem' }" sortMode="multiple">
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
export class MultipleColumnsSortDoc {
    products: Product[];

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
