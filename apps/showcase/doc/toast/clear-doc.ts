import { Component } from '@angular/core';
import { MessageService } from 'voxx-ui/api';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';
import { Toast } from 'voxx-ui/toast';
import { ButtonModule } from 'voxx-ui/button';

@Component({
    selector: 'clear-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, Toast, ButtonModule],
    template: `
        <app-docsectiontext>
            <p>
                Clicking the close icon on the toast, removes it manually. Same can also be achieved programmatically using the clear function of the <i>messageService</i>. Calling it without any arguments, removes all displayed messages whereas
                calling it with a key, removes the messages displayed on a toast having the same key.
            </p>
        </app-docsectiontext>
        <div class="card flex justify-center gap-2">
            <vx-toast key="myKey" />
            <vx-button (click)="show()" label="Show" />
            <vx-button (click)="clear()" label="Clear" severity="secondary" />
        </div>
        <app-code></app-code>
    `,
    providers: [MessageService]
})
export class ClearDoc {
    constructor(private messageService: MessageService) {}

    show() {
        this.messageService.add({ key: 'myKey', severity: 'success', summary: 'Message 1', detail: 'Message Content' });
    }

    clear() {
        this.messageService.clear();
    }
}
