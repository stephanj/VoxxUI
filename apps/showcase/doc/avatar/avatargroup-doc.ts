import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';
import { AvatarModule } from 'voxx-ui/avatar';
import { AvatarGroupModule } from 'voxx-ui/avatargroup';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'avatargroup-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, AvatarModule, AvatarGroupModule],
    template: `
        <app-docsectiontext>
            <p>Grouping is available by wrapping multiple Avatar components inside an <i>AvatarGroup</i>.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <vx-avatar-group>
                <vx-avatar image="https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png" size="large" shape="circle" />
                <vx-avatar image="https://primefaces.org/cdn/primeng/images/demo/avatar/asiyajavayant.png" size="large" shape="circle" />
                <vx-avatar image="https://primefaces.org/cdn/primeng/images/demo/avatar/onyamalimba.png" size="large" shape="circle" />
                <vx-avatar image="https://primefaces.org/cdn/primeng/images/demo/avatar/ionibowcher.png" size="large" shape="circle" />
                <vx-avatar image="https://primefaces.org/cdn/primeng/images/demo/avatar/xuxuefeng.png" size="large" shape="circle" />
                <vx-avatar label="+2" shape="circle" size="large" />
            </vx-avatar-group>
        </div>
        <app-code></app-code>
    `
})
export class GroupDoc {}
