import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DialogModule } from 'voxx-ui/dialog';
import { ButtonModule } from 'voxx-ui/button';
import { InputTextModule } from 'voxx-ui/inputtext';
import { AvatarModule } from 'voxx-ui/avatar';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'template-doc',
    standalone: true,
    imports: [DialogModule, ButtonModule, InputTextModule, AvatarModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>Dialog can be customized using <i>header</i> and <i>footer</i> templates.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <vx-button (click)="showDialog()" label="Show" />
            <vx-dialog [(visible)]="visible" [modal]="true" [style]="{ width: '25rem' }">
                <ng-template #header>
                    <div class="inline-flex items-center justify-center gap-2">
                        <vx-avatar image="https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png" shape="circle" />
                        <span class="font-bold whitespace-nowrap">Amy Elsner</span>
                    </div>
                </ng-template>
                <span class="text-surface-500 dark:text-surface-400 block mb-8">Update your information.</span>
                <div class="flex items-center gap-4 mb-4">
                    <label for="username" class="font-semibold w-24">Username</label>
                    <input vxInputText id="username" class="flex-auto" autocomplete="off" />
                </div>
                <div class="flex items-center gap-4 mb-2">
                    <label for="email" class="font-semibold w-24">Email</label>
                    <input vxInputText id="email" class="flex-auto" autocomplete="off" />
                </div>
                <ng-template #footer>
                    <vx-button label="Cancel" [text]="true" severity="secondary" (click)="visible = false" />
                    <vx-button label="Save" [outlined]="true" severity="secondary" (click)="visible = false" />
                </ng-template>
            </vx-dialog>
        </div>
        <app-code></app-code>
    `
})
export class TemplateDoc {
    visible: boolean = false;

    showDialog() {
        this.visible = true;
    }
}
