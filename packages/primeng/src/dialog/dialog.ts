import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild,
    contentChildren,
    effect,
    ElementRef,
    inject,
    InjectionToken,
    input,
    model,
    NgModule,
    NgZone,
    numberAttribute,
    output,
    signal,
    TemplateRef,
    viewChild,
    ViewEncapsulation,
    ViewRef
} from '@angular/core';
import { MotionEvent, MotionOptions } from '@primeuix/motion';
import { addStyle, appendChild, getOuterHeight, getOuterWidth, getViewport, hasClass, removeClass, setAttribute, uuid } from '@primeuix/utils';
import { OverlayService, PrimeTemplate, SharedModule, TranslationKeys } from 'voxx-ui/api';
import { BaseComponent, PARENT_INSTANCE } from 'voxx-ui/basecomponent';
import { Bind } from 'voxx-ui/bind';
import { Button, ButtonProps } from 'voxx-ui/button';
import { blockBodyScroll, DomHandler, unblockBodyScroll } from 'voxx-ui/dom';
import { FocusTrap } from 'voxx-ui/focustrap';
import { TimesIcon, WindowMaximizeIcon, WindowMinimizeIcon } from 'voxx-ui/icons';
import { MotionModule } from 'voxx-ui/motion';
import { Nullable, VoidListener } from 'voxx-ui/ts-helpers';
import { DialogPassThrough } from 'voxx-ui/types/dialog';
import { ZIndexUtils } from 'voxx-ui/utils';
import { DialogStyle } from './style/dialogstyle';

const DIALOG_INSTANCE = new InjectionToken<Dialog>('DIALOG_INSTANCE');

/**
 * Dialog is a container to display content in an overlay window.
 * @group Components
 */
