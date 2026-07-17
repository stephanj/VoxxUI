import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PopoverModule } from 'voxx-ui/popover';
import { ButtonModule } from 'voxx-ui/button';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'template-doc',
    standalone: true,
    imports: [PopoverModule, ButtonModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>Content of the OverlayPanel is defined by <i>content</i> template.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <vx-popover #op>
                <ng-template #content>
                    <h4>Custom Content</h4>
                </ng-template>
            </vx-popover>
            <vx-button (click)="op.toggle($event)" icon="pi pi-image" label="Show"></vx-button>
        </div>
        <app-code></app-code>
    `
})
export class TemplateDoc {}
