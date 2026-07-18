import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';
import { TabsModule } from 'voxx-ui/tabs';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'scrollable-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, TabsModule],
    template: `
        <app-docsectiontext>
            <p>Adding <i>scrollable</i> property displays navigational buttons at each side to scroll between tabs.</p>
        </app-docsectiontext>
        <div class="card">
            <vx-tabs value="0" scrollable>
                <vx-tablist>
                    @for (tab of scrollableTabs; track tab.value) {
                        <vx-tab [value]="tab.value">
                            {{ tab.title }}
                        </vx-tab>
                    }
                </vx-tablist>
                <vx-tabpanels>
                    @for (tab of scrollableTabs; track tab.value) {
                        <vx-tabpanel [value]="tab.value">
                            <p class="m-0">{{ tab.content }}</p>
                        </vx-tabpanel>
                    }
                </vx-tabpanels>
            </vx-tabs>
        </div>
        <app-code></app-code>
    `
})
export class ScrollableDoc {
    scrollableTabs: any[] = Array.from({ length: 50 }, (_, i) => ({
        title: `Tab ${i + 1}`,
        content: `Tab ${i + 1} Content`,
        value: `${i}`
    }));
}
