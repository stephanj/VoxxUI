import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'voxx-ui/password';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'togglemask-doc',
    standalone: true,
    imports: [FormsModule, PasswordModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>When <i>toggleMask</i> is present, an icon is displayed to show the value as plain text.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <vx-password [(ngModel)]="value" [toggleMask]="true" autocomplete="off" />
        </div>
        <app-code></app-code>
    `
})
export class ToggleMaskDoc {
    value!: string;
}
