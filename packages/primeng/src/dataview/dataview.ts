import { CommonModule } from '@angular/common';
import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    contentChild,
    DestroyRef,
    effect,
    ElementRef,
    inject,
    InjectionToken,
    input,
    linkedSignal,
    NgModule,
    numberAttribute,
    output,
    TemplateRef,
    untracked,
    ViewEncapsulation
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { resolveFieldData } from '@primeuix/utils';
import { BlockableUI, FilterService, Footer, Header, SharedModule, TranslationKeys } from 'voxx-ui/api';
import { BaseComponent, PARENT_INSTANCE } from 'voxx-ui/basecomponent';
import { Bind } from 'voxx-ui/bind';
import { SpinnerIcon } from 'voxx-ui/icons';
import { PaginatorModule } from 'voxx-ui/paginator';
import { Nullable } from 'voxx-ui/ts-helpers';
import {
    DataViewGridTemplateContext,
    DataViewLayoutChangeEvent,
    DataViewLazyLoadEvent,
    DataViewListTemplateContext,
    DataViewPageEvent,
    DataViewPaginatorDropdownItemTemplateContext,
    DataViewPaginatorLeftTemplateContext,
    DataViewPaginatorRightTemplateContext,
    DataViewPaginatorState,
    DataViewPassThrough,
    DataViewSortEvent
} from 'voxx-ui/types/dataview';
import { DataViewStyle } from './style/dataviewstyle';

const DATAVIEW_INSTANCE = new InjectionToken<DataView>('DATAVIEW_INSTANCE');

/**
 * DataView displays data in grid or list layout with pagination and sorting features.
 * @group Components
 */
