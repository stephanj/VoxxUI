import { CommonModule, isPlatformServer } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, computed, contentChild, contentChildren, effect, forwardRef, inject, InjectionToken, input, NgModule, output, TemplateRef, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { findSingle } from '@primeuix/utils';
import { Header, PrimeTemplate, SharedModule } from 'voxx-ui/api';
import { PARENT_INSTANCE } from 'voxx-ui/basecomponent';
import { BaseEditableHolder } from 'voxx-ui/baseeditableholder';
import { Bind, BindModule } from 'voxx-ui/bind';
import { Nullable } from 'voxx-ui/ts-helpers';
import { EditorBlurEvent, EditorChangeEvent, EditorFocusEvent, EditorInitEvent, EditorPassThrough, EditorSelectionChangeEvent, EditorTextChangeEvent } from 'voxx-ui/types/editor';
import { EditorStyle } from './style/editorstyle';

const EDITOR_INSTANCE = new InjectionToken<Editor>('EDITOR_INSTANCE');

export const EDITOR_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Editor),
    multi: true
};
/**
 * Editor groups a collection of contents in tabs.
 * @group Components
 */
@Component({
    selector: 'vx-editor',
    imports: [CommonModule, SharedModule, BindModule],
    template: `
        @if (toolbar() || headerTemplate() || _headerTemplate()) {
            <div [class]="cx('toolbar')" [vxBind]="ptm('toolbar')">
                <ng-content select="vx-header"></ng-content>
                <ng-container *ngTemplateOutlet="headerTemplate() || _headerTemplate()"></ng-container>
            </div>
        }
        @if (!toolbar() && !headerTemplate() && !_headerTemplate()) {
            <div [class]="cx('toolbar')" [vxBind]="ptm('toolbar')">
                <span class="ql-formats" [vxBind]="ptm('formats')">
                    <select class="ql-header" [vxBind]="ptm('header')">
                        <option value="1" [vxBind]="ptm('option')">Heading</option>
                        <option value="2" [vxBind]="ptm('option')">Subheading</option>
                        <option selected [vxBind]="ptm('option')">Normal</option>
                    </select>
                    <select class="ql-font" [vxBind]="ptm('select')">
                        <option selected [vxBind]="ptm('option')">Sans Serif</option>
                        <option value="serif" [vxBind]="ptm('option')">Serif</option>
                        <option value="monospace" [vxBind]="ptm('option')">Monospace</option>
                    </select>
                </span>
                <span class="ql-formats" [vxBind]="ptm('formats')">
                    <button class="ql-bold" aria-label="Bold" type="button" [vxBind]="ptm('bold')"></button>
                    <button class="ql-italic" aria-label="Italic" type="button" [vxBind]="ptm('italic')"></button>
                    <button class="ql-underline" aria-label="Underline" type="button" [vxBind]="ptm('underline')"></button>
                </span>
                <span class="ql-formats" [vxBind]="ptm('formats')">
                    <select class="ql-color" [vxBind]="ptm('color')"></select>
                    <select class="ql-background" [vxBind]="ptm('background')"></select>
                </span>
                <span class="ql-formats" [vxBind]="ptm('formats')">
                    <button class="ql-list" value="ordered" aria-label="Ordered List" type="button" [vxBind]="ptm('list')"></button>
                    <button class="ql-list" value="bullet" aria-label="Unordered List" type="button" [vxBind]="ptm('list')"></button>
                    <select class="ql-align" [vxBind]="ptm('select')">
                        <option selected [vxBind]="ptm('option')"></option>
                        <option value="center" [vxBind]="ptm('option')">center</option>
                        <option value="right" [vxBind]="ptm('option')">right</option>
                        <option value="justify" [vxBind]="ptm('option')">justify</option>
                    </select>
                </span>
                <span class="ql-formats" [vxBind]="ptm('formats')">
                    <button class="ql-link" aria-label="Insert Link" type="button" [vxBind]="ptm('link')"></button>
                    <button class="ql-image" aria-label="Insert Image" type="button" [vxBind]="ptm('image')"></button>
                    <button class="ql-code-block" aria-label="Insert Code Block" type="button" [vxBind]="ptm('codeBlock')"></button>
                </span>
                <span class="ql-formats" [vxBind]="ptm('formats')">
                    <button class="ql-clean" aria-label="Remove Styles" type="button" [vxBind]="ptm('clean')"></button>
                </span>
            </div>
        }
        <div [class]="cx('content')" [style]="style()" [vxBind]="ptm('content')"></div>
    `,
    providers: [EDITOR_VALUE_ACCESSOR, EditorStyle, { provide: EDITOR_INSTANCE, useExisting: Editor }, { provide: PARENT_INSTANCE, useExisting: Editor }],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': "cn(cx('root'), styleClass())"
    },
    hostDirectives: [Bind]
})
export class Editor extends BaseEditableHolder<EditorPassThrough> {
    componentName = 'Editor';

