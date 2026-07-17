import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'voxx-ui/inputnumber';
import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'filled-doc',
    standalone: true,
    imports: [FormsModule, InputNumberModule, AppCodeModule, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>Specify the <i>variant</i> property as <i>filled</i> to display the component with a higher visual emphasis than the default <i>outlined</i> style.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <vx-inputnumber variant="filled" [(ngModel)]="value1" />
        </div>
        <app-code></app-code>
    `
})
export class FilledDoc {
    value1!: number;
}
