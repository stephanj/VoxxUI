import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PopoverModule } from 'voxx-ui/popover';
import { ButtonModule } from 'voxx-ui/button';
import { InputGroupModule } from 'voxx-ui/inputgroup';
import { InputGroupAddonModule } from 'voxx-ui/inputgroupaddon';
import { InputTextModule } from 'voxx-ui/inputtext';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'basic-doc',
    standalone: true,
    imports: [PopoverModule, ButtonModule, InputGroupModule, InputGroupAddonModule, InputTextModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>Popover is accessed via its reference and visibility is controlled using <i>toggle</i>, <i>show</i> and <i>hide</i> methods with an event of the target.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <vx-button (click)="op.toggle($event)" icon="pi pi-share-alt" label="Share" />
            <vx-popover #op>
                <div class="flex flex-col gap-4 w-[25rem]">
                    <div>
                        <span class="font-medium text-surface-900 dark:text-surface-0 block mb-2">Share this document</span>
                        <vx-inputgroup>
                            <input vxInputText value="https://primeng.org/12323ff26t2g243g423g234gg52hy25XADXAG3" readonly class="w-[25rem]" />
                            <vx-inputgroup-addon>
                                <i class="pi pi-copy"></i>
                            </vx-inputgroup-addon>
                        </vx-inputgroup>
                    </div>
                    <div>
                        <span class="font-medium text-surface-900 dark:text-surface-0 block mb-2">Invite Member</span>
                        <div class="flex">
                            <vx-inputgroup>
                                <input vxInputText disabled />
                                <button vxButton label="Invite" icon="pi pi-users"></button>
                            </vx-inputgroup>
                        </div>
                    </div>
                    <div>
                        <span class="font-medium text-surface-900 dark:text-surface-0 block mb-2">Team Members</span>
                        <ul class="list-none p-0 m-0 flex flex-col gap-4">
                            @for (member of members; track member) {
                                <li class="flex items-center gap-2">
                                    <img [src]="'https://primefaces.org/cdn/primeng/images/demo/avatar/' + member.image" style="width: 32px" />
                                    <div>
                                        <span class="font-medium">{{ member.name }}</span>
                                        <div class="text-sm text-muted-color">{{ member.email }}</div>
                                    </div>
                                    <div class="flex items-center gap-2 text-muted-color ml-auto text-sm">
                                        <span>{{ member.role }}</span>
                                        <i class="pi pi-angle-down"></i>
                                    </div>
                                </li>
                            }
                        </ul>
                    </div>
                </div>
            </vx-popover>
        </div>
        <app-code></app-code>
    `
})
export class BasicDoc {
    members = [
        { name: 'Amy Elsner', image: 'amyelsner.png', email: 'amy@email.com', role: 'Owner' },
        { name: 'Bernardo Dominic', image: 'bernardodominic.png', email: 'bernardo@email.com', role: 'Editor' },
        { name: 'Ioni Bowcher', image: 'ionibowcher.png', email: 'ioni@email.com', role: 'Viewer' }
    ];
}