    $pcEditor: Editor | undefined = inject(EDITOR_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }

    /**
     * Inline style of the container.
     * @group Props
     */
    style = input<{ [klass: string]: any } | null | undefined>();
    /**
     * Style class of the container.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    styleClass = input<string | undefined>();
    /**
     * Placeholder text to show when editor is empty.
     * @group Props
     */
    placeholder = input<string | undefined>();
    /**
     * Whitelist of formats to display, see [here](https://quilljs.com/docs/formats/) for available options.
     * @group Props
     */
    formats = input<string[] | undefined>();
    /**
     * Modules configuration of Editor, see [here](https://quilljs.com/docs/modules/) for available options.
     * @group Props
     */
    modules = input<object | undefined>();
    /**
     * DOM Element or a CSS selector for a DOM Element, within which the editor’s p elements (i.e. tooltips, etc.) should be confined. Currently, it only considers left and right boundaries.
     * @group Props
     */
    bounds = input<HTMLElement | string | undefined>();
    /**
     * DOM Element or a CSS selector for a DOM Element, specifying which container has the scrollbars (i.e. overflow-y: auto), if is has been changed from the default ql-editor with custom CSS. Necessary to fix scroll jumping bugs when Quill is set to auto grow its height, and another ancestor container is responsible from the scrolling..
     * @group Props
     */
    scrollingContainer = input<HTMLElement | string | undefined>();
    /**
     * Shortcut for debug. Note debug is a static method and will affect other instances of Quill editors on the page. Only warning and error messages are enabled by default.
     * @group Props
     */
    debug = input<string | undefined>();
    /**
     * Whether to instantiate the editor to read-only mode.
     * @group Props
     */
    readonly = input<boolean>(false);
    /**
     * Callback to invoke when the quill modules are loaded.
     * @param {EditorInitEvent} event - custom event.
     * @group Emits
     */
    onEditorInit = output<EditorInitEvent>({ alias: 'onInit' });
    /**
     * Callback to invoke when text of editor changes.
     * @param {EditorTextChangeEvent} event - custom event.
     * @group Emits
     */
    onTextChange = output<EditorTextChangeEvent>();
    /**
     * Callback to invoke when selection of the text changes.
     * @param {EditorSelectionChangeEvent} event - custom event.
     * @group Emits
     */
    onSelectionChange = output<EditorSelectionChangeEvent>();
    /**
     * Callback to invoke when editor content changes (combines both text and selection changes).
     * @param {EditorChangeEvent} event - custom event.
     * @group Emits
     */
    onEditorChange = output<EditorChangeEvent>();
    /**
     * Callback to invoke when editor receives focus.
     * @param {EditorFocusEvent} event - custom event.
     * @group Emits
     */
    onFocus = output<EditorFocusEvent>();
    /**
     * Callback to invoke when editor loses focus.
     * @param {EditorBlurEvent} event - custom event.
     * @group Emits
     */
    onBlur = output<EditorBlurEvent>();

    toolbar = contentChild(Header);

    value: Nullable<string>;

    delayedCommand: Function | null = null;

    quill: any;

    dynamicQuill: any;

    /**
     * Custom item template.
     * @group Templates
     */
    headerTemplate = contentChild<TemplateRef<any>>('header', { descendants: false });

    templates = contentChildren(PrimeTemplate);

    _headerTemplate = computed<TemplateRef<any> | undefined>(() => this.templates().find((item) => item.getType() === 'header')?.template);

    private get isAttachedQuillEditorToDOM(): boolean | undefined {
        return this.quillElements?.editorElement?.isConnected;
    }

    private quillElements!: { editorElement: HTMLElement; toolbarElement: HTMLElement };

    private focusListener: (() => void) | null = null;

    private blurListener: (() => void) | null = null;

    _componentStyle = inject(EditorStyle);

    constructor() {
        super();
        /**
         * Read or write the DOM once, when initializing non-Angular (Quill) library.
         */
        afterNextRender(() => {
            this.initQuillElements();
            this.initQuillEditor();
        });

        // Signal-native replacement for the former readonly setter side effect (#16/#17).
        effect(() => {
            const readonly = this.readonly();

            if (this.quill) {
                if (readonly) this.quill.disable();
                else this.quill.enable();
            }
        });
    }

