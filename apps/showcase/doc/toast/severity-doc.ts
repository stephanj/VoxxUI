import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MessageService } from 'voxx-ui/api';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';
import { ToastModule } from 'voxx-ui/toast';
import { ButtonModule } from 'voxx-ui/button';
import { Ripple } from 'voxx-ui/ripple';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'severity-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, ToastModule, ButtonModule, Ripple],
    template: `
        <app-docsectiontext>
            <p>
                The <i>severity</i> option specifies the type of the message. There are four types of messages: <i>success</i>, <i>info</i>, <i>warn</i> and <i>error</i>. The severity of the message is used to display the icon and the color of the
                toast.
            </p>
        </app-docsectiontext>
        <div class="card flex justify-center gap-2">
            <vx-toast />
            <vx-button type="button" vxRipple (click)="showSuccess()" label="Success" severity="success" />
            <vx-button type="button" vxRipple (click)="showInfo()" label="Info" severity="info" />
            <vx-button type="button" vxRipple (click)="showWarn()" label="Warn" severity="warn" />
            <vx-button type="button" vxRipple (click)="showError()" label="Error" severity="danger" />
            <vx-button type="button" vxRipple (click)="showSecondary()" label="Secondary" severity="secondary" />
            <vx-button type="button" vxRipple (click)="showContrast()" label="Contrast" severity="contrast" />
        </div>
        <app-code></app-code>
    `,
    providers: [MessageService]
})
export class SeverityDoc {
    constructor(private messageService: MessageService) {}

    showSuccess() {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
    }

    showInfo() {
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Message Content' });
    }

    showWarn() {
        this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Message Content' });
    }

    showError() {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Message Content' });
    }

    showContrast() {
        this.messageService.add({ severity: 'contrast', summary: 'Contrast', detail: 'Message Content' });
    }

    showSecondary() {
        this.messageService.add({ severity: 'secondary', summary: 'Secondary', detail: 'Message Content' });
    }
}
