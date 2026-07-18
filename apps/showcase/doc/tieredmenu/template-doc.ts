import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MenuItem } from 'voxx-ui/api';
import { BadgeModule } from 'voxx-ui/badge';
import { RippleModule } from 'voxx-ui/ripple';
import { TieredMenuModule } from 'voxx-ui/tieredmenu';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'template-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, TieredMenuModule, BadgeModule, RippleModule],
    template: `
        <app-docsectiontext>
            <p>TieredMenu offers item customization with the <i>item</i> template that receives the menuitem instance from the model as a parameter.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <vx-tieredmenu [model]="items">
                <ng-template #item let-item let-hasSubmenu="hasSubmenu">
                    <a vxRipple class="flex items-center px-4 py-3 cursor-pointer">
                        <span [class]="item.icon"></span>
                        <span class="ms-2">{{ item.label }}</span>
                        @if (item.badge) {
                            <vx-badge class="ml-auto" [value]="item.badge" />
                        }
                        @if (item.shortcut) {
                            <span class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{ item.shortcut }}</span>
                        }
                        @if (hasSubmenu) {
                            <i class="pi pi-angle-right ms-auto rotate-90 lg:rotate-0"></i>
                        }
                    </a>
                </ng-template>
            </vx-tieredmenu>
        </div>
        <app-code></app-code>
    `
})
export class TemplateDoc implements OnInit {
    items: MenuItem[] | undefined;

    ngOnInit() {
        this.items = [
            {
                label: 'File',
                icon: 'pi pi-file',
                items: [
                    {
                        label: 'New',
                        icon: 'pi pi-plus',
                        items: [
                            {
                                label: 'Docs',
                                icon: 'pi pi-file',
                                shortcut: '⌘+N'
                            },
                            {
                                label: 'Image',
                                icon: 'pi pi-image',
                                shortcut: '⌘+I'
                            },
                            {
                                label: 'Video',
                                icon: 'pi pi-video',
                                shortcut: '⌘+L'
                            }
                        ]
                    },
                    {
                        label: 'Open',
                        icon: 'pi pi-folder-open',
                        shortcut: '⌘+O'
                    },
                    {
                        label: 'Print',
                        icon: 'pi pi-print',
                        shortcut: '⌘+P'
                    }
                ]
            },
            {
                label: 'Edit',
                icon: 'pi pi-file-edit',
                items: [
                    {
                        label: 'Copy',
                        icon: 'pi pi-copy',
                        shortcut: '⌘+C'
                    },
                    {
                        label: 'Delete',
                        icon: 'pi pi-times',
                        shortcut: '⌘+D'
                    }
                ]
            },
            {
                label: 'Search',
                icon: 'pi pi-search',
                shortcut: '⌘+S'
            },
            {
                separator: true
            },
            {
                label: 'Share',
                icon: 'pi pi-share-alt',
                items: [
                    {
                        label: 'Slack',
                        icon: 'pi pi-slack',
                        badge: '2'
                    },
                    {
                        label: 'Whatsapp',
                        icon: 'pi pi-whatsapp',
                        badge: '3'
                    }
                ]
            }
        ];
    }
}
