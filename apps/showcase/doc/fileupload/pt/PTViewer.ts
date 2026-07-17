import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FileUploadModule } from 'voxx-ui/fileupload';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'fileupload-pt-viewer',
    standalone: true,
    imports: [CommonModule, AppDocPtViewer, FileUploadModule],
    template: `
        <app-docptviewer [docs]="docs">
            <div class="w-full">
                <vx-fileupload name="demo[]" url="https://www.primefaces.org/cdn/api/upload.php" [multiple]="true" accept="image/*" [maxFileSize]="1000000">
                    <ng-template #empty>
                        <span>Drag and drop files to here to upload.</span>
                    </ng-template>
                </vx-fileupload>
            </div>
        </app-docptviewer>
    `
})
export class PTViewer {
    docs = [
        {
            data: getPTOptions('FileUpload'),
            key: 'FileUpload'
        }
    ];
}
