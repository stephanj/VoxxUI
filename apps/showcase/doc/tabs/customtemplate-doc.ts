import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';
import { TabsModule } from 'voxx-ui/tabs';
import { AvatarModule } from 'voxx-ui/avatar';
import { BadgeModule } from 'voxx-ui/badge';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'customtemplate-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, TabsModule, AvatarModule, BadgeModule],
    template: `
        <app-docsectiontext>
            <p>Custom content for a tab is defined with the default ng-content.</p>
        </app-docsectiontext>
        <div class="card">
            <vx-tabs value="0" scrollable>
                <vx-tablist>
                    <ng-template #previcon>
                        <i class="pi pi-minus"></i>
                    </ng-template>
                    <vx-tab value="0" class="flex items-center !gap-2">
                        <vx-avatar image="https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png" shape="circle" />
                        <span class="font-bold whitespace-nowrap">Amy Elsner</span>
                    </vx-tab>
                    <vx-tab value="1" class="flex items-center !gap-2">
                        <vx-avatar image="https://primefaces.org/cdn/primeng/images/demo/avatar/onyamalimba.png" shape="circle" />
                        <span class="font-bold whitespace-nowrap">Onyama Limba</span>
                    </vx-tab>
                    <vx-tab value="2" class="flex items-center !gap-2">
                        <vx-avatar image="https://primefaces.org/cdn/primeng/images/demo/avatar/ionibowcher.png" shape="circle" />
                        <span class="font-bold whitespace-nowrap">Ioni Bowcher</span>
                        <vx-badge value="2" />
                    </vx-tab>
                    <ng-template #nexticon>
                        <i class="pi pi-plus"></i>
                    </ng-template>
                </vx-tablist>
                <vx-tabpanels>
                    <vx-tabpanel value="0">
                        <p class="m-0">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                            laborum.
                        </p>
                    </vx-tabpanel>
                    <vx-tabpanel value="1">
                        <p class="m-0">
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo
                            enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
                        </p>
                    </vx-tabpanel>
                    <vx-tabpanel value="2">
                        <p class="m-0">
                            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in
                            culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
                        </p>
                    </vx-tabpanel>
                </vx-tabpanels>
            </vx-tabs>
        </div>
        <app-code></app-code>
    `
})
export class TemplateDoc {}
