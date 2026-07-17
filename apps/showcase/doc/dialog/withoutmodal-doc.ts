import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DialogModule } from 'voxx-ui/dialog';
import { ButtonModule } from 'voxx-ui/button';
import { InputTextModule } from 'voxx-ui/inputtext';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'withoutmodal-doc',
    standalone: true,
    imports: [DialogModule, ButtonModule, InputTextModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>Mask layer behind the Dialog is configured with the <i>modal</i> property. By default, no modal layer is added.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <vx-button (click)="showDialog()" label="Show" />
            <vx-dialog header="Edit Profile" [(visible)]="visible" [style]="{ width: '25rem' }">
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
export class WithoutModalDoc {
    visible: boolean = false;

    showDialog() {
        this.visible = true;
    }
}
