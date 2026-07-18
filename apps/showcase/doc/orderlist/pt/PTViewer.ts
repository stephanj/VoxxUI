import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';

import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { OrderListModule } from 'voxx-ui/orderlist';
import { ProductService } from '@/service/productservice';

interface Product {
    id?: string;
    code?: string;
    name?: string;
    description?: string;
    image?: string;
    price?: number;
    category?: string;
    quantity?: number;
    inventoryStatus?: string;
    rating?: number;
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'orderlist-pt-viewer',
    standalone: true,
    imports: [AppDocPtViewer, OrderListModule],
    template: `
        <app-docptviewer [docs]="docs">
            <vx-orderlist [value]="products()" dataKey="id">
                <ng-template #item let-option>
                    {{ option.name }}
                </ng-template>
            </vx-orderlist>
        </app-docptviewer>
    `,
    providers: [ProductService]
})
export class PTViewer implements OnInit {
    products = signal<Product[]>([]);

    docs = [
        {
            data: getPTOptions('OrderList'),
            key: 'OrderList'
        }
    ];

    constructor(private productService: ProductService) {}

    ngOnInit() {
        this.productService.getProductsSmall().then((data) => {
            this.products.set(data.slice(0, 5));
        });
    }
}
