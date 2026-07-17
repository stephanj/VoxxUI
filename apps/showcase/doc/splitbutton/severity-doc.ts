import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'voxx-ui/api';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { SplitButtonModule } from 'voxx-ui/splitbutton';
import { ToastModule } from 'voxx-ui/toast';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'severity-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText, SplitButtonModule, ToastModule, RouterModule],
    template: `
        <app-docsectiontext>
            <p>The <i>severity</i> property defines the type of button.</p>
        </app-docsectiontext>
        <div class="card flex justify-center flex-wrap gap-4">
            <vx-toast />
            <vx-splitbutton label="Save" (onClick)="save()" [model]="items" />
            <vx-splitbutton label="Save" (onClick)="save()" [model]="items" severity="secondary" />
            <vx-splitbutton label="Save" (onClick)="save()" [model]="items" severity="success" />
            <vx-splitbutton label="Save" (onClick)="save()" [model]="items" severity="info" />
            <vx-splitbutton label="Save" (onClick)="save()" [model]="items" severity="warn" />
            <vx-splitbutton label="Save" (onClick)="save()" [model]="items" severity="help" />
            <vx-splitbutton label="Save" (onClick)="save()" [model]="items" severity="danger" />
            <vx-splitbutton label="Save" (onClick)="save()" [model]="items" severity="contrast" />
        </div>
        <app-code></app-code>
    `,
    providers: [MessageService]
})
export class SeverityDoc {
    items: MenuItem[];

    constructor(private messageService: MessageService) {
        this.items = [
            {
                label: 'Update',
                command: () => {
                    this.update();
                }
            },
            {
                label: 'Delete',
                command: () => {
                    this.delete();
                }
            },
            { label: 'Angular.dev', url: 'https://angular.dev' },
            { separator: true },
            { label: 'Upload', routerLink: ['/fileupload'] }
        ];
    }

    save() {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data Saved' });
    }

    update() {
        this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Data Updated' });
    }

    delete() {
        this.messageService.add({ severity: 'warn', summary: 'Delete', detail: 'Data Deleted' });
    }
}
