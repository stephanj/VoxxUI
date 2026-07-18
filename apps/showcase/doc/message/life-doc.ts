import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MessageModule } from 'voxx-ui/message';
import { ButtonModule } from 'voxx-ui/button';
import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'life-doc',
    standalone: true,
    imports: [MessageModule, ButtonModule, AppCodeModule, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>Messages can disappear automatically by defined the <i>life</i> in milliseconds.</p>
        </app-docsectiontext>
        <div class="card flex flex-col items-center justify-center">
            <vx-button label="Show" (onClick)="showMessage()" [disabled]="visible()" styleClass="mb-4" />
            @if (visible()) {
                <vx-message [life]="3000" severity="success">Auto disappear message</vx-message>
            }
        </div>
        <app-code></app-code>
    `
})
export class LifeDoc {
    visible = signal(false);

    showMessage() {
        this.visible.set(true);

        setTimeout(() => {
            this.visible.set(false);
        }, 3000);
    }
}
