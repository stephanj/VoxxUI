import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'voxx-ui/button';
import { DialogModule } from 'voxx-ui/dialog';
import { InputTextModule } from 'voxx-ui/inputtext';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'dialog-pt-viewer',
    standalone: true,
    imports: [CommonModule, AppDocPtViewer, DialogModule, ButtonModule, InputTextModule, FormsModule],
    template: `
        <app-docptviewer [docs]="docs">
            <vx-dialog [(visible)]="visible" header="Edit Profile" [maximizable]="true" maskStyleClass="!relative" [draggable]="false" class="!my-auto w-full">
                <span class="text-surface-500 dark:text-surface-400 block mb-8">Update your information.</span>
                <div class="flex items-center gap-4 mb-4">
                    <label for="username" class="font-semibold w-24">Username</label>
                    <input vxInputText id="username" class="flex-auto" autocomplete="off" />
                </div>
                <div class="flex items-center gap-4 mb-8">
                    <label for="email" class="font-semibold w-24">Email</label>
                    <input vxInputText id="email" class="flex-auto" autocomplete="off" />
                </div>
                <ng-template #footer>
                    <div class="flex justify-end gap-2">
                        <vx-button type="button" label="Cancel" severity="secondary"></vx-button>
                        <vx-button type="button" label="Save"></vx-button>
                    </div>
                </ng-template>
            </vx-dialog>
        </app-docptviewer>
    `
})
export class PTViewer {
    visible: boolean = true;

    docs = [
        {
            data: getPTOptions('Dialog'),
            key: 'Dialog'
        }
    ];
}
