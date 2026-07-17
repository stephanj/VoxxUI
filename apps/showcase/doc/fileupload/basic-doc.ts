import { Component } from '@angular/core';
import { MessageService } from 'voxx-ui/api';
import { FileUploadModule } from 'voxx-ui/fileupload';
import { ToastModule } from 'voxx-ui/toast';
import { ButtonModule } from 'voxx-ui/button';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

interface UploadEvent {
    originalEvent: Event;
    files: File[];
}

@Component({
    selector: 'basic-doc',
    standalone: true,
    imports: [FileUploadModule, ToastModule, ButtonModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>FileUpload basic <i>mode</i> provides a simpler UI as an alternative to default advanced mode.</p>
        </app-docsectiontext>
        <vx-toast />
        <div class="card flex flex-wrap gap-6 items-center justify-between">
            <vx-fileupload #fu mode="basic" chooseLabel="Choose" chooseIcon="pi pi-upload" name="demo[]" url="https://www.primefaces.org/cdn/api/upload.php" accept="image/*" maxFileSize="1000000" (onUpload)="onUpload($event)" />
            <vx-button label="Upload" (onClick)="fu.upload()" severity="secondary" />
        </div>
        <app-code></app-code>
    `,
    providers: [MessageService]
})
export class BasicDoc {
    constructor(private messageService: MessageService) {}

    onUpload(event: UploadEvent) {
        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode' });
    }
}
