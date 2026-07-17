import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MessageService } from 'voxx-ui/api';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';
import { ToastModule } from 'voxx-ui/toast';
import { ButtonModule } from 'voxx-ui/button';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'target-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, ToastModule, ButtonModule],
    template: `
        <app-docsectiontext>
            <p>
                A page may have multiple toast components, in case you'd like to target a specific message to a particular toast, use the
                <i>key</i> property so that toast and the message can match.
            </p>
        </app-docsectiontext>
        <div class="card flex justify-center gap-2">
            <vx-toast key="toast1" />
            <vx-toast key="toast2" />
            <vx-button (click)="showToast1()" label="Show Success" />
            <vx-button (click)="showToast2()" label="Show Warning" severity="warn" />
        </div>
        <app-code></app-code>
    `,
    providers: [MessageService]
})
export class TargetDoc {
    constructor(private messageService: MessageService) {}

    showToast1() {
        this.messageService.clear();
        this.messageService.add({ key: 'toast1', severity: 'success', summary: 'Success', detail: 'key: toast1' });
    }

    showToast2() {
        this.messageService.clear();
        this.messageService.add({ key: 'toast2', severity: 'warn', summary: 'Warning', detail: 'key: toast2' });
    }
}
