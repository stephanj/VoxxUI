import { Component } from '@angular/core';
import { ButtonModule } from 'voxx-ui/button';
import { OverlayModule } from 'voxx-ui/overlay';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'basic-doc',
    standalone: true,
    imports: [ButtonModule, OverlayModule, AppCode, AppDocSectionText],
    template: ` <app-docsectiontext>
            <p>Overlay is a container to display content in an overlay window. All the options mentioned above can be used as props for this component.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <vx-button (click)="toggle()" label="Show Overlay"></vx-button>
            <vx-overlay [(visible)]="overlayVisible" [responsive]="{ breakpoint: '640px', direction: 'bottom', contentStyleClass: 'h-20rem' }" contentStyleClass="p-6 bg-surface-0 dark:bg-surface-900 shadow rounded-border"> Content </vx-overlay>
        </div>
        <app-code></app-code>`
})
export class OverlayBasicDemo {
    overlayVisible: boolean = false;

    toggle() {
        this.overlayVisible = !this.overlayVisible;
    }
}
