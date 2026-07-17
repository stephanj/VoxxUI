import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'voxx-ui/button';
import { DrawerModule } from 'voxx-ui/drawer';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'fullscreen-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText, DrawerModule, ButtonModule, FormsModule],
    template: `
        <app-docsectiontext>
            <p>Drawer can cover the whole page when <i>fullScreen</i> property is enabled.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <vx-drawer header="Drawer" [(visible)]="visible" [fullScreen]="true">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                    consequat.
                </p>
            </vx-drawer>
            <vx-button (click)="visible = true" icon="pi pi-window-maximize" />
        </div>
        <app-code></app-code>
    `
})
export class FullScreenDoc {
    visible: boolean = false;
}
