import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputNumberModule } from 'voxx-ui/inputnumber';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'clearicon-doc',
    standalone: true,
    imports: [FormsModule, RouterModule, InputNumberModule, AppCodeModule, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>When <i>showClear</i> is enabled, a clear icon is displayed to clear the value.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <vx-inputnumber [(ngModel)]="value" inputId="price_input" mode="currency" currency="USD" locale="en-US" [showClear]="true" inputStyleClass="w-56" />
        </div>
        <app-code></app-code>
    `
})
export class ClearIconDoc {
    value: number | undefined;
}
