import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonModule } from 'voxx-ui/button';
import { InputTextModule } from 'voxx-ui/inputtext';
import { StyleClassModule } from 'voxx-ui/styleclass';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'toggleclass-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, StyleClassModule, ButtonModule, InputTextModule],
    template: `
        <app-docsectiontext>
            <p>
                <i>StyleClass</i> has two modes, <i>toggleClass</i> to simply add-remove a class and enter/leave animations. The target element to change the styling is defined with the <i>selector</i> property that accepts any valid CSS selector or
                keywords including <i>&#64;next</i>, <i>prev</i>, <i>parent</i>, <i>grandparent</i>
            </p>
        </app-docsectiontext>
        <div class="card flex flex-col items-center">
            <vx-button label="Toggle Display" vxStyleClass="@next" toggleClass="hidden" />
            <input type="text" vxInputText class="hidden mt-4" />
        </div>
        <app-code></app-code>
    `
})
export class ToggleClassDoc {}
