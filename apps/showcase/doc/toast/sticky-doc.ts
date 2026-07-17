import { Component } from '@angular/core';
import { MessageService } from 'voxx-ui/api';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';
import { ToastModule } from 'voxx-ui/toast';
import { ButtonModule } from 'voxx-ui/button';
import { Ripple } from 'voxx-ui/ripple';

@Component({
    selector: 'sticky-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, ToastModule, ButtonModule, Ripple],
    template: `
        <app-docsectiontext>
            <p>A toast disappears after the time defined by the <i>life</i> option, set <i>sticky</i> option <i>true</i> on the message to override this and not hide the toast automatically.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <vx-toast />
            <div class="flex flex-wrap gap-2">
                <vx-button vxRipple (click)="show()" label="Sticky" />
                <vx-button vxRipple (click)="clear()" severity="secondary" label="Clear" />
            </div>
        </div>
        <app-code></app-code>
    `,
    providers: [MessageService]
})
export class StickyDoc {
    constructor(private messageService: MessageService) {}

    show() {
        this.messageService.add({ severity: 'info', summary: 'Sticky', detail: 'Message Content', sticky: true });
    }

    clear() {
        this.messageService.clear();
    }
}
