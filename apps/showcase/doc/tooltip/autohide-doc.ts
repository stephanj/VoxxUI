import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { InputTextModule } from 'voxx-ui/inputtext';
import { TooltipModule } from 'voxx-ui/tooltip';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'autohide-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText, InputTextModule, TooltipModule],
    template: `
        <app-docsectiontext>
            <p>
                Tooltip is hidden when mouse leaves the target element, in cases where tooltip needs to be interacted with, set
                <i>autoHide</i> to false to change the default behavior.
            </p>
        </app-docsectiontext>
        <div class="card flex flex-wrap justify-center gap-2">
            <input type="text" vxInputText vxTooltip="Enter your username" [autoHide]="false" placeholder="autoHide: false" />
            <input type="text" vxInputText vxTooltip="Enter your username" placeholder="autoHide: true" />
        </div>
        <app-code></app-code>
    `
})
export class AutoHideDoc {}