@Component({
    selector: 'vx-dialog',
    imports: [CommonModule, Button, FocusTrap, TimesIcon, WindowMaximizeIcon, WindowMinimizeIcon, SharedModule, Bind, MotionModule],
    template: `
        @if (renderMask()) {
            <div
                [class]="cn(cx('mask'), maskStyleClass())"
                [style]="combinedMaskStyle"
                [vxBind]="ptm('mask')"
                [vxMotion]="maskVisible()"
                [vxMotionAppear]="true"
                [vxMotionEnterActiveClass]="modal() ? 'p-overlay-mask-enter-active' : ''"
                [vxMotionLeaveActiveClass]="modal() ? 'p-overlay-mask-leave-active' : ''"
                [vxMotionOptions]="computedMaskMotionOptions()"
                (vxMotionOnAfterLeave)="onMaskAfterLeave()"
                [attr.data-p-scrollblocker-active]="modal() || blockScroll()"
                [attr.data-p]="dataP"
            >
                @if (renderDialog()) {
                    <div
                        #container
                        [class]="cn(cx('root'), styleClass())"
                        [style]="combinedContainerStyle"
                        [vxBind]="ptm('root')"
                        vxFocusTrap
                        [vxFocusTrapDisabled]="focusTrap() === false"
                        [vxMotion]="visible()"
                        [vxMotionAppear]="true"
                        [vxMotionName]="'p-dialog'"
                        [vxMotionOptions]="computedMotionOptions()"
                        (vxMotionOnBeforeEnter)="onBeforeEnter($event)"
                        (vxMotionOnAfterEnter)="onAfterEnter()"
                        (vxMotionOnBeforeLeave)="onBeforeLeave()"
                        (vxMotionOnAfterLeave)="onAfterLeave()"
                        [attr.role]="role()"
                        [attr.aria-labelledby]="ariaLabelledBy"
                        [attr.aria-modal]="true"
                        [attr.data-p]="dataP"
                    >
                        @if (_headlessTemplate() || headlessTemplate() || headlessT()) {
                            <ng-container *ngTemplateOutlet="_headlessTemplate() || headlessTemplate() || headlessT()"></ng-container>
                        } @else {
                            @if (resizable()) {
                                <div [class]="cx('resizeHandle')" [vxBind]="ptm('resizeHandle')" [style.z-index]="90" (mousedown)="initResize($event)"></div>
                            }
                            @if (showHeader()) {
                                <div #titlebar [class]="cx('header')" [vxBind]="ptm('header')" (mousedown)="initDrag($event)">
                                    @if (!_headerTemplate() && !headerTemplate() && !headerT()) {
                                        <span [id]="ariaLabelledBy" [class]="cx('title')" [vxBind]="ptm('title')">{{ header() }}</span>
                                    }
                                    <ng-container *ngTemplateOutlet="_headerTemplate() || headerTemplate() || headerT(); context: { ariaLabelledBy: ariaLabelledBy }"></ng-container>
                                    <div [class]="cx('headerActions')" [vxBind]="ptm('headerActions')">
                                        @if (maximizable()) {
                                            <vx-button
                                                [pt]="ptm('pcMaximizeButton')"
                                                [styleClass]="cx('pcMaximizeButton')"
                                                [ariaLabel]="maximized() ? minimizeLabel : maximizeLabel"
                                                (onClick)="maximize()"
                                                (keydown.enter)="maximize()"
                                                [tabindex]="maximizable() ? '0' : '-1'"
                                                [buttonProps]="maximizeButtonProps()"
                                                [unstyled]="unstyled()"
                                                [attr.data-pc-group-section]="'headericon'"
                                            >
                                                <ng-template #icon>
                                                    @if (maximizeIcon() && !_maximizeiconTemplate() && !_minimizeiconTemplate()) {
                                                        <span [class]="maximized() ? minimizeIcon() : maximizeIcon()"></span>
                                                    }
                                                    @if (!maximizeIcon() && !maximizeButtonProps()?.icon) {
                                                        @if (!maximized() && !_maximizeiconTemplate() && !maximizeIconTemplate() && !maximizeIconT()) {
                                                            <svg data-p-icon="window-maximize" />
                                                        }
                                                        @if (maximized() && !_minimizeiconTemplate() && !minimizeIconTemplate() && !minimizeIconT()) {
                                                            <svg data-p-icon="window-minimize" />
                                                        }
                                                    }
                                                    @if (!maximized()) {
                                                        <ng-template *ngTemplateOutlet="_maximizeiconTemplate() || maximizeIconTemplate() || maximizeIconT()"></ng-template>
                                                    }
                                                    @if (maximized()) {
                                                        <ng-template *ngTemplateOutlet="_minimizeiconTemplate() || minimizeIconTemplate() || minimizeIconT()"></ng-template>
                                                    }
                                                </ng-template>
                                            </vx-button>
                                        }
                                        @if (closable()) {
                                            <vx-button
                                                [pt]="ptm('pcCloseButton')"
                                                [styleClass]="cx('pcCloseButton')"
                                                [ariaLabel]="closeAriaLabel()"
                                                (onClick)="close($event)"
                                                (keydown.enter)="close($event)"
                                                [tabindex]="closeTabindex()"
                                                [buttonProps]="closeButtonProps()"
                                                [unstyled]="unstyled()"
                                                [attr.data-pc-group-section]="'headericon'"
                                            >
                                                <ng-template #icon>
                                                    @if (!_closeiconTemplate() && !closeIconTemplate() && !closeIconT() && !closeButtonProps()?.icon) {
                                                        @if (closeIcon()) {
                                                            <span [class]="closeIcon()"></span>
                                                        }
                                                        @if (!closeIcon()) {
                                                            <svg data-p-icon="times" />
                                                        }
                                                    }
                                                    @if (_closeiconTemplate() || closeIconTemplate() || closeIconT()) {
                                                        <span>
                                                            <ng-template *ngTemplateOutlet="_closeiconTemplate() || closeIconTemplate() || closeIconT()"></ng-template>
                                                        </span>
                                                    }
                                                </ng-template>
                                            </vx-button>
                                        }
                                    </div>
                                </div>
                            }
                            <div #content [class]="cn(cx('content'), contentStyleClass())" [style]="contentStyle()" [vxBind]="ptm('content')">
                                <ng-content></ng-content>
                                <ng-container *ngTemplateOutlet="_contentTemplate() || contentTemplate() || contentT()"></ng-container>
                            </div>
                            @if (_footerTemplate() || footerTemplate() || footerT()) {
                                <div #footer [class]="cx('footer')" [vxBind]="ptm('footer')">
                                    <ng-content select="vx-footer"></ng-content>
                                    <ng-container *ngTemplateOutlet="_footerTemplate() || footerTemplate() || footerT()"></ng-container>
                                </div>
                            }
                        }
                    </div>
                }
            </div>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [DialogStyle, { provide: DIALOG_INSTANCE, useExisting: Dialog }, { provide: PARENT_INSTANCE, useExisting: Dialog }],
    hostDirectives: [Bind]
})
export class Dialog extends BaseComponent<DialogPassThrough> {
    componentName = 'Dialog';

    hostName = input<string>('');

    $pcDialog: Dialog | undefined = inject(DIALOG_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

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
     * Enables dragging to change the position using header.
     * @group Props
     */
    draggable = input(true, { transform: booleanAttribute });
    /**
     * Enables resizing of the content.
     * @group Props
     */
    resizable = input(true, { transform: booleanAttribute });
    /**
     * Style of the content section.
     * @group Props
     */
    contentStyle = input<any>();
    /**
     * Style class of the content.
     * @group Props
     */
    contentStyleClass = input<string | undefined>();
    /**
     * Defines if background should be blocked when dialog is displayed.
     * @group Props
     */
    modal = input(false, { transform: booleanAttribute });
    /**
     * Specifies if pressing escape key should hide the dialog.
     * @group Props
     */
    closeOnEscape = input(true, { transform: booleanAttribute });
    /**
     * Specifies if clicking the modal background should hide the dialog.
     * @group Props
     */
    dismissableMask = input(false, { transform: booleanAttribute });
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
     * Object literal to define widths per screen size.
     * @group Props
     */
    breakpoints = input<any>();
    /**
     * Style class of the component.
     * @group Props
     */
    styleClass = input<string | undefined>();
    /**
     * Style class of the mask.
     * @group Props
     */
    maskStyleClass = input<string | undefined>();
    /**
     * Style of the mask.
     * @group Props
     */
    maskStyle = input<{ [klass: string]: any } | null | undefined>();
    /**
     * Whether to show the header or not.
     * @group Props
     */
    showHeader = input(true, { transform: booleanAttribute });
    /**
     * Whether background scroll should be blocked when dialog is visible.
     * @group Props
     */
    blockScroll = input(false, { transform: booleanAttribute });
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
     * Minimum value for the left coordinate of dialog in dragging.
     * @group Props
     */
    minX = input(0, { transform: numberAttribute });
    /**
     * Minimum value for the top coordinate of dialog in dragging.
     * @group Props
     */
    minY = input(0, { transform: numberAttribute });
    /**
     * When enabled, first focusable element receives focus on show.
     * @group Props
     */
    focusOnShow = input(true, { transform: booleanAttribute });
    /**
     * Whether the dialog can be displayed full screen.
     * @group Props
     */
    maximizable = input(false, { transform: booleanAttribute });
    /**
     * Keeps dialog in the viewport.
     * @group Props
     */
    keepInViewport = input(true, { transform: booleanAttribute });
    /**
     * When enabled, can only focus on elements inside the dialog.
     * @group Props
     */
    focusTrap = input(true, { transform: booleanAttribute });
    /**
     * Transition options of the animation.
     * @deprecated since v21.0.0. Use `motionOptions` instead.
     * @group Props
     */
    transitionOptions = input<string>('150ms cubic-bezier(0, 0, 0.2, 1)');
    /**
     * The motion options for the mask.
     * @group Props
     */
    maskMotionOptions = input<MotionOptions | undefined>(undefined);

    computedMaskMotionOptions = computed<MotionOptions>(() => {
        return {
            ...this.ptm('maskMotion'),
            ...this.maskMotionOptions()
        };
    });
    /**
     * The motion options.
     * @group Props
     */
    motionOptions = input<MotionOptions | undefined>(undefined);

    computedMotionOptions = computed<MotionOptions>(() => {
        return {
            ...this.ptm('motion'),
            ...this.motionOptions()
        };
    });
    /**
     * Name of the close icon.
     * @group Props
     */
    closeIcon = input<string | undefined>();
    /**
     * Defines a string that labels the close button for accessibility.
     * @group Props
     */
    closeAriaLabel = input<string | undefined>();
    /**
     * Index of the close button in tabbing order.
     * @group Props
     */
    closeTabindex = input<string>('0');
    /**
     * Name of the minimize icon.
     * @group Props
     */
    minimizeIcon = input<string | undefined>();
    /**
     * Name of the maximize icon.
     * @group Props
     */
    maximizeIcon = input<string | undefined>();
    /**
     * Used to pass all properties of the ButtonProps to the Button component.
     * @group Props
     */
    closeButtonProps = input<ButtonProps>({
        severity: 'secondary',
        variant: 'text',
        rounded: true
    });
    /**
     * Used to pass all properties of the ButtonProps to the Button component.
     * @group Props
     */
    maximizeButtonProps = input<ButtonProps>({
        severity: 'secondary',
        variant: 'text',
        rounded: true
    });
    /**
     * Specifies the visibility of the dialog. Two-way bindable; emits `visibleChange` when the
     * dialog is closed internally (close icon, escape key, mask click).
     * @group Props
     */
    visible = model<boolean>(false);
    /**
     * Inline style of the component.
     * @group Props
     */
    style = input<any>(undefined);

    get combinedMaskStyle() {
        return { ...this.sx('mask'), ...this.maskStyle() };
    }

    get combinedContainerStyle() {
        return { ...this.sx('root'), ...this._style };
    }
    /**
     * Position of the dialog.
     * @group Props
     */
    position = input<'center' | 'top' | 'bottom' | 'left' | 'right' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright' | undefined>();
    /**
     * Role attribute of html element.
     * @group Emits
     */
    role = input<string>('dialog');
    /**
     * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @defaultValue 'self'
     * @group Props
     */
    appendTo = input<HTMLElement | ElementRef | TemplateRef<any> | 'self' | 'body' | null | undefined | any>(undefined);
    /**
     * Callback to invoke when dialog is shown.
     * @group Emits
     */
    onShow = output<any>();
    /**
     * Callback to invoke when dialog is hidden.
     * @group Emits
     */
    onHide = output<any>();
    /**
     * Callback to invoke when dialog resizing is initiated.
     * @param {MouseEvent} event - Mouse event.
     * @group Emits
     */
    onResizeInit = output<MouseEvent>();
    /**
     * Callback to invoke when dialog resizing is completed.
     * @param {MouseEvent} event - Mouse event.
     * @group Emits
     */
    onResizeEnd = output<MouseEvent>();
    /**
     * Callback to invoke when dialog dragging is completed.
     * @param {DragEvent} event - Drag event.
     * @group Emits
     */
    onDragEnd = output<DragEvent>();
    /**
     * Callback to invoke when dialog maximized or unmaximized.
     * @group Emits
     */
    onMaximize = output<any>();

    headerViewChild = viewChild<ElementRef>('titlebar');

    contentViewChild = viewChild<ElementRef>('content');

    footerViewChild = viewChild<ElementRef>('footer');
    /**
     * Header template.
     * @group Templates
     */
    headerTemplate = input<TemplateRef<any> | undefined>(undefined, { alias: 'content' });
    /**
     * Content template.
     * @group Templates
     */
    contentTemplate = input<TemplateRef<void> | undefined>();
    /**
     * Footer template.
     * @group Templates
     */
    footerTemplate = input<TemplateRef<void> | undefined>();
    /**
     * Close icon template.
     * @group Templates
     */
    closeIconTemplate = input<TemplateRef<void> | undefined>();
    /**
     * Maximize icon template.
     * @group Templates
     */
    maximizeIconTemplate = input<TemplateRef<void> | undefined>();
    /**
     * Minimize icon template.
     * @group Templates
     */
    minimizeIconTemplate = input<TemplateRef<void> | undefined>();
    /**
     * Headless template.
     * @group Templates
     */
    headlessTemplate = input<TemplateRef<void> | undefined>();

    /**
     * Custom header template.
     * @group Templates
     */
    _headerTemplate = contentChild<TemplateRef<any>>('header', { descendants: false });

    /**
     * Custom content template.
     * @group Templates
     */
    _contentTemplate = contentChild<TemplateRef<void>>('content', { descendants: false });

    /**
     * Custom footer template.
     * @group Templates
     */
    _footerTemplate = contentChild<TemplateRef<void>>('footer', { descendants: false });

    /**
     * Custom close icon template.
     * @group Templates
     */
    _closeiconTemplate = contentChild<TemplateRef<void>>('closeicon', { descendants: false });

    /**
     * Custom maximize icon template.
     * @group Templates
     */
    _maximizeiconTemplate = contentChild<TemplateRef<void>>('maximizeicon', { descendants: false });

    /**
     * Custom minimize icon template.
     * @group Templates
     */
    _minimizeiconTemplate = contentChild<TemplateRef<void>>('minimizeicon', { descendants: false });

    /**
     * Custom headless template.
     * @group Templates
     */
    _headlessTemplate = contentChild<TemplateRef<void>>('headless', { descendants: false });

    $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo());

    renderMask = signal<boolean>(false);

    renderDialog = signal<boolean>(false);

    maskVisible = signal<boolean | undefined>(undefined);

    container = signal<Nullable<HTMLElement>>(null);

    wrapper: Nullable<HTMLElement>;

    dragging: boolean | undefined;

    ariaLabelledBy: string | null = this.getAriaLabelledBy();

    documentDragListener: VoidListener;

    documentDragEndListener: VoidListener;

    resizing: boolean | undefined;

    documentResizeListener: VoidListener;

    documentResizeEndListener: VoidListener;

    documentEscapeListener: VoidListener;

    maskClickListener: VoidListener;

    lastPageX: number | undefined;

    lastPageY: number | undefined;

    preventVisibleChangePropagation: boolean | undefined;

    maximized = signal<boolean | undefined>(undefined);

    preMaximizeContentHeight: number | undefined;

    preMaximizeContainerWidth: number | undefined;

    preMaximizeContainerHeight: number | undefined;

    preMaximizePageX: number | undefined;

    preMaximizePageY: number | undefined;

    id: string = uuid('pn_id_');

    _style: any = {};

    originalStyle: any;

    transformOptions: any = 'scale(0.7)';

    styleElement: any;

    private window: Window;

    _componentStyle = inject(DialogStyle);

    templates = contentChildren(PrimeTemplate);

    /**
     * Map of the `vxTemplate`-declared templates, keyed by template type. Unknown types fall
     * back to the `content` key, matching the pre-signal `ngAfterContentInit` behavior.
     */
    private _templateMap = computed(() => {
        const map: Record<string, TemplateRef<any> | undefined> = {};

        for (const item of this.templates()) {
            const type = item.getType();

            switch (type) {
                case 'header':
                case 'content':
                case 'footer':
                case 'closeicon':
                case 'maximizeicon':
                case 'minimizeicon':
                case 'headless':
                    map[type] = item.template;
                    break;

                default:
                    map['content'] = item.template;
                    break;
            }
        }

        return map;
    });

    headerT = computed(() => this._templateMap()['header'] as TemplateRef<any> | undefined);

    contentT = computed(() => this._templateMap()['content'] as TemplateRef<void> | undefined);

    footerT = computed(() => this._templateMap()['footer'] as TemplateRef<void> | undefined);

    closeIconT = computed(() => this._templateMap()['closeicon'] as TemplateRef<void> | undefined);

    maximizeIconT = computed(() => this._templateMap()['maximizeicon'] as TemplateRef<void> | undefined);

    minimizeIconT = computed(() => this._templateMap()['minimizeicon'] as TemplateRef<void> | undefined);

    headlessT = computed(() => this._templateMap()['headless'] as TemplateRef<void> | undefined);

    private zIndexForLayering?: number;

    get maximizeLabel(): string {
        return this.config.getTranslation(TranslationKeys.ARIA)['maximizeLabel'];
    }

    get minimizeLabel(): string {
        return this.config.getTranslation(TranslationKeys.ARIA)['minimizeLabel'];
    }
    zone: NgZone = inject(NgZone);

    private overlayService: OverlayService = inject(OverlayService);

    get maskClass() {
        const positions = ['left', 'right', 'top', 'topleft', 'topright', 'bottom', 'bottomleft', 'bottomright'];
        const pos = positions.find((item) => item === this.position());

        return {
            'p-dialog-mask': true,
            'p-overlay-mask': this.modal() || this.dismissableMask(),
            [`p-dialog-${pos}`]: pos
        };
    }

    constructor() {
        super();

        // visible can change outside the input system (two-way sync, close/escape/mask flows) —
        // register it so the `onChanges` contract keeps observing those writes (#16).
        this.trackSignalChanges({ visible: this.visible });

        // Former `visible` setter side effect (#18): the first truthy visibility renders the
        // mask and dialog containers. Runs on every `visible` change (including the initial
        // value, like the setter did); the `maskVisible` guard keeps it idempotent.
        effect(() => {
            if (this.visible() && !this.maskVisible()) {
                this.maskVisible.set(true);
                this.renderMask.set(true);
                this.renderDialog.set(true);
            }
        });

        // Former `style` setter side effect (#18): copy the incoming value into the internal
        // mutable style state and remember the original for position/size resets. Falsy values
        // are ignored, matching the old setter guard.
        effect(() => {
            const value = this.style();

            if (value) {
                this._style = { ...value };
                this.originalStyle = value;
            }
        });
    }

    onInit() {
        if (this.breakpoints()) {
            this.createStyle();
        }
    }

    getAriaLabelledBy() {
        return this.header() !== null ? uuid('pn_id_') + '_header' : null;
    }

    parseDurationToMilliseconds(durationString: string): number | undefined {
        const transitionTimeRegex = /([\d\.]+)(ms|s)\b/g;
        let totalMilliseconds = 0;
        let match;
        while ((match = transitionTimeRegex.exec(durationString)) !== null) {
            const value = parseFloat(match[1]);
            const unit = match[2];
            if (unit === 'ms') {
                totalMilliseconds += value;
            } else if (unit === 's') {
                totalMilliseconds += value * 1000;
            }
        }
        if (totalMilliseconds === 0) {
            return undefined;
        }
        return totalMilliseconds;
    }

    _focus(focusParentElement?: HTMLElement): boolean {
        if (focusParentElement) {
            const timeoutDuration = this.parseDurationToMilliseconds(this.transitionOptions());
            let _focusableElements = DomHandler.getFocusableElements(focusParentElement);
            if (_focusableElements && _focusableElements.length > 0) {
                this.zone.runOutsideAngular(() => {
                    setTimeout(() => _focusableElements[0].focus(), timeoutDuration || 5);
                });
                return true;
            }
        }

        return false;
    }

    focus(focusParentElement: HTMLElement = this.contentViewChild()?.nativeElement) {
        let focused = this._focus(focusParentElement);

        if (!focused) {
            focused = this._focus(this.footerViewChild()?.nativeElement);
            if (!focused) {
                focused = this._focus(this.headerViewChild()?.nativeElement);
                if (!focused) {
                    this._focus(this.contentViewChild()?.nativeElement);
                }
            }
        }
    }

    close(event: Event) {
        this.visible.set(false);
        event.preventDefault();
    }

    enableModality() {
        if (this.closable() && this.dismissableMask()) {
            this.maskClickListener = this.renderer.listen(this.wrapper, 'mousedown', (event: any) => {
                if (this.wrapper && this.wrapper.isSameNode(event.target)) {
                    this.close(event);
                }
            });
        }

        if (this.modal()) {
            blockBodyScroll();
        }
    }

    disableModality() {
        if (this.wrapper) {
            if (this.dismissableMask()) {
                this.unbindMaskClickListener();
            }

            // for nested dialogs w/modal
            const scrollBlockers = document.querySelectorAll('[data-p-scrollblocker-active="true"]');

            if (this.modal() && scrollBlockers && scrollBlockers.length == 1) {
                unblockBodyScroll();
            }

            if (!(this.cd as ViewRef).destroyed) {
                this.cd.detectChanges();
            }
        }
    }

    maximize() {
        this.maximized.update((maximized) => !maximized);

        if (!this.modal() && !this.blockScroll()) {
            if (this.maximized()) {
                blockBodyScroll();
            } else {
                unblockBodyScroll();
            }
        }

        this.onMaximize.emit({ maximized: this.maximized() });
    }

    unbindMaskClickListener() {
        if (this.maskClickListener) {
            this.maskClickListener();
            this.maskClickListener = null;
        }
    }

    moveOnTop() {
        if (this.autoZIndex()) {
            ZIndexUtils.set('modal', this.container(), this.baseZIndex() + this.config.zIndex.modal);
            (this.wrapper as HTMLElement).style.zIndex = String(parseInt((this.container() as HTMLDivElement).style.zIndex, 10) - 1);
        } else {
            this.zIndexForLayering = ZIndexUtils.generateZIndex('modal', (this.baseZIndex() ?? 0) + this.config.zIndex.modal);
        }
    }

    createStyle() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.styleElement && !this.$unstyled()) {
                this.styleElement = this.renderer.createElement('style');
                this.styleElement.type = 'text/css';
                setAttribute(this.styleElement, 'nonce', this.config?.csp()?.nonce);
                this.renderer.appendChild(this.document.head, this.styleElement);
                let innerHTML = '';
                const breakpoints = this.breakpoints();
                for (let breakpoint in breakpoints) {
                    innerHTML += `
                        @media screen and (max-width: ${breakpoint}) {
                            .p-dialog[${this.id}]:not(.p-dialog-maximized) {
                                width: ${breakpoints[breakpoint]} !important;
                            }
                        }
                    `;
                }

                this.renderer.setProperty(this.styleElement, 'innerHTML', innerHTML);
                setAttribute(this.styleElement, 'nonce', this.config?.csp()?.nonce);
            }
        }
    }

    initDrag(event: MouseEvent) {
        const target = event.target as HTMLElement;
        const closestDiv = target.closest('div');

        if (closestDiv?.getAttribute('data-pc-section') === 'headeractions') {
            return;
        }

        if (this.draggable()) {
            this.dragging = true;
            this.lastPageX = event.pageX;
            this.lastPageY = event.pageY;

            (this.container() as HTMLDivElement).style.margin = '0';
            this.document.body.setAttribute('data-p-unselectable-text', 'true');
            !this.$unstyled() && addStyle(this.document.body, { 'user-select': 'none' });
        }
    }

    onDrag(event: MouseEvent) {
        if (this.dragging && this.container()) {
            const containerWidth = getOuterWidth(this.container() as HTMLDivElement);
            const containerHeight = getOuterHeight(this.container() as HTMLDivElement);
            const deltaX = event.pageX - (this.lastPageX as number);
            const deltaY = event.pageY - (this.lastPageY as number);
            const offset = this.container()!.getBoundingClientRect();

            const containerComputedStyle = getComputedStyle(this.container() as HTMLDivElement);

            const leftMargin = parseFloat(containerComputedStyle.marginLeft);
            const topMargin = parseFloat(containerComputedStyle.marginTop);

            const leftPos = offset.left + deltaX - leftMargin;
            const topPos = offset.top + deltaY - topMargin;
            const viewport = getViewport();

            this.container()!.style.position = 'fixed';

            if (this.keepInViewport()) {
                if (leftPos >= this.minX() && leftPos + containerWidth < viewport.width) {
                    this._style.left = `${leftPos}px`;
                    this.lastPageX = event.pageX;
                    this.container()!.style.left = `${leftPos}px`;
                }

                if (topPos >= this.minY() && topPos + containerHeight < viewport.height) {
                    this._style.top = `${topPos}px`;
                    this.lastPageY = event.pageY;
                    this.container()!.style.top = `${topPos}px`;
                }
            } else {
                this.lastPageX = event.pageX;
                this.container()!.style.left = `${leftPos}px`;
                this.lastPageY = event.pageY;
                this.container()!.style.top = `${topPos}px`;
            }

            this.overlayService.emitParentDrag(this.container()!);
        }
    }

    endDrag(event: DragEvent) {
        if (this.dragging) {
            this.dragging = false;
            this.document.body.removeAttribute('data-p-unselectable-text');
            !this.$unstyled() && (this.document.body.style['user-select'] = '');
            this.cd.detectChanges();
            this.onDragEnd.emit(event);
        }
    }

    resetPosition() {
        (this.container() as HTMLDivElement).style.position = '';
        (this.container() as HTMLDivElement).style.left = '';
        (this.container() as HTMLDivElement).style.top = '';
        (this.container() as HTMLDivElement).style.margin = '';
    }

    //backward compatibility
    center() {
        this.resetPosition();
    }

    initResize(event: MouseEvent) {
        if (this.resizable()) {
            this.resizing = true;
            this.lastPageX = event.pageX;
            this.lastPageY = event.pageY;

            this.document.body.setAttribute('data-p-unselectable-text', 'true');
            !this.$unstyled() && addStyle(this.document.body, { 'user-select': 'none' });
            this.onResizeInit.emit(event);
        }
    }

    onResize(event: MouseEvent) {
        if (this.resizing) {
            let deltaX = event.pageX - (this.lastPageX as number);
            let deltaY = event.pageY - (this.lastPageY as number);
            let containerWidth = getOuterWidth(this.container() as HTMLDivElement);
            let containerHeight = getOuterHeight(this.container() as HTMLDivElement);
            let contentHeight = getOuterHeight(this.contentViewChild()?.nativeElement);
            let newWidth = containerWidth + deltaX;
            let newHeight = containerHeight + deltaY;
            let minWidth = (this.container() as HTMLDivElement).style.minWidth;
            let minHeight = (this.container() as HTMLDivElement).style.minHeight;
            let offset = (this.container() as HTMLDivElement).getBoundingClientRect();
            let viewport = getViewport();
            let hasBeenDragged = !parseInt((this.container() as HTMLDivElement).style.top) || !parseInt((this.container() as HTMLDivElement).style.left);

            if (hasBeenDragged) {
                newWidth += deltaX;
                newHeight += deltaY;
            }

            if ((!minWidth || newWidth > parseInt(minWidth)) && offset.left + newWidth < viewport.width) {
                this._style.width = newWidth + 'px';
                (this.container() as HTMLDivElement).style.width = this._style.width;
            }

            if ((!minHeight || newHeight > parseInt(minHeight)) && offset.top + newHeight < viewport.height) {
                (<ElementRef>this.contentViewChild()).nativeElement.style.height = contentHeight + newHeight - containerHeight + 'px';

                if (this._style.height) {
                    this._style.height = newHeight + 'px';
                    (this.container() as HTMLDivElement).style.height = this._style.height;
                }
            }

            this.lastPageX = event.pageX;
            this.lastPageY = event.pageY;
        }
    }

    resizeEnd(event: MouseEvent) {
        if (this.resizing) {
            this.resizing = false;
            this.document.body.removeAttribute('data-p-unselectable-text');
            !this.$unstyled() && (this.document.body.style['user-select'] = '');
            this.onResizeEnd.emit(event);
        }
    }

    bindGlobalListeners() {
        if (this.draggable()) {
            this.bindDocumentDragListener();
            this.bindDocumentDragEndListener();
        }

        if (this.resizable()) {
            this.bindDocumentResizeListeners();
        }

        if (this.closeOnEscape() && this.closable()) {
            this.bindDocumentEscapeListener();
        }
    }

    unbindGlobalListeners() {
        this.unbindDocumentDragListener();
        this.unbindDocumentDragEndListener();
        this.unbindDocumentResizeListeners();
        this.unbindDocumentEscapeListener();
    }

    bindDocumentDragListener() {
        if (!this.documentDragListener) {
            this.zone.runOutsideAngular(() => {
                this.documentDragListener = this.renderer.listen(this.document.defaultView, 'mousemove', this.onDrag.bind(this));
            });
        }
    }

    unbindDocumentDragListener() {
        if (this.documentDragListener) {
            this.documentDragListener();
            this.documentDragListener = null;
        }
    }

    bindDocumentDragEndListener() {
        if (!this.documentDragEndListener) {
            this.zone.runOutsideAngular(() => {
                this.documentDragEndListener = this.renderer.listen(this.document.defaultView, 'mouseup', this.endDrag.bind(this));
            });
        }
    }

    unbindDocumentDragEndListener() {
        if (this.documentDragEndListener) {
            this.documentDragEndListener();
            this.documentDragEndListener = null;
        }
    }

    bindDocumentResizeListeners() {
        if (!this.documentResizeListener && !this.documentResizeEndListener) {
            this.zone.runOutsideAngular(() => {
                this.documentResizeListener = this.renderer.listen(this.document.defaultView, 'mousemove', this.onResize.bind(this));
                this.documentResizeEndListener = this.renderer.listen(this.document.defaultView, 'mouseup', this.resizeEnd.bind(this));
            });
        }
    }

    unbindDocumentResizeListeners() {
        if (this.documentResizeListener && this.documentResizeEndListener) {
            this.documentResizeListener();
            this.documentResizeEndListener();
            this.documentResizeListener = null;
            this.documentResizeEndListener = null;
        }
    }

    bindDocumentEscapeListener() {
        const documentTarget: any = this.el ? this.el.nativeElement.ownerDocument : 'document';

        this.documentEscapeListener = this.renderer.listen(documentTarget, 'keydown', (event) => {
            if (event.key == 'Escape') {
                const container = this.container();
                if (!container) {
                    return;
                }
                const currentZIndex = ZIndexUtils.getCurrent();
                if (parseInt(container.style.zIndex) == currentZIndex || this.zIndexForLayering == currentZIndex) {
                    this.close(event);
                }
            }
        });
    }

    unbindDocumentEscapeListener() {
        if (this.documentEscapeListener) {
            this.documentEscapeListener();
            this.documentEscapeListener = null;
        }
    }

    appendContainer() {
        if (this.$appendTo() !== 'self') {
            appendChild(this.document.body, this.wrapper as HTMLElement);
        }
    }

    restoreAppend() {
        if (this.container() && this.$appendTo() !== 'self') {
            this.renderer.appendChild(this.el.nativeElement, this.wrapper);
        }
    }

    onBeforeEnter(event: MotionEvent | undefined) {
        this.container.set(event?.element as HTMLDivElement);
        this.wrapper = this.container()?.parentElement;
        this.$attrSelector && this.container()?.setAttribute(this.$attrSelector, '');
        this.appendContainer();
        this.moveOnTop();
        this.bindGlobalListeners();
        this.container()?.setAttribute(this.id, '');

        if (this.modal()) {
            this.enableModality();
        }
    }

    onAfterEnter() {
        if (this.focusOnShow()) {
            this.focus();
        }

        this.onShow.emit({});
    }

    onBeforeLeave() {
        if (this.modal()) {
            this.maskVisible.set(false);
        }
    }

    onAfterLeave() {
        this.onContainerDestroy();
        this.renderDialog.set(false);

        if (this.modal()) {
            this.renderMask.set(false);
        } else {
            this.maskVisible.set(false);
        }

        this.onHide.emit({});
        this.cd.markForCheck();
    }

    onMaskAfterLeave() {
        if (!this.renderDialog()) {
            this.renderMask.set(false);
        }
    }

    onContainerDestroy() {
        this.unbindGlobalListeners();
        this.dragging = false;

        if (this.maximized()) {
            removeClass(this.document.body, 'p-overflow-hidden');
            this.document.body.style.removeProperty('--scrollbar-width');
            this.maximized.set(false);
        }

        if (this.modal()) {
            this.disableModality();
        }

        if (hasClass(this.document.body, 'p-overflow-hidden')) {
            removeClass(this.document.body, 'p-overflow-hidden');
        }

        if (this.container() && this.autoZIndex()) {
            ZIndexUtils.clear(this.container());
        }
        if (this.zIndexForLayering) {
            ZIndexUtils.revertZIndex(this.zIndexForLayering);
        }

        this.container.set(null);
        this.wrapper = null;

        this._style = this.originalStyle ? { ...this.originalStyle } : {};
    }

    destroyStyle() {
        if (this.styleElement) {
            this.renderer.removeChild(this.document.head, this.styleElement);
            this.styleElement = null;
        }
    }

    onDestroy() {
        if (this.container()) {
            this.restoreAppend();
            this.onContainerDestroy();
        }

        this.destroyStyle();
    }

    get dataP() {
        return this.cn({
            maximized: this.maximized(),
            modal: this.modal()
        });
    }
}

@NgModule({
    imports: [Dialog, SharedModule],
    exports: [Dialog, SharedModule]
})
export class DialogModule {}
