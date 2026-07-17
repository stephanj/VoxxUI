import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputGroupModule } from 'voxx-ui/inputgroup';
import { InputGroupAddonModule } from 'voxx-ui/inputgroupaddon';
import { InputTextModule } from 'voxx-ui/inputtext';
import { FloatLabelModule } from 'voxx-ui/floatlabel';
import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'floatlabel-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCodeModule, FormsModule, RouterModule, InputGroupModule, InputGroupAddonModule, InputTextModule, FloatLabelModule],
    template: `
        <app-docsectiontext>
            <p>
                FloatLabel visually integrates a label with its form element. Visit
                <a routerLink="/floatlabel">FloatLabel</a> documentation for more information.
            </p>
        </app-docsectiontext>
        <div class="card flex flex-col md:items-end md:flex-row gap-4">
            <vx-inputgroup>
                <vx-inputgroup-addon>
                    <i class="pi pi-user"></i>
                </vx-inputgroup-addon>
                <vx-floatlabel>
                    <input vxInputText id="over_label" [(ngModel)]="value1" />
                    <label for="over_label">Over Label</label>
                </vx-floatlabel>
            </vx-inputgroup>

            <vx-inputgroup>
                <vx-inputgroup-addon>$</vx-inputgroup-addon>
                <vx-floatlabel variant="in">
                    <input vxInputText id="in_label" [(ngModel)]="value2" />
                    <label for="in_label">In Label</label>
                </vx-floatlabel>
                <vx-inputgroup-addon>.00</vx-inputgroup-addon>
            </vx-inputgroup>

            <vx-inputgroup>
                <vx-inputgroup-addon>www</vx-inputgroup-addon>
                <vx-floatlabel variant="on">
                    <input vxInputText id="on_label" [(ngModel)]="value3" />
                    <label for="on_label">On Label</label>
                </vx-floatlabel>
            </vx-inputgroup>
        </div>
        <app-code></app-code>
    `
})
export class FloatLabelDoc {
    value1: string | undefined;

    value2: string | undefined;

    value3: string | undefined;
}
