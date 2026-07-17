import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MessageService } from 'voxx-ui/api';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { FileUploadModule } from 'voxx-ui/fileupload';
import { ToastModule } from 'voxx-ui/toast';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'custom-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText, FileUploadModule, ToastModule],
    template: `
        <app-docsectiontext>
            <p>FileUpload basic <i>mode</i> provides a simpler UI as an alternative to default advanced mode.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <vx-toast></vx-toast>
            <vx-fileupload name="myfile[]" [customUpload]="true" (uploadHandler)="customUploader($event)"></vx-fileupload>
        </div>
        <app-code></app-code>
    `,
    providers: [MessageService]
})
export class CustomDoc {
    constructor(private messageService: MessageService) {}

    async customUploader(event) {
        const file = event.files[0];
        const reader = new FileReader();
        let blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url

        reader.readAsDataURL(blob);

        reader.onloadend = function () {
            const base64data = reader.result;
        };

        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode' });
    }
}
