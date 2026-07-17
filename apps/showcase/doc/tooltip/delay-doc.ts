import { Component } from '@angular/core';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { ButtonModule } from 'voxx-ui/button';
import { TooltipModule } from 'voxx-ui/tooltip';

@Component({
    selector: 'delay-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText, ButtonModule, TooltipModule],
    template: `
        <app-docsectiontext>
            <p>Adding delays to the show and hide events are defined with <i>showDelay</i> and <i>hideDelay</i> options respectively.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <vx-button vxTooltip="Confirm to proceed" showDelay="1000" hideDelay="300" label="Save" />
        </div>
        <app-code></app-code>
    `
})
export class DelayDoc {}
