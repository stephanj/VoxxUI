import { Component } from '@angular/core';
import { MessageService } from 'voxx-ui/api';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { FileUploadModule } from 'voxx-ui/fileupload';
import { ToastModule } from 'voxx-ui/toast';

interface UploadEvent {
    originalEvent: Event;
    files: File[];
}

@Component({
    selector: 'advanced-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText, FileUploadModule, ToastModule],
    template: `
        <app-docsectiontext>
            <p>Advanced uploader provides dragdrop support, multi file uploads, auto uploading, progress tracking and validations.</p>
        </app-docsectiontext>
        <div class="card">
            <vx-toast />
            <vx-fileupload name="demo[]" url="https://www.primefaces.org/cdn/api/upload.php" (onUpload)="onUpload($event)" [multiple]="true" accept="image/*" maxFileSize="1000000" mode="advanced">
                <ng-template #empty>
                    <div>Drag and drop files to here to upload.</div>
                </ng-template>
            </vx-fileupload>
        </div>
        <app-code></app-code>
    `,
    providers: [MessageService]
})
export class AdvancedDoc {
    uploadedFiles: any[] = [];

    constructor(private messageService: MessageService) {}

    onUpload(event: UploadEvent) {
        for (let file of event.files) {
            this.uploadedFiles.push(file);
        }

        this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
    }
}
