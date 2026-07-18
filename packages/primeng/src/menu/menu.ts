import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild,
    contentChildren,
    ElementRef,
    forwardRef,
    Inject,
    inject,
    InjectionToken,
    input,
    linkedSignal,
    NgModule,
    numberAttribute,
    output,
    Pipe,
    PipeTransform,
    PLATFORM_ID,
    signal,
    TemplateRef,
    viewChild,
    ViewEncapsulation,
    ViewRef
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { MotionEvent, MotionOptions } from '@primeuix/motion';
import { absolutePosition, addStyle, appendChild, find, findSingle, focus, isTouchDevice, uuid } from '@primeuix/utils';
import { MenuItem, OverlayService, PrimeTemplate, SharedModule } from 'voxx-ui/api';
import { BadgeModule } from 'voxx-ui/badge';
import { BaseComponent, PARENT_INSTANCE } from 'voxx-ui/basecomponent';
import { Bind, BindModule } from 'voxx-ui/bind';
import { ConnectedOverlayScrollHandler } from 'voxx-ui/dom';
import { MotionModule } from 'voxx-ui/motion';
import { Ripple } from 'voxx-ui/ripple';
import { TooltipModule } from 'voxx-ui/tooltip';
import { VoidListener } from 'voxx-ui/ts-helpers';
import { MenuItemTemplateContext, MenuPassThrough, MenuSubmenuHeaderTemplateContext } from 'voxx-ui/types/menu';
import { ZIndexUtils } from 'voxx-ui/utils';
import { MenuStyle } from './style/menustyle';

const MENU_INSTANCE = new InjectionToken<Menu>('MENU_INSTANCE');

