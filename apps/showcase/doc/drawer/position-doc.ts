import { Component } from '@angular/core';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { DrawerModule } from 'voxx-ui/drawer';
import { ButtonModule } from 'voxx-ui/button';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'position-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText, DrawerModule, ButtonModule, FormsModule],
    template: `
        <app-docsectiontext>
            <p>Drawer location is configured with the <i>position</i> property that can take <i>left</i>, <i>right</i>, <i>top</i> and <i>bottom</i> as a value.</p>
        </app-docsectiontext>
        <div class="card">
            <vx-drawer header="Left Drawer" [(visible)]="visible1" position="left">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                    consequat.
                </p>
            </vx-drawer>

            <vx-drawer header="Right Drawer" [(visible)]="visible2" position="right">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                    consequat.
                </p>
            </vx-drawer>

            <vx-drawer header="Top Drawer" [(visible)]="visible3" position="top" [style]="{ height: 'auto' }">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                    consequat.
                </p>
            </vx-drawer>

            <vx-drawer header="Bottom Drawer" [(visible)]="visible4" position="bottom" [style]="{ height: 'auto' }">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                    consequat.
                </p>
            </vx-drawer>
            <div class="flex gap-2 justify-center">
                <vx-button type="button" (click)="visible1 = true" icon="pi pi-arrow-right" />
                <vx-button type="button" (click)="visible2 = true" icon="pi pi-arrow-left" />
                <vx-button type="button" (click)="visible3 = true" icon="pi pi-arrow-down" />
                <vx-button type="button" (click)="visible4 = true" icon="pi pi-arrow-up" />
            </div>
        </div>
        <app-code></app-code>
    `
})
export class PositionDoc {
    visible1: boolean = false;

    visible2: boolean = false;

    visible3: boolean = false;

    visible4: boolean = false;
}
