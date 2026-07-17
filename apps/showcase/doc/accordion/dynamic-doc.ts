import { Component } from '@angular/core';
import { AccordionModule } from 'voxx-ui/accordion';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'dynamic-doc',
    standalone: true,
    imports: [AccordionModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>AccordionPanel can be generated dynamically using the standard <i>&#64;for</i> block.</p>
        </app-docsectiontext>
        <div class="card">
            <vx-accordion [value]="['0']">
                @for (tab of tabs; track tab.title) {
                    <vx-accordion-panel [value]="tab.value">
                        <vx-accordion-header>{{ tab.title }}</vx-accordion-header>
                        <vx-accordion-content>
                            <p class="m-0">{{ tab.content }}</p>
                        </vx-accordion-content>
                    </vx-accordion-panel>
                }
            </vx-accordion>
        </div>
        <app-code></app-code>
    `
})
export class DynamicDoc {
    tabs = [
        { title: 'Title 1', content: 'Content 1', value: '0' },
        { title: 'Title 2', content: 'Content 2', value: '1' },
        { title: 'Title 3', content: 'Content 3', value: '2' }
    ];
}
