import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MenuItem, MessageService } from 'voxx-ui/api';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { SplitButtonModule } from 'voxx-ui/splitbutton';
import { ToastModule } from 'voxx-ui/toast';
import { RouterModule } from '@angular/router';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'outlined-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText, SplitButtonModule, ToastModule, RouterModule],
    template: `
        <app-docsectiontext>
            <p>Outlined buttons display a border without a background initially.</p>
        </app-docsectiontext>
        <div class="card flex justify-center flex-wrap gap-4">
            <vx-toast />
            <vx-splitbutton label="Primary" [model]="items" (onClick)="save('info')" outlined />
            <vx-splitbutton label="Secondary" [model]="items" (onClick)="save('info')" outlined severity="secondary" />
            <vx-splitbutton label="Success" [model]="items" (onClick)="save('info')" outlined severity="success" />
            <vx-splitbutton label="Info" [model]="items" (onClick)="save('info')" outlined severity="info" />
            <vx-splitbutton label="Warning" [model]="items" (onClick)="save('info')" outlined severity="warn" />
            <vx-splitbutton label="Help" [model]="items" (onClick)="save('info')" outlined severity="help" />
            <vx-splitbutton label="Danger" [model]="items" (onClick)="save('info')" outlined severity="danger" />
            <vx-splitbutton label="Contrast" [model]="items" (onClick)="save('info')" outlined severity="contrast" />
        </div>
        <app-code></app-code>
    `,
    providers: [MessageService]
})
export class OutlinedDoc {
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
