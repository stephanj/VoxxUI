import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MessageService } from 'voxx-ui/api';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';
import { ToastModule } from 'voxx-ui/toast';
import { ButtonModule } from 'voxx-ui/button';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'life-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, ToastModule, ButtonModule],
    template: `
        <app-docsectiontext>
            <p>A toast disappears after 3000ms by default, set the <i>life</i> option on either the message or toast to override this.</p>
        </app-docsectiontext>
        <div class="card flex justify-center gap-2">
            <vx-toast [life]="10000" />
            <vx-button (click)="showLife()" label="Show Life" />
            <vx-button (click)="showLifeLong()" label="Show Life Long" />
        </div>
        <app-code></app-code>
    `,
    providers: [MessageService]
})
export class LifeDoc {
    constructor(private messageService: MessageService) {}

    showLife() {
        this.messageService.add({ severity: 'info', summary: 'Life', detail: 'I show for 10000ms' });
    }

    showLifeLong() {
        this.messageService.add({ severity: 'info', summary: 'Life', detail: 'I show for 20000ms', life: 20000 });
    }
}
