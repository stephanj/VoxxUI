import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';
import { TabsModule } from 'voxx-ui/tabs';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'dynamic-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, TabsModule],
    template: `
        <app-docsectiontext>
            <p>Tabs can be generated dynamically using the standard <i>&#64;for</i> block.</p>
        </app-docsectiontext>
        <div class="card">
            <vx-tabs value="0">
                <vx-tablist>
                    @for (tab of tabs; track tab.value) {
                        <vx-tab [value]="tab.value">{{ tab.title }}</vx-tab>
                    }
                </vx-tablist>
                <vx-tabpanels>
                    @for (tab of tabs; track tab.value) {
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
export class DynamicDoc implements OnInit {
    tabs: { title: string; value: string; content: string }[] = [];

    ngOnInit() {
        this.tabs = [
            { title: 'Tab 1', value: '0', content: 'Tab 1 Content' },
            { title: 'Tab 2', value: '1', content: 'Tab 2 Content' },
            { title: 'Tab 3', value: '2', content: 'Tab 3 Content' }
        ];
    }
}
