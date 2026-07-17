import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButton } from 'voxx-ui/selectbutton';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'sizes-doc',
    standalone: true,
    imports: [FormsModule, SelectButton, AppDocSectionText, AppCode],
    template: `
        <app-docsectiontext>
            <p>SelectButton provides <i>small</i> and <i>large</i> sizes as alternatives to the base.</p>
        </app-docsectiontext>
        <div class="card flex flex-col items-center gap-4">
            <vx-selectbutton [(ngModel)]="value1" [options]="options" size="small" />
            <vx-selectbutton [(ngModel)]="value2" [options]="options" />
            <vx-selectbutton [(ngModel)]="value3" [options]="options" size="large" />
        </div>
        <app-code></app-code>
    `
})
export class SizesDoc {
    value1!: string;

    value2: string = 'Beginner';

    value3: string = 'Expert';

    options: any[] = [
        { label: 'Beginner', value: 'Beginner' },
        { label: 'Expert', value: 'Expert' }
    ];
}
