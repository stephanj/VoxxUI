import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders } from '@angular/common/http';
import {
    DestroyRef,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild,
    contentChildren,
    ElementRef,
    inject,
    InjectionToken,
    input,
    linkedSignal,
    NgModule,
    NgZone,
    numberAttribute,
    output,
    TemplateRef,
    untracked,
    viewChild,
    ViewEncapsulation
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer } from '@angular/platform-browser';
import { addClass, removeClass } from '@primeuix/utils';
import { BlockableUI, PrimeTemplate, SharedModule, TranslationKeys } from 'voxx-ui/api';
import { Badge } from 'voxx-ui/badge';
import { BaseComponent, PARENT_INSTANCE } from 'voxx-ui/basecomponent';
import { Bind } from 'voxx-ui/bind';
import { Button, ButtonProps } from 'voxx-ui/button';
import { PlusIcon, TimesIcon, UploadIcon } from 'voxx-ui/icons';
import { Message } from 'voxx-ui/message';
import { ProgressBar } from 'voxx-ui/progressbar';
import { VoidListener } from 'voxx-ui/ts-helpers';
import {
    FileBeforeUploadEvent,
    FileProgressEvent,
    FileRemoveEvent,
    FileSelectEvent,
    FileSendEvent,
    FileUploadContentTemplateContext,
    FileUploadErrorEvent,
    FileUploadEvent,
    FileUploadFileLabelTemplateContext,
    FileUploadHandlerEvent,
    FileUploadHeaderTemplateContext,
    FileUploadPassThrough,
    RemoveUploadedFileEvent
} from 'voxx-ui/types/fileupload';
import { FileUploadStyle } from './style/fileuploadstyle';

const FILEUPLOAD_INSTANCE = new InjectionToken<FileUpload>('FILEUPLOAD_INSTANCE');

@Component({
    selector: '[vxFileContent]',
    template: `@for (file of files(); track file?.name + '-' + $index; let index = $index) {
        <div [class]="cx('file')" [vxBind]="$pcFileUpload.ptm('file')">
            <img role="presentation" [class]="cx('fileThumbnail')" [attr.alt]="file.name" [src]="file.objectURL" [width]="previewWidth()" [vxBind]="$pcFileUpload.ptm('fileThumbnail')" />
            <div [class]="cx('fileInfo')" [vxBind]="$pcFileUpload.ptm('fileInfo')">
                <div [class]="cx('fileName')" [vxBind]="$pcFileUpload.ptm('fileName')">{{ file.name }}</div>
                <span [class]="cx('fileSize')" [vxBind]="$pcFileUpload.ptm('fileSize')">{{ formatSize(file.size) }}</span>
            </div>
            <vx-badge [value]="badgeValue()" [severity]="badgeSeverity()" [class]="cx('pcFileBadge')" [pt]="$pcFileUpload.ptm('pcFileBadge')" [unstyled]="unstyled()" />
            <div [class]="cx('fileActions')" [vxBind]="$pcFileUpload.ptm('fileActions')">
                <vx-button (onClick)="onRemoveClick($event, index)" [styleClass]="cx('pcFileRemoveButton')" text rounded severity="danger" [pt]="$pcFileUpload.ptm('pcFileRemoveButton')" [unstyled]="unstyled()">
                    <ng-template #icon let-iconClass="class">
                        @if (fileRemoveIconTemplate()) {
                            <ng-template *ngTemplateOutlet="fileRemoveIconTemplate(); context: { class: iconClass, file: file, index: index }"></ng-template>
                        } @else {
                            <svg data-p-icon="times" [class]="iconClass" [attr.aria-hidden]="true" />
                        }
                    </ng-template>
                </vx-button>
            </div>
        </div>
    }`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [FileUploadStyle],
    imports: [CommonModule, Badge, Button, TimesIcon, Bind]
})
export class FileContent extends BaseComponent {
    _componentStyle = inject(FileUploadStyle);

    $pcFileUpload = inject(FILEUPLOAD_INSTANCE);

    onRemove = output<any>();

    files = input<any>();

    badgeSeverity = input<'secondary' | 'info' | 'success' | 'warn' | 'danger' | 'contrast'>('warn');

    badgeValue = input<string>();

    previewWidth = input<number>(50);

    fileRemoveIconTemplate = input<any>();

    onRemoveClick(event: any, index: number) {
        this.onRemove.emit({ event, index });
    }

    formatSize(bytes: number) {
        const k = 1024;
        const dm = 3;
        const sizes = this.config.getTranslation(TranslationKeys.FILE_SIZE_TYPES);

        if (bytes === 0) {
            return `0 ${sizes[0]}`;
        }

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        const formattedSize = (bytes / Math.pow(k, i)).toFixed(dm);

        return `${formattedSize} ${sizes[i]}`;
    }
}
/**
 * FileUpload is an advanced uploader with dragdrop support, multi file uploads, auto uploading, progress tracking and validations.
 * @group Components
 */
