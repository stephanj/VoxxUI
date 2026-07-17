import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'voxx-ui/inputgroup';
import { InputGroupAddonModule } from 'voxx-ui/inputgroupaddon';
import { InputTextModule } from 'voxx-ui/inputtext';
import { InputNumberModule } from 'voxx-ui/inputnumber';
import { SelectModule } from 'voxx-ui/select';
import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

interface City {
    name: string;
    code: string;
}
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'basic-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCodeModule, FormsModule, InputGroupModule, InputGroupAddonModule, InputTextModule, InputNumberModule, SelectModule],
    template: `
        <app-docsectiontext>
            <p>A group is created by wrapping the input and add-ons with the <i>p-inputgroup</i> component. Each add-on element is defined as a child of <i>p-inputgroup-addon</i> component.</p>
        </app-docsectiontext>
        <div class="card grid grid-cols-1 md:grid-cols-2 gap-4">
            <vx-inputgroup>
                <vx-inputgroup-addon>
                    <i class="pi pi-user"></i>
                </vx-inputgroup-addon>
                <input vxInputText [(ngModel)]="text1" placeholder="Username" />
            </vx-inputgroup>

            <vx-inputgroup>
                <vx-inputgroup-addon>$</vx-inputgroup-addon>
                <vx-inputnumber [(ngModel)]="number" placeholder="Price" />
                <vx-inputgroup-addon>.00</vx-inputgroup-addon>
            </vx-inputgroup>

            <vx-inputgroup>
                <vx-inputgroup-addon>www</vx-inputgroup-addon>
                <input vxInputText [(ngModel)]="text2" placeholder="Website" />
            </vx-inputgroup>

            <vx-inputgroup>
                <vx-inputgroup-addon>
                    <i class="pi pi-map"></i>
                </vx-inputgroup-addon>
                <vx-select [(ngModel)]="selectedCity" [options]="cities" optionLabel="name" placeholder="City" />
            </vx-inputgroup>
        </div>
        <app-code></app-code>
    `
})
export class BasicDoc {
    text1: string | undefined;

    text2: string | undefined;

    number: string | undefined;

    selectedCity: City | undefined;

    cities: City[] = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];
}
