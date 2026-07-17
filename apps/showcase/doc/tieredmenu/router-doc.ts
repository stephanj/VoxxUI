import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'voxx-ui/api';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';
import { TieredMenuModule } from 'voxx-ui/tieredmenu';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'router-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, TieredMenuModule],
    template: `
        <app-docsectiontext>
            <p>Menu items support navigation via routerLink, programmatic routing using commands, or external URLs.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <vx-tieredmenu [model]="items" />
        </div>
        <app-code></app-code>
    `
})
export class RouterDoc implements OnInit {
    items: MenuItem[] | undefined;

    constructor(private router: Router) {}

    ngOnInit() {
        this.items = [
            {
                label: 'Router',
                icon: 'pi pi-palette',
                items: [
                    {
                        label: 'Theming',
                        routerLink: '/theming'
                    },
                    {
                        label: 'UI Kit',
                        routerLink: '/uikit'
                    }
                ]
            },
            {
                label: 'Programmatic',
                icon: 'pi pi-link',
                command: () => {
                    this.router.navigate(['/installation']);
                }
            },
            {
                label: 'External',
                icon: 'pi pi-home',
                items: [
                    {
                        label: 'Angular',
                        url: 'https://angular.dev/'
                    },
                    {
                        label: 'Vite.js',
                        url: 'https://vitejs.dev/'
                    }
                ]
            }
        ];
    }
}