    /**
     * @override
     *
     * @see {@link BaseEditableHolder.writeControlValue}
     * Writes the value to the control.
     */
    writeControlValue(value: any): void {
        this.value = value;

        if (this.quill) {
            if (value) {
                const command = (): void => {
                    this.quill.setContents(this.quill.clipboard.convert(this.dynamicQuill.version.startsWith('2') ? { html: this.value } : this.value));
                };

                if (this.isAttachedQuillEditorToDOM) {
                    command();
                } else {
                    this.delayedCommand = command;
                }
            } else {
                const command = (): void => {
                    this.quill.setText('');
                };

                if (this.isAttachedQuillEditorToDOM) {
                    command();
                } else {
                    this.delayedCommand = command;
                }
            }
        }
    }

    getQuill() {
        return this.quill;
    }

    private initQuillEditor(): void {
        if (isPlatformServer(this.platformId)) {
            return;
        }

        /**
         * Importing Quill at top level, throws `document is undefined` error during when
         * building for SSR, so this dynamically loads quill when it's in browser module.
         */
        if (!this.dynamicQuill) {
            import('quill')
                .then((quillModule: any) => {
                    this.dynamicQuill = quillModule.default;
                    this.createQuillEditor();
                })
                .catch((e) => console.error(e.message));
        } else {
            this.createQuillEditor();
        }
    }

    private createQuillEditor(): void {
        this.initQuillElements();

        const { toolbarElement, editorElement } = this.quillElements;
        let defaultModule = { toolbar: toolbarElement };
        let modules = this.modules() ? { ...defaultModule, ...this.modules() } : defaultModule;
        this.quill = new this.dynamicQuill(editorElement, {
            modules: modules,
            placeholder: this.placeholder(),
            readOnly: this.readonly(),
            theme: 'snow',
            formats: this.formats(),
            bounds: this.bounds(),
            debug: this.debug(),
            scrollingContainer: this.scrollingContainer()
        });

        const isQuill2 = this.dynamicQuill.version.startsWith('2');

        if (this.value) {
            this.quill.setContents(this.quill.clipboard.convert(isQuill2 ? { html: this.value } : this.value));
        }

        this.quill.on('text-change', (delta: any, oldContents: any, source: 'user' | 'api' | 'silent') => {
            if (source === 'user') {
                let html = isQuill2 ? this.quill.getSemanticHTML() : findSingle(editorElement, '.ql-editor')?.innerHTML;
                let text = this.quill.getText().trim();
                if (html === '<p><br></p>') {
                    html = null;
                }

                this.onTextChange.emit({
                    htmlValue: html,
                    textValue: text,
                    delta: delta,
                    source: source
                });

                this.onModelChange(html);
                this.onModelTouched();
            }
        });

        this.quill.on('selection-change', (range: any, oldRange: any, source: 'user' | 'api' | 'silent') => {
            this.onSelectionChange.emit({
                range: range,
                oldRange: oldRange,
                source: source
            });
        });

        this.quill.on('editor-change', (eventName: 'text-change' | 'selection-change', ...args: any[]) => {
            this.onEditorChange.emit({
                eventName: eventName,
                args: args
            });
        });

        const editorEl = this.quill.root;

        this.focusListener = () => {
            this.onFocus.emit({
                source: 'user'
            });
        };

        this.blurListener = () => {
            this.onBlur.emit({
                source: 'user'
            });
        };

        editorEl.addEventListener('focus', this.focusListener);
        editorEl.addEventListener('blur', this.blurListener);

        this.onEditorInit.emit({
            editor: this.quill
        });
    }

    onDestroy(): void {
        if (this.quill && this.quill.root) {
            const editorEl = this.quill.root;
            if (this.focusListener) {
                editorEl.removeEventListener('focus', this.focusListener);
                this.focusListener = null;
            }
            if (this.blurListener) {
                editorEl.removeEventListener('blur', this.blurListener);
                this.blurListener = null;
            }
        }
    }

    private initQuillElements(): void {
        if (!this.quillElements) {
            this.quillElements = {
                editorElement: findSingle(this.el.nativeElement, 'div[data-pc-section="content"]'),
                toolbarElement: findSingle(this.el.nativeElement, 'div[data-pc-section="toolbar"]')
            } as any;
        }
    }
}

@NgModule({
    imports: [Editor, SharedModule],
    exports: [Editor, SharedModule]
})
export class EditorModule {}