@Component({
    selector: 'vx-fileupload, vx-fileUpload',
    imports: [CommonModule, Button, ProgressBar, Message, PlusIcon, UploadIcon, TimesIcon, SharedModule, FileContent, Bind],
    template: `
        @if (mode() === 'advanced') {
            <div [class]="cn(cx('root'), styleClass())" [style]="style()" [vxBind]="ptm('root')">
                <input
                    [attr.aria-label]="browseFilesLabel"
                    #advancedfileinput
                    type="file"
                    (change)="onFileSelect($event)"
                    [multiple]="multiple()"
                    [accept]="accept()"
                    [disabled]="disabled() || isChooseDisabled()"
                    [attr.title]="''"
                    [vxBind]="ptm('input')"
                />
                <div [class]="cx('header')" [vxBind]="ptm('header')">
                    @if (!headerTemplate() && !_headerTemplate()) {
                        <vx-button
                            [styleClass]="cn(cx('pcChooseButton'), chooseStyleClass())"
                            [disabled]="disabled() || isChooseDisabled()"
                            (focus)="onFocus()"
                            [label]="chooseButtonLabel"
                            (blur)="onBlur()"
                            (onClick)="choose()"
                            (keydown.enter)="choose()"
                            [buttonProps]="chooseButtonProps()"
                            [pt]="ptm('pcChooseButton')"
                            [unstyled]="unstyled()"
                        >
                            <input
                                [attr.aria-label]="browseFilesLabel"
                                #advancedfileinput
                                type="file"
                                (change)="onFileSelect($event)"
                                [multiple]="multiple()"
                                [accept]="accept()"
                                [disabled]="disabled() || isChooseDisabled()"
                                [attr.title]="''"
                                [vxBind]="ptm('input')"
                            />
                            <ng-template #icon>
                                @if (chooseIcon()) {
                                    <span [class]="chooseIcon()" [attr.aria-label]="true" [vxBind]="ptm('pcChooseButton')?.icon"></span>
                                }
                                @if (!chooseIcon()) {
                                    @if (!chooseIconTemplate() && !_chooseIconTemplate()) {
                                        <svg data-p-icon="plus" [attr.aria-label]="true" [vxBind]="ptm('pcChooseButton')?.icon" />
                                    }
                                    @if (chooseIconTemplate() || _chooseIconTemplate()) {
                                        <span [attr.aria-label]="true" [vxBind]="ptm('pcChooseButton')?.icon">
                                            <ng-template *ngTemplateOutlet="chooseIconTemplate() || _chooseIconTemplate()"></ng-template>
                                        </span>
                                    }
                                }
                            </ng-template>
                        </vx-button>
                        @if (!auto() && showUploadButton()) {
                            <vx-button
                                [label]="uploadButtonLabel"
                                (onClick)="upload()"
                                [disabled]="!hasFiles() || isFileLimitExceeded()"
                                [styleClass]="cn(cx('pcUploadButton'), uploadStyleClass())"
                                [buttonProps]="uploadButtonProps()"
                                [pt]="ptm('pcUploadButton')"
                                [unstyled]="unstyled()"
                            >
                                <ng-template #icon>
                                    @if (uploadIcon()) {
                                        <span [class]="uploadIcon()" [attr.aria-hidden]="true" [vxBind]="ptm('pcUploadButton')?.icon"></span>
                                    }
                                    @if (!uploadIcon()) {
                                        @if (!uploadIconTemplate() && !_uploadIconTemplate()) {
                                            <svg data-p-icon="upload" [vxBind]="ptm('pcUploadButton')?.icon" />
                                        }
                                        @if (uploadIconTemplate() || _uploadIconTemplate()) {
                                            <span [attr.aria-hidden]="true" [vxBind]="ptm('pcUploadButton')?.icon">
                                                <ng-template *ngTemplateOutlet="uploadIconTemplate() || _uploadIconTemplate()"></ng-template>
                                            </span>
                                        }
                                    }
                                </ng-template>
                            </vx-button>
                        }
                        @if (!auto() && showCancelButton()) {
                            <vx-button
                                [label]="cancelButtonLabel"
                                (onClick)="clear()"
                                [disabled]="!hasFiles() || uploading"
                                [styleClass]="cn(cx('pcCancelButton'), cancelStyleClass())"
                                [buttonProps]="cancelButtonProps()"
                                [pt]="ptm('pcCancelButton')"
                                [unstyled]="unstyled()"
                            >
                                <ng-template #icon>
                                    @if (cancelIcon()) {
                                        <span [class]="cancelIcon()"></span>
                                    }
                                    @if (!cancelIcon()) {
                                        @if (!cancelIconTemplate() && !_cancelIconTemplate()) {
                                            <svg data-p-icon="times" [attr.aria-hidden]="true" />
                                        }
                                        @if (cancelIconTemplate() || _cancelIconTemplate()) {
                                            <span [attr.aria-hidden]="true">
                                                <ng-template *ngTemplateOutlet="cancelIconTemplate() || _cancelIconTemplate()"></ng-template>
                                            </span>
                                        }
                                    }
                                </ng-template>
                            </vx-button>
                        }
                    }
                    <ng-container
                        *ngTemplateOutlet="
                            headerTemplate() || _headerTemplate();
                            context: {
                                $implicit: files(),
                                uploadedFiles: uploadedFiles,
                                chooseCallback: choose.bind(this),
                                clearCallback: clear.bind(this),
                                uploadCallback: upload.bind(this)
                            }
                        "
                    ></ng-container>
                    <ng-container *ngTemplateOutlet="toolbarTemplate() || _toolbarTemplate()"></ng-container>
                </div>
                <div #content [class]="cx('content')" (dragenter)="onDragEnter($event)" (dragleave)="onDragLeave($event)" (drop)="onDrop($event)" [vxBind]="ptm('content')">
                    @if (contentTemplate() || _contentTemplate()) {
                        <ng-container
                            *ngTemplateOutlet="
                                contentTemplate() || _contentTemplate();
                                context: {
                                    $implicit: files(),
                                    uploadedFiles: uploadedFiles,
                                    chooseCallback: choose.bind(this),
                                    clearCallback: clear.bind(this),
                                    removeUploadedFileCallback: removeUploadedFile.bind(this),
                                    removeFileCallback: remove.bind(this),
                                    progress: progress,
                                    messages: msgs
                                }
                            "
                        ></ng-container>
                    } @else {
                        @if (hasFiles()) {
                            <vx-progressbar [value]="progress" [showValue]="false" [pt]="ptm('pcProgressBar')"></vx-progressbar>
                        }
                        @for (message of msgs; track message) {
                            <vx-message [severity]="message.severity" [text]="message.text" [pt]="ptm('pcMessage')" [unstyled]="unstyled()"></vx-message>
                        }
                        @if (hasFiles()) {
                            <div [class]="cx('fileList')" [vxBind]="ptm('fileList')">
                                @for (file of files(); track file) {
                                    <ng-container *ngTemplateOutlet="fileTemplate() || _fileTemplate(); context: { $implicit: file, index: $index, count: $count, first: $first, last: $last, even: $even, odd: $odd }"></ng-container>
                                }
                                @if (!fileTemplate() && !_fileTemplate()) {
                                    <div
                                        vxFileContent
                                        [unstyled]="unstyled()"
                                        [files]="files()"
                                        (onRemove)="onRemoveClick($event)"
                                        [badgeValue]="pendingLabel"
                                        [previewWidth]="previewWidth()"
                                        [fileRemoveIconTemplate]="cancelIconTemplate() || _cancelIconTemplate()"
                                    ></div>
                                }
                            </div>
                        }
                        @if (hasUploadedFiles()) {
                            <div [class]="cx('fileList')" [vxBind]="ptm('fileList')">
                                @for (file of uploadedFiles; track file) {
                                    <ng-container *ngTemplateOutlet="fileTemplate() || _fileTemplate(); context: { $implicit: file, index: $index, count: $count, first: $first, last: $last, even: $even, odd: $odd }"></ng-container>
                                }
                                @if (!fileTemplate() && !_fileTemplate()) {
                                    <div
                                        vxFileContent
                                        [unstyled]="unstyled()"
                                        [files]="uploadedFiles"
                                        (onRemove)="onRemoveUploadedFileClick($event)"
                                        [badgeValue]="completedLabel()"
                                        badgeSeverity="success"
                                        [previewWidth]="previewWidth()"
                                        [fileRemoveIconTemplate]="cancelIconTemplate() || _cancelIconTemplate()"
                                    ></div>
                                }
                            </div>
                        }
                    }
                    @if ((emptyTemplate() || _emptyTemplate()) && !hasFiles() && !hasUploadedFiles()) {
                        <ng-container *ngTemplateOutlet="emptyTemplate() || _emptyTemplate()" [vxBind]="ptm('empty')"></ng-container>
                    }
                </div>
            </div>
        }
        @if (mode() === 'basic') {
            <div [class]="cn(cx('root'), styleClass())" [vxBind]="ptm('root')">
                @for (message of msgs; track message) {
                    <vx-message [severity]="message.severity" [text]="message.text" [pt]="ptm('pcMessage')" [unstyled]="unstyled()"></vx-message>
                }
                <div [class]="cx('basicContent')" [vxBind]="ptm('basicContent')">
                    <vx-button
                        [styleClass]="cn(cx('pcChooseButton'), chooseStyleClass())"
                        [disabled]="disabled()"
                        [label]="chooseButtonLabel"
                        [style]="style()"
                        (onClick)="onBasicUploaderClick()"
                        (keydown)="onBasicKeydown($event)"
                        [buttonProps]="chooseButtonProps()"
                        [pt]="ptm('pcChooseButton')"
                        [unstyled]="unstyled()"
                    >
                        <ng-template #icon>
                            @if (hasFiles() && !auto()) {
                                @if (uploadIcon()) {
                                    <span class="p-button-icon p-button-icon-left" [class]="uploadIcon()" [vxBind]="ptm('pcChooseButton')?.icon"></span>
                                }
                                @if (!uploadIcon()) {
                                    @if (!uploadIconTemplate() && !_uploadIconTemplate()) {
                                        <svg data-p-icon="upload" [class]="'p-button-icon p-button-icon-left'" [vxBind]="ptm('pcChooseButton')?.icon" />
                                    }
                                    @if (_uploadIconTemplate() || uploadIconTemplate()) {
                                        <span class="p-button-icon p-button-icon-left" [vxBind]="ptm('pcChooseButton')?.icon">
                                            <ng-template *ngTemplateOutlet="_uploadIconTemplate() || uploadIconTemplate()"></ng-template>
                                        </span>
                                    }
                                }
                            } @else {
                                @if (chooseIcon()) {
                                    <span class="p-button-icon p-button-icon-left pi" [class]="chooseIcon()" [vxBind]="ptm('pcChooseButton')?.icon"></span>
                                }
                                @if (!chooseIcon()) {
                                    @if (!chooseIconTemplate() && !_chooseIconTemplate()) {
                                        <svg data-p-icon="plus" [vxBind]="ptm('pcChooseButton')?.icon" />
                                    }
                                    <ng-template *ngTemplateOutlet="chooseIconTemplate() || _chooseIconTemplate()"></ng-template>
                                }
                            }
                        </ng-template>
                        <input
                            [attr.aria-label]="browseFilesLabel"
                            #basicfileinput
                            type="file"
                            [accept]="accept()"
                            [multiple]="multiple()"
                            [disabled]="disabled()"
                            (change)="onFileSelect($event)"
                            (focus)="onFocus()"
                            (blur)="onBlur()"
                            [vxBind]="ptm('input')"
                        />
                    </vx-button>
                    @if (!auto()) {
                        @if (!fileLabelTemplate() && !_fileLabelTemplate()) {
                            <span>
                                {{ basicFileChosenLabel() }}
                            </span>
                        } @else {
                            <ng-container *ngTemplateOutlet="fileLabelTemplate() || _fileLabelTemplate(); context: { $implicit: files() }"></ng-container>
                        }
                    }
                </div>
            </div>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [FileUploadStyle, { provide: FILEUPLOAD_INSTANCE, useExisting: FileUpload }, { provide: PARENT_INSTANCE, useExisting: FileUpload }],
    hostDirectives: [Bind]
})
export class FileUpload extends BaseComponent<FileUploadPassThrough> implements BlockableUI {
    componentName = 'FileUpload';

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptm('host'));
    }

    /**
     * Name of the request parameter to identify the files at backend.
     * @group Props
     */
    name = input<string>();
    /**
     * Remote url to upload the files.
     * @group Props
     */
    url = input<string>();
    /**
     * HTTP method to send the files to the url such as "post" and "put".
     * @group Props
     */
    method = input<'post' | 'put' | undefined>('post');
    /**
     * Used to select multiple files at once from file dialog.
     * @group Props
     */
    multiple = input(undefined, { transform: booleanAttribute });
    /**
     * Comma-separated list of pattern to restrict the allowed file types. Can be any combination of either the MIME types (such as "image/*") or the file extensions (such as ".jpg").
     * @group Props
     */
    accept = input<string>();
    /**
     * Disables the upload functionality.
     * @group Props
     */
    disabled = input(undefined, { transform: booleanAttribute });
    /**
     * When enabled, upload begins automatically after selection is completed.
     * @group Props
     */
    auto = input(undefined, { transform: booleanAttribute });
    /**
     * Cross-site Access-Control requests should be made using credentials such as cookies, authorization headers or TLS client certificates.
     * @group Props
     */
    withCredentials = input(undefined, { transform: booleanAttribute });
    /**
     * Maximum file size allowed in bytes.
     * @group Props
     */
    maxFileSize = input(undefined, { transform: numberAttribute });
    /**
     * Summary message of the invalid file size.
     * @group Props
     */
    invalidFileSizeMessageSummary = input<string>('{0}: Invalid file size, ');
    /**
     * Detail message of the invalid file size.
     * @group Props
     */
    invalidFileSizeMessageDetail = input<string>('maximum upload size is {0}.');
    /**
     * Summary message of the invalid file type.
     * @group Props
     */
    invalidFileTypeMessageSummary = input<string>('{0}: Invalid file type, ');
    /**
     * Detail message of the invalid file type.
     * @group Props
     */
    invalidFileTypeMessageDetail = input<string>('allowed file types: {0}.');
    /**
     * Detail message of the invalid file type.
     * @group Props
     */
    invalidFileLimitMessageDetail = input<string>('limit is {0} at most.');
    /**
     * Summary message of the invalid file type.
     * @group Props
     */
    invalidFileLimitMessageSummary = input<string>('Maximum number of files exceeded, ');
    /**
     * Inline style of the element.
     * @group Props
     */
    style = input<{ [klass: string]: any } | null | undefined>();
    /**
     * Class of the element.
     * @group Props
     */
    styleClass = input<string>();
    /**
     * Width of the image thumbnail in pixels.
     * @group Props
     */
    previewWidth = input(50, { transform: numberAttribute });
    /**
     * Label of the choose button. Defaults to VoxxUI Locale configuration.
     * @group Props
     */
    chooseLabel = input<string>();
    /**
     * Label of the upload button. Defaults to VoxxUI Locale configuration.
     * @group Props
     */
    uploadLabel = input<string>();
    /**
     * Label of the cancel button. Defaults to VoxxUI Locale configuration.
     * @group Props
     */
    cancelLabel = input<string>();
    /**
     * Icon of the choose button.
     * @group Props
     */
    chooseIcon = input<string>();
    /**
     * Icon of the upload button.
     * @group Props
     */
    uploadIcon = input<string>();
    /**
     * Icon of the cancel button.
     * @group Props
     */
    cancelIcon = input<string>();
    /**
     * Whether to show the upload button.
     * @group Props
     */
    showUploadButton = input(true, { transform: booleanAttribute });
    /**
     * Whether to show the cancel button.
     * @group Props
     */
    showCancelButton = input(true, { transform: booleanAttribute });
    /**
     * Defines the UI of the component.
     * @group Props
     */
    mode = input<'advanced' | 'basic' | undefined>('advanced');
    /**
     * HttpHeaders class represents the header configuration options for an HTTP request.
     * @group Props
     */
    headers = input<HttpHeaders>();
    /**
     * Whether to use the default upload or a manual implementation defined in uploadHandler callback. Defaults to VoxxUI Locale configuration.
     * @group Props
     */
    customUpload = input(undefined, { transform: booleanAttribute });
    /**
     * Maximum number of files that can be uploaded.
     * @group Props
     */
    fileLimit = input(undefined, { transform: (value: unknown) => numberAttribute(value, undefined) });
    /**
     * Style class of the upload button.
     * @group Props
     */
    uploadStyleClass = input<string>();
    /**
     * Style class of the cancel button.
     * @group Props
     */
    cancelStyleClass = input<string>();
    /**
     * Style class of the remove button.
     * @group Props
     */
    removeStyleClass = input<string>();
    /**
     * Style class of the choose button.
     * @group Props
     */
    chooseStyleClass = input<string>();
    /**
     * Used to pass all properties of the ButtonProps to the choose button inside the component.
     * @group Props
     */
    chooseButtonProps = input<ButtonProps>(undefined!);
    /**
     * Used to pass all properties of the ButtonProps to the upload button inside the component.
     * @group Props
     */
    uploadButtonProps = input<ButtonProps>({ severity: 'secondary' });
    /**
     * Used to pass all properties of the ButtonProps to the cancel button inside the component.
     * @group Props
     */
    cancelButtonProps = input<ButtonProps>({ severity: 'secondary' });
    /**
     * Callback to invoke before file upload is initialized.
     * @param {FileBeforeUploadEvent} event - Custom upload event.
     * @group Emits
     */
    onBeforeUpload = output<FileBeforeUploadEvent>();
    /**
     * An event indicating that the request was sent to the server. Useful when a request may be retried multiple times, to distinguish between retries on the final event stream.
     * @param {FileSendEvent} event - Custom send event.
     * @group Emits
     */
    onSend = output<FileSendEvent>();
    /**
     * Callback to invoke when file upload is complete.
     * @param {FileUploadEvent} event - Custom upload event.
     * @group Emits
     */
    onUpload = output<FileUploadEvent>();
    /**
     * Callback to invoke if file upload fails.
     * @param {FileUploadErrorEvent} event - Custom error event.
     * @group Emits
     */
    onError = output<FileUploadErrorEvent>();
    /**
     * Callback to invoke when files in queue are removed without uploading using clear all button.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    onClear = output<Event | undefined>();
    /**
     * Callback to invoke when a file is removed without uploading using clear button of a file.
     * @param {FileRemoveEvent} event - Remove event.
     * @group Emits
     */
    onRemove = output<FileRemoveEvent>();
    /**
     * Callback to invoke when files are selected.
     * @param {FileSelectEvent} event - Select event.
     * @group Emits
     */
    onSelect = output<FileSelectEvent>();
    /**
     * Callback to invoke when files are being uploaded.
     * @param {FileProgressEvent} event - Progress event.
     * @group Emits
     */
    onProgress = output<FileProgressEvent>();
    /**
     * Callback to invoke in custom upload mode to upload the files manually.
     * @param {FileUploadHandlerEvent} event - Upload handler event.
     * @group Emits
     */
    uploadHandler = output<FileUploadHandlerEvent>();
    /**
     * This event is triggered if an error occurs while loading an image file.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    onImageError = output<Event>();
    /**
     * This event is triggered if an error occurs while loading an image file.
     * @param {RemoveUploadedFileEvent} event - Remove event.
     * @group Emits
     */
    onRemoveUploadedFile = output<RemoveUploadedFileEvent>();

    /**
     * Custom file template.
     * @group Templates
     */
    fileTemplate = contentChild<TemplateRef<any>>('file', { descendants: false });

    /**
     * Custom header template.
     * @param {FileUploadHeaderTemplateContext} context - header template context.
     * @group Templates
     */
    headerTemplate = contentChild<TemplateRef<FileUploadHeaderTemplateContext>>('header', { descendants: false });

    /**
     * Custom content template.
     * @param {FileUploadContentTemplateContext} context - content template context.
     * @group Templates
     */
    contentTemplate = contentChild<TemplateRef<FileUploadContentTemplateContext>>('content', { descendants: false });

    /**
     * Custom toolbar template.
     * @group Templates
     */
    toolbarTemplate = contentChild<TemplateRef<void>>('toolbar', { descendants: false });

    /**
     * Custom choose icon template.
     * @group Templates
     */
    chooseIconTemplate = contentChild<TemplateRef<void>>('chooseicon', { descendants: false });

    /**
     * Custom file label template.
     * @param {FileUploadFileLabelTemplateContext} context - file label template context.
     * @group Templates
     */
    fileLabelTemplate = contentChild<TemplateRef<FileUploadFileLabelTemplateContext>>('filelabel', { descendants: false });

    /**
     * Custom upload icon template.
     * @group Templates
     */
    uploadIconTemplate = contentChild<TemplateRef<void>>('uploadicon', { descendants: false });

    /**
     * Custom cancel icon template.
     * @group Templates
     */
    cancelIconTemplate = contentChild<TemplateRef<void>>('cancelicon', { descendants: false });

    /**
     * Custom empty state template.
     * @group Templates
     */
    emptyTemplate = contentChild<TemplateRef<void>>('empty', { descendants: false });

    advancedFileInput = viewChild<ElementRef>('advancedfileinput');

    basicFileInput = viewChild<ElementRef>('basicfileinput');

    content = viewChild<ElementRef>('content');

    /**
     * List of files to preset on the component. Incoming files are validated and object URLs are
     * created for image previews, mirroring the original `files` input setter.
     * @group Props
     */
    filesInput = input<File[] | undefined>(undefined, { alias: 'files' });

    /**
     * The current list of files — component state seeded from the `files` input.
     *
     * This replaces the previous `files` getter/setter pair with an equivalent callable API:
     * `files()` returns the internal file array (the previous `get files()`), and a write to the
     * `files` input re-runs the original setter logic (validation + `objectURL` creation for
     * images) through the `linkedSignal` computation. Programmatic writes (`files.set(...)`)
     * replace the internal state directly without input validation, matching the internal
     * mutation semantics of select/remove/clear.
     */
    files = linkedSignal<File[] | undefined, File[]>({
        source: this.filesInput,
        computation: (incomingFiles) => untracked(() => this.assignInputFiles(incomingFiles))
    });

    /**
     * Mirrors the original `files` input setter: keeps only valid files and creates object URLs
     * for image previews. Runs untracked so that validation (which reads other inputs and pushes
     * messages to `msgs`) does not register reactive dependencies beyond the `files` input.
     */
    private assignInputFiles(incomingFiles: File[] | undefined): File[] {
        const files: File[] = [];

        if (incomingFiles) {
            for (let i = 0; i < incomingFiles.length; i++) {
                const file = incomingFiles[i];

                if (this.validate(file)) {
                    if (this.isImage(file)) {
                        (<any>file).objectURL = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(incomingFiles[i]));
                    }

                    files.push(incomingFiles[i]);
                }
            }
        }

        return files;
    }

    public get basicButtonLabel(): string {
        if (this.auto() || !this.hasFiles()) {
            return this.chooseLabel() as string;
        }

        return this.uploadLabel() ?? this.files()[0].name;
    }

    public progress: number = 0;

    public dragHighlight: boolean | undefined;

    public msgs: any[] | undefined;

    public uploadedFileCount: number = 0;

    focus: boolean | undefined;

    uploading: boolean | undefined;

    duplicateIEEvent: boolean | undefined; // flag to recognize duplicate onchange event for file input

    dragOverListener: VoidListener;

    public uploadedFiles: File[] = [];

    sanitizer: DomSanitizer = inject(DomSanitizer);

    zone: NgZone = inject(NgZone);

    http: HttpClient = inject(HttpClient);

    destroyRef = inject(DestroyRef);

    _componentStyle = inject(FileUploadStyle);

    onInit() {
        this.config.translationObserver.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.cd.markForCheck();
        });
    }

    onAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.mode() === 'advanced') {
                this.zone.runOutsideAngular(() => {
                    const content = this.content();

                    if (content) {
                        this.dragOverListener = this.renderer.listen(content.nativeElement, 'dragover', this.onDragOver.bind(this));
                    }
                });
            }
        }
    }

    templates = contentChildren(PrimeTemplate);

    /**
     * Map of the `vxTemplate`-declared templates, keyed by template type. Unknown types fall
     * back to the `file` key, matching the pre-signal `ngAfterContentInit` behavior.
     */
    private _templateMap = computed(() => {
        const map: Record<string, TemplateRef<any> | undefined> = {};

        for (const item of this.templates()) {
            const type = item.getType();

            switch (type) {
                case 'header':
                case 'file':
                case 'content':
                case 'toolbar':
                case 'chooseicon':
                case 'uploadicon':
                case 'cancelicon':
                case 'empty':
                case 'filelabel':
                    map[type] = item.template;
                    break;

                default:
                    map['file'] = item.template;
                    break;
            }
        }

        return map;
    });

    _headerTemplate = computed(() => this._templateMap()['header'] as TemplateRef<FileUploadHeaderTemplateContext> | undefined);

    _contentTemplate = computed(() => this._templateMap()['content'] as TemplateRef<FileUploadContentTemplateContext> | undefined);

    _toolbarTemplate = computed(() => this._templateMap()['toolbar'] as TemplateRef<void> | undefined);

    _chooseIconTemplate = computed(() => this._templateMap()['chooseicon'] as TemplateRef<void> | undefined);

    _uploadIconTemplate = computed(() => this._templateMap()['uploadicon'] as TemplateRef<void> | undefined);

    _cancelIconTemplate = computed(() => this._templateMap()['cancelicon'] as TemplateRef<void> | undefined);

    _emptyTemplate = computed(() => this._templateMap()['empty'] as TemplateRef<void> | undefined);

    _fileTemplate = computed(() => this._templateMap()['file'] as TemplateRef<any> | undefined);

    _fileLabelTemplate = computed(() => this._templateMap()['filelabel'] as TemplateRef<FileUploadFileLabelTemplateContext> | undefined);

    basicFileChosenLabel() {
        if (this.auto()) return this.chooseButtonLabel;
        else if (this.hasFiles()) {
            if (this.files() && this.files().length === 1) return this.files()[0].name;

            return this.config.getTranslation('fileChosenMessage')?.replace('{0}', this.files().length);
        }

        return this.config.getTranslation('noFileChosenMessage') || '';
    }

    completedLabel() {
        return this.config.getTranslation('completed') || '';
    }

    getTranslation(option: string) {
        return this.config.getTranslation(option);
    }

    choose() {
        this.advancedFileInput()?.nativeElement.click();
    }

    onFileSelect(event: any) {
        if (event.type !== 'drop' && this.isIE11() && this.duplicateIEEvent) {
            this.duplicateIEEvent = false;
            return;
        }

        this.msgs = [];
        const currentFiles = this.multiple() ? [...this.files()] : [];
        let files = event.dataTransfer ? event.dataTransfer.files : event.target.files;

        for (let i = 0; i < files.length; i++) {
            let file = files[i];

            if (!this.isFileSelected(file, currentFiles)) {
                if (this.validate(file)) {
                    if (this.isImage(file)) {
                        file.objectURL = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(files[i]));
                    }

                    currentFiles.push(files[i]);
                }
            }
        }

        this.files.set(currentFiles);

        this.onSelect.emit({ originalEvent: event, files: files, currentFiles: this.files() });

        // this will check the fileLimit with the uploaded files
        this.checkFileLimit(files);

        if (this.hasFiles() && this.auto() && (this.mode() !== 'advanced' || !this.isFileLimitExceeded())) {
            this.upload();
        }

        if (event.type !== 'drop' && this.isIE11()) {
            this.clearIEInput();
        } else {
            this.clearInputElement();
        }
    }

    isFileSelected(file: File, files: File[] = this.files()): boolean {
        for (let sFile of files) {
            if (sFile.name + sFile.type + sFile.size === file.name + file.type + file.size) {
                return true;
            }
        }

        return false;
    }

    isIE11() {
        if (isPlatformBrowser(this.platformId)) {
            return !!(this.document.defaultView as any)['MSInputMethodContext'] && !!(this.document as any)['documentMode'];
        }
    }

    validate(file: File): boolean {
        this.msgs = this.msgs || [];
        const accept = this.accept();
        const maxFileSize = this.maxFileSize();

        if (accept && !this.isFileTypeValid(file)) {
            const text = `${this.invalidFileTypeMessageSummary().replace('{0}', file.name)} ${this.invalidFileTypeMessageDetail().replace('{0}', accept)}`;
            this.msgs.push({
                severity: 'error',
                text: text
            });
            return false;
        }

        if (maxFileSize && file.size > maxFileSize) {
            const text = `${this.invalidFileSizeMessageSummary().replace('{0}', file.name)} ${this.invalidFileSizeMessageDetail().replace('{0}', this.formatSize(maxFileSize))}`;
            this.msgs.push({
                severity: 'error',
                text: text
            });
            return false;
        }

        return true;
    }

    private isFileTypeValid(file: File): boolean {
        let acceptableTypes = this.accept()
            ?.split(',')
            .map((type) => type.trim());
        for (let type of acceptableTypes!) {
            let acceptable = this.isWildcard(type) ? this.getTypeClass(file.type) === this.getTypeClass(type) : file.type == type || this.getFileExtension(file).toLowerCase() === type.toLowerCase();

            if (acceptable) {
                return true;
            }
        }

        return false;
    }

    getTypeClass(fileType: string): string {
        return fileType.substring(0, fileType.indexOf('/'));
    }

    isWildcard(fileType: string): boolean {
        return fileType.indexOf('*') !== -1;
    }

    getFileExtension(file: File): string {
        return '.' + file.name.split('.').pop();
    }

    isImage(file: File): boolean {
        return /^image\//.test(file.type);
    }

    onImageLoad(img: any) {
        window.URL.revokeObjectURL(img.src);
    }
    /**
     * Uploads the selected files.
     * @group Method
     */
    uploader() {
        if (this.customUpload()) {
            if (this.fileLimit()) {
                this.uploadedFileCount += this.files().length;
            }

            this.uploadHandler.emit({
                files: this.files()
            });

            this.cd.markForCheck();
        } else {
            this.uploading = true;
            this.msgs = [];
            let formData = new FormData();

            this.onBeforeUpload.emit({
                formData: formData
            });

            const files = this.files();

            for (let i = 0; i < files.length; i++) {
                formData.append(this.name()!, files[i], files[i].name);
            }

            this.http
                .request(<string>this.method(), this.url() as string, {
                    body: formData,
                    headers: this.headers(),
                    reportProgress: true,
                    observe: 'events',
                    withCredentials: this.withCredentials()
                })
                .subscribe(
                    (event: HttpEvent<any>) => {
                        switch (event.type) {
                            case HttpEventType.Sent:
                                this.onSend.emit({
                                    originalEvent: event,
                                    formData: formData
                                });
                                break;
                            case HttpEventType.Response:
                                this.uploading = false;
                                this.progress = 0;

                                if (event['status'] >= 200 && event['status'] < 300) {
                                    if (this.fileLimit()) {
                                        this.uploadedFileCount += this.files().length;
                                    }

                                    this.onUpload.emit({ originalEvent: event, files: this.files() });
                                } else {
                                    this.onError.emit({ files: this.files() });
                                }
                                this.uploadedFiles = [...this.uploadedFiles, ...this.files()];
                                this.clear();
                                break;
                            case HttpEventType.UploadProgress: {
                                if (event['loaded']) {
                                    this.progress = Math.round((event['loaded'] * 100) / event['total']!);
                                }

                                this.onProgress.emit({ originalEvent: event, progress: this.progress });
                                break;
                            }
                        }

                        this.cd.markForCheck();
                    },
                    (error: ErrorEvent) => {
                        this.uploading = false;
                        this.onError.emit({ files: this.files(), error: error });
                    }
                );
        }
    }
    onRemoveClick(e: any) {
        const { event, index } = e;
        if (this.hasFiles()) {
            this.remove(event, index);
        }
    }
    onRemoveUploadedFileClick(e: any) {
        const { index } = e;
        if (this.hasUploadedFiles()) {
            this.removeUploadedFile(index);
        }
    }
    /**
     * Clears the files list.
     * @group Method
     */
    clear() {
        this.files.set([]);
        this.onClear.emit(undefined);
        this.clearInputElement();
        this.msgs = [];
        this.cd.markForCheck();
    }
    /**
     * Removes a single file.
     * @param {Event} event - Browser event.
     * @param {Number} index - Index of the file.
     * @group Method
     */
    remove(event: Event, index: number) {
        this.clearInputElement();
        this.onRemove.emit({ originalEvent: event, file: this.files()[index] });
        this.files.update((files) => files.filter((_, i) => i !== index));
        this.checkFileLimit(this.files());
    }
    /**
     * Removes uploaded file.
     * @param {Number} index - Index of the file to be removed.
     * @group Method
     */
    removeUploadedFile(index: number) {
        let removedFile = this.uploadedFiles.splice(index, 1)[0];
        this.uploadedFiles = [...this.uploadedFiles];
        this.onRemoveUploadedFile.emit({ file: removedFile, files: this.uploadedFiles });
    }

    isFileLimitExceeded() {
        const fileLimit = this.fileLimit();
        const isAutoMode = this.auto();
        const totalFileCount = isAutoMode ? this.files().length : this.files().length + this.uploadedFileCount;

        if (fileLimit && fileLimit <= totalFileCount && this.focus) {
            this.focus = false;
        }

        return fileLimit && fileLimit < totalFileCount;
    }

    isChooseDisabled() {
        const fileLimit = this.fileLimit();

        if (this.auto()) {
            return fileLimit && fileLimit <= this.files().length;
        } else {
            return fileLimit && fileLimit <= this.files().length + this.uploadedFileCount;
        }
    }

    checkFileLimit(files: File[]) {
        this.msgs ??= [];
        const fileLimit = this.fileLimit();
        const hasExistingValidationMessages = this.msgs.length > 0 && fileLimit && fileLimit < files.length;

        if (this.isFileLimitExceeded() || hasExistingValidationMessages) {
            const text = `${this.invalidFileLimitMessageSummary().replace('{0}', (fileLimit as number).toString())} ${this.invalidFileLimitMessageDetail().replace('{0}', (fileLimit as number).toString())}`;
            this.msgs.push({
                severity: 'error',
                text: text
            });
        } else {
            this.msgs = this.msgs.filter((msg) => !msg.text.includes(this.invalidFileLimitMessageSummary()));
        }
    }

    clearInputElement() {
        const advancedFileInput = this.advancedFileInput();
        const basicFileInput = this.basicFileInput();

        if (advancedFileInput && advancedFileInput.nativeElement) {
            advancedFileInput.nativeElement.value = '';
        }

        if (basicFileInput && basicFileInput.nativeElement) {
            basicFileInput.nativeElement.value = '';
        }
    }

    clearIEInput() {
        const advancedFileInput = this.advancedFileInput();

        if (advancedFileInput && advancedFileInput.nativeElement) {
            this.duplicateIEEvent = true; //IE11 fix to prevent onFileChange trigger again
            advancedFileInput.nativeElement.value = '';
        }
    }

    hasFiles(): boolean {
        return this.files() && this.files().length > 0;
    }

    hasUploadedFiles() {
        return this.uploadedFiles && this.uploadedFiles.length > 0;
    }

    onDragEnter(e: DragEvent) {
        if (!this.disabled()) {
            e.stopPropagation();
            e.preventDefault();
        }
    }

    onDragOver(e: DragEvent) {
        if (!this.disabled()) {
            !this.$unstyled() && addClass(this.content()?.nativeElement, 'p-fileupload-highlight');
            this.content()?.nativeElement.setAttribute('data-p-highlight', true);
            this.dragHighlight = true;
            e.stopPropagation();
            e.preventDefault();
        }
    }

    onDragLeave(event: DragEvent) {
        if (!this.disabled()) {
            !this.$unstyled() && removeClass(this.content()?.nativeElement, 'p-fileupload-highlight');
            this.content()?.nativeElement.setAttribute('data-p-highlight', false);
        }
    }

    onDrop(event: any) {
        if (!this.disabled()) {
            !this.$unstyled() && removeClass(this.content()?.nativeElement, 'p-fileupload-highlight');
            this.content()?.nativeElement.setAttribute('data-p-highlight', false);
            event.stopPropagation();
            event.preventDefault();

            let files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
            let allowDrop = this.multiple() || (files && files.length === 1);

            if (allowDrop) {
                this.onFileSelect(event);
            }
        }
    }

    onFocus() {
        this.focus = true;
    }

    onBlur() {
        this.focus = false;
    }

    formatSize(bytes: number) {
        const k = 1024;
        const dm = 3;
        const sizes = this.getTranslation(TranslationKeys.FILE_SIZE_TYPES);

        if (bytes === 0) {
            return `0 ${sizes[0]}`;
        }

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        const formattedSize = (bytes / Math.pow(k, i)).toFixed(dm);

        return `${formattedSize} ${sizes[i]}`;
    }

    upload() {
        if (this.hasFiles()) this.uploader();
    }

    onBasicUploaderClick() {
        this.basicFileInput()?.nativeElement.click();
    }

    onBasicKeydown(event: KeyboardEvent) {
        switch (event.code) {
            case 'Space':
            case 'Enter':
                this.onBasicUploaderClick();

                event.preventDefault();
                break;
        }
    }

    imageError(event: Event) {
        this.onImageError.emit(event);
    }

    getBlockableElement(): HTMLElement {
        return this.el.nativeElement.children[0];
    }

    get chooseButtonLabel(): string {
        return this.chooseLabel() || this.config.getTranslation(TranslationKeys.CHOOSE);
    }

    get uploadButtonLabel(): string {
        return this.uploadLabel() || this.config.getTranslation(TranslationKeys.UPLOAD);
    }

    get cancelButtonLabel(): string {
        return this.cancelLabel() || this.config.getTranslation(TranslationKeys.CANCEL);
    }

    get browseFilesLabel(): string {
        return this.config.getTranslation(TranslationKeys.ARIA)[TranslationKeys.BROWSE_FILES];
    }

    get pendingLabel() {
        return this.config.getTranslation(TranslationKeys.PENDING);
    }

    onDestroy() {
        if (this.content()?.nativeElement) {
            if (this.dragOverListener) {
                this.dragOverListener();
                this.dragOverListener = null;
            }
        }
    }
}

@NgModule({
    imports: [FileUpload, SharedModule],
    exports: [FileUpload, SharedModule]
})
export class FileUploadModule {}
