import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AvatarModule } from 'voxx-ui/avatar';
import { AvatarGroupModule } from 'voxx-ui/avatargroup';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'avatar-pt-viewer',
    standalone: true,
    imports: [CommonModule, AppDocPtViewer, AvatarModule, AvatarGroupModule],
    template: `
        <app-docptviewer [docs]="docs">
            <div class="flex flex-wrap gap-8">
                <vx-avatargroup>
                    <vx-avatar label="P" size="xlarge" shape="circle"></vx-avatar>
                    <vx-avatar icon="pi pi-user" size="xlarge" shape="circle"></vx-avatar>
                    <vx-avatar image="https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp" styleClass="flex items-center justify-center" size="xlarge" shape="circle"></vx-avatar>
                </vx-avatargroup>
            </div>
        </app-docptviewer>
    `
})
export class PTViewer {
    docs = [
        {
            data: getPTOptions('Avatar'),
            key: 'Avatar'
        },
        {
            data: getPTOptions('AvatarGroup'),
            key: 'AvatarGroup'
        }
    ];
}
