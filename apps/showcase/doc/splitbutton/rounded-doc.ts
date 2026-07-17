import { Component } from '@angular/core';
import { MenuItem, MessageService } from 'voxx-ui/api';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { SplitButtonModule } from 'voxx-ui/splitbutton';
import { ToastModule } from 'voxx-ui/toast';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'rounded-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText, SplitButtonModule, ToastModule, RouterModule],
    template: `
        <app-docsectiontext>
            <p>Rounded buttons have a circular border radius.</p>
        </app-docsectiontext>
        <div class="card flex justify-center flex-wrap gap-4">
            <vx-toast />
            <vx-splitbutton label="Primary" [model]="items" (onClick)="save('info')" rounded />
            <vx-splitbutton label="Secondary" [model]="items" (onClick)="save('info')" rounded severity="secondary" />
            <vx-splitbutton label="Success" [model]="items" (onClick)="save('info')" rounded severity="success" />
            <vx-splitbutton label="Info" [model]="items" (onClick)="save('info')" rounded severity="info" />
            <vx-splitbutton label="Warning" [model]="items" (onClick)="save('info')" rounded severity="warn" />
            <vx-splitbutton label="Help" [model]="items" (onClick)="save('info')" rounded severity="help" />
            <vx-splitbutton label="Danger" [model]="items" (onClick)="save('info')" rounded severity="danger" />
            <vx-splitbutton label="Contrast" [model]="items" (onClick)="save('info')" rounded severity="contrast" />
        </div>
        <app-code></app-code>
    `,
    providers: [MessageService]
})
export class RoundedDoc {
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

    save(severity: string) {
        this.messageService.add({ severity: severity, summary: 'Success', detail: 'Data Saved' });
    }

    update() {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data Updated' });
    }

    delete() {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data Deleted' });
    }
}