@Component({
    selector: 'vx-dataView, vx-dataview, vx-data-view',
    imports: [CommonModule, PaginatorModule, SpinnerIcon, SharedModule, Bind],
    template: `
        @if (loading()) {
            <div [vxBind]="ptm('loading')" [class]="cx('loading')">
                <div [vxBind]="ptm('loadingOverlay')" [class]="cx('loadingOverlay')">
                    @if (loadingIcon()) {
                        <i [class]="cn(cx('loadingIcon'), 'pi-spin' + loadingIcon())"></i>
                    } @else {
                        <ng-container>
                            <svg [vxBind]="ptm('loadingIcon')" data-p-icon="spinner" [spin]="true" [class]="cx('loadingIcon')" />
                            <ng-template *ngTemplateOutlet="loadingicon()"></ng-template>
                        </ng-container>
                    }
                </div>
            </div>
        }
        @if (header() || headerTemplate()) {
            <div [vxBind]="ptm('header')" [class]="cx('header')">
                <ng-content select="vx-header"></ng-content>
                <ng-container *ngTemplateOutlet="headerTemplate()"></ng-container>
            </div>
        }
        @if (paginator() && (paginatorPosition() === 'top' || paginatorPosition() == 'both')) {
            <vx-paginator
                [rows]="rows()"
                [first]="first() ?? 0"
                [totalRecords]="totalRecords()"
                [pageLinkSize]="pageLinks()"
                [alwaysShow]="alwaysShowPaginator()"
                (onPageChange)="paginate($event)"
                [rowsPerPageOptions]="rowsPerPageOptions()"
                [appendTo]="paginatorDropdownAppendTo()"
                [dropdownScrollHeight]="paginatorDropdownScrollHeight()"
                [templateLeft]="paginatorleft()"
                [templateRight]="paginatorright()"
                [currentPageReportTemplate]="currentPageReportTemplate()"
                [showFirstLastIcon]="showFirstLastIcon()"
                [dropdownItemTemplate]="paginatordropdownitem()"
                [showCurrentPageReport]="showCurrentPageReport()"
                [showJumpToPageDropdown]="showJumpToPageDropdown()"
                [showPageLinks]="showPageLinks()"
                [styleClass]="cn(cx('pcPaginator', { position: 'top' }), paginatorStyleClass())"
                [pt]="ptm('pcPaginator')"
                [unstyled]="unstyled()"
            ></vx-paginator>
        }
        <div [vxBind]="ptm('content')" [class]="cx('content')">
            @if (layout() === 'list') {
                <ng-container
                    *ngTemplateOutlet="
                        listTemplate();
                        context: {
                            $implicit: paginator() ? (filteredValue || value() | slice: (lazy() ? 0 : (first() ?? 0)) : (lazy() ? 0 : (first() ?? 0)) + (rows() ?? 0)) : filteredValue || value()
                        }
                    "
                ></ng-container>
            }
            @if (layout() === 'grid') {
                <ng-container
                    *ngTemplateOutlet="
                        gridTemplate();
                        context: {
                            $implicit: paginator() ? (filteredValue || value() | slice: (lazy() ? 0 : (first() ?? 0)) : (lazy() ? 0 : (first() ?? 0)) + (rows() ?? 0)) : filteredValue || value()
                        }
                    "
                ></ng-container>
            }
            @if (isEmpty() && !loading()) {
                <div [vxBind]="ptm('emptyMessage')" [class]="cx('emptyMessage')">
                    @if (!emptymessageTemplate()) {
                        {{ emptyMessageLabel }}
                    }
                    <ng-container *ngTemplateOutlet="emptymessageTemplate()"></ng-container>
                </div>
            }
        </div>
        @if (paginator() && (paginatorPosition() === 'bottom' || paginatorPosition() == 'both')) {
            <vx-paginator
                [rows]="rows()"
                [first]="first() ?? 0"
                [totalRecords]="totalRecords()"
                [pageLinkSize]="pageLinks()"
                [alwaysShow]="alwaysShowPaginator()"
                (onPageChange)="paginate($event)"
                [rowsPerPageOptions]="rowsPerPageOptions()"
                [appendTo]="paginatorDropdownAppendTo()"
                [dropdownScrollHeight]="paginatorDropdownScrollHeight()"
                [templateLeft]="paginatorleft()"
                [templateRight]="paginatorright()"
                [currentPageReportTemplate]="currentPageReportTemplate()"
                [showFirstLastIcon]="showFirstLastIcon()"
                [dropdownItemTemplate]="paginatordropdownitem()"
                [showCurrentPageReport]="showCurrentPageReport()"
                [showJumpToPageDropdown]="showJumpToPageDropdown()"
                [showPageLinks]="showPageLinks()"
                [styleClass]="cn(cx('pcPaginator', { position: 'bottom' }), paginatorStyleClass())"
                [pt]="ptm('pcPaginator')"
                [unstyled]="unstyled()"
            ></vx-paginator>
        }
        @if (footer() || footerTemplate()) {
            <div [vxBind]="ptm('footer')" [class]="cx('footer')">
                <ng-content select="vx-footer"></ng-content>
                <ng-container *ngTemplateOutlet="footerTemplate()"></ng-container>
            </div>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [DataViewStyle, { provide: DATAVIEW_INSTANCE, useExisting: DataView }, { provide: PARENT_INSTANCE, useExisting: DataView }],
    host: {
        '[class]': "cn(cx('root'), styleClass())"
    },
    hostDirectives: [Bind]
})
export class DataView extends BaseComponent<DataViewPassThrough> implements BlockableUI {
    componentName = 'DataView';

    bindDirectiveInstance = inject(Bind, { self: true });

    $pcDataView: DataView | undefined = inject(DATAVIEW_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }

    /**
     * When specified as true, enables the pagination.
     * @group Props
     */
    paginator = input(undefined, { transform: booleanAttribute });
    /**
     * The `rows` input. Number of rows to display per page.
     * @group Props
     */
    rowsInput = input(undefined, { alias: 'rows', transform: numberAttribute });
    /**
     * Number of rows to display per page; follows the `rows` input and is updated when the
     * paginator changes the page size (#18, replaces the internally-mutated `rows` @Input).
     */
    rows = linkedSignal<number | undefined>(() => this.rowsInput());
    /**
     * The `totalRecords` input. Number of total records, defaults to length of value when not defined.
     * @group Props
     */
    totalRecordsInput = input(undefined, { alias: 'totalRecords', transform: numberAttribute });
    /**
     * Number of total records; follows the `totalRecords` input and is recomputed from the value
     * (or the filtered value) when not lazy (#18, replaces the internally-mutated `totalRecords` @Input).
     */
    totalRecords = linkedSignal<number | undefined>(() => this.totalRecordsInput());
    /**
     * Number of page links to display in paginator.
     * @group Props
     */
    pageLinks = input(5, { transform: numberAttribute });
    /**
     * Array of integer/object values to display inside rows per page dropdown of paginator
     * @group Props
     */
    rowsPerPageOptions = input<number[] | any[] | undefined>();
    /**
     * Position of the paginator.
     * @group Props
     */
    paginatorPosition = input<'top' | 'bottom' | 'both'>('bottom');
    /**
     * Custom style class for paginator
     * @group Props
     */
    paginatorStyleClass = input<string | undefined>();
    /**
     * Whether to show it even there is only one page.
     * @group Props
     */
    alwaysShowPaginator = input(true, { transform: booleanAttribute });
    /**
     * Target element to attach the paginator dropdown overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @group Props
     */
    paginatorDropdownAppendTo = input<HTMLElement | ElementRef | TemplateRef<any> | string | null | undefined | any>();
    /**
     * Paginator dropdown height of the viewport in pixels, a scrollbar is defined if height of list exceeds this value.
     * @group Props
     */
    paginatorDropdownScrollHeight = input<string>('200px');
    /**
     * Template of the current page report element. Available placeholders are {currentPage},{totalPages},{rows},{first},{last} and {totalRecords}
     * @group Props
     */
    currentPageReportTemplate = input<string>('{currentPage} of {totalPages}');
    /**
     * Whether to display current page report.
     * @group Props
     */
    showCurrentPageReport = input(undefined, { transform: booleanAttribute });
    /**
     * Whether to display a dropdown to navigate to any page.
     * @group Props
     */
    showJumpToPageDropdown = input(undefined, { transform: booleanAttribute });
    /**
     * When enabled, icons are displayed on paginator to go first and last page.
     * @group Props
     */
    showFirstLastIcon = input(true, { transform: booleanAttribute });
    /**
     * Whether to show page links.
     * @group Props
     */
    showPageLinks = input(true, { transform: booleanAttribute });
    /**
     * Defines if data is loaded and interacted with in lazy manner.
     * @group Props
     */
    lazy = input(undefined, { transform: booleanAttribute });
    /**
     * Whether to call lazy loading on initialization.
     * @group Props
     */
    lazyLoadOnInit = input(true, { transform: booleanAttribute });
    /**
     * Text to display when there is no data. Defaults to global value in i18n translation configuration.
     * @group Props
     */
    emptyMessage = input<string>('');
    /**
     * Style class of the component.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    styleClass = input<string | undefined>();
    /**
     * Style class of the grid.
     * @group Props
     */
    gridStyleClass = input<string>('');
    /**
     * Function to optimize the dom operations by delegating to ngForTrackBy, default algorithm checks for object identity.
     * @group Props
     */
    trackBy = input<Function>((index: number, item: any) => item);
    /**
     * Comma separated list of fields in the object graph to search against.
     * @group Props
     */
    filterBy = input<string | undefined>();
    /**
     * Locale to use in filtering. The default locale is the host environment's current locale.
     * @group Props
     */
    filterLocale = input<string | undefined>();
    /**
     * Displays a loader to indicate data load is in progress.
     * @group Props
     */
    loading = input(undefined, { transform: booleanAttribute });
    /**
     * The icon to show while indicating data load is in progress.
     * @group Props
     */
    loadingIcon = input<string | undefined>();
    /**
     * The `first` input. Index of the first row to be displayed.
     * @group Props
     */
    firstInput = input(0, { alias: 'first', transform: numberAttribute });
    /**
     * Index of the first row to be displayed; follows the `first` input and is reset by paging,
     * sorting and filtering (#18, replaces the internally-mutated `first` @Input).
     */
    first = linkedSignal<number | undefined>(() => this.firstInput());
    /**
     * Property name of data to use in sorting by default.
     * @group Props
     */
    sortField = input<string | undefined>();
    /**
     * Order to sort the data by default.
     * @group Props
     */
    sortOrder = input(undefined, { transform: numberAttribute });
    /**
     * The `value` input. An array of objects to display.
     * @group Props
     */
    valueInput = input<any[] | undefined>(undefined, { alias: 'value' });
    /**
     * The displayed data; follows the `value` input and is replaced immutably when sorting
     * (#18, replaces the `value` @Input mirrored into `_value` by `onChanges`).
     */
    value = linkedSignal<any[] | undefined>(() => this.valueInput());
    /**
     * Defines the layout mode.
     * @group Props
     */
    layout = input<'list' | 'grid'>('list');
    /**
     * Callback to invoke when paging, sorting or filtering happens in lazy mode.
     * @param {DataViewLazyLoadEvent} event - Custom lazy load event.
     * @group Emits
     */
    onLazyLoad = output<DataViewLazyLoadEvent>();
    /**
     * Callback to invoke when pagination occurs.
     * @param {DataViewPageEvent} event - Custom page event.
     * @group Emits
     */
    onPage = output<DataViewPageEvent>();
    /**
     * Callback to invoke when sorting occurs.
     * @param {DataViewSortEvent} event - Custom sort event.
     * @group Emits
     */
    onSort = output<DataViewSortEvent>();
    /**
     * Callback to invoke when changing layout.
     * @param {DataViewLayoutChangeEvent} event - Custom layout change event.
     * @group Emits
     */
    onChangeLayout = output<DataViewLayoutChangeEvent>();
    /**
     * Template for the list layout.
     * @param {DataViewListTemplateContext} context - list template context.
     * @group Templates
     */
    listTemplate = contentChild<TemplateRef<DataViewListTemplateContext>>('list');
    /**
     * Template for grid layout.
     * @param {DataViewGridTemplateContext} context - grid template context.
     * @group Templates
     */
    gridTemplate = contentChild<TemplateRef<DataViewGridTemplateContext>>('grid');
    /**
     * Template for the header section.
     * @group Templates
     */
    headerTemplate = contentChild<TemplateRef<void>>('header');
    /**
     * Template for the empty message section.
     * @group Templates
     */
    emptymessageTemplate = contentChild<TemplateRef<void>>('emptymessage');
    /**
     * Template for the footer section.
     * @group Templates
     */
    footerTemplate = contentChild<TemplateRef<void>>('footer');
    /**
     * Template for the left side of paginator.
     * @param {DataViewPaginatorLeftTemplateContext} context - paginator left template context.
     * @group Templates
     */
    paginatorleft = contentChild<TemplateRef<DataViewPaginatorLeftTemplateContext>>('paginatorleft');
    /**
     * Template for the right side of paginator.
     * @param {DataViewPaginatorRightTemplateContext} context - paginator right template context.
     * @group Templates
     */
    paginatorright = contentChild<TemplateRef<DataViewPaginatorRightTemplateContext>>('paginatorright');
    /**
     * Template for items in paginator dropdown.
     * @param {DataViewPaginatorDropdownItemTemplateContext} context - paginator dropdown item template context.
     * @group Templates
     */
    paginatordropdownitem = contentChild<TemplateRef<DataViewPaginatorDropdownItemTemplateContext>>('paginatordropdownitem');
    /**
     * Template for loading icon.
     * @group Templates
     */
    loadingicon = contentChild<TemplateRef<void>>('loadingicon');
    /**
     * Template for list icon.
     * @group Templates
     */
    listicon = contentChild<TemplateRef<void>>('listicon');
    /**
     * Template for grid icon.
     * @group Templates
     */
    gridicon = contentChild<TemplateRef<void>>('gridicon');

    header = contentChild(Header);

    footer = contentChild(Footer);

    filteredValue: Nullable<any[]>;

    filterValue: Nullable<string>;

    initialized: Nullable<boolean>;

    _componentStyle = inject(DataViewStyle);

    get emptyMessageLabel(): string {
        return this.emptyMessage() || this.config.getTranslation(TranslationKeys.EMPTY_MESSAGE);
    }

    filterService = inject(FilterService);

    destroyRef = inject(DestroyRef);

    /**
     * Former `onChanges` override, converted per the Signal Input Change Tracking pattern (#16):
     * each branch of the legacy `SimpleChanges` handling is now a constructor `effect()` watching
     * the corresponding signal input. All internal mutations write to `linkedSignal`s
     * (`value`, `first`, `rows`, `totalRecords`), so every external write still arrives through
     * the input system and no `trackSignalChanges` registration is needed.
     */
    constructor() {
        super();

        // Former `layout` branch: emit onChangeLayout on every layout change after the first.
        // The legacy branch was guarded by `!firstChange`; firstChange is never true on the
        // signal path, so the initial value is skipped explicitly here.
        let initialLayout = true;
        effect(() => {
            const layout = this.layout();

            if (initialLayout) {
                initialLayout = false;
                return;
            }

            untracked(() => this.onChangeLayout.emit({ layout }));
        });

        // Former `value` branch: recompute totalRecords and re-apply an active filter whenever
        // the value input changes. The legacy branch also ran for the initial binding, but only
        // when a `value` binding was present - hence the first-run guard.
        let initialValue = true;
        effect(() => {
            const incomingValue = this.valueInput();

            untracked(() => {
                if (initialValue) {
                    initialValue = false;

                    if (incomingValue === undefined) {
                        return;
                    }
                }

                this.updateTotalRecords();

                if (!this.lazy() && this.hasFilter()) {
                    this.filter(this.filterValue as string);
                }
            });
        });

        // Former `sortField`/`sortOrder` branch: re-sort on change. The legacy branch ran in
        // ngOnChanges before onInit (`initialized` was still false), so lazy dataviews skipped
        // the initial sort and unbound sort inputs produced no ngOnChanges entry at all - the
        // first-run guard mirrors both behaviors.
        let initialSort = true;
        effect(() => {
            const sortField = this.sortField();
            const sortOrder = this.sortOrder();

            untracked(() => {
                if (initialSort) {
                    initialSort = false;

                    if (this.lazy() || (sortField === undefined && (sortOrder === undefined || isNaN(sortOrder)))) {
                        return;
                    }

                    this.sort();
                    return;
                }

                //avoid triggering lazy load prior to lazy initialization at onInit
                if (!this.lazy() || this.initialized) {
                    this.sort();
                }
            });
        });
    }

    onInit() {
        if (this.lazy() && this.lazyLoadOnInit()) {
            this.onLazyLoad.emit(this.createLazyLoadMetadata());
        }

        this.config.translationObserver.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.cd.markForCheck();
        });
        this.initialized = true;
    }

    onAfterViewInit() {}

    updateTotalRecords() {
        this.totalRecords.set(this.lazy() ? this.totalRecords() : this.value() ? this.value()!.length : 0);
    }

    paginate(event: DataViewPaginatorState) {
        this.first.set(event.first);
        this.rows.set(event.rows);

        if (this.lazy()) {
            this.onLazyLoad.emit(this.createLazyLoadMetadata());
        }

        this.onPage.emit({
            first: <number>this.first(),
            rows: <number>this.rows()
        });
    }

    sort() {
        this.first.set(0);

        if (this.lazy()) {
            this.onLazyLoad.emit(this.createLazyLoadMetadata());
        } else if (this.value()) {
            const value = [...this.value()!];

            value.sort((data1, data2) => {
                let value1 = resolveFieldData(data1, this.sortField());
                let value2 = resolveFieldData(data2, this.sortField());
                let result: number;

                if (value1 == null && value2 != null) result = -1;
                else if (value1 != null && value2 == null) result = 1;
                else if (value1 == null && value2 == null) result = 0;
                else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2);
                else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

                return (this.sortOrder() as number) * result;
            });

            this.value.set(value);

            if (this.hasFilter()) {
                this.filter(this.filterValue as string);
            }
        }

        this.onSort.emit({
            sortField: <string>this.sortField(),
            sortOrder: <number>this.sortOrder()
        });
    }

    isEmpty() {
        let data = this.filteredValue || this.value();
        return data == null || data.length == 0;
    }

    createLazyLoadMetadata(): DataViewLazyLoadEvent {
        return {
            first: <number>this.first(),
            rows: <number>this.rows(),
            sortField: <string>this.sortField(),
            sortOrder: <number>this.sortOrder()
        };
    }

    getBlockableElement(): HTMLElement {
        return this.el.nativeElement.children[0];
    }

    filter(filter: string, filterMatchMode: string = 'contains') {
        this.filterValue = filter;

        if (this.value() && this.value()!.length) {
            let searchFields = (this.filterBy() as string).split(',');
            this.filteredValue = this.filterService.filter(this.value()!, searchFields, filter, filterMatchMode, this.filterLocale());

            if (this.filteredValue!.length === this.value()!.length) {
                this.filteredValue = null;
            }

            if (this.paginator()) {
                this.first.set(0);
                this.totalRecords.set(this.filteredValue ? this.filteredValue.length : this.value() ? this.value()!.length : 0);
            }

            this.cd.markForCheck();
        }
    }

    hasFilter() {
        return this.filterValue && this.filterValue.trim().length > 0;
    }
}

@NgModule({
    imports: [DataView, SharedModule],
    exports: [DataView, SharedModule]
})
export class DataViewModule {}
