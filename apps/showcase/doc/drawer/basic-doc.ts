import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DrawerModule } from 'voxx-ui/drawer';
import { ButtonModule } from 'voxx-ui/button';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'basic-doc',
    standalone: true,
    imports: [DrawerModule, ButtonModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>Drawer is used as a container and visibility is controlled with a binding to <i>visible</i>.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <vx-drawer [(visible)]="visible" header="Drawer">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                    consequat.
                </p>
            </vx-drawer>
            <vx-button (click)="visible = true" icon="pi pi-arrow-right" />
        </div>
        <app-code></app-code>
    `
})
export class BasicDoc {
    visible: boolean = false;
}
