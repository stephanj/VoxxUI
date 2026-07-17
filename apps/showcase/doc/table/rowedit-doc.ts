import { DeferredDemo } from '@/components/demo/deferreddemo';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService, SelectItem } from 'voxx-ui/api';
import { ButtonModule } from 'voxx-ui/button';
import { InputTextModule } from 'voxx-ui/inputtext';
import { RippleModule } from 'voxx-ui/ripple';
import { SelectModule } from 'voxx-ui/select';
import { TableModule } from 'voxx-ui/table';
import { TagModule } from 'voxx-ui/tag';
import { ToastModule } from 'voxx-ui/toast';

@Component({
    selector: 'rowedit-doc',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ToastModule, InputTextModule, SelectModule, TagModule, ButtonModule, RippleModule, AppDocSectionText, AppCode, DeferredDemo],
    template: ` <app-docsectiontext>
            <p>
                Row editing toggles the visibility of all the editors in the row at once and provides additional options to save and cancel editing. Row editing functionality is enabled by setting the <i>editMode</i> to "row" on table, defining a
                dataKey to uniquely identify a row, adding <i>vxEditableRow</i> directive to the editable rows and defining the UI Controls with <i>vxInitEditableRow</i>, <i>vxSaveEditableRow</i> and <i>vxCancelEditableRow</i> directives
                respectively.
            </p>
            <p>
                Save and Cancel functionality implementation is left to the page author to provide more control over the editing business logic. Example below utilizes a simple implementation where a row is cloned when editing is initialized and is
                saved or restored depending on the result of the editing. An implicit variable called "editing" is passed to the body template so you may come up with your own UI controls that implement editing based on your own requirements such as
                adding validations and styling. Note that <i>vxSaveEditableRow</i> only switches the row to back view mode when there are no validation errors.
            </p>
            <p>
                Moreover, you may use setting <i>vxEditableRowDisabled</i> property as true to disable editing for that particular row and in case you need to display rows in edit mode by default, use the <i>editingRowKeys</i> property which is a map
                whose key is the dataKey of the record where the value is any arbitrary number greater than zero.
            </p>
        </app-docsectiontext>
        <vx-deferred-demo (load)="loadDemoData()">
            <div class="card">
                <vx-toast />
                <vx-table [value]="products" dataKey="id" editMode="row" [tableStyle]="{ 'min-width': '50rem' }">
                    <ng-template #header>
                        <tr>
                            <th style="width:22%">Code</th>
                            <th style="width:22%">Name</th>
                            <th style="width:22%">Inventory Status</th>
                            <th style="width:22%">Price</th>
                            <th style="width:12%"></th>
                        </tr>
                    </ng-template>
                    <ng-template #body let-product let-editing="editing" let-ri="rowIndex">
                        <tr [vxEditableRow]="product">
                            <td>
                                <vx-cellEditor>
                                    <ng-template #input>
                                        <input vxInputText type="text" [(ngModel)]="product.code" />
                                    </ng-template>
                                    <ng-template #output>
                                        {{ product.code }}
                                    </ng-template>
                                </vx-cellEditor>
                            </td>
                            <td>
                                <vx-cellEditor>
                                    <ng-template #input>
                                        <input vxInputText type="text" [(ngModel)]="product.name" required />
                                    </ng-template>
                                    <ng-template #output>
                                        {{ product.name }}
                                    </ng-template>
                                </vx-cellEditor>
                            </td>
                            <td>
                                <vx-cellEditor>
                                    <ng-template #input>
                                        <vx-select [options]="statuses" appendTo="body" [(ngModel)]="product.inventoryStatus" [style]="{ width: '100%' }" />
                                    </ng-template>
                                    <ng-template #output>
                                        <vx-tag [value]="product.inventoryStatus" [severity]="getSeverity(product.inventoryStatus)" />
                                    </ng-template>
                                </vx-cellEditor>
                            </td>
                            <td>
                                <vx-cellEditor>
                                    <ng-template #input>
                                        <input vxInputText type="text" [(ngModel)]="product.price" />
                                    </ng-template>
                                    <ng-template #output>
                                        {{ product.price | currency: 'USD' }}
                                    </ng-template>
                                </vx-cellEditor>
                            </td>
                            <td>
                                <div class="flex items-center justify-center gap-2">
                                    <button *ngIf="!editing" vxButton vxRipple type="button" vxInitEditableRow icon="pi pi-pencil" (click)="onRowEditInit(product)" text rounded severity="secondary"></button>
                                    <button *ngIf="editing" vxButton vxRipple type="button" vxSaveEditableRow icon="pi pi-check" (click)="onRowEditSave(product)" text rounded severity="secondary"></button>
                                    <button *ngIf="editing" vxButton vxRipple type="button" vxCancelEditableRow icon="pi pi-times" (click)="onRowEditCancel(product, ri)" text rounded severity="secondary"></button>
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
export class RowEditDoc {
    products!: Product[];

    statuses!: SelectItem[];

    clonedProducts: { [s: string]: Product } = {};

    constructor(
        private productService: ProductService,
        private messageService: MessageService,
        private cd: ChangeDetectorRef
    ) {}

    loadDemoData() {
        this.productService.getProductsMini().then((data) => {
            this.products = data;
            this.cd.markForCheck();
        });

        this.statuses = [
            { label: 'In Stock', value: 'INSTOCK' },
            { label: 'Low Stock', value: 'LOWSTOCK' },
            { label: 'Out of Stock', value: 'OUTOFSTOCK' }
        ];
    }

    onRowEditInit(product: Product) {
        this.clonedProducts[product.id as string] = { ...product };
    }

    onRowEditSave(product: Product) {
        if (product.price > 0) {
            delete this.clonedProducts[product.id as string];
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is updated' });
        } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Price' });
        }
    }

    onRowEditCancel(product: Product, index: number) {
        this.products[index] = this.clonedProducts[product.id as string];
        delete this.clonedProducts[product.id as string];
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
