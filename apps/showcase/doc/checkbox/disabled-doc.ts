import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'voxx-ui/checkbox';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'disabled-doc',
    standalone: true,
    imports: [FormsModule, CheckboxModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>When <i>disabled</i> is present, the element cannot be edited and focused.</p>
        </app-docsectiontext>
        <div class="card flex justify-center gap-2">
            <vx-checkbox [(ngModel)]="checked1" [binary]="true" [disabled]="true" />
            <vx-checkbox [(ngModel)]="checked2" [binary]="true" [disabled]="true" />
        </div>
        <app-code></app-code>
    `
})
export class DisabledDoc {
    checked1: boolean = false;

    checked2: boolean = true;
}
