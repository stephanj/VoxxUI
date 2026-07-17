import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonModule } from 'voxx-ui/button';
import { DialogModule } from 'voxx-ui/dialog';
import { InputTextModule } from 'voxx-ui/inputtext';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'basic-doc',
    standalone: true,
    imports: [DialogModule, ButtonModule, InputTextModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>Dialog is used as a container and visibility is controlled with <i>visible</i> property.</p>
        </app-docsectiontext>

        <div class="card flex justify-center">
            <vx-button (click)="showDialog()" label="Show" />
            <vx-dialog header="Edit Profile" [modal]="true" [(visible)]="visible" [style]="{ width: '25rem' }">
                <span class="p-text-secondary block mb-8">Update your information.</span>
                <div class="flex items-center gap-4 mb-4">
                    <label for="username" class="font-semibold w-24">Username</label>
                    <input vxInputText id="username" class="flex-auto" autocomplete="off" />
                </div>
                <div class="flex items-center gap-4 mb-8">
                    <label for="email" class="font-semibold w-24">Email</label>
                    <input vxInputText id="email" class="flex-auto" autocomplete="off" />
                </div>
                <div class="flex justify-end gap-2">
                    <vx-button label="Cancel" severity="secondary" (click)="visible = false" />
                    <vx-button label="Save" (click)="visible = false" />
                </div>
            </vx-dialog>
        </div>
        <app-code></app-code>
    `
})
export class BasicDoc {
    visible: boolean = false;

    showDialog() {
        this.visible = true;
    }
}