@Pipe({
    name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {
    constructor(
        @Inject(PLATFORM_ID) private readonly platformId: any,
        private readonly sanitizer: DomSanitizer
    ) {}

    public transform(value: string | null | undefined): SafeHtml | string | null | undefined {
        if (!value || !isPlatformBrowser(this.platformId)) {
            return value;
        }

        return this.sanitizer.bypassSecurityTrustHtml(value);
    }
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: '[vxMenuItemContent]',
    imports: [CommonModule, RouterModule, Ripple, TooltipModule, BadgeModule, SharedModule, SafeHtmlPipe, BindModule],
    template: ` <div [class]="cx('itemContent')" (click)="onItemClick($event, item())" [attr.data-pc-section]="'content'" [vxBind]="getPTOptions('itemContent')">
        @if (!itemTemplate()) {
            @if (!item()?.routerLink) {
                <a
                    [attr.title]="item()?.title"
                    [attr.href]="item()?.url || null"
                    [attr.data-automationid]="item()?.automationId"
                    [attr.tabindex]="-1"
                    [class]="cn(cx('itemLink'), item()?.linkClass)"
                    [style]="item()?.linkStyle"
                    [target]="item()?.target"
                    [vxBind]="getPTOptions('itemLink')"
                    vxRipple
                >
                    <ng-container *ngTemplateOutlet="itemContent; context: { $implicit: item() }"></ng-container>
                </a>
            }
            @if (item()?.routerLink) {
                <a
                    [routerLink]="item()?.routerLink"
                    [attr.data-automationid]="item()?.automationId"
                    [attr.tabindex]="-1"
                    [attr.title]="item()?.title"
                    [queryParams]="item()?.queryParams"
                    routerLinkActive="p-menu-item-link-active"
                    [routerLinkActiveOptions]="item()?.routerLinkActiveOptions || { exact: false }"
                    [class]="cn(cx('itemLink'), item()?.linkClass)"
                    [style]="item()?.linkStyle"
                    [target]="item()?.target"
                    [fragment]="item()?.fragment"
                    [queryParamsHandling]="item()?.queryParamsHandling"
                    [preserveFragment]="item()?.preserveFragment"
                    [skipLocationChange]="item()?.skipLocationChange"
                    [replaceUrl]="item()?.replaceUrl"
                    [state]="item()?.state"
                    [vxBind]="getPTOptions('itemLink')"
                    vxRipple
                >
                    <ng-container *ngTemplateOutlet="itemContent; context: { $implicit: item() }"></ng-container>
                </a>
            }
        }

        @if (itemTemplate()) {
            <ng-template *ngTemplateOutlet="itemTemplate(); context: { $implicit: item() }"></ng-template>
        }

        <ng-template #itemContent>
            @if (item()?.icon) {
                <span [class]="cn(cx('itemIcon', { item: item() }), item()?.iconClass)" [vxBind]="getPTOptions('itemIcon')" [style]="item()?.iconStyle" [attr.data-pc-section]="'itemicon'"></span>
            }
            @if (item()?.escape !== false) {
                <span [class]="cn(cx('itemLabel'), item()?.labelClass)" [style]="item()?.labelStyle" [vxBind]="getPTOptions('itemLabel')" [attr.data-pc-section]="'itemlabel'">{{ item()?.label }}</span>
            } @else {
                <span [class]="cn(cx('itemLabel'), item()?.labelClass)" [style]="item()?.labelStyle" [attr.data-pc-section]="'itemlabel'" [innerHTML]="item()?.label | safeHtml" [vxBind]="getPTOptions('itemLabel')"></span>
            }
            @if (item()?.badge) {
                <vx-badge [styleClass]="item()?.badgeStyleClass" [value]="item()?.badge" [pt]="getPTOptions('pcBadge')" [unstyled]="unstyled()" />
            }
        </ng-template>
    </div>`,
    encapsulation: ViewEncapsulation.None,
    providers: [MenuStyle]
})
export class MenuItemContent extends BaseComponent {
    item = input<MenuItem | undefined>(undefined, { alias: 'vxMenuItemContent' });

    itemTemplate = input<any | undefined>();

    menuitemId = input<string>('');

    idx = input<number>(0);

    onMenuItemClick = output<any>();

    menu: Menu;

    _componentStyle = inject(MenuStyle);

    hostName = 'Menu';

    constructor(@Inject(forwardRef(() => Menu)) menu: Menu) {
        super();
        this.menu = menu as Menu;
    }

    onItemClick(event, item) {
        this.onMenuItemClick.emit({ originalEvent: event, item });
    }

    getPTOptions(key: string) {
        return this.menu.getPTOptions(key, this.item(), this.idx(), this.menuitemId());
    }
}
/**
 * Menu is a navigation / command component that supports dynamic and static positioning.
 * @group Components
 */
@Component({
    selector: 'vx-menu',
    imports: [CommonModule, RouterModule, MenuItemContent, TooltipModule, BadgeModule, SharedModule, SafeHtmlPipe, BindModule, MotionModule],
    template: `
        @if (!popup() || overlayVisible) {
            <div
                #container
                [class]="cn(cx('root'), styleClass())"
                [style]="{ ...sx('root'), ...style() }"
                (click)="onOverlayClick($event)"
                [attr.id]="$id()"
                [vxBind]="ptm('root')"
                [attr.data-p]="dataP"
                [vxMotion]="visible || !popup()"
                [vxMotionName]="'p-anchored-overlay'"
                [vxMotionAppear]="!!popup()"
                [vxMotionDisabled]="!popup()"
                [vxMotionOptions]="computedMotionOptions()"
                (vxMotionOnBeforeEnter)="onOverlayBeforeEnter($event)"
                (vxMotionOnAfterLeave)="onOverlayAfterLeave()"
            >
                @if (startTemplate() ?? _startTemplate()) {
                    <div [class]="cx('start')" [vxBind]="ptm('start')" [attr.data-pc-section]="'start'">
                        <ng-container *ngTemplateOutlet="startTemplate() ?? _startTemplate()"></ng-container>
                    </div>
                }
                <ul
                    #list
                    [class]="cx('list')"
                    [vxBind]="ptm('list')"
                    role="menu"
                    [attr.id]="$id() + '_list'"
                    [attr.tabindex]="getTabIndexValue()"
                    [attr.data-pc-section]="'menu'"
                    [attr.aria-activedescendant]="activedescendant()"
                    [attr.aria-label]="ariaLabel()"
                    [attr.aria-labelledBy]="ariaLabelledBy()"
                    (focus)="onListFocus($event)"
                    (blur)="onListBlur($event)"
                    (keydown)="onListKeyDown($event)"
                >
                    @if (hasSubMenu()) {
                        @for (submenu of model(); track submenu; let i = $index) {
                            @if (submenu.separator && submenu.visible !== false) {
                                <li [class]="cx('separator')" [vxBind]="ptm('separator')" role="separator" [attr.data-pc-section]="'separator'"></li>
                            }
                            @if (!submenu.separator) {
                                <li
                                    [class]="cx('submenuLabel')"
                                    [vxBind]="ptm('submenuLabel')"
                                    [attr.data-automationid]="submenu.automationId"
                                    vxTooltip
                                    [tooltipOptions]="submenu.tooltipOptions"
                                    [vxTooltipUnstyled]="unstyled()"
                                    role="none"
                                    [attr.id]="menuitemId(submenu, $id(), i)"
                                    [attr.data-pc-section]="'submenulabel'"
                                >
                                    @if (!submenuHeaderTemplate() && !_submenuHeaderTemplate()) {
                                        @if (submenu.escape !== false) {
                                            <span>{{ submenu.label }}</span>
                                        } @else {
                                            <span [innerHTML]="submenu.label | safeHtml"></span>
                                        }
                                    }
                                    <ng-container *ngTemplateOutlet="submenuHeaderTemplate() ?? _submenuHeaderTemplate(); context: { $implicit: submenu }"></ng-container>
                                </li>
                            }
                            @for (item of submenu.items; track item; let j = $index) {
                                @if (item.separator && (item.visible !== false || submenu.visible !== false)) {
                                    <li [class]="cx('separator')" [vxBind]="ptm('separator')" role="separator" [attr.data-pc-section]="'separator'"></li>
                                }
                                @if (!item.separator && item.visible !== false && (item.visible !== undefined || submenu.visible !== false)) {
                                    <li
                                        [class]="cn(cx('item', { item, id: menuitemId(item, $id(), i, j) }), item?.styleClass)"
                                        [vxBind]="ptm('item')"
                                        [vxMenuItemContent]="item"
                                        [itemTemplate]="itemTemplate() ?? _itemTemplate()"
                                        [idx]="j"
                                        [menuitemId]="menuitemId(item, $id(), i, j)"
                                        [style]="item.style"
                                        (onMenuItemClick)="itemClick($event, menuitemId(item, $id(), i, j))"
                                        vxTooltip
                                        [tooltipOptions]="item.tooltipOptions"
                                        [vxTooltipUnstyled]="unstyled()"
                                        [unstyled]="unstyled()"
                                        role="menuitem"
                                        [attr.aria-label]="label(item.label)"
                                        [attr.data-p-focused]="isItemFocused(menuitemId(item, $id(), i, j))"
                                        [attr.data-p-disabled]="disabled(item.disabled)"
                                        [attr.aria-disabled]="disabled(item.disabled)"
                                        [attr.id]="menuitemId(item, $id(), i, j)"
                                    ></li>
                                }
                            }
                        }
                    }
                    @if (!hasSubMenu()) {
                        @for (item of model(); track item; let i = $index) {
                            @if (item.separator && item.visible !== false) {
                                <li [class]="cx('separator')" [vxBind]="ptm('separator')" role="separator" [attr.data-pc-section]="'separator'"></li>
                            }
                            @if (!item.separator && item.visible !== false) {
                                <li
                                    [class]="cn(cx('item', { item, id: menuitemId(item, $id(), i) }), item?.styleClass)"
                                    [vxBind]="ptm('item')"
                                    [vxMenuItemContent]="item"
                                    [itemTemplate]="itemTemplate() ?? _itemTemplate()"
                                    [idx]="i"
                                    [menuitemId]="menuitemId(item, $id(), i)"
                                    [style]="item.style"
                                    (onMenuItemClick)="itemClick($event, menuitemId(item, $id(), i))"
                                    vxTooltip
                                    [tooltipOptions]="item.tooltipOptions"
                                    [unstyled]="unstyled()"
                                    [vxTooltipUnstyled]="unstyled()"
                                    role="menuitem"
                                    [attr.aria-label]="label(item.label)"
                                    [attr.data-p-focused]="isItemFocused(menuitemId(item, $id(), i))"
                                    [attr.data-p-disabled]="disabled(item.disabled)"
                                    [attr.aria-disabled]="disabled(item.disabled)"
                                    [attr.id]="menuitemId(item, $id(), i)"
                                ></li>
                            }
                        }
                    }
                </ul>
                @if (endTemplate() ?? _endTemplate()) {
                    <div [class]="cx('end')" [vxBind]="ptm('end')" [attr.data-pc-section]="'end'">
                        <ng-container *ngTemplateOutlet="endTemplate() ?? _endTemplate()"></ng-container>
                    </div>
                }
            </div>
        }
    `,

    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [MenuStyle, { provide: MENU_INSTANCE, useExisting: Menu }, { provide: PARENT_INSTANCE, useExisting: Menu }],
    hostDirectives: [Bind]
})
export class Menu extends BaseComponent<MenuPassThrough> {
    componentName = 'Menu';

    /**
     * An array of menuitems.
     * @group Props
     */
    model = input<MenuItem[] | undefined>();
    /**
     * Defines if menu would displayed as a popup.
     * @group Props
     */
    popup = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
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
     * Whether to automatically manage layering.
     * @group Props
     */
    autoZIndex = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Base zIndex value to use in layering.
     * @group Props
     */
    baseZIndex = input<number, unknown>(0, { transform: numberAttribute });
    /**
     * Transition options of the show animation.
     * @deprecated since v21.0.0, use `motionOptions` instead.
     * @group Props
     */
    showTransitionOptions = input<string>('.12s cubic-bezier(0, 0, 0.2, 1)');
    /**
     * Transition options of the hide animation.
     * @deprecated since v21.0.0, use `motionOptions` instead.
     * @group Props
     */
    hideTransitionOptions = input<string>('.1s linear');

    /**
     * Defines a string value that labels an interactive element.
     * @group Props
     */
    ariaLabel = input<string | undefined>();
    /**
     * Identifier of the underlying input element.
     * @group Props
     */
    ariaLabelledBy = input<string | undefined>();
    /**
     * Current id state as a string.
     * @group Props
     */
    id = input<string | undefined>();
    /**
     * Effective id: the `id` input when provided, otherwise a generated unique id.
     */
    $id = linkedSignal(() => this.id() || uuid('pn_id_'));
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    tabindex = input<number, unknown>(0, { transform: numberAttribute });
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
     * Callback to invoke when overlay menu is shown.
     * @group Emits
     */
    onShow = output<any>();
    /**
     * Callback to invoke when overlay menu is hidden.
     * @group Emits
     */
    onHide = output<any>();
    /**
     * Callback to invoke when the list loses focus.
     * @param {Event} event - blur event.
     * @group Emits
     */
    onBlur = output<Event>();
    /**
     * Callback to invoke when the list receives focus.
     * @param {Event} event - focus event.
     * @group Emits
     */
    onFocus = output<Event>();

    listViewChild = viewChild<ElementRef>('list');

    containerViewChild = viewChild<ElementRef>('container');

    $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo());

    container: any;

    scrollHandler: ConnectedOverlayScrollHandler | null | undefined;

    documentClickListener: VoidListener;

    documentResizeListener: VoidListener;

    preventDocumentDefault: boolean | undefined;

    target: any;

    visible: boolean | undefined;

    focusedOptionId = computed(() => {
        return this.focusedOptionIndex() !== -1 ? this.focusedOptionIndex() : null;
    });

    public focusedOptionIndex: any = signal<any>(-1);

    public selectedOptionIndex: any = signal<any>(-1);

    public focused: boolean | undefined = false;

    public overlayVisible: boolean | undefined = false;

    $pcMenu: Menu | undefined = inject(MENU_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    _componentStyle = inject(MenuStyle);

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptm('host'));
    }

    constructor(public overlayService: OverlayService) {
        super();
    }

    getPTOptions(key: string, item: any, index: number, id: string) {
        return this.ptm(key, {
            context: {
                item: item,
                index: index,
                focused: this.isItemFocused(id),
                disabled: this.disabled(item.disabled)
            }
        });
    }
    /**
     * Toggles the visibility of the popup menu.
     * @param {Event} event - Browser event.
     * @group Method
     */
    public toggle(event: Event) {
        if (this.visible) this.hide();
        else this.show(event);

        this.preventDocumentDefault = true;
    }
    /**
     * Displays the popup menu.
     * @param {Event} event - Browser event.
     * @group Method
     */
    public show(event: any) {
        // Clear container if exists but overlay is not currently visible (fast toggle case)
        if (this.container && !this.overlayVisible) {
            this.container = undefined;
        }

        this.target = event.currentTarget;
        this.visible = true;
        this.preventDocumentDefault = true;
        this.overlayVisible = true;
        this.cd.markForCheck();
    }

    onInit() {
        if (!this.popup()) {
            this.bindDocumentClickListener();
        }
    }

    /**
     * Defines template option for start.
     * @group Templates
     */
    startTemplate = contentChild<TemplateRef<void>>('start', { descendants: false });
    _startTemplate = computed<TemplateRef<void> | undefined>(() => this.templates().find((item) => item.getType() === 'start')?.template);

    /**
     * Defines template option for end.
     * @group Templates
     */
    endTemplate = contentChild<TemplateRef<void>>('end', { descendants: false });
    _endTemplate = computed<TemplateRef<void> | undefined>(() => this.templates().find((item) => item.getType() === 'end')?.template);

    /**
     * Defines template option for header.
     * @group Templates
     */
    headerTemplate = contentChild<TemplateRef<void>>('header', { descendants: false });
    _headerTemplate: TemplateRef<void> | undefined;

    /**
     * Custom item template.
     * @param {MenuItemTemplateContext} context - item context.
     * @see {@link MenuItemTemplateContext}
     * @group Templates
     */
    itemTemplate = contentChild<TemplateRef<MenuItemTemplateContext>>('item', { descendants: false });
    _itemTemplate = computed<TemplateRef<MenuItemTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => !['start', 'end', 'submenuheader'].includes(item.getType()))
                .at(-1)?.template
    );

    /**
     * Custom submenu header template.
     * @param {MenuSubmenuHeaderTemplateContext} context - submenu header context.
     * @see {@link MenuSubmenuHeaderTemplateContext}
     * @group Templates
     */
    submenuHeaderTemplate = contentChild<TemplateRef<MenuSubmenuHeaderTemplateContext>>('submenuheader', { descendants: false });
    _submenuHeaderTemplate = computed<TemplateRef<MenuSubmenuHeaderTemplateContext> | undefined>(() => this.templates().find((item) => item.getType() === 'submenuheader')?.template);

    templates = contentChildren(PrimeTemplate);

    getTabIndexValue(): string | null {
        return this.tabindex() !== undefined ? this.tabindex().toString() : null;
    }

    onOverlayBeforeEnter(event: MotionEvent | undefined) {
        this.container = event?.element as HTMLElement;

        if (this.container) {
            addStyle(this.container, { position: 'absolute', top: '0' });
            this.appendOverlay();
            this.moveOnTop();

            this.$attrSelector && this.container?.setAttribute(this.$attrSelector, '');
            this.bindDocumentClickListener();
            this.bindDocumentResizeListener();
            this.bindScrollListener();
            absolutePosition(this.container!, this.target);
            focus(this.listViewChild()?.nativeElement);
            this.onShow.emit({});
        }
    }

    onOverlayAfterLeave() {
        this.restoreOverlayAppend();
        this.onOverlayHide();
        this.overlayVisible = false;
        this.onHide.emit({});
    }

    appendOverlay() {
        if (this.$appendTo() && this.$appendTo() !== 'self') {
            if (this.$appendTo() === 'body') {
                appendChild(this.document.body, this.container!);
            } else {
                appendChild(this.$appendTo(), this.container!);
            }
        }
    }

    restoreOverlayAppend() {
        if (this.container && this.$appendTo() !== 'self') {
            appendChild(this.el.nativeElement, this.container);
        }
    }

    moveOnTop() {
        if (this.autoZIndex()) {
            ZIndexUtils.set('menu', this.container, this.baseZIndex() + this.config.zIndex.menu);
        }
    }
    /**
     * Hides the popup menu.
     * @group Method
     */
    public hide() {
        this.visible = false;

        this.cd.markForCheck();
    }

    onWindowResize() {
        if (this.visible && !isTouchDevice()) {
            this.hide();
        }
    }

    menuitemId(item: MenuItem, id: string | any, index?: string | number, childIndex?: string | number) {
        return item?.id ?? `${id}_${index}${childIndex !== undefined ? '_' + childIndex : ''}`;
    }

    isItemFocused(id) {
        return this.focusedOptionId() === id;
    }

    label(label: any) {
        return typeof label === 'function' ? label() : label;
    }

    disabled(disabled: any) {
        return typeof disabled === 'function' ? disabled() : typeof disabled === 'undefined' ? false : disabled;
    }

    activedescendant() {
        return this.focused ? this.focusedOptionId() : undefined;
    }

    onListFocus(event: Event) {
        if (!this.focused) {
            this.focused = true;
            !this.popup() && this.changeFocusedOptionIndex(0);
            this.onFocus.emit(event);
        }
    }

    onListBlur(event: FocusEvent | MouseEvent) {
        if (this.focused) {
            this.focused = false;
            this.changeFocusedOptionIndex(-1);
            this.selectedOptionIndex.set(-1);
            this.focusedOptionIndex.set(-1);
            this.onBlur.emit(event);
        }
    }

    onListKeyDown(event) {
        switch (event.code) {
            case 'ArrowDown':
                this.onArrowDownKey(event);
                break;

            case 'ArrowUp':
                this.onArrowUpKey(event);
                break;

            case 'Home':
                this.onHomeKey(event);
                break;

            case 'End':
                this.onEndKey(event);
                break;

            case 'Enter':
                this.onEnterKey(event);
                break;

            case 'NumpadEnter':
                this.onEnterKey(event);
                break;

            case 'Space':
                this.onSpaceKey(event);
                break;

            case 'Escape':
            case 'Tab':
                if (this.popup()) {
                    focus(this.target);
                    this.hide();
                }
                this.overlayVisible && this.hide();
                break;

            default:
                break;
        }
    }

    onArrowDownKey(event) {
        const optionIndex = this.findNextOptionIndex(this.focusedOptionIndex());
        this.changeFocusedOptionIndex(optionIndex);
        event.preventDefault();
    }

    onArrowUpKey(event) {
        if (event.altKey && this.popup()) {
            focus(this.target);
            this.hide();
            event.preventDefault();
        } else {
            const optionIndex = this.findPrevOptionIndex(this.focusedOptionIndex());

            this.changeFocusedOptionIndex(optionIndex);
            event.preventDefault();
        }
    }

    onHomeKey(event) {
        this.changeFocusedOptionIndex(0);
        event.preventDefault();
    }

    onEndKey(event) {
        this.changeFocusedOptionIndex(find(this.containerViewChild()?.nativeElement, 'li[data-pc-section="item"][data-p-disabled="false"]').length - 1);
        event.preventDefault();
    }

    onEnterKey(event) {
        const element = <any>findSingle(this.containerViewChild()?.nativeElement, `li[id="${`${this.focusedOptionIndex()}`}"]`);
        const anchorElement = element && (<any>findSingle(element, '[data-pc-section="itemlink"]') || findSingle(element, 'a,button'));

        this.popup() && focus(this.target);
        anchorElement ? anchorElement.click() : element && element.click();

        event.preventDefault();
    }

    onSpaceKey(event) {
        this.onEnterKey(event);
    }

    findNextOptionIndex(index) {
        const links = find(this.containerViewChild()?.nativeElement, 'li[data-pc-section="item"][data-p-disabled="false"]');
        const matchedOptionIndex = [...links].findIndex((link) => link.id === index);

        return matchedOptionIndex > -1 ? matchedOptionIndex + 1 : 0;
    }

    findPrevOptionIndex(index) {
        const links = find(this.containerViewChild()?.nativeElement, 'li[data-pc-section="item"][data-p-disabled="false"]');
        const matchedOptionIndex = [...links].findIndex((link) => link.id === index);

        return matchedOptionIndex > -1 ? matchedOptionIndex - 1 : 0;
    }

    changeFocusedOptionIndex(index) {
        const links = find(this.containerViewChild()?.nativeElement, 'li[data-pc-section="item"][data-p-disabled="false"]');
        if (links.length > 0) {
            let order = index >= links.length ? links.length - 1 : index < 0 ? 0 : index;
            order > -1 && this.focusedOptionIndex.set(links[order].getAttribute('id'));
        }
    }

    itemClick(event: any, id: string) {
        const { originalEvent, item } = event;

        if (!this.focused) {
            this.focused = true;
            this.onFocus.emit(originalEvent);
        }

        if (item.disabled) {
            originalEvent.preventDefault();
            return;
        }

        if (!item.url && !item.routerLink) {
            originalEvent.preventDefault();
        }

        if (item.command) {
            item.command({
                originalEvent: originalEvent,
                item: item
            });
        }

        if (this.popup()) {
            this.hide();
        }

        if (!this.popup() && this.focusedOptionIndex() !== id) {
            this.focusedOptionIndex.set(id);
        }
    }

    onOverlayClick(event: Event) {
        if (this.popup()) {
            this.overlayService.add({
                originalEvent: event,
                target: this.el.nativeElement
            });
        }

        this.preventDocumentDefault = true;
    }

    bindDocumentClickListener() {
        if (!this.documentClickListener && isPlatformBrowser(this.platformId)) {
            const documentTarget: any = this.el ? this.el.nativeElement.ownerDocument : 'document';

            this.documentClickListener = this.renderer.listen(documentTarget, 'click', (event) => {
                const isOutsideContainer = this.containerViewChild()?.nativeElement && !this.containerViewChild()?.nativeElement.contains(event.target);
                const isOutsideTarget = !(this.target && (this.target === event.target || this.target.contains(event.target)));
                if (!this.popup() && isOutsideContainer && isOutsideTarget) {
                    this.onListBlur(event);
                }
                if (this.preventDocumentDefault && this.overlayVisible && isOutsideContainer && isOutsideTarget) {
                    this.hide();
                    this.preventDocumentDefault = false;
                }
            });
        }
    }

    unbindDocumentClickListener() {
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
        }
    }

    bindDocumentResizeListener() {
        if (!this.documentResizeListener && isPlatformBrowser(this.platformId)) {
            const window = this.document.defaultView;
            this.documentResizeListener = this.renderer.listen(window, 'resize', this.onWindowResize.bind(this));
        }
    }

    unbindDocumentResizeListener() {
        if (this.documentResizeListener) {
            this.documentResizeListener();
            this.documentResizeListener = null;
        }
    }

    bindScrollListener() {
        if (!this.scrollHandler && isPlatformBrowser(this.platformId)) {
            this.scrollHandler = new ConnectedOverlayScrollHandler(this.target, () => {
                if (this.visible) {
                    this.hide();
                }
            });
        }

        this.scrollHandler?.bindScrollListener();
    }

    unbindScrollListener() {
        if (this.scrollHandler) {
            this.scrollHandler.unbindScrollListener();
            this.scrollHandler = null;
        }
    }

    onOverlayHide() {
        this.unbindDocumentClickListener();
        this.unbindDocumentResizeListener();
        this.unbindScrollListener();
        this.preventDocumentDefault = false;

        if (!(this.cd as ViewRef).destroyed) {
            this.target = null;
        }
        if (this.container) {
            if (this.autoZIndex()) {
                ZIndexUtils.clear(this.container);
            }
            this.container = undefined;
        }
    }

    onDestroy() {
        if (this.popup()) {
            if (this.scrollHandler) {
                this.scrollHandler.destroy();
                this.scrollHandler = null;
            }

            if (this.container) {
                if (this.autoZIndex()) {
                    ZIndexUtils.clear(this.container);
                }
                this.container = undefined;
            }

            this.restoreOverlayAppend();
            this.onOverlayHide();
        }

        if (!this.popup()) {
            this.unbindDocumentClickListener();
        }
    }

    hasSubMenu(): boolean {
        return this.model()?.some((item) => item.items) ?? false;
    }

    isItemHidden(item: any): boolean {
        if (item.separator) {
            return item.visible === false || (item.items && item.items.some((subitem) => subitem.visible !== false));
        }
        return item.visible === false;
    }

    get dataP() {
        return this.cn({
            popup: this.popup()
        });
    }
}

@NgModule({
    imports: [Menu, SharedModule, SafeHtmlPipe],
    exports: [Menu, SharedModule, SafeHtmlPipe]
})
export class MenuModule {}
