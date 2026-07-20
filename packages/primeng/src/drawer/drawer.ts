import { CommonModule } from '@angular/common';
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
    numberAttribute,
    output,
    signal,
    TemplateRef,
    viewChild,
    ViewEncapsulation
} from '@angular/core';
import { MotionEvent, MotionOptions } from '@primeuix/motion';
import { addClass, appendChild, removeClass, setAttribute } from '@primeuix/utils';
import { PrimeTemplate, SharedModule } from 'voxx-ui/api';
import { BaseComponent, PARENT_INSTANCE } from 'voxx-ui/basecomponent';
import { Bind } from 'voxx-ui/bind';
import { Button, ButtonProps } from 'voxx-ui/button';
import { blockBodyScroll, unblockBodyScroll } from 'voxx-ui/dom';
import { FocusTrapModule } from 'voxx-ui/focustrap';
import { TimesIcon } from 'voxx-ui/icons';
import { MotionModule } from 'voxx-ui/motion';
import { Nullable, VoidListener } from 'voxx-ui/ts-helpers';
import { DrawerPassThrough } from 'voxx-ui/types/drawer';
import { ZIndexUtils } from 'voxx-ui/utils';
import { DrawerStyle } from './style/drawerstyle';

const DRAWER_INSTANCE = new InjectionToken<Drawer>('DRAWER_INSTANCE');

/**
 * Sidebar is a panel component displayed as an overlay at the edges of the screen.
 * @group Components
 */
