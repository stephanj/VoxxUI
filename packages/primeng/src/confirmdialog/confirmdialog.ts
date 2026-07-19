import { CommonModule } from '@angular/common';
import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild,
    contentChildren,
    DestroyRef,
    effect,
    ElementRef,
    EventEmitter,
    inject,
    InjectionToken,
    input,
    linkedSignal,
    NgModule,
    NgZone,
    numberAttribute,
    output,
    signal,
    SimpleChanges,
    TemplateRef,
    untracked,
    ViewEncapsulation
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { findSingle, setAttribute, uuid } from '@primeuix/utils';
import { Confirmation, ConfirmationService, ConfirmEventType, Footer, PrimeTemplate, SharedModule, TranslationKeys } from 'voxx-ui/api';
import { BaseComponent, PARENT_INSTANCE } from 'voxx-ui/basecomponent';
import { Bind } from 'voxx-ui/bind';
import { Button } from 'voxx-ui/button';
import { Dialog } from 'voxx-ui/dialog';
import { Nullable } from 'voxx-ui/ts-helpers';
import { ConfirmDialogHeadlessTemplateContext, ConfirmDialogMessageTemplateContext, ConfirmDialogPassThrough } from 'voxx-ui/types/confirmdialog';
import { ConfirmDialogStyle } from './style/confirmdialogstyle';

const CONFIRMDIALOG_INSTANCE = new InjectionToken<ConfirmDialog>('CONFIRMDIALOG_INSTANCE');

/**
 * ConfirmDialog uses a Dialog UI that is integrated with the Confirmation API.
 * @group Components
 */
