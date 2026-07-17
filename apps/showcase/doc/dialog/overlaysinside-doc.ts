import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'voxx-ui/dialog';
import { ButtonModule } from 'voxx-ui/button';
import { SelectModule } from 'voxx-ui/select';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

interface City {
    name: string;
    code: string;
}

@Component({
    selector: 'overlaysinside-doc',
    standalone: true,
    imports: [FormsModule, DialogModule, ButtonModule, SelectModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                When dialog includes other components with overlays such as dropdown, the overlay part cannot exceed dialog boundaries due to overflow. In order to solve this, you can either append the overlay to the body by using
                <i>appendTo</i> property or allow overflow in dialog.
            </p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <vx-button (click)="showDialog()" icon="pi pi-external-link" label="Show"></vx-button>
            <vx-dialog header="Header" [(visible)]="visible" [style]="{ width: '50vw' }">
                <div class="flex py-2 justify-center">
                    <vx-select appendTo="body" [options]="cities" [(ngModel)]="selectedCity" placeholder="Select a City" optionLabel="name"></vx-select>
                </div>
            </vx-dialog>
        </div>
        <app-code></app-code>
    `
})
export class OverlaysInsideDoc implements OnInit {
    cities: City[] | undefined;

    selectedCity: City | undefined;

    visible: boolean = false;

    ngOnInit() {
        this.cities = [
            { name: 'New York', code: 'NY' },
            { name: 'Rome', code: 'RM' },
            { name: 'London', code: 'LDN' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Paris', code: 'PRS' }
        ];
    }

    showDialog() {
        this.visible = true;
    }
}
