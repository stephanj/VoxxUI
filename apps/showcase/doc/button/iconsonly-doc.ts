import { Component } from '@angular/core';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { ButtonModule } from 'voxx-ui/button';

@Component({
    selector: 'iconsonly-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText, ButtonModule],
    template: `
        <app-docsectiontext>
            <p>Buttons can have icons without labels.</p>
        </app-docsectiontext>
        <div class="card">
            <div class="flex justify-center flex-wrap gap-4 mb-6">
                <vx-button icon="pi pi-check" />
                <vx-button icon="pi pi-bookmark" severity="secondary" />
                <vx-button icon="pi pi-search" severity="success" />
                <vx-button icon="pi pi-user" severity="info" />
                <vx-button icon="pi pi-bell" severity="warn" />
                <vx-button icon="pi pi-heart" severity="help" />
                <vx-button icon="pi pi-times" severity="danger" />
            </div>
            <div class="flex justify-center flex-wrap gap-4 mb-6">
                <vx-button icon="pi pi-check" [rounded]="true" />
                <vx-button icon="pi pi-bookmark" [rounded]="true" severity="secondary" />
                <vx-button icon="pi pi-search" [rounded]="true" severity="success" />
                <vx-button icon="pi pi-user" [rounded]="true" severity="info" />
                <vx-button icon="pi pi-bell" [rounded]="true" severity="warn" />
                <vx-button icon="pi pi-heart" [rounded]="true" severity="help" />
                <vx-button icon="pi pi-times" [rounded]="true" severity="danger" />
            </div>
            <div class="flex justify-center flex-wrap gap-4 mb-6">
                <vx-button icon="pi pi-check" [rounded]="true" [outlined]="true" />
                <vx-button icon="pi pi-bookmark" [rounded]="true" severity="secondary" [outlined]="true" />
                <vx-button icon="pi pi-search" [rounded]="true" severity="success" [outlined]="true" />
                <vx-button icon="pi pi-user" [rounded]="true" severity="info" [outlined]="true" />
                <vx-button icon="pi pi-bell" [rounded]="true" severity="warn" [outlined]="true" />
                <vx-button icon="pi pi-heart" [rounded]="true" severity="help" [outlined]="true" />
                <vx-button icon="pi pi-times" [rounded]="true" severity="danger" [outlined]="true" />
            </div>
            <div class="flex justify-center flex-wrap gap-4 mb-6">
                <vx-button icon="pi pi-check" [rounded]="true" [text]="true" [raised]="true" />
                <vx-button icon="pi pi-bookmark" [rounded]="true" [text]="true" [raised]="true" severity="secondary" />
                <vx-button icon="pi pi-search" [rounded]="true" [text]="true" [raised]="true" severity="success" />
                <vx-button icon="pi pi-user" [rounded]="true" [text]="true" [raised]="true" severity="info" />
                <vx-button icon="pi pi-bell" [rounded]="true" [text]="true" [raised]="true" severity="warn" />
                <vx-button icon="pi pi-heart" [rounded]="true" [text]="true" [raised]="true" severity="help" />
                <vx-button icon="pi pi-times" [rounded]="true" [text]="true" [raised]="true" severity="danger" />
            </div>
            <div class="flex justify-center flex-wrap gap-4 mb-6">
                <vx-button icon="pi pi-check" [rounded]="true" [text]="true" />
                <vx-button icon="pi pi-bookmark" [rounded]="true" [text]="true" severity="secondary" />
                <vx-button icon="pi pi-search" [rounded]="true" [text]="true" severity="success" />
                <vx-button icon="pi pi-user" [rounded]="true" [text]="true" severity="info" />
                <vx-button icon="pi pi-bell" [rounded]="true" [text]="true" severity="warn" />
                <vx-button icon="pi pi-heart" [rounded]="true" [text]="true" severity="help" />
                <vx-button icon="pi pi-times" [rounded]="true" [text]="true" severity="danger" />
            </div>
        </div>
        <app-code></app-code>
    `
})
export class IconOnlyDoc {}
