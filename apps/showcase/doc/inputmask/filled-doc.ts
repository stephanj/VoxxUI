import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputMaskModule } from 'voxx-ui/inputmask';
import { InputText } from 'voxx-ui/inputtext';
import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'filled-doc',
    standalone: true,
    imports: [FormsModule, InputMaskModule, InputText, AppCodeModule, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>Specify the <i>variant</i> property as <i>filled</i> to display the component with a higher visual emphasis than the default <i>outlined</i> style.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <input vxInputText vxInputMask="99-999999" [(ngModel)]="value" variant="filled" placeholder="99-999999" />
        </div>
        <app-code></app-code>
    `
})
export class FilledDoc {
    value: string | undefined;
}
