import { Component } from '@angular/core';
import { MessageModule } from 'voxx-ui/message';
import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'sizes-doc',
    standalone: true,
    imports: [MessageModule, AppCodeModule, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>Message provides <i>small</i> and <i>large</i> sizes as alternatives to the base.</p>
        </app-docsectiontext>
        <div class="card flex flex-col items-center gap-4">
            <vx-message size="small" icon="pi pi-send">Small Message</vx-message>
            <vx-message icon="pi pi-user">Normal Message</vx-message>
            <vx-message size="large" icon="pi pi-check">Large Message</vx-message>
        </div>
        <app-code></app-code>
    `
})
export class SizesDoc {}
