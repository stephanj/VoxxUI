import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MessageModule } from 'voxx-ui/message';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'message-pt-viewer',
    standalone: true,
    imports: [AppDocPtViewer, MessageModule],
    template: `
        <app-docptviewer [docs]="docs">
            <vx-message [closable]="true" severity="info" icon="pi pi-send">Info Message</vx-message>
        </app-docptviewer>
    `
})
export class PTViewer {
    docs = [
        {
            data: getPTOptions('Message'),
            key: 'Message'
        }
    ];
}
