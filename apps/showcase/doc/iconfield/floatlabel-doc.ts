import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FloatLabelModule } from 'voxx-ui/floatlabel';
import { IconFieldModule } from 'voxx-ui/iconfield';
import { InputIconModule } from 'voxx-ui/inputicon';
import { InputTextModule } from 'voxx-ui/inputtext';
import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'floatlabel-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCodeModule, RouterModule, FormsModule, FloatLabelModule, IconFieldModule, InputIconModule, InputTextModule],
    template: `
        <app-docsectiontext>
            <p>FloatLabel visually integrates a label with its form element. Visit <a routerLink="/floatlabel">FloatLabel</a> documentation for more information.</p>
        </app-docsectiontext>
        <div class="card flex flex-wrap justify-center items-end gap-4">
            <vx-floatlabel>
                <vx-iconfield>
                    <vx-inputicon class="pi pi-search" />
                    <input vxInputText id="over_label" [(ngModel)]="value1" autocomplete="off" />
                </vx-iconfield>
                <label for="over_label">Over Label</label>
            </vx-floatlabel>

            <vx-floatlabel variant="in">
                <vx-iconfield>
                    <vx-inputicon class="pi pi-search" />
                    <input vxInputText id="in_label" [(ngModel)]="value2" autocomplete="off" />
                </vx-iconfield>
                <label for="in_label">In Label</label>
            </vx-floatlabel>

            <vx-floatlabel variant="on">
                <vx-iconfield>
                    <vx-inputicon class="pi pi-search" />
                    <input vxInputText id="on_label" [(ngModel)]="value3" autocomplete="off" />
                </vx-iconfield>
                <label for="on_label">On Label</label>
            </vx-floatlabel>
        </div>
        <app-code></app-code>
    `
})
export class FloatLabelDoc {
    value1: string | undefined;

    value2: string | undefined;

    value3: string | undefined;
}
