import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'voxx-ui/datepicker';
import { InputTextModule } from 'voxx-ui/inputtext';
import { SelectModule } from 'voxx-ui/select';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'form-doc',
    standalone: true,
    imports: [FormsModule, AppDocSectionText, AppCode, InputTextModule, SelectModule, DatePickerModule],
    template: `
        <app-docsectiontext>
            <p>Using Tailwind utilities for the responsive layout of a form with VoxxUI components.</p>
        </app-docsectiontext>
        <div class="card flex sm:justify-center">
            <div class="flex flex-col gap-6 w-full sm:w-auto">
                <div class="flex flex-col sm:flex-row sm:items-center gap-6">
                    <div class="flex-auto">
                        <label for="firstname" class="block font-semibold mb-2">Firstname</label>
                        <input type="text" vxInputText id="firstname" class="w-full" />
                    </div>
                    <div class="flex-auto">
                        <label for="lastname" class="block font-semibold mb-2">Lastname</label>
                        <input type="text" vxInputText id="lastname" class="w-full" />
                    </div>
                </div>
                <div class="flex flex-col sm:flex-row sm:items-center gap-6">
                    <div class="flex-1">
                        <label for="date" class="block font-semibold mb-2">Date</label>
                        <vx-datepicker inputId="date" class="w-full" />
                    </div>
                    <div class="flex-1">
                        <label for="country" class="block font-semibold mb-2">Country</label>
                        <vx-select [options]="countries" [(ngModel)]="selectedCountry" optionLabel="name" [showClear]="true" placeholder="Select a Country">
                            <ng-template vxTemplate="selectedItem">
                                @if (selectedCountry) {
                                    <div class="flex items-center gap-2">
                                        <img src="https://primefaces.org/cdn/primeng/images/demo/flag/flag_placeholder.png" [class]="'flag flag-' + selectedCountry.code.toLowerCase()" style="width: 18px" />
                                        <div>{{ selectedCountry.name }}</div>
                                    </div>
                                }
                            </ng-template>
                            <ng-template let-country vxTemplate="item">
                                <div class="flex items-center gap-2">
                                    <img src="https://primefaces.org/cdn/primeng/images/demo/flag/flag_placeholder.png" [class]="'flag flag-' + country.code.toLowerCase()" style="width: 18px" />
                                    <div>{{ country.name }}</div>
                                </div>
                            </ng-template>
                        </vx-select>
                    </div>
                </div>
                <div class="flex-auto">
                    <label for="message" class="block font-semibold mb-2">Message</label>
                    <textarea id="message" class="w-full" rows="4"></textarea>
                </div>
            </div>
        </div>
        <app-code [hideToggleCode]="true" [hideCodeSandbox]="true" [hideStackBlitz]="true"></app-code>
    `
})
export class FormDoc implements OnInit {
    countries: any[] | undefined;

    selectedCountry: string | undefined;

    ngOnInit() {
        this.countries = [
            { name: 'Australia', code: 'AU' },
            { name: 'Brazil', code: 'BR' },
            { name: 'China', code: 'CN' },
            { name: 'Egypt', code: 'EG' },
            { name: 'France', code: 'FR' },
            { name: 'Germany', code: 'DE' },
            { name: 'India', code: 'IN' },
            { name: 'Japan', code: 'JP' },
            { name: 'Spain', code: 'ES' },
            { name: 'United States', code: 'US' }
        ];
    }
}
