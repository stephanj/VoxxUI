import { DeferredDemo } from '@/components/demo/deferreddemo';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'voxx-ui/api';
import { ButtonModule } from 'voxx-ui/button';
import { ConfirmDialogModule } from 'voxx-ui/confirmdialog';
import { DialogModule } from 'voxx-ui/dialog';
import { FileUploadModule } from 'voxx-ui/fileupload';
import { IconFieldModule } from 'voxx-ui/iconfield';
import { InputIconModule } from 'voxx-ui/inputicon';
import { InputNumberModule } from 'voxx-ui/inputnumber';
import { InputTextModule } from 'voxx-ui/inputtext';
import { RadioButtonModule } from 'voxx-ui/radiobutton';
import { RatingModule } from 'voxx-ui/rating';
import { SelectModule } from 'voxx-ui/select';
import { Table, TableModule } from 'voxx-ui/table';
import { TagModule } from 'voxx-ui/tag';
import { ToastModule } from 'voxx-ui/toast';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'products-doc',
    standalone: true,
    imports: [
        CommonModule,
        IconFieldModule,
        InputIconModule,
        FormsModule,
        TableModule,
        ToastModule,
        ButtonModule,
        FileUploadModule,
        RatingModule,
        DialogModule,
        InputTextModule,
        InputNumberModule,
        SelectModule,
        RadioButtonModule,
        TagModule,
        AppDocSectionText,
        AppCode,
        DeferredDemo,
        ConfirmDialogModule
    ],
    template: ` <app-docsectiontext>
            <p>CRUD implementation example with a Dialog.</p>
        </app-docsectiontext>
        <vx-deferred-demo (load)="loadDemoData()">
            <div class="card">
                <vx-toast />
                <div class="mb-6 flex flex-wrap items-center justify-between gap-2">
                    <div class="flex items-center">
                        <vx-button label="New" icon="pi pi-plus" class="mr-2" (onClick)="openNew()" />
                        <vx-button severity="danger" label="Delete" icon="pi pi-trash" outlined (onClick)="deleteSelectedProducts()" [disabled]="!selectedProducts || !selectedProducts.length" />
                    </div>

                    <div class="flex items-center">
                        <vx-fileUpload mode="basic" accept="image/*" [maxFileSize]="1000000" label="Import" chooseLabel="Import" auto customUpload class="mr-2 inline-block" [chooseButtonProps]="{ severity: 'secondary' }" />
                        <vx-button label="Export" icon="pi pi-upload" severity="secondary" (onClick)="exportCSV()" />
                    </div>
                </div>

                <vx-table
                    #dt
                    [value]="products"
                    [rows]="10"
                    [columns]="cols"
                    [paginator]="true"
                    [globalFilterFields]="['name', 'country.name', 'representative.name', 'status']"
                    [tableStyle]="{ 'min-width': '75rem' }"
                    [(selection)]="selectedProducts"
                    [rowHover]="true"
                    dataKey="id"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                    [showCurrentPageReport]="true"
                >
                    <ng-template #caption>
                        <div class="flex items-center justify-between">
                            <h5 class="m-0">Manage Products</h5>
                            <vx-iconfield>
                                <vx-inputicon class="pi pi-search" />
                                <input vxInputText type="text" (input)="dt.filterGlobal($event.target.value, 'contains')" placeholder="Search..." />
                            </vx-iconfield>
                        </div>
                    </ng-template>
                    <ng-template #header>
                        <tr>
                            <th style="width: 3rem">
                                <vx-tableHeaderCheckbox />
                            </th>
                            <th style="min-width: 16rem">Code</th>
                            <th vxSortableColumn="name" style="min-width:16rem">
                                <div class="flex items-center gap-2">
                                    Name
                                    <vx-sortIcon field="name" />
                                </div>
                            </th>
                            <th>Image</th>
                            <th vxSortableColumn="price" style="min-width: 8rem">
                                <div class="flex items-center gap-2">
                                    Price
                                    <vx-sortIcon field="price" />
                                </div>
                            </th>
                            <th vxSortableColumn="category" style="min-width:10rem">
                                <div class="flex items-center gap-2">
                                    Category
                                    <vx-sortIcon field="category" />
                                </div>
                            </th>
                            <th vxSortableColumn="rating" style="min-width: 12rem">
                                <div class="flex items-center gap-2">
                                    Reviews
                                    <vx-sortIcon field="rating" />
                                </div>
                            </th>
                            <th vxSortableColumn="inventoryStatus" style="min-width: 12rem">
                                <div class="flex items-center gap-2">
                                    Status
                                    <vx-sortIcon field="inventoryStatus" />
                                </div>
                            </th>
                            <th style="min-width: 12rem"></th>
                        </tr>
                    </ng-template>
                    <ng-template #body let-product>
                        <tr>
                            <td style="width: 3rem">
                                <vx-tableCheckbox [value]="product" />
                            </td>
                            <td style="min-width: 12rem">{{ product.code }}</td>
                            <td style="min-width: 16rem">{{ product.name }}</td>
                            <td>
                                <img [src]="'https://primefaces.org/cdn/primeng/images/demo/product/' + product.image" [alt]="product.name" style="width: 64px" class="rounded" />
                            </td>
                            <td>{{ product.price | currency: 'USD' }}</td>
                            <td>{{ product.category }}</td>
                            <td>
                                <vx-rating [(ngModel)]="product.rating" [readonly]="true" [cancel]="false" />
                            </td>
                            <td>
                                <vx-tag [value]="product.inventoryStatus" [severity]="getSeverity(product.inventoryStatus)" />
                            </td>
                            <td>
                                <vx-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" (click)="editProduct(product)" />
                                <vx-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (click)="deleteProduct(product)" />
                            </td>
                        </tr>
                    </ng-template>
                </vx-table>

                <vx-dialog [(visible)]="productDialog" [style]="{ width: '450px' }" header="Product Details" [modal]="true">
                    <ng-template #content>
                        <div class="flex flex-col gap-6">
                            <img [src]="'https://primefaces.org/cdn/primeng/images/demo/product/' + product.image" [alt]="product.image" class="block m-auto pb-4" *ngIf="product.image" />
                            <div>
                                <label for="name" class="block font-bold mb-3">Name</label>
                                <input type="text" vxInputText id="name" [(ngModel)]="product.name" required autofocus fluid />
                                <small class="text-red-500" *ngIf="submitted && !product.name">Name is required.</small>
                            </div>
                            <div>
                                <label for="description" class="block font-bold mb-3">Description</label>
                                <textarea id="description" [(ngModel)]="product.description" required rows="3" cols="20" class="w-full"></textarea>
                            </div>

                            <div>
                                <label for="inventoryStatus" class="block font-bold mb-3">Inventory Status</label>
                                <vx-select [(ngModel)]="product.inventoryStatus" inputId="inventoryStatus" [options]="statuses" optionLabel="label" optionValue="label" placeholder="Select a Status" fluid />
                            </div>

                            <div>
                                <span class="block font-bold mb-4">Category</span>
                                <div class="grid grid-cols-12 gap-4">
                                    <div class="flex items-center gap-2 col-span-6">
                                        <vx-radiobutton id="category1" name="category" value="Accessories" [(ngModel)]="product.category" />
                                        <label for="category1">Accessories</label>
                                    </div>
                                    <div class="flex items-center gap-2 col-span-6">
                                        <vx-radiobutton id="category2" name="category" value="Clothing" [(ngModel)]="product.category" />
                                        <label for="category2">Clothing</label>
                                    </div>
                                    <div class="flex items-center gap-2 col-span-6">
                                        <vx-radiobutton id="category3" name="category" value="Electronics" [(ngModel)]="product.category" />
                                        <label for="category3">Electronics</label>
                                    </div>
                                    <div class="flex items-center gap-2 col-span-6">
                                        <vx-radiobutton id="category4" name="category" value="Fitness" [(ngModel)]="product.category" />
                                        <label for="category4">Fitness</label>
                                    </div>
                                </div>
                            </div>

                            <div class="grid grid-cols-12 gap-4">
                                <div class="col-span-6">
                                    <label for="price" class="block font-bold mb-3">Price</label>
                                    <vx-inputnumber id="price" [(ngModel)]="product.price" mode="currency" currency="USD" locale="en-US" fluid />
                                </div>
                                <div class="col-span-6">
                                    <label for="quantity" class="block font-bold mb-3">Quantity</label>
                                    <vx-inputnumber id="quantity" [(ngModel)]="product.quantity" fluid />
                                </div>
                            </div>
                        </div>
                    </ng-template>

                    <ng-template #footer>
                        <vx-button label="Cancel" icon="pi pi-times" text (click)="hideDialog()" />
                        <vx-button label="Save" icon="pi pi-check" (click)="saveProduct()" />
                    </ng-template>
                </vx-dialog>

                <vx-confirmdialog [style]="{ width: '450px' }" />
            </div>
        </vx-deferred-demo>
        <app-code [extFiles]="['Product']"></app-code>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [MessageService, ConfirmationService]
})
export class ProductsDoc {
    productDialog: boolean = false;

    products!: Product[];

    product!: Product;

    selectedProducts!: Product[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    cols!: Column[];

    exportColumns!: ExportColumn[];

    constructor(
        private productService: ProductService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private cd: ChangeDetectorRef
    ) {}

    exportCSV() {
        this.dt.exportCSV();
    }

    loadDemoData() {
        this.productService.getProducts().then((data) => {
            this.products = data;
            this.cd.markForCheck();
        });

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];

        this.cols = [
            { field: 'code', header: 'Code', customExportHeader: 'Product Code' },
            { field: 'name', header: 'Name' },
            { field: 'image', header: 'Image' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    editProduct(product: Product) {
        this.product = { ...product };
        this.productDialog = true;
    }

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected products?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: {
                label: 'No',
                severity: 'secondary',
                variant: 'text'
            },
            acceptButtonProps: {
                severity: 'danger',
                label: 'Yes'
            },
            accept: () => {
                this.products = this.products.filter((val) => !this.selectedProducts?.includes(val));
                this.selectedProducts = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Products Deleted',
                    life: 3000
                });
            }
        });
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    deleteProduct(product: Product) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + product.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: {
                label: 'No',
                severity: 'secondary',
                variant: 'text'
            },
            acceptButtonProps: {
                severity: 'danger',
                label: 'Yes'
            },
            accept: () => {
                this.products = this.products.filter((val) => val.id !== product.id);
                this.product = {};
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Deleted',
                    life: 3000
                });
            }
        });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
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

    saveProduct() {
        this.submitted = true;

        if (this.product.name?.trim()) {
            if (this.product.id) {
                this.products[this.findIndexById(this.product.id)] = this.product;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Updated',
                    life: 3000
                });
            } else {
                this.product.id = this.createId();
                this.product.code = this.createId();
                this.product.image = 'product-placeholder.svg';
                this.products.push(this.product);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Created',
                    life: 3000
                });
            }

            this.products = [...this.products];
            this.productDialog = false;
            this.product = {};
        }
    }
}
