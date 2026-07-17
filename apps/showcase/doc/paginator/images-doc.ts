import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PaginatorModule, PaginatorState } from 'voxx-ui/paginator';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'images-doc',
    standalone: true,
    imports: [PaginatorModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>Sample image gallery implementation using paginator.</p>
        </app-docsectiontext>
        <div class="card flex flex-col gap-4 justify-center items-center">
            <vx-paginator [first]="first" [rows]="1" [totalRecords]="12" (onPageChange)="onPageChange($event)" [showJumpToPageDropdown]="true" [showPageLinks]="false"></vx-paginator>
            <img [src]="'https://primefaces.org/cdn/primeng/images/demo/nature/nature' + (first + 1) + '.jpg'" class="max-w-full rounded-xl" />
        </div>
        <app-code></app-code>
    `
})
export class ImagesDoc {
    first: number = 0;

    rows: number = 10;

    onPageChange(event: PaginatorState) {
        this.first = event.first ?? 0;
        this.rows = event.rows ?? 10;
    }
}
