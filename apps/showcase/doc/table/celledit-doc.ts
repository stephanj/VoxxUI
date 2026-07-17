import { DeferredDemo } from '@/components/demo/deferreddemo';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'voxx-ui/inputtext';
import { TableModule } from 'voxx-ui/table';

@Component({
    selector: 'celledit-doc',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, InputTextModule, AppDocSectionText, AppCode, DeferredDemo],
    template: ` <app-docsectiontext>
            <p>In-cell editing is enabled by adding <i>vxEditableColumn</i> directive to an editable cell that has a <i>p-cellEditor</i> helper component to define the input-output templates for the edit and view modes respectively.</p>
        </app-docsectiontext>
        <vx-deferred-demo (load)="loadDemoData()">
            <div class="card">
                <vx-table [value]="products" dataKey="id" [tableStyle]="{ 'min-width': '50rem' }">
                    <ng-template #header>
                        <tr>
                            <th style="width:25%">Code</th>
                            <th style="width:25%">Name</th>
                            <th style="width:25%">Quantity</th>
                            <th style="width:25%">Price</th>
                        </tr>
                    </ng-template>
                    <ng-template #body let-product let-editing="editing">
                        <tr>
                            <td [vxEditableColumn]="product.code" vxEditableColumnField="code">
                                <vx-cellEditor>
                                    <ng-template #input>
                                        <input vxInputText type="text" [(ngModel)]="product.code" fluid />
                                    </ng-template>
                                    <ng-template #output>
                                        {{ product.code }}
                                    </ng-template>
                                </vx-cellEditor>
                            </td>
                            <td [vxEditableColumn]="product.name" vxEditableColumnField="name">
                                <vx-cellEditor>
                                    <ng-template #input>
                                        <input vxInputText type="text" [(ngModel)]="product.name" required fluid />
                                    </ng-template>
                                    <ng-template #output>
                                        {{ product.name }}
                                    </ng-template>
                                </vx-cellEditor>
                            </td>
                            <td [vxEditableColumn]="product.quantity" vxEditableColumnField="quantity">
                                <vx-cellEditor>
                                    <ng-template #input>
                                        <input vxInputText [(ngModel)]="product.quantity" fluid />
                                    </ng-template>
                                    <ng-template #output>
                                        {{ product.quantity }}
                                    </ng-template>
                                </vx-cellEditor>
                            </td>
                            <td [vxEditableColumn]="product.price" vxEditableColumnField="price">
                                <vx-cellEditor>
                                    <ng-template #input>
                                        <input vxInputText type="text" [(ngModel)]="product.price" fluid />
                                    </ng-template>
                                    <ng-template #output>
                                        {{ product.price | currency: 'USD' }}
                                    </ng-template>
                                </vx-cellEditor>
                            </td>
                        </tr>
                    </ng-template>
                </vx-table>
            </div>
        </vx-deferred-demo>
        <app-code [extFiles]="['Product']"></app-code>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CellEditDoc {
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
