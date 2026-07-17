import { Code } from '@/domain/code';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MenuItem, PrimeIcons } from 'voxx-ui/api';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';
import { MenuModule } from 'voxx-ui/menu';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'constants-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, MenuModule],
    template: `
        <app-docsectiontext>
            <p>Constants API is available to reference icons easily when used programmatically.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <vx-menu [model]="items"></vx-menu>
        </div>
        <app-code [code]="code" [hideToggleCode]="true"></app-code>
    `
})
export class ConstantsDoc implements OnInit {
    items: MenuItem[];

    ngOnInit() {
        this.items = [
            {
                label: 'New',
                icon: PrimeIcons.PLUS
            },
            {
                label: 'Delete',
                icon: PrimeIcons.TRASH
            }
        ];
    }

    code: Code = {
        typescript: `
import { Component } from '@angular/core';
import { PrimeIcons, MenuItem } from 'voxx-ui/api';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'prime-icons-constants-demo',
    templateUrl: './prime-icons-constants-demo.html'
})
export class PrimeIconsConstantsDemo {
    items: MenuItem[];

    ngOnInit() {
        this.items = [
            {
                label: 'New',
                icon: PrimeIcons.PLUS,
            },
            {
                label: 'Delete',
                icon: PrimeIcons.TRASH
            }
        ];
    }
}`
    };
}
