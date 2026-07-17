import { DeferredDemo } from '@/components/demo/deferreddemo';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { RatingModule } from 'voxx-ui/rating';
import { TableModule } from 'voxx-ui/table';
import { TagModule } from 'voxx-ui/tag';

interface Column {
    field: string;
    header: string;
}

@Component({
    selector: 'template-doc',
    standalone: true,
    imports: [CommonModule, TableModule, AppDocSectionText, AppCode, DeferredDemo, RatingModule, TagModule],
    template: ` <app-docsectiontext>
            <p>Custom content at <i>header</i>, <i>body</i> and <i>footer</i> sections are supported via templating.</p>
        </app-docsectiontext>
        <vx-deferred-demo (load)="loadDemoData()">
            <div class="card">
                <vx-table [value]="products" [tableStyle]="{ 'min-width': '60rem' }">
                    <ng-template #caption>
                        <div class="flex items-center justify-between">
                            <span class="text-xl font-bold">Products</span>
                            <vx-button icon="pi pi-refresh" rounded raised />
                        </div>
                    </ng-template>
                    <ng-template #header>
                        <tr>
                            <th>Name</th>
                            <th>Image</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Reviews</th>
                            <th>Status</th>
                        </tr>
                    </ng-template>
                    <ng-template #body let-product>
                        <tr>
                            <td>{{ product.name }}</td>
                            <td>
                                <img [src]="'https://primefaces.org/cdn/primeng/images/demo/product/' + product.image" [alt]="product.name" class="w-24 rounded" />
                            </td>
                            <td>{{ product.price | currency: 'USD' }}</td>
                            <td>{{ product.category }}</td>
                            <td><vx-rating [(ngModel)]="product.rating" [readonly]="true" [cancel]="false" /></td>
                            <td>
                                <vx-tag [value]="product.inventoryStatus" [severity]="getSeverity(product.inventoryStatus)" />
                            </td>
                        </tr>
                    </ng-template>
                    <ng-template #footer>
                        <tr>
                            <td colspan="6">In total there are {{ products ? products.length : 0 }} products.</td>
                        </tr>
                    </ng-template>
                </vx-table>
            </div>
        </vx-deferred-demo>
        <app-code [extFiles]="['Product']"></app-code>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateDoc {
    products!: Product[];

    cols!: Column[];

    constructor(
        private productService: ProductService,
        private cd: ChangeDetectorRef
    ) {}

    loadDemoData() {
        this.productService.getProductsMini().then((data) => {
            this.products = data;
            this.cd.markForCheck();
        });

        this.cols = [
            { field: 'code', header: 'Code' },
            { field: 'name', header: 'Name' },
            { field: 'category', header: 'Category' },
            { field: 'quantity', header: 'Quantity' }
        ];
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
}
