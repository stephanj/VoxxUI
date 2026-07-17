import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';
import { AvatarModule } from 'voxx-ui/avatar';

@Component({
    selector: 'shape-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, AvatarModule],
    template: `
        <app-docsectiontext>
            <p>Avatar comes in two different styles specified with the <i>shape</i> property, <i>square</i> is the default and <i>circle</i> is the alternative.</p>
        </app-docsectiontext>
        <div class="card flex justify-center gap-2">
            <vx-avatar label="P" shape="circle" />
            <vx-avatar label="T" />
        </div>
        <app-code></app-code>
    `
})
export class ShapeDoc {}
