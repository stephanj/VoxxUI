import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AccordionModule } from 'voxx-ui/accordion';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'accordion-pt-viewer',
    standalone: true,
    imports: [CommonModule, AppDocPtViewer, AccordionModule],
    template: `
        <app-docptviewer [docs]="docs">
            <vx-accordion value="0">
                <vx-accordion-panel value="0">
                    <vx-accordion-header>Header I</vx-accordion-header>
                    <vx-accordion-content>
                        <p class="m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
                    </vx-accordion-content>
                </vx-accordion-panel>
                <vx-accordion-panel value="1">
                    <vx-accordion-header>Header II</vx-accordion-header>
                    <vx-accordion-content>
                        <p class="m-0">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto.</p>
                    </vx-accordion-content>
                </vx-accordion-panel>
                <vx-accordion-panel value="2">
                    <vx-accordion-header>Header III</vx-accordion-header>
                    <vx-accordion-content>
                        <p class="m-0">At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate.</p>
                    </vx-accordion-content>
                </vx-accordion-panel>
            </vx-accordion>
        </app-docptviewer>
    `
})
export class PTViewer {
    docs = [
        {
            data: getPTOptions('Accordion'),
            key: 'Accordion'
        },
        {
            data: getPTOptions('AccordionPanel'),
            key: 'AccordionPanel'
        },
        {
            data: getPTOptions('AccordionHeader'),
            key: 'AccordionHeader'
        },
        {
            data: getPTOptions('AccordionContent'),
            key: 'AccordionContent'
        }
    ];
}
