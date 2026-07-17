import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';
import { AvatarModule } from 'voxx-ui/avatar';

@Component({
    selector: 'label-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, AvatarModule],
    template: `
        <app-docsectiontext>
            <p>A letter Avatar is defined with the <i>label</i> property.</p>
        </app-docsectiontext>
        <div class="card">
            <div class="flex flex-wrap gap-8">
                <div class="flex-auto">
                    <h5>Label</h5>
                    <vx-avatar label="P" class="mr-2" size="xlarge" />
                    <vx-avatar label="V" class="mr-2" size="large" [style]="{ 'background-color': '#ece9fc', color: '#2a1261' }" />
                    <vx-avatar label="U" class="mr-2" [style]="{ 'background-color': '#dee9fc', color: '#1a2551' }" />
                </div>
                <div class="flex-auto">
                    <h5>Circle</h5>
                    <vx-avatar label="P" class="mr-2" size="xlarge" shape="circle" />
                    <vx-avatar label="V" class="mr-2" size="large" [style]="{ 'background-color': '#ece9fc', color: '#2a1261' }" shape="circle" />
                    <vx-avatar label="U" class="mr-2" [style]="{ 'background-color': '#dee9fc', color: '#1a2551' }" shape="circle" />
                </div>
            </div>
        </div>
        <app-code></app-code>
    `
})
export class LabelDoc {}
