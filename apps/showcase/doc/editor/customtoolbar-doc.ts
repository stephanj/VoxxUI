import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EditorModule } from 'voxx-ui/editor';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'customtoolbar-doc',
    standalone: true,
    imports: [FormsModule, EditorModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>Editor provides a default toolbar with common options, to customize it define your elements inside the header element. Refer to <a href="http://quilljs.com/docs/modules/toolbar/">Quill documentation</a> for available controls.</p>
        </app-docsectiontext>
        <div class="card">
            <vx-editor [(ngModel)]="text" [style]="{ height: '320px' }">
                <ng-template #header>
                    <span class="ql-formats">
                        <button type="button" class="ql-bold" aria-label="Bold"></button>
                        <button type="button" class="ql-italic" aria-label="Italic"></button>
                        <button type="button" class="ql-underline" aria-label="Underline"></button>
                    </span>
                </ng-template>
            </vx-editor>
        </div>
        <app-code></app-code>
    `
})
export class CustomToolbarDoc {
    text: string = '<div>Hello World!</div><div>VoxxUI <b>Editor</b> Rocks</div><div><br></div>';
}
