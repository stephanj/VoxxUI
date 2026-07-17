import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ProgressSpinnerModule } from 'voxx-ui/progressspinner';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'custom-doc',
    standalone: true,
    imports: [ProgressSpinnerModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>ProgressSpinner can be customized with styling property like <i>strokeWidth</i> and <i>fill</i>.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <vx-progress-spinner strokeWidth="8" fill="transparent" animationDuration=".5s" [style]="{ width: '50px', height: '50px' }" />
        </div>
        <app-code></app-code>
    `
})
export class CustomDoc {
    @Input() id: string;

    @Input() title: string;
}