@Component({
    selector: 'vx-drawer',
    imports: [CommonModule, Button, TimesIcon, SharedModule, Bind, FocusTrapModule, MotionModule],
    providers: [DrawerStyle, { provide: DRAWER_INSTANCE, useExisting: Drawer }, { provide: PARENT_INSTANCE, useExisting: Drawer }],
    hostDirectives: [Bind],
    template: `
        @if (modalVisible()) {
            <div
                #container
                [vxBind]="ptm('root')"
                [vxMotion]="visible()"
                [vxMotionAppear]="true"
                [vxMotionEnterActiveClass]="$enterAnimation()"
                [vxMotionLeaveActiveClass]="$leaveAnimation()"
                [vxMotionOptions]="computedMotionOptions()"
                (vxMotionOnBeforeEnter)="onBeforeEnter($event)"
                (vxMotionOnAfterLeave)="onAfterLeave()"
                [class]="cn(cx('root'), styleClass())"
                [style]="style()"
                role="complementary"
                (keydown)="onKeyDown($event)"
                vxFocusTrap
                [attr.data-p]="dataP"
                [attr.data-p-open]="visible()"
            >
                @if (headlessTemplate() || _headlessTemplate()) {
                    <ng-container *ngTemplateOutlet="headlessTemplate() || _headlessTemplate()"></ng-container>
                } @else {
                    <div [vxBind]="ptm('header')" [class]="cx('header')" [attr.data-pc-section]="'header'">
                        <ng-container *ngTemplateOutlet="headerTemplate() || _headerTemplate()"></ng-container>
                        @if (header()) {
                            <div [vxBind]="ptm('title')" [class]="cx('title')">{{ header() }}</div>
                        }
                        @if (showCloseIcon() && closable()) {
                            <vx-button
                                [pt]="ptm('pcCloseButton')"
                                [class]="cx('pcCloseButton')"
                                (onClick)="close($event)"
                                (keydown.enter)="close($event)"
                                [buttonProps]="closeButtonProps()"
                                [ariaLabel]="ariaCloseLabel()"
                                [attr.data-pc-group-section]="'iconcontainer'"
                                [unstyled]="unstyled()"
                            >
                                <ng-template #icon>
                                    @if (!closeIconTemplate() && !_closeIconTemplate()) {
                                        <svg data-p-icon="times" [attr.data-pc-section]="'closeicon'" />
                                    }
                                    <ng-template *ngTemplateOutlet="closeIconTemplate() || _closeIconTemplate()"></ng-template>
                                </ng-template>
                            </vx-button>
                        }
                    </div>

                    <div [vxBind]="ptm('content')" [class]="cx('content')" [attr.data-pc-section]="'content'">
                        <ng-content></ng-content>
                        <ng-container *ngTemplateOutlet="contentTemplate() || _contentTemplate()"></ng-container>
                    </div>

                    @if (footerTemplate() || _footerTemplate()) {
                        <div [vxBind]="ptm('footer')" [class]="cx('footer')" [attr.data-pc-section]="'footer'">
                            <ng-container *ngTemplateOutlet="footerTemplate() || _footerTemplate()"></ng-container>
                        </div>
                    }
                }
            </div>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class Drawer extends BaseComponent<DrawerPassThrough> {
    componentName = 'Drawer';

    $pcDrawer: Drawer | undefined = inject(DRAWER_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptm('host'));
    }
    /**
     * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @defaultValue 'self'
     * @group Props
     */
    appendTo = input<HTMLElement | ElementRef | TemplateRef<any> | 'self' | 'body' | null | undefined | any>(undefined);
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
     * Whether to block scrolling of the document when drawer is active.
     * @group Props
     */
    blockScroll = input(false, { transform: booleanAttribute });
    /**
     * Inline style of the component.
     * @group Props
     */
    style = input<{ [klass: string]: any } | null | undefined>();
    /**
     * Style class of the component.
     * @group Props
     */
    styleClass = input<string | undefined>();
    /**
     * Aria label of the close icon.
     * @group Props
     */
    ariaCloseLabel = input<string | undefined>();
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
     * Whether an overlay mask is displayed behind the drawer.
     * @group Props
     */
    modal = input(true, { transform: booleanAttribute });
    /**
     * Used to pass all properties of the ButtonProps to the Button component.
     * @group Props
     */
    closeButtonProps = input<ButtonProps>({ severity: 'secondary', text: true, rounded: true });
    /**
     * Whether to dismiss drawer on click of the mask.
     * @group Props
     */
    dismissible = input(true, { transform: booleanAttribute });
    /**
     * Whether to display the close icon.
     * @group Props
     * @deprecated use 'closable' instead.
     */
    showCloseIcon = input(true, { transform: booleanAttribute });
    /**
     * Specifies if pressing escape key should hide the drawer.
     * @group Props
     */
    closeOnEscape = input(true, { transform: booleanAttribute });
    /**
     * Transition options of the animation.
     * @group Props
     * @deprecated since v21.0.0. Use `motionOptions` instead.
     */
    transitionOptions = input<string>('150ms cubic-bezier(0, 0, 0.2, 1)');
    /**
     * The visible property is an input that determines the visibility of the component.
     * Two-way bindable; emits `visibleChange` when the drawer is closed internally
     * (close icon, escape key, mask click).
     * @defaultValue false
     * @group Props
     */
    visible = model<boolean>(false);

    /**
     * Specifies the position of the drawer, valid values are "left", "right", "bottom" and "top".
     * @defaultValue 'left'
     * @group Props
     */
    position = input<'left' | 'right' | 'bottom' | 'top' | 'full'>('left');
    /**
     * Adds a close icon to the header to hide the dialog.
     * @defaultValue false
     * @group Props
     */
    fullScreen = input<boolean>(false);

    $enterAnimation = computed(() => (this.fullScreen() ? 'p-drawer-enter-full' : `p-drawer-enter-${this.position()}`));

    $leaveAnimation = computed(() => (this.fullScreen() ? 'p-drawer-leave-full' : `p-drawer-leave-${this.position()}`));

    /**
     * Title content of the dialog.
     * @group Props
     */
    header = input<string | undefined>();
    /**
     * Style of the mask.
     * @group Props
     */
    maskStyle = input<{ [klass: string]: any } | null | undefined>();
    /**
     * Whether to display close button.
     * @group Props
     * @defaultValue true
     */
    closable = input(true, { transform: booleanAttribute });
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

    containerViewChild = viewChild<ElementRef>('container');

    closeButtonViewChild = viewChild<ElementRef>('closeButton');

    initialized: boolean | undefined;

    modalVisible = signal<boolean>(false);

    container: Nullable<HTMLDivElement>;

    mask: Nullable<HTMLDivElement>;

    maskClickListener: VoidListener;

    documentEscapeListener: VoidListener;

    animationEndListener: VoidListener;

    _componentStyle = inject(DrawerStyle);

    constructor() {
        super();

        // visible can change outside the input system (two-way sync, close/escape/mask flows) —
        // register it so the `onChanges` contract keeps observing those writes (#16).
        this.trackSignalChanges({ visible: this.visible });

        // Former `visible` setter side effect (#18): the first truthy visibility renders the
        // drawer container. Runs on every `visible` change (including the initial value, like the
        // setter did); the `modalVisible` guard keeps it idempotent.
        effect(() => {
            if (this.visible() && !this.modalVisible()) {
                this.modalVisible.set(true);
            }
        });
    }

    onAfterViewInit() {
        this.initialized = true;
    }
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
     * Custom content template.
     * @group Templates
     */
    contentTemplate = contentChild<TemplateRef<void>>('content', { descendants: false });
    /**
     * Custom close icon template.
     * @group Templates
     */
    closeIconTemplate = contentChild<TemplateRef<void>>('closeicon', { descendants: false });
    /**
     * Custom headless template to replace the entire drawer content.
     * @group Templates
     */
    headlessTemplate = contentChild<TemplateRef<void>>('headless', { descendants: false });

    $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo());

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
                case 'footer':
                case 'content':
                case 'closeicon':
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

    _headerTemplate = computed(() => this._templateMap()['header'] as TemplateRef<void> | undefined);

    _footerTemplate = computed(() => this._templateMap()['footer'] as TemplateRef<void> | undefined);

    _contentTemplate = computed(() => this._templateMap()['content'] as TemplateRef<void> | undefined);

    _closeIconTemplate = computed(() => this._templateMap()['closeicon'] as TemplateRef<void> | undefined);

    _headlessTemplate = computed(() => this._templateMap()['headless'] as TemplateRef<void> | undefined);

    onKeyDown(event: KeyboardEvent) {
        if (event.code === 'Escape') {
            this.hide(false);
        }
    }

    show() {
        this.container?.setAttribute(this.$attrSelector, '');

        if (this.autoZIndex()) {
            ZIndexUtils.set('modal', this.container, this.baseZIndex() || this.config.zIndex.modal);
        }

        if (this.modal()) {
            this.enableModality();
        }

        this.onShow.emit({});
    }

    hide(emit: boolean = true) {
        if (emit) {
            this.onHide.emit({});
        }

        if (this.modal()) {
            this.disableModality();
        }
    }

    close(event: Event) {
        this.hide();
        this.visible.set(false);
        this.cd.markForCheck();
        event.preventDefault();
    }

    enableModality() {
        const activeDrawers = this.document.querySelectorAll('[data-p-open="true"]');
        const activeDrawersLength = activeDrawers.length;
        const zIndex = activeDrawersLength == 1 ? String(parseInt((this.container as HTMLDivElement).style.zIndex) - 1) : String(parseInt((activeDrawers[activeDrawersLength - 1] as HTMLElement).style.zIndex) - 1);

        if (!this.mask) {
            this.mask = this.renderer.createElement('div');

            if (this.mask) {
                const style = `z-index: ${zIndex};${this.getMaskStyle()}`;
                setAttribute(this.mask, 'style', style);
                setAttribute(this.mask, 'data-p', this.dataP);
                addClass(this.mask, this.cx('mask'));
            }

            if (this.dismissible()) {
                this.maskClickListener = this.renderer.listen(this.mask, 'click', (event: any) => {
                    if (this.dismissible()) {
                        this.close(event);
                    }
                });
            }

            this.renderer.appendChild(this.document.body, this.mask);
            if (this.blockScroll()) {
                blockBodyScroll();
            }
        }
    }

    getMaskStyle() {
        const maskStyle = this.maskStyle();
        return maskStyle
            ? Object.entries(maskStyle)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join('; ')
            : '';
    }

    disableModality() {
        if (this.mask) {
            !this.$unstyled() && removeClass(this.mask, 'p-overlay-mask-enter-active');
            !this.$unstyled() && addClass(this.mask, 'p-overlay-mask-leave-active');
            this.animationEndListener = this.renderer.listen(this.mask, 'animationend', this.destroyModal.bind(this));
        }
    }

    destroyModal() {
        this.unbindMaskClickListener();

        if (this.mask) {
            this.renderer.removeChild(this.document.body, this.mask);
        }

        if (this.blockScroll()) {
            unblockBodyScroll();
        }

        this.unbindAnimationEndListener();
        this.mask = null;
    }

    onBeforeEnter(event: MotionEvent | undefined) {
        this.container = event?.element as HTMLDivElement;
        this.appendContainer();
        this.show();

        if (this.closeOnEscape()) {
            this.bindDocumentEscapeListener();
        }
    }

    onAfterLeave() {
        this.hide(false);
        ZIndexUtils.clear(this.container);
        this.unbindGlobalListeners();
        this.modalVisible.set(false);
        this.container = null;
    }

    appendContainer() {
        if (this.$appendTo() && this.$appendTo() !== 'self') {
            if (this.$appendTo() === 'body') {
                appendChild(this.document.body, this.container!);
            } else {
                appendChild(this.$appendTo(), this.container!);
            }
        }
    }

    bindDocumentEscapeListener() {
        const documentTarget: any = this.el ? this.el.nativeElement.ownerDocument : this.document;

        this.documentEscapeListener = this.renderer.listen(documentTarget, 'keydown', (event) => {
            if (event.which == 27) {
                if (parseInt((this.container as HTMLDivElement)?.style.zIndex) === ZIndexUtils.get(this.container)) {
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

    unbindMaskClickListener() {
        if (this.maskClickListener) {
            this.maskClickListener();
            this.maskClickListener = null;
        }
    }

    unbindGlobalListeners() {
        this.unbindMaskClickListener();
        this.unbindDocumentEscapeListener();
    }

    unbindAnimationEndListener() {
        if (this.animationEndListener && this.mask) {
            this.animationEndListener();
            this.animationEndListener = null;
        }
    }

    onDestroy() {
        this.initialized = false;

        if (this.visible() && this.modal()) {
            this.destroyModal();
        }

        if (this.$appendTo() && this.container) {
            this.renderer.appendChild(this.el.nativeElement, this.container);
        }

        if (this.container && this.autoZIndex()) {
            ZIndexUtils.clear(this.container);
        }

        this.container = null;
        this.unbindGlobalListeners();
        this.unbindAnimationEndListener();
    }

    get dataP() {
        return this.cn({
            'full-screen': this.position() === 'full',
            [this.position()]: this.position(),
            open: this.visible(),
            modal: this.modal()
        });
    }
}

@NgModule({
    imports: [Drawer, SharedModule],
    exports: [Drawer, SharedModule]
})
export class DrawerModule {}
