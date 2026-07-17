import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'dynamic-dialog-pt-viewer',
    standalone: true,
    imports: [CommonModule, AppDocSectionText, RouterModule],
    template: `
        <app-docsectiontext>
            <p>For more information visit <a routerLink="/dialog" fragment="pt.doc.dialog">Dialog PT</a>.</p>
        </app-docsectiontext>
    `
})
export class PTViewer {}
