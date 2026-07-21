import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, contentChild, contentChildren, ElementRef, inject, InjectionToken, input, linkedSignal, NgModule, NgZone, output, SimpleChanges, TemplateRef, viewChild, ViewEncapsulation } from '@angular/core';
import { findSingle, getHeight, getWidth, isTouchDevice, isVisible } from '@primeuix/utils';
import { PrimeTemplate, ScrollerOptions, SharedModule } from 'voxx-ui/api';
import { BaseComponent, PARENT_INSTANCE } from 'voxx-ui/basecomponent';
import { Bind } from 'voxx-ui/bind';
import { SpinnerIcon } from 'voxx-ui/icons';
import { VoidListener } from 'voxx-ui/ts-helpers';
import {
    ScrollerContentTemplateContext,
    ScrollerItemTemplateContext,
    ScrollerLazyLoadEvent,
    ScrollerLoaderIconTemplateContext,
    ScrollerLoaderTemplateContext,
    ScrollerScrollEvent,
    ScrollerScrollIndexChangeEvent,
    ScrollerToType,
    VirtualScrollerPassThrough
} from 'voxx-ui/types/scroller';
import { ScrollerStyle } from './style/scrollerstyle';

const SCROLLER_INSTANCE = new InjectionToken<Scroller>('SCROLLER_INSTANCE');

/**
 * Scroller is a performance-approach to handle huge data efficiently.
 * @group Components
 */
