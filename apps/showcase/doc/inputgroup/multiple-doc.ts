import { Component } from '@angular/core';
import { InputGroupModule } from 'voxx-ui/inputgroup';
import { InputGroupAddonModule } from 'voxx-ui/inputgroupaddon';
import { InputTextModule } from 'voxx-ui/inputtext';
import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'multiple-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCodeModule, InputGroupModule, InputGroupAddonModule, InputTextModule],
    template: `
        <app-docsectiontext>
            <p>Multiple add-ons can be placed inside the same group.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <vx-inputgroup class="w-full md:!w-[30rem]">
                <vx-inputgroup-addon>
                    <i class="pi pi-clock"></i>
                </vx-inputgroup-addon>
                <vx-inputgroup-addon>
                    <i class="pi pi-star-fill"></i>
                </vx-inputgroup-addon>
                <input type="text" vxInputText placeholder="Price" />
                <vx-inputgroup-addon>$</vx-inputgroup-addon>
                <vx-inputgroup-addon>.00</vx-inputgroup-addon>
            </vx-inputgroup>
        </div>
        <app-code></app-code>
    `
})
export class MultipleDoc {}
