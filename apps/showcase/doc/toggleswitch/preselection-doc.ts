import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'voxx-ui/toggleswitch';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'preselection-doc',
    standalone: true,
    imports: [FormsModule, ToggleSwitchModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>Enabling <i>ngModel</i> property displays the component as active initially.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <vx-toggleswitch [(ngModel)]="checked" />
        </div>
        <app-code></app-code>
    `
})
export class PreselectionDoc {
    checked: boolean = true;
}
