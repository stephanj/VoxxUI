import { AppDocPtViewer } from '@/components/doc/app.docptviewer';
import { getPTOptions } from '@/components/doc/app.docptviewer';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'voxx-ui/toggleswitch';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'toggleswitch-pt-viewer',
    standalone: true,
    imports: [AppDocPtViewer, ToggleSwitchModule, FormsModule],
    template: `
        <app-docptviewer [docs]="docs">
            <vx-toggleswitch [(ngModel)]="checked"></vx-toggleswitch>
        </app-docptviewer>
    `
})
export class PTViewer {
    checked: boolean = false;

    docs = [{ data: getPTOptions('ToggleSwitch'), key: 'ToggleSwitch' }];
}