@Component({
    selector: 'vx-scroller, vx-virtualscroller, vx-virtual-scroller, vx-virtualScroller',
    imports: [CommonModule, SpinnerIcon, SharedModule, Bind],
    template: `
        @if (!_disabled) {
            <div #element [attr.id]="_id" [attr.tabindex]="_tabindex" [style]="_style" [class]="cn(cx('root'), _styleClass)" (scroll)="onContainerScroll($event)" [vxBind]="ptm('root')">
                @if (contentTemplate() || _contentTemplate()) {
                    <ng-container *ngTemplateOutlet="contentTemplate() || _contentTemplate(); context: { $implicit: loadedItems, options: getContentOptions() }"></ng-container>
                } @else {
                    <div #content [class]="cn(cx('content'), contentStyleClass)" [style]="contentStyle" [vxBind]="ptm('content')">
                        @for (item of loadedItems; track _trackBy ? _trackBy(index, item) : item; let index = $index) {
                            <ng-container *ngTemplateOutlet="itemTemplate() || _itemTemplate(); context: { $implicit: item, options: getOptions(index) }"></ng-container>
                        }
                    </div>
                }
                @if (_showSpacer) {
                    <div [class]="cx('spacer')" [style]="spacerStyle" [vxBind]="ptm('spacer')"></div>
                }
                @if (!_loaderDisabled && _showLoader && d_loading) {
                    <div [class]="cx('loader')" [vxBind]="ptm('loader')">
                        @if (loaderTemplate() || _loaderTemplate()) {
                            @for (item of loaderArr; track item; let index = $index) {
                                <ng-container
                                    *ngTemplateOutlet="
                                        loaderTemplate() || _loaderTemplate();
                                        context: {
                                            options: getLoaderOptions(index, both && { numCols: numItemsInViewport.cols })
                                        }
                                    "
                                ></ng-container>
                            }
                        } @else {
                            @if (loaderIconTemplate() || _loaderIconTemplate()) {
                                <ng-container *ngTemplateOutlet="loaderIconTemplate() || _loaderIconTemplate(); context: { options: { styleClass: 'p-virtualscroller-loading-icon' } }"></ng-container>
                            } @else {
                                <svg data-p-icon="spinner" [class]="cx('loadingIcon')" [spin]="true" [vxBind]="ptm('loadingIcon')" />
                            }
                        }
                    </div>
                }
            </div>
        } @else {
            <ng-content></ng-content>
            @if (contentTemplate() || _contentTemplate()) {
                <ng-container *ngTemplateOutlet="contentTemplate() || _contentTemplate(); context: { $implicit: _items, options: { rows: _items, columns: loadedColumns } }"></ng-container>
            }
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[style.height]': 'height'
    },
    providers: [ScrollerStyle, { provide: SCROLLER_INSTANCE, useExisting: Scroller }, { provide: PARENT_INSTANCE, useExisting: Scroller }],
    hostDirectives: [Bind]
})
export class Scroller extends BaseComponent<VirtualScrollerPassThrough> {
    componentName = 'VirtualScroller';

    bindDirectiveInstance = inject(Bind, { self: true });

    $pcScroller: Scroller | undefined = inject(SCROLLER_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    hostName = input<string>('');
    /**
     * Unique identifier of the element.
     * @group Props
     */
    id = input<string | undefined>(undefined);
    /**
     * Inline style of the component.
     * @group Props
     */
    style = input<any>(undefined);
    /**
     * Style class of the element.
     * @group Props
     */
    styleClass = input<string | undefined>(undefined);
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    tabindex = input<number>(0);
    /**
     * An array of objects to display.
     * @group Props
     */
    items = input<any[] | undefined | null>(undefined);
    /**
     * The height/width of item according to orientation.
     * @group Props
     */
    itemSize = input<number[] | number | undefined>(0);
    /**
     * Height of the scroll viewport.
     * @group Props
     */
    scrollHeight = input<string | undefined>(undefined);
    /**
     * Width of the scroll viewport.
     * @group Props
     */
    scrollWidth = input<string | undefined>(undefined);
    /**
     * The orientation of scrollbar.
     * @group Props
     */
    orientation = input<'vertical' | 'horizontal' | 'both'>('vertical');
    /**
     * Used to specify how many items to load in each load method in lazy mode.
     * @group Props
     */
    step = input<number>(0);
    /**
     * Delay in scroll before new data is loaded.
     * @group Props
     */
    delay = input<number>(0);
    /**
     * Delay after window's resize finishes.
     * @group Props
     */
    resizeDelay = input<number>(10);
    /**
     * Used to append each loaded item to top without removing any items from the DOM. Using very large data may cause the browser to crash.
     * @group Props
     */
    appendOnly = input<boolean>(false);
    /**
     * Specifies whether the scroller should be displayed inline or not.
     * @group Props
     */
    inline = input<boolean>(false);
    /**
     * Defines if data is loaded and interacted with in lazy manner.
     * @group Props
     */
    lazy = input<boolean>(false);
    /**
     * If disabled, the scroller feature is eliminated and the content is displayed directly.
     * @group Props
     */
    disabled = input<boolean>(false);
    /**
     * Used to implement a custom loader instead of using the loader feature in the scroller.
     * @group Props
     */
    loaderDisabled = input<boolean>(false);
    /**
     * Columns to display.
     * @group Props
     */
    columns = input<any[] | undefined | null>(undefined);
    /**
     * Used to implement a custom spacer instead of using the spacer feature in the scroller.
     * @group Props
     */
    showSpacer = input<boolean>(true);
    /**
     * Defines whether to show loader.
     * @group Props
     */
    showLoader = input<boolean>(false);
    /**
     * Determines how many additional elements to add to the DOM outside of the view. According to the scrolls made up and down, extra items are added in a certain algorithm in the form of multiples of this number. Default value is half the number of items shown in the view.
     * @group Props
     */
    numToleratedItems = input<any>(undefined);
    /**
     * Defines whether the data is loaded.
     * @group Props
     */
    loading = input<boolean | undefined>(undefined);
    /**
     * Defines whether to dynamically change the height or width of scrollable container.
     * @group Props
     */
    autoSize = input<boolean>(false);
    /**
     * Function to optimize the dom operations by delegating to ngForTrackBy, default algoritm checks for object identity.
     * @group Props
     */
    trackBy = input<Function | undefined>(undefined);
    /**
     * Defines whether to use the scroller feature. The properties of scroller component can be used like an object in it.
     * @group Props
     */
    options = input<ScrollerOptions | undefined>(undefined);
    /**
     * Callback to invoke in lazy mode to load new data.
     * @param {ScrollerLazyLoadEvent} event - Custom lazy load event.
     * @group Emits
     */
    onLazyLoad = output<ScrollerLazyLoadEvent>();
    /**
     * Callback to invoke when scroll position changes.
     * @param {ScrollerScrollEvent} event - Custom scroll event.
     * @group Emits
     */
    onScroll = output<ScrollerScrollEvent>();
    /**
     * Callback to invoke when scroll position and item's range in view changes.
     * @param {ScrollerScrollEvent} event - Custom scroll index change event.
     * @group Emits
     */
    onScrollIndexChange = output<ScrollerScrollIndexChangeEvent>();

    elementViewChild = viewChild<ElementRef>('element');

    contentViewChild = viewChild<ElementRef>('content');

    height: string;

    /**
     * Resolved option values. Signal-native replacement of the former `options` setter, which
     * copied every key present on the `options` aggregate onto the matching individual field.
     * Precedence per key: a key present on `options()` wins over the individual `input()`
     * (matching the original setter order — `options` was declared/applied last). Consumed by
     * the `_xxx` getters below, so all internal `this._xxx` reads stay unchanged.
     */
    private _resolvedOptions = computed<Record<string, any>>(() => {
        const opts = (this.options() as Record<string, any>) || undefined;
        const pick = (key: string, value: any) => (opts && key in opts ? opts[key] : value);
        return {
            id: pick('id', this.id()),
            style: pick('style', this.style()),
            styleClass: pick('styleClass', this.styleClass()),
            tabindex: pick('tabindex', this.tabindex()),
            items: pick('items', this.items()),
            itemSize: pick('itemSize', this.itemSize()),
            scrollHeight: pick('scrollHeight', this.scrollHeight()),
            scrollWidth: pick('scrollWidth', this.scrollWidth()),
            orientation: pick('orientation', this.orientation()),
            step: pick('step', this.step()),
            delay: pick('delay', this.delay()),
            resizeDelay: pick('resizeDelay', this.resizeDelay()),
            appendOnly: pick('appendOnly', this.appendOnly()),
            inline: pick('inline', this.inline()),
            lazy: pick('lazy', this.lazy()),
            disabled: pick('disabled', this.disabled()),
            loaderDisabled: pick('loaderDisabled', this.loaderDisabled()),
            columns: pick('columns', this.columns()),
            showSpacer: pick('showSpacer', this.showSpacer()),
            showLoader: pick('showLoader', this.showLoader()),
            numToleratedItems: pick('numToleratedItems', this.numToleratedItems()),
            loading: pick('loading', this.loading()),
            autoSize: pick('autoSize', this.autoSize()),
            trackBy: pick('trackBy', this.trackBy()),
            contentStyleClass: opts?.contentStyleClass
        };
    });

    // Each resolved `_xxx` is a linkedSignal seeded from `_resolvedOptions()` so it stays reactive
    // to input/`options` changes, while remaining locally writable (imperative overrides that the
    // next input change resets — matching the former writable backing field). Getter/setter pairs
    // preserve every `this._xxx` read/write site unchanged.
    private _idState = linkedSignal(() => this._resolvedOptions().id);
    get _id(): string | undefined {
        return this._idState();
    }
    set _id(val: string | undefined) {
        this._idState.set(val);
    }
    private _styleState = linkedSignal(() => this._resolvedOptions().style);
    get _style(): { [klass: string]: any } | null | undefined {
        return this._styleState();
    }
    set _style(val: { [klass: string]: any } | null | undefined) {
        this._styleState.set(val);
    }
    private _styleClassState = linkedSignal(() => this._resolvedOptions().styleClass);
    get _styleClass(): string | undefined {
        return this._styleClassState();
    }
    set _styleClass(val: string | undefined) {
        this._styleClassState.set(val);
    }
    private _tabindexState = linkedSignal(() => this._resolvedOptions().tabindex);
    get _tabindex(): number {
        return this._tabindexState();
    }
    set _tabindex(val: number) {
        this._tabindexState.set(val);
    }
    private _itemsState = linkedSignal(() => this._resolvedOptions().items);
    get _items(): any[] | undefined | null {
        return this._itemsState();
    }
    set _items(val: any[] | undefined | null) {
        this._itemsState.set(val);
    }
    private _itemSizeState = linkedSignal(() => this._resolvedOptions().itemSize);
    get _itemSize(): number | number[] | undefined {
        return this._itemSizeState();
    }
    set _itemSize(val: number | number[] | undefined) {
        this._itemSizeState.set(val);
    }
    private _scrollHeightState = linkedSignal(() => this._resolvedOptions().scrollHeight);
    get _scrollHeight(): string | undefined {
        return this._scrollHeightState();
    }
    set _scrollHeight(val: string | undefined) {
        this._scrollHeightState.set(val);
    }
    private _scrollWidthState = linkedSignal(() => this._resolvedOptions().scrollWidth);
    get _scrollWidth(): string | undefined {
        return this._scrollWidthState();
    }
    set _scrollWidth(val: string | undefined) {
        this._scrollWidthState.set(val);
    }
    private _orientationState = linkedSignal(() => this._resolvedOptions().orientation);
    get _orientation(): 'vertical' | 'horizontal' | 'both' {
        return this._orientationState();
    }
    set _orientation(val: 'vertical' | 'horizontal' | 'both') {
        this._orientationState.set(val);
    }
    private _stepState = linkedSignal(() => this._resolvedOptions().step);
    get _step(): number {
        return this._stepState();
    }
    set _step(val: number) {
        this._stepState.set(val);
    }
    private _delayState = linkedSignal(() => this._resolvedOptions().delay);
    get _delay(): number {
        return this._delayState();
    }
    set _delay(val: number) {
        this._delayState.set(val);
    }
    private _resizeDelayState = linkedSignal(() => this._resolvedOptions().resizeDelay);
    get _resizeDelay(): number {
        return this._resizeDelayState();
    }
    set _resizeDelay(val: number) {
        this._resizeDelayState.set(val);
    }
    private _appendOnlyState = linkedSignal(() => this._resolvedOptions().appendOnly);
    get _appendOnly(): boolean {
        return this._appendOnlyState();
    }
    set _appendOnly(val: boolean) {
        this._appendOnlyState.set(val);
    }
    private _inlineState = linkedSignal(() => this._resolvedOptions().inline);
    get _inline(): boolean {
        return this._inlineState();
    }
    set _inline(val: boolean) {
        this._inlineState.set(val);
    }
    private _lazyState = linkedSignal(() => this._resolvedOptions().lazy);
    get _lazy(): boolean {
        return this._lazyState();
    }
    set _lazy(val: boolean) {
        this._lazyState.set(val);
    }
    private _disabledState = linkedSignal(() => this._resolvedOptions().disabled);
    get _disabled(): boolean {
        return this._disabledState();
    }
    set _disabled(val: boolean) {
        this._disabledState.set(val);
    }
    private _loaderDisabledState = linkedSignal(() => this._resolvedOptions().loaderDisabled);
    get _loaderDisabled(): boolean {
        return this._loaderDisabledState();
    }
    set _loaderDisabled(val: boolean) {
        this._loaderDisabledState.set(val);
    }
    private _columnsState = linkedSignal(() => this._resolvedOptions().columns);
    get _columns(): any[] | undefined | null {
        return this._columnsState();
    }
    set _columns(val: any[] | undefined | null) {
        this._columnsState.set(val);
    }
    private _showSpacerState = linkedSignal(() => this._resolvedOptions().showSpacer);
    get _showSpacer(): boolean {
        return this._showSpacerState();
    }
    set _showSpacer(val: boolean) {
        this._showSpacerState.set(val);
    }
    private _showLoaderState = linkedSignal(() => this._resolvedOptions().showLoader);
    get _showLoader(): boolean {
        return this._showLoaderState();
    }
    set _showLoader(val: boolean) {
        this._showLoaderState.set(val);
    }
    private _numToleratedItemsState = linkedSignal(() => this._resolvedOptions().numToleratedItems);
    get _numToleratedItems(): any {
        return this._numToleratedItemsState();
    }
    set _numToleratedItems(val: any) {
        this._numToleratedItemsState.set(val);
    }
    private _loadingState = linkedSignal(() => this._resolvedOptions().loading);
    get _loading(): boolean | undefined {
        return this._loadingState();
    }
    set _loading(val: boolean | undefined) {
        this._loadingState.set(val);
    }
    private _autoSizeState = linkedSignal(() => this._resolvedOptions().autoSize);
    get _autoSize(): boolean {
        return this._autoSizeState();
    }
    set _autoSize(val: boolean) {
        this._autoSizeState.set(val);
    }
    private _trackByState = linkedSignal(() => this._resolvedOptions().trackBy);
    get _trackBy(): any {
        return this._trackByState();
    }
    set _trackBy(val: any) {
        this._trackByState.set(val);
    }
    get _options(): ScrollerOptions | undefined {
        return this.options();
    }

    d_loading: boolean = false;

    d_numToleratedItems: any;

    contentEl: any;
    /**
     * Content template of the component.
     * @param {ScrollerContentTemplateContext} context - content context.
     * @see {@link ScrollerContentTemplateContext}
     * @group Templates
     */
    contentTemplate = contentChild<TemplateRef<ScrollerContentTemplateContext>>('content', { descendants: false });

    /**
     * Item template of the component.
     * @param {ScrollerItemTemplateContext} context - item context.
     * @see {@link ScrollerItemTemplateContext}
     * @group Templates
     */
    itemTemplate = contentChild<TemplateRef<ScrollerItemTemplateContext>>('item', { descendants: false });

    /**
     * Loader template of the component.
     * @param {ScrollerLoaderTemplateContext} context - loader context.
     * @see {@link ScrollerLoaderTemplateContext}
     * @group Templates
     */
    loaderTemplate = contentChild<TemplateRef<ScrollerLoaderTemplateContext>>('loader', { descendants: false });

    /**
     * Loader icon template of the component.
     * @param {ScrollerLoaderIconTemplateContext} context - loader icon context.
     * @see {@link ScrollerLoaderIconTemplateContext}
     * @group Templates
     */
    loaderIconTemplate = contentChild<TemplateRef<ScrollerLoaderIconTemplateContext>>('loadericon', { descendants: false });

    templates = contentChildren(PrimeTemplate);

    /**
     * Former `ngAfterContentInit` template map (#18): each `vxTemplate` type resolves to the last
     * matching projected template. Unknown types fall back to the item template, matching the
     * legacy `default` switch branch.
     */
    _contentTemplate = computed<TemplateRef<ScrollerContentTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'content')
                .at(-1)?.template
    );

    _itemTemplate = computed<TemplateRef<ScrollerItemTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'item' || !['content', 'loader', 'loadericon'].includes(item.getType()))
                .at(-1)?.template
    );

    _loaderTemplate = computed<TemplateRef<ScrollerLoaderTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'loader')
                .at(-1)?.template
    );

    _loaderIconTemplate = computed<TemplateRef<ScrollerLoaderIconTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'loadericon')
                .at(-1)?.template
    );

    first: any = 0;

    last: any = 0;

    page: number = 0;

    isRangeChanged: boolean = false;

    numItemsInViewport: any = 0;

    lastScrollPos: any = 0;

    lazyLoadState: any = {};

    loaderArr: any[] = [];

    spacerStyle: { [klass: string]: any } | null | undefined = {};

    contentStyle: { [klass: string]: any } | null | undefined = {};

    scrollTimeout: any;

    resizeTimeout: any;

    initialized: boolean = false;

    windowResizeListener: VoidListener;

    defaultWidth: number | undefined;

    defaultHeight: number | undefined;

    defaultContentWidth: number | undefined;

    defaultContentHeight: number | undefined;

    get contentStyleClass() {
        return this._resolvedOptions().contentStyleClass;
    }

    get vertical() {
        return this._orientation === 'vertical';
    }

    get horizontal() {
        return this._orientation === 'horizontal';
    }

    get both() {
        return this._orientation === 'both';
    }

    get loadedItems() {
        if (this._items && !this.d_loading) {
            if (this.both) {
                return this._items.slice(this._appendOnly ? 0 : this.first.rows, this.last.rows).map((item) => {
                    if (this._columns) {
                        return item;
                    } else if (Array.isArray(item)) {
                        return item.slice(this._appendOnly ? 0 : this.first.cols, this.last.cols);
                    } else {
                        return item;
                    }
                });
            } else if (this.horizontal && this._columns) return this._items;
            else return this._items.slice(this._appendOnly ? 0 : this.first, this.last);
        }

        return [];
    }

    get loadedRows() {
        return this.d_loading ? (this._loaderDisabled ? this.loaderArr : []) : this.loadedItems;
    }

    get loadedColumns() {
        if (this._columns && (this.both || this.horizontal)) {
            return this.d_loading && this._loaderDisabled ? (this.both ? this.loaderArr[0] : this.loaderArr) : this._columns.slice(this.both ? this.first.cols : this.first, this.both ? this.last.cols : this.last);
        }

        return this._columns;
    }

    _componentStyle = inject(ScrollerStyle);

    constructor(private zone: NgZone) {
        super();
    }

    onInit() {
        this.setInitialState();
    }

    onChanges(simpleChanges: SimpleChanges) {
        let isLoadingChanged = false;
        if (this._scrollHeight == '100%') {
            this.height = '100%';
        }
        if (simpleChanges.loading) {
            const { previousValue, currentValue } = simpleChanges.loading;

            if (this._lazy && previousValue !== currentValue && currentValue !== this.d_loading) {
                this.d_loading = currentValue;
                isLoadingChanged = true;
            }
        }

        if (simpleChanges.orientation) {
            this.lastScrollPos = this.both ? { top: 0, left: 0 } : 0;
        }

        if (simpleChanges.numToleratedItems) {
            const { previousValue, currentValue } = simpleChanges.numToleratedItems;

            if (previousValue !== currentValue && currentValue !== this.d_numToleratedItems) {
                this.d_numToleratedItems = currentValue;
            }
        }

        if (simpleChanges.options) {
            const { previousValue, currentValue } = simpleChanges.options;

            if (this._lazy && previousValue?.loading !== currentValue?.loading && currentValue?.loading !== this.d_loading) {
                this.d_loading = currentValue.loading;
                isLoadingChanged = true;
            }

            if (previousValue?.numToleratedItems !== currentValue?.numToleratedItems && currentValue?.numToleratedItems !== this.d_numToleratedItems) {
                this.d_numToleratedItems = currentValue.numToleratedItems;
            }
        }

        if (this.initialized) {
            const isChanged = !isLoadingChanged && (simpleChanges.items?.previousValue?.length !== simpleChanges.items?.currentValue?.length || simpleChanges.itemSize || simpleChanges.scrollHeight || simpleChanges.scrollWidth);

            if (isChanged) {
                this.init();
            }
        }
    }

    onAfterViewInit() {
        Promise.resolve().then(() => {
            this.viewInit();
        });
    }

    onAfterViewChecked() {
        this.bindDirectiveInstance.setAttrs(this.ptm('host'));
        if (!this.initialized) {
            this.viewInit();
        }
    }

    onDestroy() {
        this.unbindResizeListener();

        this.contentEl = null;
        this.initialized = false;
    }

    viewInit() {
        if (isPlatformBrowser(this.platformId) && !this.initialized) {
            if (isVisible(this.elementViewChild()?.nativeElement)) {
                this.setInitialState();
                this.setContentEl(this.contentEl);
                this.init();

                this.defaultWidth = getWidth(this.elementViewChild()?.nativeElement);
                this.defaultHeight = getHeight(this.elementViewChild()?.nativeElement);
                this.defaultContentWidth = getWidth(this.contentEl);
                this.defaultContentHeight = getHeight(this.contentEl);
                this.initialized = true;
            }
        }
    }

    init() {
        if (!this._disabled) {
            this.bindResizeListener();

            // wait for the next tick
            setTimeout(() => {
                this.setSpacerSize();
                this.setSize();
                this.calculateOptions();
                this.calculateAutoSize();
                this.cd.detectChanges();
            }, 1);
        }
    }

    setContentEl(el?: HTMLElement) {
        this.contentEl = el || this.contentViewChild()?.nativeElement || findSingle(this.elementViewChild()?.nativeElement, '.p-virtualscroller-content');
    }
    setInitialState() {
        this.first = this.both ? { rows: 0, cols: 0 } : 0;
        this.last = this.both ? { rows: 0, cols: 0 } : 0;
        this.numItemsInViewport = this.both ? { rows: 0, cols: 0 } : 0;
        this.lastScrollPos = this.both ? { top: 0, left: 0 } : 0;
        if (this.d_loading === undefined || this.d_loading === false) {
            this.d_loading = this._loading || false;
        }
        this.d_numToleratedItems = this._numToleratedItems;
        this.loaderArr = this.loaderArr.length > 0 ? this.loaderArr : [];
    }

    getElementRef() {
        return this.elementViewChild();
    }

    getPageByFirst(first?: any) {
        return Math.floor(((first ?? this.first) + this.d_numToleratedItems * 4) / (this._step || 1));
    }

    isPageChanged(first?: any) {
        return this._step ? this.page !== this.getPageByFirst(first ?? this.first) : true;
    }

    scrollTo(options: ScrollToOptions) {
        // this.lastScrollPos = this.both ? { top: 0, left: 0 } : 0;
        this.elementViewChild()?.nativeElement?.scrollTo(options);
    }

    scrollToIndex(index: number | number[], behavior: ScrollBehavior = 'auto') {
        const valid = this.both ? (index as number[]).every((i) => i > -1) : (index as number) > -1;

        if (valid) {
            const first = this.first;
            const { scrollTop = 0, scrollLeft = 0 } = this.elementViewChild()?.nativeElement;
            const { numToleratedItems } = this.calculateNumItems();
            const contentPos = this.getContentPosition();
            const itemSize = this._itemSize ?? 0;
            const calculateFirst = (_index = 0, _numT) => (_index <= _numT ? 0 : _index);
            const calculateCoord = (_first, _size, _cpos) => _first * _size + _cpos;
            const scrollTo = (left = 0, top = 0) => this.scrollTo({ left, top, behavior });
            let newFirst = this.both ? { rows: 0, cols: 0 } : 0;
            let isRangeChanged = false,
                isScrollChanged = false;

            if (this.both) {
                newFirst = {
                    rows: calculateFirst(index[0], numToleratedItems[0]),
                    cols: calculateFirst(index[1], numToleratedItems[1])
                };
                scrollTo(calculateCoord(newFirst.cols, itemSize[1], contentPos.left), calculateCoord(newFirst.rows, itemSize[0], contentPos.top));
                isScrollChanged = this.lastScrollPos.top !== scrollTop || this.lastScrollPos.left !== scrollLeft;
                isRangeChanged = newFirst.rows !== first.rows || newFirst.cols !== first.cols;
            } else {
                newFirst = calculateFirst(index as number, numToleratedItems);
                this.horizontal ? scrollTo(calculateCoord(newFirst, itemSize, contentPos.left), scrollTop) : scrollTo(scrollLeft, calculateCoord(newFirst, itemSize, contentPos.top));
                isScrollChanged = this.lastScrollPos !== (this.horizontal ? scrollLeft : scrollTop);
                isRangeChanged = newFirst !== first;
            }

            this.isRangeChanged = isRangeChanged;
            isScrollChanged && (this.first = newFirst);
        }
    }

    scrollInView(index: number, to: ScrollerToType, behavior: ScrollBehavior = 'auto') {
        if (to) {
            const { first, viewport } = this.getRenderedRange();
            const scrollTo = (left = 0, top = 0) => this.scrollTo({ left, top, behavior });
            const isToStart = to === 'to-start';
            const isToEnd = to === 'to-end';

            if (isToStart) {
                if (this.both) {
                    if (viewport.first.rows - first.rows > (<any>index)[0]) {
                        scrollTo(viewport.first.cols * (<number[]>this._itemSize)[1], (viewport.first.rows - 1) * (<number[]>this._itemSize)[0]);
                    } else if (viewport.first.cols - first.cols > (<any>index)[1]) {
                        scrollTo((viewport.first.cols - 1) * (<number[]>this._itemSize)[1], viewport.first.rows * (<number[]>this._itemSize)[0]);
                    }
                } else {
                    if (viewport.first - first > index) {
                        const pos = (viewport.first - 1) * <number>this._itemSize;
                        this.horizontal ? scrollTo(pos, 0) : scrollTo(0, pos);
                    }
                }
            } else if (isToEnd) {
                if (this.both) {
                    if (viewport.last.rows - first.rows <= (<any>index)[0] + 1) {
                        scrollTo(viewport.first.cols * (<number[]>this._itemSize)[1], (viewport.first.rows + 1) * (<number[]>this._itemSize)[0]);
                    } else if (viewport.last.cols - first.cols <= (<any>index)[1] + 1) {
                        scrollTo((viewport.first.cols + 1) * (<number[]>this._itemSize)[1], viewport.first.rows * (<number[]>this._itemSize)[0]);
                    }
                } else {
                    if (viewport.last - first <= index + 1) {
                        const pos = (viewport.first + 1) * <number>this._itemSize;
                        this.horizontal ? scrollTo(pos, 0) : scrollTo(0, pos);
                    }
                }
            }
        } else {
            this.scrollToIndex(index, behavior);
        }
    }

    getRenderedRange() {
        const calculateFirstInViewport = (_pos: number, _size: number) => (_size || _pos ? Math.floor(_pos / (_size || _pos)) : 0);

        let firstInViewport = this.first;
        let lastInViewport: any = 0;

        if (this.elementViewChild()?.nativeElement) {
            const { scrollTop, scrollLeft } = this.elementViewChild()!.nativeElement;

            if (this.both) {
                firstInViewport = {
                    rows: calculateFirstInViewport(scrollTop, (<number[]>this._itemSize)[0]),
                    cols: calculateFirstInViewport(scrollLeft, (<number[]>this._itemSize)[1])
                };
                lastInViewport = {
                    rows: firstInViewport.rows + this.numItemsInViewport.rows,
                    cols: firstInViewport.cols + this.numItemsInViewport.cols
                };
            } else {
                const scrollPos = this.horizontal ? scrollLeft : scrollTop;
                firstInViewport = calculateFirstInViewport(scrollPos, <number>this._itemSize);
                lastInViewport = firstInViewport + this.numItemsInViewport;
            }
        }

        return {
            first: this.first,
            last: this.last,
            viewport: {
                first: firstInViewport,
                last: lastInViewport
            }
        };
    }

    calculateNumItems() {
        const contentPos = this.getContentPosition();
        const contentWidth = (this.elementViewChild()?.nativeElement ? this.elementViewChild()!.nativeElement.offsetWidth - contentPos.left : 0) || 0;
        const contentHeight = (this.elementViewChild()?.nativeElement ? this.elementViewChild()!.nativeElement.offsetHeight - contentPos.top : 0) || 0;
        const calculateNumItemsInViewport = (_contentSize: number, _itemSize: number) => (_itemSize || _contentSize ? Math.ceil(_contentSize / (_itemSize || _contentSize)) : 0);
        const calculateNumToleratedItems = (_numItems: number) => Math.ceil(_numItems / 2);
        const numItemsInViewport: any = this.both
            ? {
                  rows: calculateNumItemsInViewport(contentHeight, (<number[]>this._itemSize)[0]),
                  cols: calculateNumItemsInViewport(contentWidth, (<number[]>this._itemSize)[1])
              }
            : calculateNumItemsInViewport(this.horizontal ? contentWidth : contentHeight, <number>this._itemSize);

        const numToleratedItems = this.d_numToleratedItems || (this.both ? [calculateNumToleratedItems(numItemsInViewport.rows), calculateNumToleratedItems(numItemsInViewport.cols)] : calculateNumToleratedItems(numItemsInViewport));

        return { numItemsInViewport, numToleratedItems };
    }

    calculateOptions() {
        const { numItemsInViewport, numToleratedItems } = this.calculateNumItems();
        const calculateLast = (_first: number, _num: number, _numT: number, _isCols: boolean = false) => this.getLast(_first + _num + (_first < _numT ? 2 : 3) * _numT, _isCols);
        const first = this.first;
        const last = this.both
            ? {
                  rows: calculateLast(this.first.rows, numItemsInViewport.rows, numToleratedItems[0]),
                  cols: calculateLast(this.first.cols, numItemsInViewport.cols, numToleratedItems[1], true)
              }
            : calculateLast(this.first, numItemsInViewport, numToleratedItems);

        this.last = last;
        this.numItemsInViewport = numItemsInViewport;
        this.d_numToleratedItems = numToleratedItems;

        if (this._showLoader) {
            this.loaderArr = this.both ? Array.from({ length: numItemsInViewport.rows }).map(() => Array.from({ length: numItemsInViewport.cols })) : Array.from({ length: numItemsInViewport });
        }

        if (this._lazy) {
            Promise.resolve().then(() => {
                this.lazyLoadState = {
                    first: this._step ? (this.both ? { rows: 0, cols: first.cols } : 0) : first,
                    last: Math.min(this._step ? this._step : this.last, (<any[]>this._items).length)
                };

                this.handleEvents('onLazyLoad', this.lazyLoadState);
            });
        }
    }

    calculateAutoSize() {
        if (this._autoSize && !this.d_loading) {
            Promise.resolve().then(() => {
                if (this.contentEl) {
                    this.contentEl.style.minHeight = this.contentEl.style.minWidth = 'auto';
                    this.contentEl.style.position = 'relative';
                    (<ElementRef>this.elementViewChild()).nativeElement.style.contain = 'none';

                    const [contentWidth, contentHeight] = [getWidth(this.contentEl), getHeight(this.contentEl)];
                    contentWidth !== this.defaultContentWidth && ((<ElementRef>this.elementViewChild()).nativeElement.style.width = '');
                    contentHeight !== this.defaultContentHeight && ((<ElementRef>this.elementViewChild()).nativeElement.style.height = '');

                    const [width, height] = [getWidth((<ElementRef>this.elementViewChild()).nativeElement), getHeight((<ElementRef>this.elementViewChild()).nativeElement)];
                    (this.both || this.horizontal) && ((<ElementRef>this.elementViewChild()).nativeElement.style.width = width < <number>this.defaultWidth ? width + 'px' : this._scrollWidth || this.defaultWidth + 'px');
                    (this.both || this.vertical) && ((<ElementRef>this.elementViewChild()).nativeElement.style.height = height < <number>this.defaultHeight ? height + 'px' : this._scrollHeight || this.defaultHeight + 'px');

                    this.contentEl.style.minHeight = this.contentEl.style.minWidth = '';
                    this.contentEl.style.position = '';
                    (<ElementRef>this.elementViewChild()).nativeElement.style.contain = '';
                }
            });
        }
    }

    getLast(last = 0, isCols = false) {
        return this._items ? Math.min(isCols ? (this._columns || this._items[0]).length : this._items.length, last) : 0;
    }

    getContentPosition() {
        if (this.contentEl) {
            const style = getComputedStyle(this.contentEl);
            const left = parseFloat(style.paddingLeft) + Math.max(parseFloat(style.left) || 0, 0);
            const right = parseFloat(style.paddingRight) + Math.max(parseFloat(style.right) || 0, 0);
            const top = parseFloat(style.paddingTop) + Math.max(parseFloat(style.top) || 0, 0);
            const bottom = parseFloat(style.paddingBottom) + Math.max(parseFloat(style.bottom) || 0, 0);

            return { left, right, top, bottom, x: left + right, y: top + bottom };
        }

        return { left: 0, right: 0, top: 0, bottom: 0, x: 0, y: 0 };
    }

    setSize() {
        if (this.elementViewChild()?.nativeElement) {
            const nativeElement = this.elementViewChild()!.nativeElement;
            const parentElement = nativeElement.parentElement?.parentElement;

            const elementWidth = nativeElement.offsetWidth;
            const parentWidth = parentElement?.offsetWidth || 0;
            const width = this._scrollWidth || `${elementWidth || parentWidth}px`;

            const elementHeight = nativeElement.offsetHeight;
            const parentHeight = parentElement?.offsetHeight || 0;
            const height = this._scrollHeight || `${elementHeight || parentHeight}px`;

            const setProp = (_name: string, _value: any) => (nativeElement.style[_name] = _value);

            if (this.both || this.horizontal) {
                setProp('height', height);
                setProp('width', width);
            } else {
                setProp('height', height);
            }
        }
    }

    setSpacerSize() {
        if (this._items) {
            const contentPos = this.getContentPosition();
            const setProp = (_name: string, _value: any, _size: number, _cpos: number = 0) =>
                (this.spacerStyle = {
                    ...this.spacerStyle,
                    ...{ [`${_name}`]: (_value || []).length * _size + _cpos + 'px' }
                });

            if (this.both) {
                setProp('height', this._items, (<number[]>this._itemSize)[0], contentPos.y);
                setProp('width', this._columns || this._items[1], (<number[]>this._itemSize)[1], contentPos.x);
            } else {
                this.horizontal ? setProp('width', this._columns || this._items, <number>this._itemSize, contentPos.x) : setProp('height', this._items, <number>this._itemSize, contentPos.y);
            }
        }
    }

    setContentPosition(pos: any) {
        if (this.contentEl && !this._appendOnly) {
            const first = pos ? pos.first : this.first;
            const calculateTranslateVal = (_first: number, _size: number) => _first * _size;
            const setTransform = (_x = 0, _y = 0) => (this.contentStyle = { ...this.contentStyle, ...{ transform: `translate3d(${_x}px, ${_y}px, 0)` } });

            if (this.both) {
                setTransform(calculateTranslateVal(first.cols, (<number[]>this._itemSize)[1]), calculateTranslateVal(first.rows, (<number[]>this._itemSize)[0]));
            } else {
                const translateVal = calculateTranslateVal(first, <number>this._itemSize);
                this.horizontal ? setTransform(translateVal, 0) : setTransform(0, translateVal);
            }
        }
    }

    onScrollPositionChange(event: Event) {
        const target = event.target;
        if (!target) {
            throw new Error('Event target is null');
        }
        const contentPos = this.getContentPosition();
        const calculateScrollPos = (_pos: number, _cpos: number) => (_pos ? (_pos > _cpos ? _pos - _cpos : _pos) : 0);
        const calculateCurrentIndex = (_pos: number, _size: number) => (_size || _pos ? Math.floor(_pos / (_size || _pos)) : 0);
        const calculateTriggerIndex = (_currentIndex: number, _first: number, _last: number, _num: number, _numT: number, _isScrollDownOrRight: any) => {
            return _currentIndex <= _numT ? _numT : _isScrollDownOrRight ? _last - _num - _numT : _first + _numT - 1;
        };
        const calculateFirst = (_currentIndex: number, _triggerIndex: number, _first: number, _last: number, _num: number, _numT: number, _isScrollDownOrRight: any) => {
            if (_currentIndex <= _numT) return 0;
            else return Math.max(0, _isScrollDownOrRight ? (_currentIndex < _triggerIndex ? _first : _currentIndex - _numT) : _currentIndex > _triggerIndex ? _first : _currentIndex - 2 * _numT);
        };
        const calculateLast = (_currentIndex: number, _first: number, _last: number, _num: number, _numT: number, _isCols = false) => {
            let lastValue = _first + _num + 2 * _numT;

            if (_currentIndex >= _numT) {
                lastValue += _numT + 1;
            }

            return this.getLast(lastValue, _isCols);
        };

        const scrollTop = calculateScrollPos((<HTMLElement>target).scrollTop, contentPos.top);
        const scrollLeft = calculateScrollPos((<HTMLElement>target).scrollLeft, contentPos.left);

        let newFirst = this.both ? { rows: 0, cols: 0 } : 0;
        let newLast = this.last;
        let isRangeChanged = false;
        let newScrollPos = this.lastScrollPos;

        if (this.both) {
            const isScrollDown = this.lastScrollPos.top <= scrollTop;
            const isScrollRight = this.lastScrollPos.left <= scrollLeft;

            if (!this._appendOnly || (this._appendOnly && (isScrollDown || isScrollRight))) {
                const currentIndex = {
                    rows: calculateCurrentIndex(scrollTop, (<number[]>this._itemSize)[0]),
                    cols: calculateCurrentIndex(scrollLeft, (<number[]>this._itemSize)[1])
                };
                const triggerIndex = {
                    rows: calculateTriggerIndex(currentIndex.rows, this.first.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0], isScrollDown),
                    cols: calculateTriggerIndex(currentIndex.cols, this.first.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], isScrollRight)
                };

                newFirst = {
                    rows: calculateFirst(currentIndex.rows, triggerIndex.rows, this.first.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0], isScrollDown),
                    cols: calculateFirst(currentIndex.cols, triggerIndex.cols, this.first.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], isScrollRight)
                };
                newLast = {
                    rows: calculateLast(currentIndex.rows, newFirst.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0]),
                    cols: calculateLast(currentIndex.cols, newFirst.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], true)
                };

                isRangeChanged = newFirst.rows !== this.first.rows || newLast.rows !== this.last.rows || newFirst.cols !== this.first.cols || newLast.cols !== this.last.cols || this.isRangeChanged;
                newScrollPos = { top: scrollTop, left: scrollLeft };
            }
        } else {
            const scrollPos = this.horizontal ? scrollLeft : scrollTop;
            const isScrollDownOrRight = this.lastScrollPos <= scrollPos;

            if (!this._appendOnly || (this._appendOnly && isScrollDownOrRight)) {
                const currentIndex = calculateCurrentIndex(scrollPos, <number>this._itemSize);
                const triggerIndex = calculateTriggerIndex(currentIndex, this.first, this.last, this.numItemsInViewport, this.d_numToleratedItems, isScrollDownOrRight);

                newFirst = calculateFirst(currentIndex, triggerIndex, this.first, this.last, this.numItemsInViewport, this.d_numToleratedItems, isScrollDownOrRight);
                newLast = calculateLast(currentIndex, newFirst, this.last, this.numItemsInViewport, this.d_numToleratedItems);
                isRangeChanged = newFirst !== this.first || newLast !== this.last || this.isRangeChanged;
                newScrollPos = scrollPos;
            }
        }

        return {
            first: newFirst,
            last: newLast,
            isRangeChanged,
            scrollPos: newScrollPos
        };
    }

    onScrollChange(event: Event) {
        const { first, last, isRangeChanged, scrollPos } = this.onScrollPositionChange(event);

        if (isRangeChanged) {
            const newState = { first, last };

            this.setContentPosition(newState);

            this.first = first;
            this.last = last;
            this.lastScrollPos = scrollPos;

            this.handleEvents('onScrollIndexChange', newState);

            if (this._lazy && this.isPageChanged(first)) {
                const lazyLoadState = {
                    first: this._step ? Math.min(this.getPageByFirst(first) * this._step, (<any[]>this._items).length - this._step) : first,
                    last: Math.min(this._step ? (this.getPageByFirst(first) + 1) * this._step : last, (<any[]>this._items).length)
                };
                const isLazyStateChanged = this.lazyLoadState.first !== lazyLoadState.first || this.lazyLoadState.last !== lazyLoadState.last;

                isLazyStateChanged && this.handleEvents('onLazyLoad', lazyLoadState);
                this.lazyLoadState = lazyLoadState;
            }
        }
    }

    onContainerScroll(event: Event) {
        this.handleEvents('onScroll', { originalEvent: event });

        if (this._delay) {
            if (this.scrollTimeout) {
                clearTimeout(this.scrollTimeout);
            }

            if (!this.d_loading && this._showLoader) {
                const { isRangeChanged } = this.onScrollPositionChange(event);
                const changed = isRangeChanged || (this._step ? this.isPageChanged() : false);

                if (changed) {
                    this.d_loading = true;

                    this.cd.detectChanges();
                }
            }

            this.scrollTimeout = setTimeout(() => {
                this.onScrollChange(event);

                if (this.d_loading && this._showLoader && (!this._lazy || this._loading === undefined)) {
                    this.d_loading = false;
                    this.page = this.getPageByFirst();
                }
                this.cd.detectChanges();
            }, this._delay);
        } else {
            !this.d_loading && this.onScrollChange(event);
        }
    }

    bindResizeListener() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.windowResizeListener) {
                this.zone.runOutsideAngular(() => {
                    const window = this.document.defaultView as Window;
                    const event = isTouchDevice() ? 'orientationchange' : 'resize';
                    this.windowResizeListener = this.renderer.listen(window, event, this.onWindowResize.bind(this));
                });
            }
        }
    }

    unbindResizeListener() {
        if (this.windowResizeListener) {
            this.windowResizeListener();
            this.windowResizeListener = null;
        }
    }

    onWindowResize() {
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }

        this.resizeTimeout = setTimeout(() => {
            if (isVisible(this.elementViewChild()?.nativeElement)) {
                const [width, height] = [getWidth(this.elementViewChild()?.nativeElement), getHeight(this.elementViewChild()?.nativeElement)];
                const [isDiffWidth, isDiffHeight] = [width !== this.defaultWidth, height !== this.defaultHeight];
                const reinit = this.both ? isDiffWidth || isDiffHeight : this.horizontal ? isDiffWidth : this.vertical ? isDiffHeight : false;

                reinit &&
                    this.zone.run(() => {
                        this.d_numToleratedItems = this._numToleratedItems;
                        this.defaultWidth = width;
                        this.defaultHeight = height;
                        this.defaultContentWidth = getWidth(this.contentEl);
                        this.defaultContentHeight = getHeight(this.contentEl);

                        this.init();
                    });
            }
        }, this._resizeDelay);
    }

    handleEvents(name: string, params: any) {
        const options = this.options() as any;
        //@ts-ignore
        return options && options[name] ? options[name](params) : this[name].emit(params);
    }

    getContentOptions() {
        return {
            contentStyleClass: `p-virtualscroller-content ${this.d_loading ? 'p-virtualscroller-loading' : ''}`,
            items: this.loadedItems,
            getItemOptions: (index: number) => this.getOptions(index),
            loading: this.d_loading,
            getLoaderOptions: (index: number, options?: any) => this.getLoaderOptions(index, options),
            itemSize: this._itemSize,
            rows: this.loadedRows,
            columns: this.loadedColumns,
            spacerStyle: this.spacerStyle,
            contentStyle: this.contentStyle,
            vertical: this.vertical,
            horizontal: this.horizontal,
            both: this.both,
            scrollTo: this.scrollTo.bind(this),
            scrollToIndex: this.scrollToIndex.bind(this),
            orientation: this._orientation,
            scrollableElement: this.elementViewChild()?.nativeElement
        };
    }

    getOptions(renderedIndex: number) {
        const count = (this._items || []).length;
        const index = this.both ? this.first.rows + renderedIndex : this.first + renderedIndex;

        return {
            index,
            count,
            first: index === 0,
            last: index === count - 1,
            even: index % 2 === 0,
            odd: index % 2 !== 0
        };
    }

    getLoaderOptions(index: number, extOptions: any) {
        const count = this.loaderArr.length;

        return {
            index,
            count,
            first: index === 0,
            last: index === count - 1,
            even: index % 2 === 0,
            odd: index % 2 !== 0,
            loading: this.d_loading,
            ...extOptions
        };
    }
}

@NgModule({
    imports: [Scroller, SharedModule],
    exports: [Scroller, SharedModule]
})
export class ScrollerModule {}
