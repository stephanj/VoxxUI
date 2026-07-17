import { Component } from '@angular/core';
import { AccordionModule } from 'voxx-ui/accordion';
import { ButtonModule } from 'voxx-ui/button';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'controlled-doc',
    standalone: true,
    imports: [AccordionModule, ButtonModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>Panels can be controlled programmatically using <i>value</i> property as a model.</p>
        </app-docsectiontext>

        <div class="card">
            <div class="flex mb-4 gap-2 justify-end">
                <vx-button (onClick)="active = '0'" [rounded]="true" label="1" styleClass="w-8 h-8 p-0" [outlined]="active !== '0'" />
                <vx-button (onClick)="active = '1'" [rounded]="true" label="2" styleClass="w-8 h-8 p-0" [outlined]="active !== '1'" />
                <vx-button (onClick)="active = '2'" [rounded]="true" label="3" styleClass="w-8 h-8 p-0" [outlined]="active !== '2'" />
            </div>

            <vx-accordion [(value)]="active">
                <vx-accordion-panel value="0">
                    <vx-accordion-header>Header I</vx-accordion-header>
                    <vx-accordion-content>
                        <p class="m-0">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                            laborum.
                        </p>
                    </vx-accordion-content>
                </vx-accordion-panel>
                <vx-accordion-panel value="1">
                    <vx-accordion-header>Header II</vx-accordion-header>
                    <vx-accordion-content>
                        <p class="m-0">
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo
                            enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
                        </p>
                    </vx-accordion-content>
                </vx-accordion-panel>
                <vx-accordion-panel value="2">
                    <vx-accordion-header>Header III</vx-accordion-header>
                    <vx-accordion-content>
                        <p class="m-0">
                            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in
                            culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
                        </p>
                    </vx-accordion-content>
                </vx-accordion-panel>
            </vx-accordion>
        </div>

        <app-code></app-code>
    `
})
export class ControlledDoc {
    active = '0';
}
