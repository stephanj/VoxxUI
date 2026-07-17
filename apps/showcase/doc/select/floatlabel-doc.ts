import { Component, OnInit } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'voxx-ui/select';
import { FloatLabelModule } from 'voxx-ui/floatlabel';
import { RouterModule } from '@angular/router';

interface City {
    name: string;
    code: string;
}

@Component({
    selector: 'floatlabel-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, FormsModule, SelectModule, FloatLabelModule, RouterModule],
    template: `
        <app-docsectiontext>
            <p>
                A floating label appears on top of the input field when focused. Visit
                <a routerLink="/floatlabel">FloatLabel</a> documentation for more information.
            </p>
        </app-docsectiontext>
        <div class="card flex flex-wrap justify-center items-end gap-4">
            <vx-floatlabel class="w-full md:w-56">
                <vx-select [(ngModel)]="value1" inputId="over_label" [options]="cities" optionLabel="name" class="w-full" />
                <label for="over_label">Over Label</label>
            </vx-floatlabel>

            <vx-floatlabel class="w-full md:w-56" variant="in">
                <vx-select [(ngModel)]="value2" inputId="in_label" [options]="cities" optionLabel="name" class="w-full" variant="filled" />
                <label for="in_label">In Label</label>
            </vx-floatlabel>

            <vx-floatlabel class="w-full md:w-56" variant="on">
                <vx-select [(ngModel)]="value3" inputId="on_label" [options]="cities" optionLabel="name" class="w-full" />
                <label for="on_label">On Label</label>
            </vx-floatlabel>
        </div>
        <app-code></app-code>
    `
})
export class FloatLabelDoc implements OnInit {
    cities: City[] | undefined;

    value1: City | undefined;

    value2: City | undefined;

    value3: City | undefined;

    ngOnInit() {
        this.cities = [
            { name: 'New York', code: 'NY' },
            { name: 'Rome', code: 'RM' },
            { name: 'London', code: 'LDN' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Paris', code: 'PRS' }
        ];
    }
}
