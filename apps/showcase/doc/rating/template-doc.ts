import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RatingModule } from 'voxx-ui/rating';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'template-doc',
    standalone: true,
    imports: [FormsModule, RatingModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>Templating allows customizing the content where the icon instance is available as the implicit variable.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <vx-rating [(ngModel)]="value">
                <ng-template #onicon>
                    <img src="https://primefaces.org/cdn/primeng/images/demo/rating/custom-icon-active.png" height="24" width="24" />
                </ng-template>
                <ng-template #officon>
                    <img src="https://primefaces.org/cdn/primeng/images/demo/rating/custom-icon.png" height="24" width="24" />
                </ng-template>
            </vx-rating>
        </div>
        <app-code></app-code>
    `
})
export class TemplateDoc {
    value!: number;
}
