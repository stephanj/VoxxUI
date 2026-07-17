import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'voxx-ui/password';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'clearicon-doc',
    standalone: true,
    imports: [FormsModule, PasswordModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>When <i>showClear</i> is enabled, a clear icon is displayed to clear the value.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <vx-password [(ngModel)]="value" [feedback]="false" autocomplete="off" [showClear]="true" inputStyleClass="w-56" />
        </div>
        <app-code></app-code>
    `
})
export class ClearIconDoc {
    value!: string;
}
