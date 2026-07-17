import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';
import { Component, OnInit, signal } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'voxx-ui/dynamicdialog';
import { InfoDemo } from './infodemo';
import { ButtonModule } from 'voxx-ui/button';
import { TableModule } from 'voxx-ui/table';
@Component({
    standalone: true,
    imports: [ButtonModule, TableModule],
    template: ` <div class="flex justify-end mt-1 mb-4">
            <vx-button icon="pi pi-external-link" label="Nested Dialog" [outlined]="true" severity="success" (click)="showInfo()" />
        </div>
        <vx-table [value]="products()" responsiveLayout="scroll" [rows]="5">
            <ng-template vxTemplate="header">
                <tr>
                    <th vxSortableColumn="code">Code</th>
                    <th vxSortableColumn="name">Name</th>
                    <th vxSortableColumn="year">Image</th>
                    <th vxSortableColumn="price">Category</th>
                    <th vxSortableColumn="inventoryStatus">Quantity</th>
                    <th style="width:4em"></th>
                </tr>
            </ng-template>
            <ng-template vxTemplate="body" let-product>
                <tr>
                    <td>{{ product.code }}</td>
                    <td>{{ product.name }}</td>
                    <td>
                        <img src="https://primefaces.org/cdn/primeng/images/demo/product/{{ product.image }}" [alt]="product.image" class="w-16" />
                    </td>
                    <td>{{ product.category }}</td>
                    <td>
                        {{ product.quantity }}
                    </td>
                    <td>
                        <vx-button type="button" [text]="true" [rounded]="true" icon="pi pi-plus" (click)="selectProduct(product)"></vx-button>
                    </td>
                </tr>
            </ng-template>
        </vx-table>`
})
export class ProductListDemo implements OnInit {
    products = signal(<Product[] | null>[]);

    constructor(
        private productService: ProductService,
        private dialogService: DialogService,
        private ref: DynamicDialogRef
    ) {}

    ngOnInit() {
        this.productService.getProductsSmall().then((products) => this.products.set(products.slice(0, 5)));
    }

    selectProduct(product: Product) {
        this.ref.close(product);
    }

    showInfo() {
        this.dialogService.open(InfoDemo, {
            header: 'Information',
            modal: true,
            dismissableMask: true,
            data: {
                totalProducts: this.products ? this.products.length : 0
            }
        });
    }

    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warning';
            case 'OUTOFSTOCK':
                return 'danger';
        }
    }
}
