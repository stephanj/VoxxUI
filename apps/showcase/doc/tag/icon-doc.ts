import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { TagModule } from 'voxx-ui/tag';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'icon-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText, TagModule],
    template: `
        <app-docsectiontext>
            <p>A font icon next to the value can be displayed with the <i>icon</i> property.</p>
        </app-docsectiontext>
        <div class="card flex flex-wrap justify-center gap-2">
            <vx-tag icon="pi pi-user" value="Primary" />
            <vx-tag icon="pi pi-search" severity="secondary" value="Secondary" />
            <vx-tag icon="pi pi-check" severity="success" value="Success" />
            <vx-tag icon="pi pi-info-circle" severity="info" value="Info" />
            <vx-tag icon="pi pi-exclamation-triangle" severity="warn" value="Warn" />
            <vx-tag icon="pi pi-times" severity="danger" value="Danger" />
            <vx-tag icon="pi pi-cog" severity="contrast" value="Contrast" />
        </div>
        <app-code></app-code>
    `
})
export class IconDoc {}
