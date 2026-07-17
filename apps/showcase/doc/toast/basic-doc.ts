import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MessageService } from 'voxx-ui/api';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';
import { ToastModule } from 'voxx-ui/toast';
import { ButtonModule } from 'voxx-ui/button';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'basic-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, ToastModule, ButtonModule],
    template: `
        <app-docsectiontext>
            <p>
                Toasts are displayed by calling the <i>add</i> and <i>addAll</i> method provided by the <i>messageService</i>. A single toast is specified by the <i>Message</i> interface that defines various properties such as <i>severity</i>,
                <i>summary</i> and <i>detail</i>.
            </p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <vx-toast />
            <vx-button (onClick)="show()" label="Show" />
        </div>
        <app-code></app-code>
    `,
    providers: [MessageService]
})
export class BasicDoc {
    constructor(private messageService: MessageService) {}

    show() {
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Message Content', life: 3000 });
    }
}
