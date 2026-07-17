import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MessageService } from 'voxx-ui/api';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';
import { ToastModule } from 'voxx-ui/toast';
import { ButtonModule } from 'voxx-ui/button';
import { Ripple } from 'voxx-ui/ripple';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'position-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, ToastModule, ButtonModule, Ripple],
    template: `
        <app-docsectiontext>
            <p>Location of the toast is customized with the <i>position</i> property. Valid values are <i>top-left</i>, <i>top-center</i>, <i>top-right</i>, <i>bottom-left</i>, <i>bottom-center</i>, <i>bottom-right</i> and <i>center</i>.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <vx-toast position="top-left" key="tl" />
            <vx-toast position="bottom-left" key="bl" />
            <vx-toast position="bottom-right" key="br" />
            <div class="flex flex-wrap gap-2">
                <vx-button vxRipple (click)="showTopLeft()" label="Top Left" />
                <vx-button vxRipple (click)="showBottomLeft()" label="Bottom Left" />
                <vx-button vxRipple (click)="showBottomRight()" label="Bottom Right" />
            </div>
        </div>
        <app-code></app-code>
    `,
    providers: [MessageService]
})
export class PositionDoc {
    constructor(private messageService: MessageService) {}

    showTopLeft() {
        this.messageService.add({
            severity: 'info',
            summary: 'Info Message',
            detail: 'Message Content',
            key: 'tl',
            life: 3000
        });
    }

    showBottomLeft() {
        this.messageService.add({
            severity: 'warn',
            summary: 'Warn Message',
            detail: 'Message Content',
            key: 'bl',
            life: 3000
        });
    }

    showBottomRight() {
        this.messageService.add({
            severity: 'success',
            summary: 'Success Message',
            detail: 'Message Content',
            key: 'br',
            life: 3000
        });
    }
}
