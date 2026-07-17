import { FontAwesomeDoc } from '@/doc/customicons/fontawesome-doc';
import { ImageDoc } from '@/doc/customicons/image-doc';
import { MaterialDoc } from '@/doc/customicons/material-doc';
import { SVGDoc } from '@/doc/customicons/svg-doc';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppDoc } from '@/components/doc/app.doc';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
    imports: [AppDoc],
    template: ` <app-doc title="Custom Icons - VoxxUI" header="Custom Icons" description="VoxxUI components can be used with any icon library using the templating features." [docs]="docs" docType="page"></app-doc>`
})
export class CustomIconsDemo {
    docs = [
        {
            id: 'material',
            label: 'Material',
            component: MaterialDoc
        },
        {
            id: 'fontawesome',
            label: 'Font Awesome',
            component: FontAwesomeDoc
        },
        {
            id: 'svg',
            label: 'SVG',
            component: SVGDoc
        },
        {
            id: 'image',
            label: 'Image',
            component: ImageDoc
        }
    ];
}
