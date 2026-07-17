import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { FloatLabelModule } from 'voxx-ui/floatlabel';
import { InputTextModule } from 'voxx-ui/inputtext';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'basic-doc',
    standalone: true,
    imports: [FormsModule, AppCode, AppDocSectionText, FloatLabelModule, InputTextModule],
    template: `
        <app-docsectiontext>
            <p>FloatLabel is used by wrapping the input and its label.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <vx-floatlabel>
                <input id="username" vxInputText [(ngModel)]="value" autocomplete="off" />
                <label for="username">Username</label>
            </vx-floatlabel>
        </div>
        <app-code></app-code>
    `
})
export class BasicDoc {
    value: string | undefined;
}