@Component({
    selector: 'vx-confirmDialog, vx-confirmdialog, vx-confirm-dialog',
    imports: [CommonModule, Button, Dialog, SharedModule, Bind],
    template: `
        <vx-dialog
            [pt]="$any(pt())"
            #dialog
            [visible]="$visible()"
            (visibleChange)="onVisibleChange($event)"
            role="alertdialog"
            [closable]="option('closable')"
            [styleClass]="cn(cx('root'), option('styleClass'))"
            [modal]="option('modal')"
            [header]="option('header')"
            [closeOnEscape]="option('closeOnEscape')"
            [blockScroll]="option('blockScroll')"
            [appendTo]="$appendTo()"
            [position]="option('position')"
            [style]="option('style')"
            [dismissableMask]="option('dismissableMask')"
            [draggable]="option('draggable')"
            [baseZIndex]="option('baseZIndex')"
            [autoZIndex]="option('autoZIndex')"
            [maskStyleClass]="cn(cx('mask'), option('maskStyleClass'))"
            [unstyled]="unstyled()"
            (onHide)="onDialogHide()"
        >
            @if (headlessTemplate() || _headlessTemplate()) {
                <ng-template #headless>
                    <ng-container
                        *ngTemplateOutlet="
                            headlessTemplate() || _headlessTemplate();
                            context: {
                                $implicit: confirmation,
                                onAccept: onAccept.bind(this),
                                onReject: onReject.bind(this)
                            }
                        "
                    ></ng-container>
                </ng-template>
            } @else {
                @if (headerTemplate() || _headerTemplate()) {
                    <ng-template #header>
                        <ng-container *ngTemplateOutlet="headerTemplate() || _headerTemplate()"></ng-container>
                    </ng-template>
                }

                <ng-template #content>
                    @if (iconTemplate() || _iconTemplate()) {
                        <ng-template *ngTemplateOutlet="iconTemplate() || _iconTemplate()"></ng-template>
                    } @else if (!iconTemplate() && !_iconTemplate() && !_messageTemplate() && !messageTemplate()) {
                        @if (option('icon')) {
                            <i [class]="cn(cx('icon'), option('icon'))" [vxBind]="ptm('icon')"></i>
                        }
                    }
                    @if (messageTemplate() || _messageTemplate()) {
                        <ng-template *ngTemplateOutlet="messageTemplate() || _messageTemplate(); context: { $implicit: confirmation }"></ng-template>
                    } @else {
                        <span [class]="cx('message')" [vxBind]="ptm('message')" [innerHTML]="option('message')"> </span>
                    }
                </ng-template>
            }
            <ng-template #footer>
                @if (footerTemplate() || _footerTemplate()) {
                    <ng-content select="vx-footer"></ng-content>
                    <ng-container *ngTemplateOutlet="footerTemplate() || _footerTemplate()"></ng-container>
                }
                @if (!footerTemplate() && !_footerTemplate()) {
                    @if (option('rejectVisible')) {
                        <vx-button
                            [pt]="ptm('pcRejectButton')"
                            [label]="rejectButtonLabel"
                            (onClick)="onReject()"
                            [styleClass]="getButtonStyleClass('pcRejectButton', 'rejectButtonStyleClass')"
                            [ariaLabel]="option('rejectButtonProps', 'ariaLabel')"
                            [buttonProps]="getRejectButtonProps()"
                            [unstyled]="unstyled()"
                        >
                            <ng-template #icon>
                                @if (option('rejectIcon') && !rejectIconTemplate() && !_rejectIconTemplate()) {
                                    @if (option('rejectIcon')) {
                                        <i [class]="option('rejectIcon')" [vxBind]="ptm('pcRejectButton')['icon']"></i>
                                    }
                                }
                                <ng-template *ngTemplateOutlet="rejectIconTemplate() || _rejectIconTemplate()"></ng-template>
                            </ng-template>
                        </vx-button>
                    }
                    @if (option('acceptVisible')) {
                        <vx-button
                            [pt]="ptm('pcAcceptButton')"
                            [label]="acceptButtonLabel"
                            (onClick)="onAccept()"
                            [styleClass]="getButtonStyleClass('pcAcceptButton', 'acceptButtonStyleClass')"
                            [ariaLabel]="option('acceptButtonProps', 'ariaLabel')"
                            [buttonProps]="getAcceptButtonProps()"
                            [unstyled]="unstyled()"
                        >
                            <ng-template #icon>
                                @if (option('acceptIcon') && !_acceptIconTemplate() && !acceptIconTemplate()) {
                                    @if (option('acceptIcon')) {
                                        <i [class]="option('acceptIcon')" [vxBind]="ptm('pcAcceptButton')['icon']"></i>
                                    }
                                }
                                <ng-template *ngTemplateOutlet="acceptIconTemplate() || _acceptIconTemplate()"></ng-template>
                            </ng-template>
                        </vx-button>
                    }
                }
            </ng-template>
        </vx-dialog>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [ConfirmDialogStyle, { provide: CONFIRMDIALOG_INSTANCE, useExisting: ConfirmDialog }, { provide: PARENT_INSTANCE, useExisting: ConfirmDialog }],
    hostDirectives: [Bind]
})
export class ConfirmDialog extends BaseComponent<ConfirmDialogPassThrough> {
    componentName = 'ConfirmDialog';

    $pcConfirmDialog: ConfirmDialog | undefined = inject(CONFIRMDIALOG_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptm('host'));
    }

    /**
     * Title text of the dialog.
     * @group Props
     */
    header = input<string | undefined>();
    /**
     * Icon to display next to message.
     * @group Props
     */
    icon = input<string | undefined>();
    /**
     * Message of the confirmation.
     * @group Props
     */
    message = input<string | undefined>();
    /**
     * Inline style of the element.
     * @group Props
     */
    style = input<{ [klass: string]: any } | null | undefined>();
    /**
     * Class of the element.
     * @group Props
     */
    styleClass = input<string | undefined>();
    /**
     * Specify the CSS class(es) for styling the mask element
     * @group Props
     */
    maskStyleClass = input<string | undefined>();
    /**
     * Icon of the accept button.
     * @group Props
     */
    acceptIcon = input<string | undefined>();
    /**
     * Label of the accept button.
     * @group Props
     */
    acceptLabel = input<string | undefined>();
    /**
     * Defines a string that labels the close button for accessibility.
     * @group Props
     */
    closeAriaLabel = input<string | undefined>();
    /**
     * Defines a string that labels the accept button for accessibility.
     * @group Props
     */
    acceptAriaLabel = input<string | undefined>();
    /**
     * Visibility of the accept button.
     * @group Props
     */
    acceptVisible = input(true, { transform: booleanAttribute });
    /**
     * Icon of the reject button.
     * @group Props
     */
    rejectIcon = input<string | undefined>();
    /**
     * Label of the reject button.
     * @group Props
     */
    rejectLabel = input<string | undefined>();
    /**
     * Defines a string that labels the reject button for accessibility.
     * @group Props
     */
    rejectAriaLabel = input<string | undefined>();
    /**
     * Visibility of the reject button.
     * @group Props
     */
    rejectVisible = input(true, { transform: booleanAttribute });
    /**
     * Style class of the accept button.
     * @group Props
     */
    acceptButtonStyleClass = input<string | undefined>();
    /**
     * Style class of the reject button.
     * @group Props
     */
    rejectButtonStyleClass = input<string | undefined>();
    /**
     * Specifies if pressing escape key should hide the dialog.
     * @group Props
     */
    closeOnEscape = input(true, { transform: booleanAttribute });
    /**
     * Specifies if clicking the modal background should hide the dialog.
     * @group Props
     */
    dismissableMask = input(undefined, { transform: booleanAttribute });
    /**
     * Determines whether scrolling behavior should be blocked within the component.
     * @group Props
     */
    blockScroll = input(true, { transform: booleanAttribute });
    /**
     * When enabled dialog is displayed in RTL direction.
     * @group Props
     */
    rtl = input(false, { transform: booleanAttribute });
    /**
     * Adds a close icon to the header to hide the dialog.
     * @group Props
     */
    closable = input(true, { transform: booleanAttribute });
    /**
     * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @defaultValue 'body'
     * @group Props
     */
    appendTo = input<HTMLElement | ElementRef | TemplateRef<any> | 'self' | 'body' | null | undefined | any>('body');
    /**
     * Optional key to match the key of confirm object, necessary to use when component tree has multiple confirm dialogs.
     * @group Props
     */
    key = input<string | undefined>();
    /**
     * Whether to automatically manage layering.
     * @group Props
     */
    autoZIndex = input(true, { transform: booleanAttribute });
    /**
     * Base zIndex value to use in layering.
     * @group Props
     */
    baseZIndex = input(0, { transform: numberAttribute });
    /**
     * Transition options of the animation.
     * @group Props
     */
    transitionOptions = input<string>('150ms cubic-bezier(0, 0, 0.2, 1)');
    /**
     * When enabled, can only focus on elements inside the confirm dialog.
     * @group Props
     */
    focusTrap = input(true, { transform: booleanAttribute });
    /**
     * Element to receive the focus when the dialog gets visible.
     * @group Props
     */
    defaultFocus = input<'accept' | 'reject' | 'close' | 'none'>('accept');
    /**
     * Object literal to define widths per screen size.
     * @group Props
     */
    breakpoints = input<any>();
    /**
     * Defines if background should be blocked when dialog is displayed.
     * @group Props
     */
    modal = input(true, { transform: booleanAttribute });
    /**
     * Current visible state as a boolean.
     * @group Props
     */
    visible = input<any>();
    /**
     *  Allows getting the position of the component.
     * @group Props
     */
    position = input<'center' | 'top' | 'bottom' | 'left' | 'right' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright'>('center');
    /**
     * Enables dragging to change the position using header.
     * @group Props
     */
    draggable = input(true, { transform: booleanAttribute });
    /**
     * Callback to invoke when dialog is hidden.
     * @param {ConfirmEventType} enum - Custom confirm event.
     * @group Emits
     */
    onHide = output<ConfirmEventType | undefined>();

    footer = contentChild(Footer);

    _componentStyle = inject(ConfirmDialogStyle);

    /**
     * Custom header template.
     * @group Templates
     */
    headerTemplate = contentChild<TemplateRef<void>>('header', { descendants: false });

    /**
     * Custom footer template.
     * @group Templates
     */
    footerTemplate = contentChild<TemplateRef<void>>('footer', { descendants: false });

    /**
     * Custom reject icon template.
     * @group Templates
     */
    rejectIconTemplate = contentChild<TemplateRef<void>>('rejecticon', { descendants: false });

    /**
     * Custom accept icon template.
     * @group Templates
     */
    acceptIconTemplate = contentChild<TemplateRef<void>>('accepticon', { descendants: false });

    /**
     * Custom message template.
     * @group Templates
     */
    messageTemplate = contentChild<TemplateRef<ConfirmDialogMessageTemplateContext>>('message', { descendants: false });

    /**
     * Custom icon template.
     * @group Templates
     */
    iconTemplate = contentChild<TemplateRef<void>>('icon', { descendants: false });

    /**
     * Custom headless template.
     * @group Templates
     */
    headlessTemplate = contentChild<TemplateRef<ConfirmDialogHeadlessTemplateContext>>('headless', { descendants: false });

    templates = contentChildren(PrimeTemplate);

    /**
     * Map of the `vxTemplate`-declared templates, keyed by template type. Unknown types are
     * ignored, matching the pre-signal `ngAfterContentInit` behavior.
     */
    private _templateMap = computed(() => {
        const map: Record<string, TemplateRef<any> | undefined> = {};

        for (const item of this.templates()) {
            const type = item.getType();

            switch (type) {
                case 'header':
                case 'footer':
                case 'message':
                case 'icon':
                case 'rejecticon':
                case 'accepticon':
                case 'headless':
                    map[type] = item.template;
                    break;
            }
        }

        return map;
    });

    _headerTemplate = computed(() => this._templateMap()['header'] as TemplateRef<void> | undefined);

    _footerTemplate = computed(() => this._templateMap()['footer'] as TemplateRef<void> | undefined);

    _rejectIconTemplate = computed(() => this._templateMap()['rejecticon'] as TemplateRef<void> | undefined);

    _acceptIconTemplate = computed(() => this._templateMap()['accepticon'] as TemplateRef<void> | undefined);

    _messageTemplate = computed(() => this._templateMap()['message'] as TemplateRef<ConfirmDialogMessageTemplateContext> | undefined);

    _iconTemplate = computed(() => this._templateMap()['icon'] as TemplateRef<void> | undefined);

    _headlessTemplate = computed(() => this._templateMap()['headless'] as TemplateRef<ConfirmDialogHeadlessTemplateContext> | undefined);

    $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo());

    /**
     * Effective visibility state. Mirrors the `visible` input and is also written internally
     * when a confirmation arrives (shown) or is accepted/rejected/closed (hidden).
     */
    $visible = linkedSignal(() => this.visible());

    /**
     * Per-confirmation option overrides (#18). The pre-signal implementation copied every key of
     * an arriving `Confirmation` onto the component instance, shadowing the inputs until the
     * next confirmation or input write. Signal inputs cannot be written outside the input
     * system, so those values now live here and are resolved through `option()`.
     */
    private $confirmationOptions = signal<Record<string, any>>({});

    confirmation: Nullable<Confirmation>;

    maskVisible: boolean | undefined;

    dialog: Nullable<Dialog>;

    wrapper: Nullable<HTMLElement>;

    contentContainer: Nullable<HTMLDivElement>;

    preWidth: number | undefined;

    styleElement: any;

    id = uuid('pn_id_');

    destroyRef = inject(DestroyRef);

    ariaLabelledBy: string | null = this.getAriaLabelledBy();

    constructor(
        private confirmationService: ConfirmationService,
        public zone: NgZone
    ) {
        super();
        this.confirmationService.requireConfirmation$.pipe(takeUntilDestroyed()).subscribe((confirmation) => {
            if (!confirmation) {
                this.hide();
                return;
            }
            if (confirmation.key === this.key()) {
                this.confirmation = confirmation;

                this.$confirmationOptions.update((current) => ({ ...current, ...confirmation }));

                if (this.confirmation.accept) {
                    this.confirmation.acceptEvent = new EventEmitter();
                    this.confirmation.acceptEvent.subscribe(this.confirmation.accept);
                }

                if (this.confirmation.reject) {
                    this.confirmation.rejectEvent = new EventEmitter();
                    this.confirmation.rejectEvent.subscribe(this.confirmation.reject);
                }

                this.$visible.set(true);
            }
        });

        // Former `visible` setter side effect (#18): showing the dialog marks the mask visible.
        effect(() => {
            if (this.$visible() && !this.maskVisible) {
                this.maskVisible = true;
            }
        });
    }

    onInit() {
        if (this.breakpoints()) {
            this.createStyle();
        }

        this.config.translationObserver.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            if (this.$visible()) {
                this.cd.markForCheck();
            }
        });
    }

    onChanges(changes: SimpleChanges) {
        // A binding write takes precedence over the value a previous confirmation clobbered —
        // matching the pre-signal property-assignment order (#18). Drop stale overrides for
        // every input reported changed.
        const overrides = untracked(this.$confirmationOptions);
        const stale = Object.keys(changes).filter((name) => Object.prototype.hasOwnProperty.call(overrides, name));

        if (stale.length) {
            this.$confirmationOptions.update((current) => {
                const next = { ...current };

                for (const name of stale) {
                    delete next[name];
                }

                return next;
            });
        }
    }

    getAriaLabelledBy() {
        return this.header() !== null ? uuid('pn_id_') + '_header' : null;
    }

    option(name: string, k?: string) {
        const overrides = this.$confirmationOptions();
        const source: { [key: string]: any } = Object.prototype.hasOwnProperty.call(overrides, name) ? overrides : this;

        if (source.hasOwnProperty(name)) {
            const value = k ? source[k] : source[name];
            return typeof value === 'function' ? value() : value;
        }

        return undefined;
    }

    getButtonStyleClass(cx: string, opt: string): string {
        const cxClass = this.cx(cx);
        const optionClass = this.option(opt);

        return [cxClass, optionClass].filter(Boolean).join(' ');
    }

    getElementToFocus() {
        if (!this.dialog?.el?.nativeElement) return;

        switch (this.option('defaultFocus')) {
            case 'accept':
                return findSingle(this.dialog.el.nativeElement, '.p-confirm-dialog-accept');

            case 'reject':
                return findSingle(this.dialog.el.nativeElement, '.p-confirm-dialog-reject');

            case 'close':
                return findSingle(this.dialog.el.nativeElement, '.p-dialog-header-close');

            case 'none':
                return null;

            //backward compatibility
            default:
                return findSingle(this.dialog.el.nativeElement, '.p-confirm-dialog-accept');
        }
    }

    createStyle() {
        if (!this.styleElement) {
            this.styleElement = this.document.createElement('style');
            this.styleElement.type = 'text/css';
            setAttribute(this.styleElement, 'nonce', this.config?.csp()?.nonce);
            this.document.head.appendChild(this.styleElement);
            let innerHTML = '';
            const breakpoints = this.breakpoints();
            for (let breakpoint in breakpoints) {
                innerHTML += `
                    @media screen and (max-width: ${breakpoint}) {
                        .p-dialog[${this.id}] {
                            width: ${breakpoints[breakpoint]} !important;
                        }
                    }
                `;
            }

            this.styleElement.innerHTML = innerHTML;
            setAttribute(this.styleElement, 'nonce', this.config?.csp()?.nonce);
        }
    }

    close() {
        if (this.confirmation?.rejectEvent) {
            this.confirmation.rejectEvent.emit(ConfirmEventType.CANCEL);
        }

        this.hide(ConfirmEventType.CANCEL);
    }

    hide(type?: ConfirmEventType) {
        this.onHide.emit(type);
        this.$visible.set(false);
        // Unsubscribe from confirmation events when the dialogue is closed, because events are created when the dialogue is opened.
        this.unsubscribeConfirmationEvents();
    }

    onDialogHide() {
        this.confirmation = null;
    }

    destroyStyle() {
        if (this.styleElement) {
            this.document.head.removeChild(this.styleElement);
            this.styleElement = null;
        }
    }

    onDestroy() {
        // Unsubscribe from confirmation events if the dialogue is opened and this component is somehow destroyed.
        this.unsubscribeConfirmationEvents();

        this.destroyStyle();
    }

    onVisibleChange(value: boolean) {
        if (!value) {
            this.close();
        } else {
            this.$visible.set(value);
        }
    }

    onAccept() {
        if (this.confirmation && this.confirmation.acceptEvent) {
            this.confirmation.acceptEvent.emit();
        }
        this.hide(ConfirmEventType.ACCEPT);
    }

    onReject() {
        if (this.confirmation && this.confirmation.rejectEvent) {
            this.confirmation.rejectEvent.emit(ConfirmEventType.REJECT);
        }

        this.hide(ConfirmEventType.REJECT);
    }

    unsubscribeConfirmationEvents() {
        if (this.confirmation) {
            this.confirmation.acceptEvent?.unsubscribe();
            this.confirmation.rejectEvent?.unsubscribe();
        }
    }

    get acceptButtonLabel(): string {
        return this.option('acceptLabel') || this.getAcceptButtonProps()?.label || this.config.getTranslation(TranslationKeys.ACCEPT);
    }

    get rejectButtonLabel(): string {
        return this.option('rejectLabel') || this.getRejectButtonProps()?.label || this.config.getTranslation(TranslationKeys.REJECT);
    }

    getAcceptButtonProps() {
        return this.option('acceptButtonProps');
    }

    getRejectButtonProps() {
        return this.option('rejectButtonProps');
    }
}

@NgModule({
    imports: [ConfirmDialog, SharedModule],
    exports: [ConfirmDialog, SharedModule]
})
export class ConfirmDialogModule {}
