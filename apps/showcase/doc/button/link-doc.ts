import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { ButtonModule } from 'voxx-ui/button';
import { RouterModule } from '@angular/router';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'link-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText, ButtonModule, RouterModule],
    template: `
        <app-docsectiontext>
            <p>A button can be rendered as a link when <i>link</i> property is present, while the <i>vxButton</i> directive can be applied on an anchor element to style the link as a button.</p>
        </app-docsectiontext>
        <div class="card flex justify-center gap-4">
            <vx-button label="Link" link />
            <a href="https://angular.dev/" vxButton target="_blank" rel="noopener noreferrer">
                <span vxButtonLabel>Angular Website</span>
            </a>
            <a routerLink="/" vxButton>
                <span vxButtonLabel>Router Link</span>
            </a>
        </div>
        <app-code></app-code>
    `
})
export class LinkDoc {}
