import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MessageService } from 'voxx-ui/api';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';
import { ToastModule } from 'voxx-ui/toast';
import { ButtonModule } from 'voxx-ui/button';
import { AvatarModule } from 'voxx-ui/avatar';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'template-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, ToastModule, ButtonModule, AvatarModule],
    template: `
        <app-docsectiontext>
            <p>Templating allows customizing the content where the message instance is available as the implicit variable.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <vx-toast position="bottom-center" key="confirm" (onClose)="onReject()" [baseZIndex]="5000">
                <ng-template let-message #message>
                    <div class="flex flex-col items-start flex-auto">
                        <div class="flex items-center gap-2">
                            <vx-avatar image="https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png" shape="circle" />
                            <span class="font-bold">Amy Elsner</span>
                        </div>
                        <div class="font-medium text-lg my-4">{{ message.summary }}</div>
                        <vx-button severity="success" size="small" label="Reply" (click)="onConfirm()" />
                    </div>
                </ng-template>
            </vx-toast>
            <vx-button (click)="showConfirm()" label="View" />
        </div>
        <app-code></app-code>
    `,
    providers: [MessageService]
})
export class TemplateDoc {
    constructor(private messageService: MessageService) {}

    visible: boolean = false;

    onConfirm() {
        this.messageService.clear('confirm');
        this.visible = false;
    }

    onReject() {
        this.messageService.clear('confirm');
        this.visible = false;
    }

    showConfirm() {
        if (!this.visible) {
            this.messageService.add({
                key: 'confirm',
                sticky: true,
                severity: 'success',
                summary: 'Can you send me the report?'
            });
            this.visible = true;
        }
    }
}
