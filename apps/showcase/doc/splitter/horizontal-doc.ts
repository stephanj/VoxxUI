import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';
import { SplitterModule } from 'voxx-ui/splitter';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'horizontal-doc',
    standalone: true,
    imports: [AppDocSectionText, SplitterModule, AppCode],
    template: `
        <app-docsectiontext>
            <p>Splitter requires two SplitterPanel components as children which are displayed horizontally by default.</p>
        </app-docsectiontext>
        <div class="card">
            <vx-splitter [style]="{ height: '300px' }" class="mb-8">
                <ng-template #panel>
                    <div class="flex items-center justify-center h-full">Panel 1</div>
                </ng-template>
                <ng-template #panel>
                    <div class="flex items-center justify-center h-full">Panel 2</div>
                </ng-template>
            </vx-splitter>
        </div>
        <app-code></app-code>
    `
})
export class HorizontalDoc {}
