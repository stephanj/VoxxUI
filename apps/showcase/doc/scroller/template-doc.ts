import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrollerModule } from 'voxx-ui/scroller';

@Component({
    selector: 'template-doc',
    standalone: true,
    imports: [ScrollerModule, AppCode, AppDocSectionText, CommonModule],
    template: `
        <app-docsectiontext>
            <p>Scroller content is customizable by using <i>ng-template</i>. Valid values are <i>content</i>, <i>item</i>, <i>loader</i> and <i>loadericon</i></p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <vx-virtualscroller [items]="items" [itemSize]="25 * 7" [showLoader]="true" [delay]="250" [numToleratedItems]="20" styleClass="border border-surface" [style]="{ width: '200px', height: '200px' }">
                <ng-template #item let-item let-options="options">
                    <div class="flex flex-col align-items-strech" [ngClass]="{ 'bg-surface-100 dark:bg-surface-700': options.odd }">
                        <div class="flex items-center px-2" style="height: 25px">Item: {{ item }}</div>
                        <div class="flex items-center px-2" style="height: 25px">Index: {{ options.index }}</div>
                        <div class="flex items-center px-2" style="height: 25px">Count: {{ options.count }}</div>
                        <div class="flex items-center px-2" style="height: 25px">First: {{ options.first }}</div>
                        <div class="flex items-center px-2" style="height: 25px">Last: {{ options.last }}</div>
                        <div class="flex items-center px-2" style="height: 25px">Even: {{ options.even }}</div>
                        <div class="flex items-center px-2" style="height: 25px">Odd: {{ options.odd }}</div>
                    </div>
                </ng-template>
                <ng-template #loader let-options="options">
                    <div class="flex flex-col items-stretch" [ngClass]="{ 'bg-surface-100 dark:bg-surface-700': options.odd }">
                        <div class="flex items-center px-2" style="height: 25px"><div class="rounded bg-surface-200 dark:bg-surface-600" style="width: 60%; height: 1.2rem"></div></div>
                        <div class="flex items-center px-2" style="height: 25px"><div class="rounded bg-surface-200 dark:bg-surface-600" style="width: 50%; height: 1.2rem"></div></div>
                        <div class="flex items-center px-2" style="height: 25px"><div class="rounded bg-surface-200 dark:bg-surface-600" style="width: 60%; height: 1.2rem"></div></div>
                        <div class="flex items-center px-2" style="height: 25px"><div class="rounded bg-surface-200 dark:bg-surface-600" style="width: 50%; height: 1.2rem"></div></div>
                        <div class="flex items-center px-2" style="height: 25px"><div class="rounded bg-surface-200 dark:bg-surface-600" style="width: 60%; height: 1.2rem"></div></div>
                        <div class="flex items-center px-2" style="height: 25px"><div class="rounded bg-surface-200 dark:bg-surface-600" style="width: 50%; height: 1.2rem"></div></div>
                        <div class="flex items-center px-2" style="height: 25px"><div class="rounded bg-surface-200 dark:bg-surface-600" style="width: 60%; height: 1.2rem"></div></div>
                    </div>
                </ng-template>
            </vx-virtualscroller>
        </div>
        <app-code></app-code>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateDoc {
    items!: string[];

    ngOnInit() {
        this.items = Array.from({ length: 1000 }).map((_, i) => `Item #${i}`);
    }
}
