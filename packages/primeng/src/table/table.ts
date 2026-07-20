import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    booleanAttribute,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    computed,
    contentChild,
    contentChildren,
    ContentChild,
    ContentChildren,
    Directive,
    effect,
    ElementRef,
    EventEmitter,
    forwardRef,
    inject,
    Injectable,
    InjectionToken,
    input,
    Input,
    linkedSignal,
    model,
    NgModule,
    NgZone,
    numberAttribute,
    Optional,
    Output,
    output,
    QueryList,
    signal,
    SimpleChanges,
    TemplateRef,
    untracked,
    viewChild,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MotionEvent, MotionOptions } from '@primeuix/motion';
import { absolutePosition, addStyle, appendChild, find, findSingle, getAttribute, isClickable, setAttribute } from '@primeuix/utils';
import { BlockableUI, FilterMatchMode, FilterMetadata, FilterOperator, FilterService, LazyLoadMeta, OverlayService, PrimeTemplate, ScrollerOptions, SelectItem, SharedModule, SortMeta, TableState, TranslationKeys } from 'voxx-ui/api';
import { BadgeModule } from 'voxx-ui/badge';
import { BaseComponent, PARENT_INSTANCE } from 'voxx-ui/basecomponent';
import { Bind, BindModule } from 'voxx-ui/bind';
import { Button, ButtonModule } from 'voxx-ui/button';
import { CheckboxChangeEvent, CheckboxModule } from 'voxx-ui/checkbox';
import { DatePickerModule } from 'voxx-ui/datepicker';
import { ConnectedOverlayScrollHandler, DomHandler } from 'voxx-ui/dom';
import { ArrowDownIcon } from 'voxx-ui/icons/arrowdown';
import { ArrowUpIcon } from 'voxx-ui/icons/arrowup';
import { FilterIcon } from 'voxx-ui/icons/filter';
import { FilterFillIcon } from 'voxx-ui/icons/filterfill';
import { FilterSlashIcon } from 'voxx-ui/icons/filterslash';
import { PlusIcon } from 'voxx-ui/icons/plus';
import { SortAltIcon } from 'voxx-ui/icons/sortalt';
import { SortAmountDownIcon } from 'voxx-ui/icons/sortamountdown';
import { SortAmountUpAltIcon } from 'voxx-ui/icons/sortamountupalt';
import { SpinnerIcon } from 'voxx-ui/icons/spinner';
import { TrashIcon } from 'voxx-ui/icons/trash';
import { InputNumberModule } from 'voxx-ui/inputnumber';
import { InputTextModule } from 'voxx-ui/inputtext';
import { MotionModule } from 'voxx-ui/motion';
import { PaginatorModule } from 'voxx-ui/paginator';
import { RadioButton, RadioButtonClickEvent, RadioButtonModule } from 'voxx-ui/radiobutton';
import { Scroller, ScrollerModule } from 'voxx-ui/scroller';
import { SelectModule } from 'voxx-ui/select';
import { SelectButtonModule } from 'voxx-ui/selectbutton';
import { Nullable, VoidListener } from 'voxx-ui/ts-helpers';
import {
    ColumnFilterPassThrough,
    ExportCSVOptions,
    TableColResizeEvent,
    TableColumnReorderEvent,
    TableContextMenuSelectEvent,
    TableEditCancelEvent,
    TableEditCompleteEvent,
    TableEditInitEvent,
    TableFilterButtonPropsOptions,
    TableFilterEvent,
    TableHeaderCheckboxToggleEvent,
    TableLazyLoadEvent,
    TablePageEvent,
    TablePassThrough,
    TableRowCollapseEvent,
    TableRowExpandEvent,
    TableRowReorderEvent,
    TableRowSelectEvent,
    TableRowUnSelectEvent,
    TableSelectAllChangeEvent
} from 'voxx-ui/types/table';
import { ObjectUtils, UniqueComponentId, ZIndexUtils } from 'voxx-ui/utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, Subscription } from 'rxjs';
import { TableStyle } from './style/tablestyle';

const TABLE_INSTANCE = new InjectionToken<Table>('TABLE_INSTANCE');

@Injectable()
export class TableService {
    private sortSource = new Subject<SortMeta | SortMeta[] | null>();
    private selectionSource = new Subject();
    private contextMenuSource = new Subject<any>();
    private valueSource = new Subject<any>();
    private columnsSource = new Subject();

    sortSource$ = this.sortSource.asObservable();
    selectionSource$ = this.selectionSource.asObservable();
    contextMenuSource$ = this.contextMenuSource.asObservable();
    valueSource$ = this.valueSource.asObservable();
    columnsSource$ = this.columnsSource.asObservable();

    onSort(sortMeta: SortMeta | SortMeta[] | null) {
        this.sortSource.next(sortMeta);
    }

    onSelectionChange() {
        this.selectionSource.next(null);
    }

    onContextMenu(data: any) {
        this.contextMenuSource.next(data);
    }

    onValueChange(value: any) {
        this.valueSource.next(value);
    }

    onColumnsChange(columns: any[]) {
        this.columnsSource.next(columns);
    }
}
/**
 * Table displays data in tabular format.
 * @group Components
 */
@Component({
    selector: 'vx-table',
    imports: [CommonModule, SharedModule, PaginatorModule, ScrollerModule, forwardRef(() => TableBody), Bind, SpinnerIcon, ArrowDownIcon, ArrowUpIcon],
    template: `
        @if (loading() && showLoader()) {
            <div [class]="cx('mask')" [vxBind]="ptm('mask')" animate.enter="p-overlay-mask-enter-active" animate.leave="p-overlay-mask-leave-active">
                @if (loadingIcon()) {
                    <i [class]="cn(cx('loadingIcon'), loadingIcon())" [vxBind]="ptm('loadingIcon')"></i>
                }
                @if (!loadingIcon()) {
                    @if (!loadingIconTemplate() && !_loadingIconTemplate()) {
                        <svg data-p-icon="spinner" [spin]="true" [class]="cx('loadingIcon')" [vxBind]="ptm('loadingIcon')" />
                    }
                    @if (loadingIconTemplate() || _loadingIconTemplate()) {
                        <span [class]="cx('loadingIcon')" [vxBind]="ptm('loadingIcon')">
                            <ng-template *ngTemplateOutlet="loadingIconTemplate() || _loadingIconTemplate()"></ng-template>
                        </span>
                    }
                }
            </div>
        }
        @if (captionTemplate() || _captionTemplate()) {
            <div [class]="cx('header')" [vxBind]="ptm('header')">
                <ng-container *ngTemplateOutlet="captionTemplate() || _captionTemplate()"></ng-container>
            </div>
        }
        @if (paginator() && (paginatorPosition() === 'top' || paginatorPosition() == 'both')) {
            <vx-paginator
                [rows]="rows()"
                [first]="first()"
                [totalRecords]="totalRecords()"
                [pageLinkSize]="pageLinks()"
                [alwaysShow]="alwaysShowPaginator()"
                (onPageChange)="onPageChange($event)"
                [rowsPerPageOptions]="rowsPerPageOptions()"
                [templateLeft]="paginatorLeftTemplate() || _paginatorLeftTemplate()"
                [templateRight]="paginatorRightTemplate() || _paginatorRightTemplate()"
                [appendTo]="paginatorDropdownAppendTo()"
                [dropdownScrollHeight]="paginatorDropdownScrollHeight()"
                [currentPageReportTemplate]="currentPageReportTemplate()"
                [showFirstLastIcon]="showFirstLastIcon()"
                [dropdownItemTemplate]="paginatorDropdownItemTemplate() || _paginatorDropdownItemTemplate()"
                [showCurrentPageReport]="showCurrentPageReport()"
                [showJumpToPageDropdown]="showJumpToPageDropdown()"
                [showJumpToPageInput]="showJumpToPageInput"
                [showPageLinks]="showPageLinks()"
                [styleClass]="cx('pcPaginator') + ' ' + paginatorStyleClass() && paginatorStyleClass()"
                [locale]="paginatorLocale()"
                [pt]="ptm('pcPaginator')"
                [unstyled]="unstyled()"
            >
                @if (paginatorDropdownIconTemplate() || _paginatorDropdownIconTemplate()) {
                    <ng-template vxTemplate="dropdownicon">
                        <ng-container *ngTemplateOutlet="paginatorDropdownIconTemplate() || _paginatorDropdownIconTemplate()"></ng-container>
                    </ng-template>
                }
                @if (paginatorFirstPageLinkIconTemplate() || _paginatorFirstPageLinkIconTemplate()) {
                    <ng-template vxTemplate="firstpagelinkicon">
                        <ng-container *ngTemplateOutlet="paginatorFirstPageLinkIconTemplate() || _paginatorFirstPageLinkIconTemplate()"></ng-container>
                    </ng-template>
                }
                @if (paginatorPreviousPageLinkIconTemplate() || _paginatorPreviousPageLinkIconTemplate()) {
                    <ng-template vxTemplate="previouspagelinkicon">
                        <ng-container *ngTemplateOutlet="paginatorPreviousPageLinkIconTemplate() || _paginatorPreviousPageLinkIconTemplate()"></ng-container>
                    </ng-template>
                }
                @if (paginatorLastPageLinkIconTemplate() || _paginatorLastPageLinkIconTemplate()) {
                    <ng-template vxTemplate="lastpagelinkicon">
                        <ng-container *ngTemplateOutlet="paginatorLastPageLinkIconTemplate() || _paginatorLastPageLinkIconTemplate()"></ng-container>
                    </ng-template>
                }
                @if (paginatorNextPageLinkIconTemplate() || _paginatorNextPageLinkIconTemplate()) {
                    <ng-template vxTemplate="nextpagelinkicon">
                        <ng-container *ngTemplateOutlet="paginatorNextPageLinkIconTemplate() || _paginatorNextPageLinkIconTemplate()"></ng-container>
                    </ng-template>
                }
            </vx-paginator>
        }

        <div #wrapper [class]="cx('tableContainer')" [style]="sx('tableContainer')" [vxBind]="ptm('tableContainer')" [attr.data-p]="dataP">
            @if (virtualScroll()) {
                <vx-scroller
                    #scroller
                    [items]="processedData"
                    [columns]="columns()"
                    [style]="{
                        height: scrollHeight() !== 'flex' ? scrollHeight() : undefined
                    }"
                    [scrollHeight]="scrollHeight() !== 'flex' ? undefined : '100%'"
                    [itemSize]="virtualScrollItemSize()"
                    [step]="rows()"
                    [delay]="lazy() ? virtualScrollDelay() : 0"
                    [inline]="true"
                    [autoSize]="true"
                    [lazy]="lazy()"
                    (onLazyLoad)="onLazyItemLoad($event)"
                    [loaderDisabled]="true"
                    [showSpacer]="false"
                    [showLoader]="loadingBodyTemplate() || _loadingBodyTemplate()"
                    [options]="virtualScrollOptions()"
                    [pt]="ptm('virtualScroller')"
                >
                    <ng-template #content let-items let-scrollerOptions="options">
                        <ng-container
                            *ngTemplateOutlet="
                                buildInTable;
                                context: {
                                    $implicit: items,
                                    options: scrollerOptions
                                }
                            "
                        ></ng-container>
                    </ng-template>
                </vx-scroller>
            }
            @if (!virtualScroll()) {
                <ng-container
                    *ngTemplateOutlet="
                        buildInTable;
                        context: {
                            $implicit: processedData,
                            options: { columns: columns() }
                        }
                    "
                ></ng-container>
            }

            <ng-template #buildInTable let-items let-scrollerOptions="options">
                <table #table role="table" [class]="cn(cx('table'), tableStyleClass())" [vxBind]="ptm('table')" [style]="tableStyle()" [attr.id]="id + '-table'">
                    <ng-container *ngTemplateOutlet="colGroupTemplate() || _colGroupTemplate(); context: { $implicit: scrollerOptions.columns }"></ng-container>
                    <thead role="rowgroup" #thead [class]="cx('thead')" [style]="sx('thead')" [vxBind]="ptm('thead')">
                        <ng-container
                            *ngTemplateOutlet="
                                headerGroupedTemplate() || headerTemplate() || _headerTemplate();
                                context: {
                                    $implicit: scrollerOptions.columns
                                }
                            "
                        ></ng-container>
                    </thead>
                    @if (frozenValue() || frozenBodyTemplate() || _frozenBodyTemplate()) {
                        <tbody
                            role="rowgroup"
                            [class]="cx('tbody')"
                            [vxBind]="ptm('tbody')"
                            [value]="frozenValue()"
                            [frozenRows]="true"
                            [vxTableBody]="scrollerOptions.columns"
                            [vxTableBodyTemplate]="frozenBodyTemplate() || _frozenBodyTemplate()"
                            [unstyled]="unstyled()"
                            [frozen]="true"
                            [attr.data-p-virtualscroll]="virtualScroll()"
                        ></tbody>
                    }
                    <tbody
                        role="rowgroup"
                        [class]="cx('tbody', scrollerOptions.contentStyleClass)"
                        [vxBind]="ptm('tbody')"
                        [style]="scrollerOptions.contentStyle"
                        [value]="dataToRender(scrollerOptions.rows)"
                        [vxTableBody]="scrollerOptions.columns"
                        [vxTableBodyTemplate]="bodyTemplate() || _bodyTemplate()"
                        [scrollerOptions]="scrollerOptions"
                        [unstyled]="unstyled()"
                        [attr.data-p-virtualscroll]="virtualScroll()"
                    ></tbody>
                    @if (scrollerOptions.spacerStyle) {
                        <tbody
                            role="rowgroup"
                            [style]="'height: calc(' + scrollerOptions.spacerStyle.height + ' - ' + scrollerOptions.rows.length * scrollerOptions.itemSize + 'px);'"
                            [class]="cx('virtualScrollerSpacer')"
                            [vxBind]="ptm('virtualScrollerSpacer')"
                        ></tbody>
                    }
                    @if (footerGroupedTemplate() || footerTemplate() || _footerTemplate() || _footerGroupedTemplate()) {
                        <tfoot role="rowgroup" #tfoot [class]="cx('footer')" [style]="sx('tfoot')" [vxBind]="ptm('tfoot')">
                            <ng-container
                                *ngTemplateOutlet="
                                    footerGroupedTemplate() || footerTemplate() || _footerTemplate() || _footerGroupedTemplate();
                                    context: {
                                        $implicit: scrollerOptions.columns
                                    }
                                "
                            ></ng-container>
                        </tfoot>
                    }
                </table>
            </ng-template>
        </div>

        @if (paginator() && (paginatorPosition() === 'bottom' || paginatorPosition() == 'both')) {
            <vx-paginator
                [rows]="rows()"
                [first]="first()"
                [totalRecords]="totalRecords()"
                [pageLinkSize]="pageLinks()"
                [alwaysShow]="alwaysShowPaginator()"
                (onPageChange)="onPageChange($event)"
                [rowsPerPageOptions]="rowsPerPageOptions()"
                [templateLeft]="paginatorLeftTemplate() || _paginatorLeftTemplate()"
                [templateRight]="paginatorRightTemplate() || _paginatorRightTemplate()"
                [appendTo]="paginatorDropdownAppendTo()"
                [dropdownScrollHeight]="paginatorDropdownScrollHeight()"
                [currentPageReportTemplate]="currentPageReportTemplate()"
                [showFirstLastIcon]="showFirstLastIcon()"
                [dropdownItemTemplate]="paginatorDropdownItemTemplate() || _paginatorDropdownItemTemplate()"
                [showCurrentPageReport]="showCurrentPageReport()"
                [showJumpToPageDropdown]="showJumpToPageDropdown()"
                [showJumpToPageInput]="showJumpToPageInput"
                [showPageLinks]="showPageLinks()"
                [styleClass]="cx('pcPaginator') + ' ' + paginatorStyleClass() && paginatorStyleClass()"
                [locale]="paginatorLocale()"
                [pt]="ptm('pcPaginator')"
                [unstyled]="unstyled()"
            >
                @if (paginatorDropdownIconTemplate() || _paginatorDropdownIconTemplate()) {
                    <ng-template vxTemplate="dropdownicon">
                        <ng-container *ngTemplateOutlet="paginatorDropdownIconTemplate() || _paginatorDropdownIconTemplate()"></ng-container>
                    </ng-template>
                }
                @if (paginatorFirstPageLinkIconTemplate() || _paginatorFirstPageLinkIconTemplate()) {
                    <ng-template vxTemplate="firstpagelinkicon">
                        <ng-container *ngTemplateOutlet="paginatorFirstPageLinkIconTemplate() || _paginatorFirstPageLinkIconTemplate()"></ng-container>
                    </ng-template>
                }
                @if (paginatorPreviousPageLinkIconTemplate() || _paginatorPreviousPageLinkIconTemplate()) {
                    <ng-template vxTemplate="previouspagelinkicon">
                        <ng-container *ngTemplateOutlet="paginatorPreviousPageLinkIconTemplate() || _paginatorPreviousPageLinkIconTemplate()"></ng-container>
                    </ng-template>
                }
                @if (paginatorLastPageLinkIconTemplate() || _paginatorLastPageLinkIconTemplate()) {
                    <ng-template vxTemplate="lastpagelinkicon">
                        <ng-container *ngTemplateOutlet="paginatorLastPageLinkIconTemplate() || _paginatorLastPageLinkIconTemplate()"></ng-container>
                    </ng-template>
                }
                @if (paginatorNextPageLinkIconTemplate() || _paginatorNextPageLinkIconTemplate()) {
                    <ng-template vxTemplate="nextpagelinkicon">
                        <ng-container *ngTemplateOutlet="paginatorNextPageLinkIconTemplate() || _paginatorNextPageLinkIconTemplate()"></ng-container>
                    </ng-template>
                }
            </vx-paginator>
        }

        @if (summaryTemplate() || _summaryTemplate()) {
            <div [class]="cx('footer')" [vxBind]="ptm('footer')">
                <ng-container *ngTemplateOutlet="summaryTemplate() || _summaryTemplate()"></ng-container>
            </div>
        }

        @if (resizableColumns()) {
            <div #resizeHelper [class]="cx('columnResizeIndicator')" [vxBind]="ptm('columnResizeIndicator')" [style.display]="'none'"></div>
        }
        @if (reorderableColumns()) {
            <span #reorderIndicatorUp [class]="cx('rowReorderIndicatorUp')" [vxBind]="ptm('rowReorderIndicatorUp')" [style.display]="'none'">
                @if (!reorderIndicatorUpIconTemplate() && !_reorderIndicatorUpIconTemplate()) {
                    <svg data-p-icon="arrow-down" [vxBind]="ptm('rowReorderIndicatorUp')['icon']" />
                }
                <ng-template *ngTemplateOutlet="reorderIndicatorUpIconTemplate() || _reorderIndicatorUpIconTemplate()"></ng-template>
            </span>
        }
        @if (reorderableColumns()) {
            <span #reorderIndicatorDown [class]="cx('rowReorderIndicatorDown')" [vxBind]="ptm('rowReorderIndicatorDown')" [style.display]="'none'">
                @if (!reorderIndicatorDownIconTemplate() && !_reorderIndicatorDownIconTemplate()) {
                    <svg data-p-icon="arrow-up" [vxBind]="ptm('rowReorderIndicatorDown')['icon']" />
                }
                <ng-template *ngTemplateOutlet="reorderIndicatorDownIconTemplate() || _reorderIndicatorDownIconTemplate()"></ng-template>
            </span>
        }
    `,
    providers: [TableService, TableStyle, { provide: TABLE_INSTANCE, useExisting: Table }, { provide: PARENT_INSTANCE, useExisting: Table }],
    changeDetection: ChangeDetectionStrategy.Default,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': "cn(cx('root'), styleClass())",
        '[attr.data-p]': 'dataP'
    },
    hostDirectives: [Bind]
})
export class Table<RowData = any> extends BaseComponent<TablePassThrough> implements BlockableUI {
    componentName = 'DataTable';
    /**
     * An array of objects to represent dynamic columns that are frozen.
     * @group Props
     */
    frozenColumns = input<any[] | undefined>(undefined);
    /**
     * An array of objects to display as frozen.
     * @group Props
     */
    frozenValue = input<any[] | undefined>(undefined);
    /**
     * Style class of the component.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    styleClass = input<string | undefined>(undefined);
    /**
     * Inline style of the table.
     * @group Props
     */
    tableStyle = input<{ [klass: string]: any } | null | undefined>(undefined);
    /**
     * Style class of the table.
     * @group Props
     */
    tableStyleClass = input<string | undefined>(undefined);
    /**
     * When specified as true, enables the pagination.
     * @group Props
     */
    paginator = input(undefined, { transform: booleanAttribute });
    /**
     * Number of page links to display in paginator.
     * @group Props
     */
    pageLinks = input(5, { transform: numberAttribute });
    /**
     * Array of integer/object values to display inside rows per page dropdown of paginator
     * @group Props
     */
    rowsPerPageOptions = input<any[] | undefined>(undefined);
    /**
     * Whether to show it even there is only one page.
     * @group Props
     */
    alwaysShowPaginator = input(true, { transform: booleanAttribute });
    /**
     * Position of the paginator, options are "top", "bottom" or "both".
     * @group Props
     */
    paginatorPosition = input<'top' | 'bottom' | 'both'>('bottom');
    /**
     * Custom style class for paginator
     * @group Props
     */
    paginatorStyleClass = input<string | undefined>(undefined);
    /**
     * Target element to attach the paginator dropdown overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @group Props
     */
    paginatorDropdownAppendTo = input<HTMLElement | ElementRef | TemplateRef<any> | string | null | undefined | any>(undefined);
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
     * Whether to display a input to navigate to any page.
     * @group Props
     */
    showJumpToPageInput = input(undefined, { transform: booleanAttribute });
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
     * Sort order to use when an unsorted column gets sorted by user interaction.
     * @group Props
     */
    defaultSortOrder = input(1, { transform: numberAttribute });
    /**
     * Defines whether sorting works on single column or on multiple columns.
     * @group Props
     */
    sortMode = input<'single' | 'multiple'>('single');
    /**
     * When true, resets paginator to first page after sorting. Available only when sortMode is set to single.
     * @group Props
     */
    resetPageOnSort = input(true, { transform: booleanAttribute });
    /**
     * Specifies the selection mode, valid values are "single" and "multiple".
     * @group Props
     */
    selectionMode = input<'single' | 'multiple' | undefined | null>(undefined);
    /**
     * When enabled with paginator and checkbox selection mode, the select all checkbox in the header will select all rows on the current page.
     * @group Props
     */
    selectionPageOnly = input(undefined, { transform: booleanAttribute });
    /**
     * Selected row with a context menu.
     * @group Props
     */
    contextMenuSelectionInput = input<any>(undefined, { alias: 'contextMenuSelection' });

    contextMenuSelection = linkedSignal<any>(() => this.contextMenuSelectionInput());
    /**
     * Callback to invoke on context menu selection change.
     * @param {*} object - row data.
     * @group Emits
     */
    contextMenuSelectionChange = output<any>();
    /**
     *  Defines the behavior of context menu selection, in "separate" mode context menu updates contextMenuSelection property whereas in joint mode selection property is used instead so that when row selection is enabled, both row selection and context menu selection use the same property.
     * @group Props
     */
    contextMenuSelectionMode = input<string>('separate');
    /**
     * A property to uniquely identify a record in data.
     * @group Props
     */
    dataKey = input<string | undefined>(undefined);
    /**
     * Defines whether metaKey should be considered for the selection. On touch enabled devices, metaKeySelection is turned off automatically.
     * @group Props
     */
    metaKeySelection = input(false, { transform: booleanAttribute });
    /**
     * Defines if the row is selectable.
     * @group Props
     */
    rowSelectable = input<(row: { data: any; index: number }) => boolean | undefined>();
    /**
     * Function to optimize the dom operations by delegating to ngForTrackBy, default algorithm checks for object identity.
     * @group Props
     */
    rowTrackBy = input<Function>((index: number, item: any) => item);
    /**
     * Defines if data is loaded and interacted with in lazy manner.
     * @group Props
     */
    lazy = input(false, { transform: booleanAttribute });
    /**
     * Whether to call lazy loading on initialization.
     * @group Props
     */
    lazyLoadOnInit = input(true, { transform: booleanAttribute });
    /**
     * Algorithm to define if a row is selected, valid values are "equals" that compares by reference and "deepEquals" that compares all fields.
     * @group Props
     */
    compareSelectionBy = input<'equals' | 'deepEquals'>('deepEquals');
    /**
     * Character to use as the csv separator.
     * @group Props
     */
    csvSeparator = input<string>(',');
    /**
     * Name of the exported file.
     * @group Props
     */
    exportFilename = input<string>('download');
    /**
     * An array of FilterMetadata objects to provide external filters.
     * @group Props
     */
    filtersInput = input<{ [s: string]: FilterMetadata | FilterMetadata[] }>({}, { alias: 'filters' });

    filters = linkedSignal<{ [s: string]: FilterMetadata | FilterMetadata[] }>(() => this.filtersInput());
    /**
     * An array of fields as string to use in global filtering.
     * @group Props
     */
    globalFilterFields = input<string[] | undefined>(undefined);
    /**
     * Delay in milliseconds before filtering the data.
     * @group Props
     */
    filterDelay = input(300, { transform: numberAttribute });
    /**
     * Locale to use in filtering. The default locale is the host environment's current locale.
     * @group Props
     */
    filterLocale = input<string | undefined>(undefined);
    /**
     * Map instance to keep the expanded rows where key of the map is the data key of the row.
     * @group Props
     */
    expandedRowKeysInput = input<{ [s: string]: boolean }>({}, { alias: 'expandedRowKeys' });

    expandedRowKeys = linkedSignal<{ [s: string]: boolean }>(() => this.expandedRowKeysInput());
    /**
     * Map instance to keep the rows being edited where key of the map is the data key of the row.
     * @group Props
     */
    editingRowKeysInput = input<{ [s: string]: boolean }>({}, { alias: 'editingRowKeys' });

    editingRowKeys = linkedSignal<{ [s: string]: boolean }>(() => this.editingRowKeysInput());
    /**
     * Whether multiple rows can be expanded at any time. Valid values are "multiple" and "single".
     * @group Props
     */
    rowExpandMode = input<'multiple' | 'single'>('multiple');
    /**
     * Enables scrollable tables.
     * @group Props
     */
    scrollable = input(undefined, { transform: booleanAttribute });
    /**
     * Type of the row grouping, valid values are "subheader" and "rowspan".
     * @group Props
     */
    rowGroupMode = input<'subheader' | 'rowspan' | undefined>(undefined);
    /**
     * Height of the scroll viewport in fixed pixels or the "flex" keyword for a dynamic size.
     * @group Props
     */
    scrollHeight = input<string | undefined>(undefined);
    /**
     * Whether the data should be loaded on demand during scroll.
     * @group Props
     */
    virtualScroll = input(undefined, { transform: booleanAttribute });
    /**
     * Height of a row to use in calculations of virtual scrolling.
     * @group Props
     */
    virtualScrollItemSize = input(undefined, { transform: numberAttribute });
    /**
     * Whether to use the scroller feature. The properties of scroller component can be used like an object in it.
     * @group Props
     */
    virtualScrollOptions = input<ScrollerOptions | undefined>(undefined);
    /**
     * Threshold in milliseconds to delay lazy loading during scrolling.
     * @group Props
     */
    virtualScrollDelay = input(250, { transform: numberAttribute });
    /**
     * Width of the frozen columns container.
     * @group Props
     */
    frozenWidth = input<string | undefined>(undefined);
    /**
     * Local ng-template varilable of a ContextMenu.
     * @group Props
     */
    contextMenu = input<any>(undefined);
    /**
     * When enabled, columns can be resized using drag and drop.
     * @group Props
     */
    resizableColumns = input(undefined, { transform: booleanAttribute });
    /**
     * Defines whether the overall table width should change on column resize, valid values are "fit" and "expand".
     * @group Props
     */
    columnResizeMode = input<string>('fit');
    /**
     * When enabled, columns can be reordered using drag and drop.
     * @group Props
     */
    reorderableColumns = input(undefined, { transform: booleanAttribute });
    /**
     * Displays a loader to indicate data load is in progress.
     * @group Props
     */
    loading = input(undefined, { transform: booleanAttribute });
    /**
     * The icon to show while indicating data load is in progress.
     * @group Props
     */
    loadingIcon = input<string | undefined>(undefined);
    /**
     * Whether to show the loading mask when loading property is true.
     * @group Props
     */
    showLoader = input(true, { transform: booleanAttribute });
    /**
     * Adds hover effect to rows without the need for selectionMode. Note that tr elements that can be hovered need to have "p-selectable-row" class for rowHover to work.
     * @group Props
     */
    rowHover = input(undefined, { transform: booleanAttribute });
    /**
     * Whether to use the default sorting or a custom one using sortFunction.
     * @group Props
     */
    customSort = input(undefined, { transform: booleanAttribute });
    /**
     * Whether to use the initial sort badge or not.
     * @group Props
     */
    showInitialSortBadge = input(true, { transform: booleanAttribute });
    /**
     * Export function.
     * @group Props
     */
    exportFunction = input<Function | undefined>(undefined);
    /**
     * Custom export header of the column to be exported as CSV.
     * @group Props
     */
    exportHeader = input<string | undefined>(undefined);
    /**
     * Unique identifier of a stateful table to use in state storage.
     * @group Props
     */
    stateKey = input<string | undefined>(undefined);
    /**
     * Defines where a stateful table keeps its state, valid values are "session" for sessionStorage and "local" for localStorage.
     * @group Props
     */
    stateStorage = input<'session' | 'local'>('session');
    /**
     * Defines the editing mode, valid values are "cell" and "row".
     * @group Props
     */
    editMode = input<'cell' | 'row'>('cell');
    /**
     * Field name to use in row grouping.
     * @group Props
     */
    groupRowsBy = input<any>(undefined);
    /**
     * Defines the size of the table.
     * @group Props
     */
    size = input<'small' | 'large' | undefined>(undefined);
    /**
     * Whether to show grid lines between cells.
     * @group Props
     */
    showGridlines = input(undefined, { transform: booleanAttribute });
    /**
     * Whether to display rows with alternating colors.
     * @group Props
     */
    stripedRows = input(undefined, { transform: booleanAttribute });
    /**
     * Order to sort when default row grouping is enabled.
     * @group Props
     */
    groupRowsByOrder = input(1, { transform: numberAttribute });
    /**
     * Defines the responsive mode, valid options are "stack" and "scroll".
     * @deprecated since v20.0.0, always defaults to scroll, stack mode needs custom implementation
     * @group Props
     */
    responsiveLayout = input<string>('scroll');
    /**
     * The breakpoint to define the maximum width boundary when using stack responsive layout.
     * @group Props
     */
    breakpoint = input<string>('960px');
    /**
     * Locale to be used in paginator formatting.
     * @group Props
     */
    paginatorLocale = input<string | undefined>(undefined);
    /**
     * An array of objects to display.
     * @group Props
     */
    valueInput = input<RowData[]>([], { alias: 'value' });

    value = linkedSignal<RowData[]>(() => this.valueInput());
    /**
     * An array of objects to represent dynamic columns.
     * @group Props
     */
    columnsInput = input<any[] | undefined>(undefined, { alias: 'columns' });

    columns = linkedSignal<any[] | undefined>(() => this.columnsInput());
    /**
     * Index of the first row to be displayed.
     * @group Props
     */
    firstInput = input<number | null | undefined>(0, { alias: 'first' });

    first = linkedSignal<number | null | undefined>(() => this.firstInput());
    /**
     * Number of rows to display per page.
     * @group Props
     */
    rowsInput = input<number | undefined>(undefined, { alias: 'rows' });

    rows = linkedSignal<number | undefined>(() => this.rowsInput());
    /**
     * Number of total records, defaults to length of value when not defined.
     * @group Props
     */
    totalRecordsInput = input<number>(0, { alias: 'totalRecords' });

    totalRecords = linkedSignal<number>(() => this.totalRecordsInput());

    /**
     * Name of the field to sort data by default.
     * @group Props
     */
    sortFieldInput = input<string | undefined | null>(undefined, { alias: 'sortField' });

    sortField = linkedSignal<string | undefined | null>(() => this.sortFieldInput());
    /**
     * Order to sort when default sorting is enabled.
     * @group Props
     */
    sortOrderInput = input<number>(1, { alias: 'sortOrder' });

    sortOrder = linkedSignal<number>(() => this.sortOrderInput());
    /**
     * An array of SortMeta objects to sort the data by default in multiple sort mode.
     * @group Props
     */
    multiSortMetaInput = input<SortMeta[] | undefined | null>(undefined, { alias: 'multiSortMeta' });

    multiSortMeta = linkedSignal<SortMeta[] | undefined | null>(() => this.multiSortMetaInput());
    /**
     * Selected row in single mode or an array of values in multiple mode.
     * @group Props
     */
    selectionInput = input<any>(undefined, { alias: 'selection' });

    selection = linkedSignal<any>(() => this.selectionInput());
    /**
     * Whether all data is selected.
     * @group Props
     */
    selectAll = input<boolean | null>(null);
    /**
     * Emits when the all of the items selected or unselected.
     * @param {TableSelectAllChangeEvent} event - custom  all selection change event.
     * @group Emits
     */
    selectAllChange = output<TableSelectAllChangeEvent>();
    /**
     * Callback to invoke on selection changed.
     * @param {any | null} value - selected data.
     * @group Emits
     */
    selectionChange = output<any | null>();
    /**
     * Callback to invoke when a row is selected.
     * @param {TableRowSelectEvent} event - custom select event.
     * @group Emits
     */
    onRowSelect = output<TableRowSelectEvent<RowData>>();
    /**
     * Callback to invoke when a row is unselected.
     * @param {TableRowUnSelectEvent} event - custom unselect event.
     * @group Emits
     */
    onRowUnselect = output<TableRowUnSelectEvent<RowData>>();
    /**
     * Callback to invoke when pagination occurs.
     * @param {TablePageEvent} event - custom pagination event.
     * @group Emits
     */
    onPage = output<TablePageEvent>();
    /**
     * Callback to invoke when a column gets sorted.
     * @param {Object} object - sort meta.
     * @group Emits
     */
    onSort = output<{ multisortmeta: SortMeta[] } | any>();
    /**
     * Callback to invoke when data is filtered.
     * @param {TableFilterEvent} event - custom filtering event.
     * @group Emits
     */
    onFilter = output<TableFilterEvent>();
    /**
     * Callback to invoke when paging, sorting or filtering happens in lazy mode.
     * @param {TableLazyLoadEvent} event - custom lazy loading event.
     * @group Emits
     */
    onLazyLoad = output<TableLazyLoadEvent>();
    /**
     * Callback to invoke when a row is expanded.
     * @param {TableRowExpandEvent} event - custom row expand event.
     * @group Emits
     */
    onRowExpand = output<TableRowExpandEvent<RowData>>();
    /**
     * Callback to invoke when a row is collapsed.
     * @param {TableRowCollapseEvent} event - custom row collapse event.
     * @group Emits
     */
    onRowCollapse = output<TableRowCollapseEvent>();
    /**
     * Callback to invoke when a row is selected with right click.
     * @param {TableContextMenuSelectEvent} event - custom context menu select event.
     * @group Emits
     */
    onContextMenuSelect = output<TableContextMenuSelectEvent<RowData>>();
    /**
     * Callback to invoke when a column is resized.
     * @param {TableColResizeEvent} event - custom column resize event.
     * @group Emits
     */
    onColResize = output<TableColResizeEvent>();
    /**
     * Callback to invoke when a column is reordered.
     * @param {TableColumnReorderEvent} event - custom column reorder event.
     * @group Emits
     */
    onColReorder = output<TableColumnReorderEvent>();
    /**
     * Callback to invoke when a row is reordered.
     * @param {TableRowReorderEvent} event - custom row reorder event.
     * @group Emits
     */
    onRowReorder = output<TableRowReorderEvent>();
    /**
     * Callback to invoke when a cell switches to edit mode.
     * @param {TableEditInitEvent} event - custom edit init event.
     * @group Emits
     */
    onEditInit = output<TableEditInitEvent>();
    /**
     * Callback to invoke when cell edit is completed.
     * @param {TableEditCompleteEvent} event - custom edit complete event.
     * @group Emits
     */
    onEditComplete = output<TableEditCompleteEvent>();
    /**
     * Callback to invoke when cell edit is cancelled with escape key.
     * @param {TableEditCancelEvent} event - custom edit cancel event.
     * @group Emits
     */
    onEditCancel = output<TableEditCancelEvent>();
    /**
     * Callback to invoke when state of header checkbox changes.
     * @param {TableHeaderCheckboxToggleEvent} event - custom header checkbox event.
     * @group Emits
     */
    onHeaderCheckboxToggle = output<TableHeaderCheckboxToggleEvent>();
    /**
     * A function to implement custom sorting, refer to sorting section for details.
     * @param {any} any - sort meta.
     * @group Emits
     */
    sortFunction = output<any>();
    /**
     * Callback to invoke on pagination.
     * @param {number} number - first element.
     * @group Emits
     */
    firstChange = output<number>();
    /**
     * Callback to invoke on rows change.
     * @param {number} number - Row count.
     * @group Emits
     */
    rowsChange = output<number>();
    /**
     * Callback to invoke table state is saved.
     * @param {TableState} object - table state.
     * @group Emits
     */
    onStateSave = output<TableState>();
    /**
     * Callback to invoke table state is restored.
     * @param {TableState} object - table state.
     * @group Emits
     */
    onStateRestore = output<TableState>();

    resizeHelperViewChild = viewChild<ElementRef>('resizeHelper');

    reorderIndicatorUpViewChild = viewChild<ElementRef>('reorderIndicatorUp');

    reorderIndicatorDownViewChild = viewChild<ElementRef>('reorderIndicatorDown');

    wrapperViewChild = viewChild<ElementRef>('wrapper');

    tableViewChild = viewChild<ElementRef>('table');

    tableHeaderViewChild = viewChild<ElementRef>('thead');

    tableFooterViewChild = viewChild<ElementRef>('tfoot');

    scroller = viewChild<Scroller>('scroller');

    _templates = contentChildren(PrimeTemplate);

    _totalRecords: number = 0;

    filteredValue: any[] | undefined | null;

    // @todo will be refactored later
    _headerTemplate = contentChild<TemplateRef<any>>('header', { descendants: false });
    headerTemplate = computed<TemplateRef<any> | undefined>(
        () =>
            this._templates()
                ?.filter((item) => item.getType() === 'header')
                .at(-1)?.template
    );

    _headerGroupedTemplate = contentChild<TemplateRef<any>>('headergrouped', { descendants: false });
    headerGroupedTemplate = computed<TemplateRef<any> | undefined>(
        () =>
            this._templates()
                ?.filter((item) => item.getType() === 'headergrouped')
                .at(-1)?.template
    );

    _bodyTemplate = contentChild<TemplateRef<any>>('body', { descendants: false });
    bodyTemplate = computed<TemplateRef<any> | undefined>(
        () =>
            this._templates()
                ?.filter((item) => item.getType() === 'body')
                .at(-1)?.template
    );

    _loadingBodyTemplate = contentChild<TemplateRef<any>>('loadingbody', { descendants: false });
    loadingBodyTemplate = computed<TemplateRef<any> | undefined>(
        () =>
            this._templates()
                ?.filter((item) => item.getType() === 'loadingbody')
                .at(-1)?.template
    );

    _captionTemplate = contentChild<TemplateRef<any>>('caption', { descendants: false });
    captionTemplate = computed<TemplateRef<any> | undefined>(
        () =>
            this._templates()
                ?.filter((item) => item.getType() === 'caption')
                .at(-1)?.template
    );

    _footerTemplate = contentChild<TemplateRef<any>>('footer', { descendants: false });
    footerTemplate = computed<TemplateRef<any> | undefined>(
        () =>
            this._templates()
                ?.filter((item) => item.getType() === 'footer')
                .at(-1)?.template
    );

    _footerGroupedTemplate = contentChild<TemplateRef<any>>('footergrouped', { descendants: false });
    footerGroupedTemplate = computed<TemplateRef<any> | undefined>(
        () =>
            this._templates()
                ?.filter((item) => item.getType() === 'footergrouped')
                .at(-1)?.template
    );

    _summaryTemplate = contentChild<TemplateRef<any>>('summary', { descendants: false });
    summaryTemplate = computed<TemplateRef<any> | undefined>(
        () =>
            this._templates()
                ?.filter((item) => item.getType() === 'summary')
                .at(-1)?.template
    );

    _colGroupTemplate = contentChild<TemplateRef<any>>('colgroup', { descendants: false });
    colGroupTemplate = computed<TemplateRef<any> | undefined>(
        () =>
            this._templates()
                ?.filter((item) => item.getType() === 'colgroup')
                .at(-1)?.template
    );

    _expandedRowTemplate = contentChild<TemplateRef<any>>('expandedrow', { descendants: false });
    expandedRowTemplate = computed<TemplateRef<any> | undefined>(
        () =>
            this._templates()
                ?.filter((item) => item.getType() === 'expandedrow')
                .at(-1)?.template
    );

    _groupHeaderTemplate = contentChild<TemplateRef<any>>('groupheader', { descendants: false });
    groupHeaderTemplate = computed<TemplateRef<any> | undefined>(
        () =>
            this._templates()
                ?.filter((item) => item.getType() === 'groupheader')
                .at(-1)?.template
    );

    _groupFooterTemplate = contentChild<TemplateRef<any>>('groupfooter', { descendants: false });
    groupFooterTemplate = computed<TemplateRef<any> | undefined>(
        () =>
            this._templates()
                ?.filter((item) => item.getType() === 'groupfooter')
                .at(-1)?.template
    );

    _frozenExpandedRowTemplate = contentChild<TemplateRef<any>>('frozenexpandedrow', { descendants: false });
    frozenExpandedRowTemplate = computed<TemplateRef<any> | undefined>(
        () =>
            this._templates()
                ?.filter((item) => item.getType() === 'frozenexpandedrow')
                .at(-1)?.template
    );

    _frozenHeaderTemplate = contentChild<TemplateRef<any>>('frozenheader', { descendants: false });
    frozenHeaderTemplate = computed<TemplateRef<any> | undefined>(
        () =>
            this._templates()
                ?.filter((item) => item.getType() === 'frozenheader')
                .at(-1)?.template
    );

    _frozenBodyTemplate = contentChild<TemplateRef<any>>('frozenbody', { descendants: false });
    frozenBodyTemplate = computed<TemplateRef<any> | undefined>(
        () =>
            this._templates()
                ?.filter((item) => item.getType() === 'frozenbody')
                .at(-1)?.template
    );

    _frozenFooterTemplate = contentChild<TemplateRef<any>>('frozenfooter', { descendants: false });
    frozenFooterTemplate = computed<TemplateRef<any> | undefined>(
        () =>
            this._templates()
                ?.filter((item) => item.getType() === 'frozenfooter')
                .at(-1)?.template
    );

    _frozenColGroupTemplate = contentChild<TemplateRef<any>>('frozencolgroup', { descendants: false });
    frozenColGroupTemplate = computed<TemplateRef<any> | undefined>(
        () =>
            this._templates()
                ?.filter((item) => item.getType() === 'frozencolgroup')
                .at(-1)?.template
    );

    _emptyMessageTemplate = contentChild<TemplateRef<any>>('emptymessage', { descendants: false });
    emptyMessageTemplate = computed<TemplateRef<any> | undefined>(
        () =>
            this._templates()
                ?.filter((item) => item.getType() === 'emptymessage')
                .at(-1)?.template
    );

    _paginatorLeftTemplate = contentChild<TemplateRef<any>>('paginatorleft', { descendants: false });
    paginatorLeftTemplate = computed<TemplateRef<any> | undefined>(
        () =>
            this._templates()
                ?.filter((item) => item.getType() === 'paginatorleft')
                .at(-1)?.template
    );

    _paginatorRightTemplate = contentChild<TemplateRef<any>>('paginatorright', { descendants: false });
    paginatorRightTemplate = computed<TemplateRef<any> | undefined>(
        () =>
            this._templates()
                ?.filter((item) => item.getType() === 'paginatorright')
                .at(-1)?.template
    );

    _paginatorDropdownItemTemplate = contentChild<TemplateRef<any>>('paginatordropdownitem', { descendants: false });
    paginatorDropdownItemTemplate = computed<TemplateRef<any> | undefined>(
        () =>
            this._templates()
                ?.filter((item) => item.getType() === 'paginatordropdownitem')
                .at(-1)?.template
    );

    _loadingIconTemplate = contentChild<TemplateRef<any>>('loadingicon', { descendants: false });
    loadingIconTemplate = computed<TemplateRef<any> | undefined>(
        () =>
            this._templates()
                ?.filter((item) => item.getType() === 'loadingicon')
                .at(-1)?.template
    );

    _reorderIndicatorUpIconTemplate = contentChild<TemplateRef<any>>('reorderindicatorupicon', { descendants: false });
    reorderIndicatorUpIconTemplate = computed<TemplateRef<any> | undefined>(
        () =>
            this._templates()
                ?.filter((item) => item.getType() === 'reorderindicatorupicon')
                .at(-1)?.template
    );

    _reorderIndicatorDownIconTemplate = contentChild<TemplateRef<any>>('reorderindicatordownicon', { descendants: false });
    reorderIndicatorDownIconTemplate = computed<TemplateRef<any> | undefined>(
        () =>
            this._templates()
                ?.filter((item) => item.getType() === 'reorderindicatordownicon')
                .at(-1)?.template
    );

    _sortIconTemplate = contentChild<TemplateRef<any>>('sorticon', { descendants: false });
    sortIconTemplate = computed<TemplateRef<any> | undefined>(
        () =>
            this._templates()
                ?.filter((item) => item.getType() === 'sorticon')
                .at(-1)?.template
    );

    _checkboxIconTemplate = contentChild<TemplateRef<any>>('checkboxicon', { descendants: false });
    checkboxIconTemplate = computed<TemplateRef<any> | undefined>(
        () =>
            this._templates()
                ?.filter((item) => item.getType() === 'checkboxicon')
                .at(-1)?.template
    );

    _headerCheckboxIconTemplate = contentChild<TemplateRef<any>>('headercheckboxicon', { descendants: false });
    headerCheckboxIconTemplate = computed<TemplateRef<any> | undefined>(
        () =>
            this._templates()
                ?.filter((item) => item.getType() === 'headercheckboxicon')
                .at(-1)?.template
    );

    _paginatorDropdownIconTemplate = contentChild<TemplateRef<any>>('paginatordropdownicon', { descendants: false });
    paginatorDropdownIconTemplate = computed<TemplateRef<any> | undefined>(
        () =>
            this._templates()
                ?.filter((item) => item.getType() === 'paginatordropdownicon')
                .at(-1)?.template
    );

    _paginatorFirstPageLinkIconTemplate = contentChild<TemplateRef<any>>('paginatorfirstpagelinkicon', { descendants: false });
    paginatorFirstPageLinkIconTemplate = computed<TemplateRef<any> | undefined>(
        () =>
            this._templates()
                ?.filter((item) => item.getType() === 'paginatorfirstpagelinkicon')
                .at(-1)?.template
    );

    _paginatorLastPageLinkIconTemplate = contentChild<TemplateRef<any>>('paginatorlastpagelinkicon', { descendants: false });
    paginatorLastPageLinkIconTemplate = computed<TemplateRef<any> | undefined>(
        () =>
            this._templates()
                ?.filter((item) => item.getType() === 'paginatorlastpagelinkicon')
                .at(-1)?.template
    );

    _paginatorPreviousPageLinkIconTemplate = contentChild<TemplateRef<any>>('paginatorpreviouspagelinkicon', { descendants: false });
    paginatorPreviousPageLinkIconTemplate = computed<TemplateRef<any> | undefined>(
        () =>
            this._templates()
                ?.filter((item) => item.getType() === 'paginatorpreviouspagelinkicon')
                .at(-1)?.template
    );

    _paginatorNextPageLinkIconTemplate = contentChild<TemplateRef<any>>('paginatornextpagelinkicon', { descendants: false });
    paginatorNextPageLinkIconTemplate = computed<TemplateRef<any> | undefined>(
        () =>
            this._templates()
                ?.filter((item) => item.getType() === 'paginatornextpagelinkicon')
                .at(-1)?.template
    );

    selectionKeys: any = {};

    lastResizerHelperX: number | undefined;

    reorderIconWidth: number | undefined;

    reorderIconHeight: number | undefined;

    draggedColumn: any;

    draggedRowIndex: number | undefined | null;

    droppedRowIndex: number | undefined | null;

    rowDragging: boolean | undefined | null;

    dropPosition: number | undefined | null;

    editingCell: Element | undefined | null;

    editingCellData: any;

    editingCellField: any;

    editingCellRowIndex: number | undefined | null;

    selfClick: boolean | undefined | null;

    documentEditListener: any;

    preventSelectionSetterPropagation: boolean | undefined;

    _selectAll: boolean | null = null;

    anchorRowIndex: number | undefined | null;

    rangeRowIndex: number | undefined;

    filterTimeout: any;

    initialized: boolean | undefined | null;

    rowTouched: boolean | undefined;

    restoringSort: boolean | undefined;

    restoringFilter: boolean | undefined;

    stateRestored: boolean | undefined;

    columnOrderStateRestored: boolean | undefined;

    columnWidthsState: string | undefined;

    tableWidthState: string | undefined;

    overlaySubscription: Subscription | undefined;

    resizeColumnElement: HTMLElement;

    columnResizing: boolean = false;

    rowGroupHeaderStyleObject: any = {};

    id: string = UniqueComponentId();

    styleElement: any;

    responsiveStyleElement: any;

    overlayService = inject(OverlayService);

    filterService = inject(FilterService);

    tableService = inject(TableService);

    zone = inject(NgZone);

    _componentStyle = inject(TableStyle);

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }

    onInit() {
        if (this.lazy() && this.lazyLoadOnInit()) {
            if (!this.virtualScroll()) {
                this.onLazyLoad.emit(this.createLazyLoadMetadata());
            }

            if (this.restoringFilter) {
                this.restoringFilter = false;
            }
        }

        if (this.responsiveLayout() === 'stack') {
            this.createResponsiveStyle();
        }

        this.initialized = true;
    }

    onAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.isStateful() && this.resizableColumns()) {
                this.restoreColumnWidths();
            }
        }
    }

    onChanges(simpleChange: SimpleChanges) {
        if (simpleChange.totalRecordsInput && simpleChange.totalRecordsInput.firstChange) {
            this._totalRecords = simpleChange.totalRecordsInput.currentValue;
        }

        if (simpleChange.valueInput) {
            if (this.isStateful() && !this.stateRestored && isPlatformBrowser(this.platformId)) {
                this.restoreState();
            }

            this.value.set(simpleChange.valueInput.currentValue);

            if (!this.lazy()) {
                this.totalRecords.set(this._totalRecords === 0 && this.value() ? this.value().length : (this._totalRecords ?? 0));

                if (this.sortMode() == 'single' && (this.sortField() || this.groupRowsBy())) this.sortSingle();
                else if (this.sortMode() == 'multiple' && (this.multiSortMeta() || this.groupRowsBy())) this.sortMultiple();
                else if (this.hasFilter())
                    //sort already filters
                    this._filter();
            }

            this.tableService.onValueChange(simpleChange.valueInput.currentValue);
        }

        if (simpleChange.columnsInput) {
            if (!this.isStateful()) {
                this.columns.set(simpleChange.columnsInput.currentValue);
                this.tableService.onColumnsChange(simpleChange.columnsInput.currentValue);
            }

            if (this.columns() && this.isStateful() && this.reorderableColumns() && !this.columnOrderStateRestored) {
                this.restoreColumnOrder();

                this.tableService.onColumnsChange(this.columns()!);
            }
        }

        if (simpleChange.sortFieldInput) {
            this.sortField.set(simpleChange.sortFieldInput.currentValue);

            //avoid triggering lazy load prior to lazy initialization at onInit
            if (!this.lazy() || this.initialized) {
                if (this.sortMode() === 'single') {
                    this.sortSingle();
                }
            }
        }

        if (simpleChange.groupRowsBy) {
            //avoid triggering lazy load prior to lazy initialization at onInit
            if (!this.lazy() || this.initialized) {
                if (this.sortMode() === 'single') {
                    this.sortSingle();
                }
            }
        }

        if (simpleChange.sortOrderInput) {
            this.sortOrder.set(simpleChange.sortOrderInput.currentValue);

            //avoid triggering lazy load prior to lazy initialization at onInit
            if (!this.lazy() || this.initialized) {
                if (this.sortMode() === 'single') {
                    this.sortSingle();
                }
            }
        }

        if (simpleChange.groupRowsByOrder) {
            //avoid triggering lazy load prior to lazy initialization at onInit
            if (!this.lazy() || this.initialized) {
                if (this.sortMode() === 'single') {
                    this.sortSingle();
                }
            }
        }

        if (simpleChange.multiSortMetaInput) {
            this.multiSortMeta.set(simpleChange.multiSortMetaInput.currentValue);
            if (this.sortMode() === 'multiple' && (this.initialized || (!this.lazy() && !this.virtualScroll()))) {
                this.sortMultiple();
            }
        }

        if (simpleChange.selectionInput) {
            this.selection.set(simpleChange.selectionInput.currentValue);

            if (!this.preventSelectionSetterPropagation) {
                this.updateSelectionKeys();
                this.tableService.onSelectionChange();
            }
            this.preventSelectionSetterPropagation = false;
        }

        if (simpleChange.selectAll) {
            this._selectAll = simpleChange.selectAll.currentValue;

            if (!this.preventSelectionSetterPropagation) {
                this.updateSelectionKeys();
                this.tableService.onSelectionChange();

                if (this.isStateful()) {
                    this.saveState();
                }
            }
            this.preventSelectionSetterPropagation = false;
        }
    }

    get processedData() {
        return this.filteredValue || this.value() || [];
    }

    private _initialColWidths: number[];

    dataToRender(data: any) {
        const _data = data || this.processedData;

        if (_data && this.paginator()) {
            const first = this.lazy() ? 0 : this.first();
            return _data.slice(first, <number>first + <number>this.rows());
        }

        return _data;
    }

    updateSelectionKeys() {
        if (this.dataKey() && this.selection()) {
            this.selectionKeys = {};
            if (Array.isArray(this.selection())) {
                for (let data of this.selection()) {
                    this.selectionKeys[String(ObjectUtils.resolveFieldData(data, this.dataKey()))] = 1;
                }
            } else {
                this.selectionKeys[String(ObjectUtils.resolveFieldData(this.selection(), this.dataKey()))] = 1;
            }
        }
    }

    onPageChange(event: TablePageEvent) {
        this.first.set(event.first);
        this.rows.set(event.rows);

        this.onPage.emit({
            first: this.first()!,
            rows: <number>this.rows()
        });

        if (this.lazy()) {
            this.onLazyLoad.emit(this.createLazyLoadMetadata());
        }

        this.firstChange.emit(this.first()!);
        this.rowsChange.emit(this.rows()!);
        this.tableService.onValueChange(this.value());

        if (this.isStateful()) {
            this.saveState();
        }

        this.anchorRowIndex = null;

        if (this.scrollable()) {
            this.resetScrollTop();
        }
    }

    sort(event: any) {
        let originalEvent = event.originalEvent;

        if (this.sortMode() === 'single') {
            this.sortOrder.set(this.sortField() === event.field ? this.sortOrder() * -1 : this.defaultSortOrder());
            this.sortField.set(event.field);

            if (this.resetPageOnSort()) {
                this.first.set(0);
                this.firstChange.emit(this.first()!);

                if (this.scrollable()) {
                    this.resetScrollTop();
                }
            }

            this.sortSingle();
        }
        if (this.sortMode() === 'multiple') {
            let metaKey = (<KeyboardEvent>originalEvent).metaKey || (<KeyboardEvent>originalEvent).ctrlKey;
            let sortMeta = this.getSortMeta(<string>event.field);

            if (sortMeta) {
                if (!metaKey) {
                    this.multiSortMeta.set([
                        {
                            field: <string>event.field,
                            order: sortMeta.order * -1
                        }
                    ]);

                    if (this.resetPageOnSort()) {
                        this.first.set(0);
                        this.firstChange.emit(this.first()!);

                        if (this.scrollable()) {
                            this.resetScrollTop();
                        }
                    }
                } else {
                    sortMeta.order = sortMeta.order * -1;
                }
            } else {
                if (!metaKey || !this.multiSortMeta()) {
                    this.multiSortMeta.set([]);

                    if (this.resetPageOnSort()) {
                        this.first.set(0);
                        this.firstChange.emit(this.first()!);
                    }
                }
                (<SortMeta[]>this.multiSortMeta()).push({
                    field: <string>event.field,
                    order: this.defaultSortOrder()
                });
            }

            this.sortMultiple();
        }

        if (this.isStateful()) {
            this.saveState();
        }

        this.anchorRowIndex = null;
    }

    sortSingle() {
        let field = this.sortField() || this.groupRowsBy();
        let order = this.sortField() ? this.sortOrder() : this.groupRowsByOrder();
        if (this.groupRowsBy() && this.sortField() && this.groupRowsBy() !== this.sortField()) {
            this.multiSortMeta.set([this.getGroupRowsMeta(), { field: this.sortField(), order: this.sortOrder() }]);
            this.sortMultiple();
            return;
        }

        if (field && order) {
            if (this.restoringSort) {
                this.restoringSort = false;
            }

            if (this.lazy()) {
                this.onLazyLoad.emit(this.createLazyLoadMetadata());
            } else if (this.value()) {
                if (this.customSort()) {
                    this.sortFunction.emit({
                        data: this.value(),
                        mode: this.sortMode(),
                        field: field,
                        order: order
                    });
                } else {
                    this.value().sort((data1, data2) => {
                        let value1 = ObjectUtils.resolveFieldData(data1, field);
                        let value2 = ObjectUtils.resolveFieldData(data2, field);
                        let result: any = null;

                        if (value1 == null && value2 != null) result = -1;
                        else if (value1 != null && value2 == null) result = 1;
                        else if (value1 == null && value2 == null) result = 0;
                        else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2);
                        else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

                        return order * (result || 0);
                    });

                    this.value.set([...this.value()]);
                }

                if (this.hasFilter()) {
                    this._filter();
                }
            }

            let sortMeta: SortMeta = {
                field: field,
                order: order
            };

            this.onSort.emit(sortMeta);
            this.tableService.onSort(sortMeta);
        }
    }

    sortMultiple() {
        if (this.groupRowsBy()) {
            if (!this.multiSortMeta()) this.multiSortMeta.set([this.getGroupRowsMeta()]);
            else if ((<SortMeta[]>this.multiSortMeta())[0].field !== this.groupRowsBy()) this.multiSortMeta.set([this.getGroupRowsMeta(), ...(this.multiSortMeta() as SortMeta[])]);
        }

        if (this.multiSortMeta()) {
            if (this.lazy()) {
                this.onLazyLoad.emit(this.createLazyLoadMetadata());
            } else if (this.value()) {
                if (this.customSort()) {
                    this.sortFunction.emit({
                        data: this.value(),
                        mode: this.sortMode(),
                        multiSortMeta: this.multiSortMeta()
                    });
                } else {
                    this.value().sort((data1, data2) => {
                        return this.multisortField(data1, data2, <SortMeta[]>this.multiSortMeta(), 0);
                    });

                    this.value.set([...this.value()]);
                }

                if (this.hasFilter()) {
                    this._filter();
                }
            }

            this.onSort.emit({
                multisortmeta: <SortMeta[]>this.multiSortMeta()
            });
            this.tableService.onSort(this.multiSortMeta() ?? null);
        }
    }

    multisortField(data1: any, data2: any, multiSortMeta: SortMeta[], index: number): any {
        const value1 = ObjectUtils.resolveFieldData(data1, multiSortMeta[index].field);
        const value2 = ObjectUtils.resolveFieldData(data2, multiSortMeta[index].field);
        if (ObjectUtils.compare(value1, value2, this.filterLocale()) === 0) {
            return multiSortMeta.length - 1 > index ? this.multisortField(data1, data2, multiSortMeta, index + 1) : 0;
        }
        return this.compareValuesOnSort(value1, value2, multiSortMeta[index].order);
    }

    compareValuesOnSort(value1: any, value2: any, order: any) {
        return ObjectUtils.sort(value1, value2, order, this.filterLocale(), this.sortOrder());
    }

    getSortMeta(field: string) {
        const multiSortMeta = this.multiSortMeta();
        if (multiSortMeta && multiSortMeta.length) {
            for (let i = 0; i < multiSortMeta.length; i++) {
                if (multiSortMeta[i].field === field) {
                    return multiSortMeta[i];
                }
            }
        }

        return null;
    }

    isSorted(field: string) {
        if (this.sortMode() === 'single') {
            return this.sortField() && this.sortField() === field;
        } else if (this.sortMode() === 'multiple') {
            let sorted = false;
            const multiSortMeta = this.multiSortMeta();
            if (multiSortMeta) {
                for (let i = 0; i < multiSortMeta.length; i++) {
                    if (multiSortMeta[i].field == field) {
                        sorted = true;
                        break;
                    }
                }
            }
            return sorted;
        }
    }

    handleRowClick(event: any) {
        let target = <HTMLElement>event.originalEvent.target;
        let targetNode = target.nodeName;
        let parentNode = target.parentElement && target.parentElement.nodeName;
        if (targetNode == 'INPUT' || targetNode == 'BUTTON' || targetNode == 'A' || parentNode == 'INPUT' || parentNode == 'BUTTON' || parentNode == 'A' || isClickable(event.originalEvent.target)) {
            return;
        }

        if (this.selectionMode()) {
            let rowData = event.rowData;
            let rowIndex = event.rowIndex;

            this.preventSelectionSetterPropagation = true;
            if (this.isMultipleSelectionMode() && event.originalEvent.shiftKey && this.anchorRowIndex != null) {
                DomHandler.clearSelection();
                if (this.rangeRowIndex != null) {
                    this.clearSelectionRange(event.originalEvent);
                }

                this.rangeRowIndex = rowIndex;
                this.selectRange(event.originalEvent, rowIndex);
            } else {
                let selected = this.isSelected(rowData);

                if (!selected && !this.isRowSelectable(rowData, rowIndex)) {
                    return;
                }

                let metaSelection = this.rowTouched ? false : this.metaKeySelection();
                let dataKeyValue = this.dataKey() ? String(ObjectUtils.resolveFieldData(rowData, this.dataKey())) : null;
                this.anchorRowIndex = rowIndex;
                this.rangeRowIndex = rowIndex;

                if (metaSelection) {
                    let metaKey = event.originalEvent.metaKey || event.originalEvent.ctrlKey;

                    if (selected && metaKey) {
                        if (this.isSingleSelectionMode()) {
                            this.selection.set(null);
                            this.selectionKeys = {};
                            this.selectionChange.emit(null);
                        } else {
                            let selectionIndex = this.findIndexInSelection(rowData);
                            this.selection.set(this.selection().filter((val: any, i: number) => i != selectionIndex));
                            this.selectionChange.emit(this.selection());
                            if (dataKeyValue) {
                                delete this.selectionKeys[dataKeyValue];
                            }
                        }

                        this.onRowUnselect.emit({
                            originalEvent: event.originalEvent,
                            data: rowData,
                            type: 'row'
                        });
                    } else {
                        if (this.isSingleSelectionMode()) {
                            this.selection.set(rowData);
                            this.selectionChange.emit(rowData);
                            if (dataKeyValue) {
                                this.selectionKeys = {};
                                this.selectionKeys[dataKeyValue] = 1;
                            }
                        } else if (this.isMultipleSelectionMode()) {
                            if (metaKey) {
                                this.selection.set(this.selection() || []);
                            } else {
                                this.selection.set([]);
                                this.selectionKeys = {};
                            }

                            this.selection.set([...this.selection(), rowData]);
                            this.selectionChange.emit(this.selection());
                            if (dataKeyValue) {
                                this.selectionKeys[dataKeyValue] = 1;
                            }
                        }

                        this.onRowSelect.emit({
                            originalEvent: event.originalEvent,
                            data: rowData,
                            type: 'row',
                            index: rowIndex
                        });
                    }
                } else {
                    if (this.selectionMode() === 'single') {
                        if (selected) {
                            this.selection.set(null);
                            this.selectionKeys = {};
                            this.selectionChange.emit(this.selection());
                            this.onRowUnselect.emit({
                                originalEvent: event.originalEvent,
                                data: rowData,
                                type: 'row',
                                index: rowIndex
                            });
                        } else {
                            this.selection.set(rowData);
                            this.selectionChange.emit(this.selection());
                            this.onRowSelect.emit({
                                originalEvent: event.originalEvent,
                                data: rowData,
                                type: 'row',
                                index: rowIndex
                            });
                            if (dataKeyValue) {
                                this.selectionKeys = {};
                                this.selectionKeys[dataKeyValue] = 1;
                            }
                        }
                    } else if (this.selectionMode() === 'multiple') {
                        if (selected) {
                            let selectionIndex = this.findIndexInSelection(rowData);
                            this.selection.set(this.selection().filter((val: any, i: number) => i != selectionIndex));
                            this.selectionChange.emit(this.selection());
                            this.onRowUnselect.emit({
                                originalEvent: event.originalEvent,
                                data: rowData,
                                type: 'row',
                                index: rowIndex
                            });
                            if (dataKeyValue) {
                                delete this.selectionKeys[dataKeyValue];
                            }
                        } else {
                            this.selection.set(this.selection() ? [...this.selection(), rowData] : [rowData]);
                            this.selectionChange.emit(this.selection());
                            this.onRowSelect.emit({
                                originalEvent: event.originalEvent,
                                data: rowData,
                                type: 'row',
                                index: rowIndex
                            });
                            if (dataKeyValue) {
                                this.selectionKeys[dataKeyValue] = 1;
                            }
                        }
                    }
                }
            }

            this.tableService.onSelectionChange();

            if (this.isStateful()) {
                this.saveState();
            }
        }

        this.rowTouched = false;
    }

    handleRowTouchEnd(event: Event) {
        this.rowTouched = true;
    }

    handleRowRightClick(event: any) {
        if (this.contextMenu()) {
            const rowData = event.rowData;
            const rowIndex = event.rowIndex;

            const showContextMenu = () => {
                this.contextMenu().show(event.originalEvent);
                this.contextMenu().hideCallback = () => {
                    this.contextMenuSelection.set(null);
                    this.contextMenuSelectionChange.emit(null);
                    this.tableService.onContextMenu(null);
                };
            };

            if (this.contextMenuSelectionMode() === 'separate') {
                this.contextMenuSelection.set(rowData);
                this.contextMenuSelectionChange.emit(rowData);
                this.tableService.onContextMenu(rowData);
                showContextMenu();
                this.onContextMenuSelect.emit({
                    originalEvent: event.originalEvent,
                    data: rowData,
                    index: event.rowIndex
                });
            } else if (this.contextMenuSelectionMode() === 'joint') {
                this.preventSelectionSetterPropagation = true;
                let selected = this.isSelected(rowData);
                let dataKeyValue = this.dataKey() ? String(ObjectUtils.resolveFieldData(rowData, this.dataKey())) : null;

                if (!selected) {
                    if (!this.isRowSelectable(rowData, rowIndex)) {
                        return;
                    }

                    if (this.isSingleSelectionMode()) {
                        this.selection.set(rowData);
                        this.selectionChange.emit(rowData);

                        if (dataKeyValue) {
                            this.selectionKeys = {};
                            this.selectionKeys[dataKeyValue] = 1;
                        }
                    } else if (this.isMultipleSelectionMode()) {
                        this.selection.set(this.selection() ? [...this.selection(), rowData] : [rowData]);
                        this.selectionChange.emit(this.selection());

                        if (dataKeyValue) {
                            this.selectionKeys[dataKeyValue] = 1;
                        }
                    }
                }

                // Also update contextMenuSelection in joint mode
                this.contextMenuSelection.set(rowData);
                this.contextMenuSelectionChange.emit(rowData);
                this.tableService.onContextMenu(rowData);

                this.tableService.onSelectionChange();
                showContextMenu();
                this.onContextMenuSelect.emit({
                    originalEvent: event,
                    data: rowData,
                    index: event.rowIndex
                });
            }
        }
    }

    selectRange(event: MouseEvent | KeyboardEvent, rowIndex: number, isMetaKeySelection?: boolean | undefined) {
        let rangeStart, rangeEnd;

        if (<number>this.anchorRowIndex > rowIndex) {
            rangeStart = rowIndex;
            rangeEnd = this.anchorRowIndex;
        } else if (<number>this.anchorRowIndex < rowIndex) {
            rangeStart = this.anchorRowIndex;
            rangeEnd = rowIndex;
        } else {
            rangeStart = rowIndex;
            rangeEnd = rowIndex;
        }

        if (this.lazy() && this.paginator()) {
            (rangeStart as number) -= <number>this.first();
            (rangeEnd as number) -= <number>this.first();
        }

        let rangeRowsData: RowData[] = [];
        for (let i = <number>rangeStart; i <= <number>rangeEnd; i++) {
            let rangeRowData = this.filteredValue ? this.filteredValue[i] : this.value()[i];
            if (!this.isSelected(rangeRowData) && !isMetaKeySelection) {
                if (!this.isRowSelectable(rangeRowData, rowIndex)) {
                    continue;
                }

                rangeRowsData.push(rangeRowData);
                this.selection.set([...this.selection(), rangeRowData]);
                let dataKeyValue = this.dataKey() ? String(ObjectUtils.resolveFieldData(rangeRowData, this.dataKey())) : null;
                if (dataKeyValue) {
                    this.selectionKeys[dataKeyValue] = 1;
                }
            }
        }
        this.selectionChange.emit(this.selection());
        this.onRowSelect.emit({
            originalEvent: event,
            data: rangeRowsData,
            type: 'row'
        });
    }

    clearSelectionRange(event: MouseEvent | KeyboardEvent) {
        let rangeStart, rangeEnd;
        let rangeRowIndex = <number>this.rangeRowIndex;
        let anchorRowIndex = <number>this.anchorRowIndex;

        if (rangeRowIndex > anchorRowIndex) {
            rangeStart = this.anchorRowIndex;
            rangeEnd = this.rangeRowIndex;
        } else if (rangeRowIndex < anchorRowIndex) {
            rangeStart = this.rangeRowIndex;
            rangeEnd = this.anchorRowIndex;
        } else {
            rangeStart = this.rangeRowIndex;
            rangeEnd = this.rangeRowIndex;
        }

        for (let i = <number>rangeStart; i <= <number>rangeEnd; i++) {
            let rangeRowData = this.value()[i];
            let selectionIndex = this.findIndexInSelection(rangeRowData);
            this.selection.set(this.selection().filter((val: any, i: number) => i != selectionIndex));
            let dataKeyValue = this.dataKey() ? String(ObjectUtils.resolveFieldData(rangeRowData, this.dataKey())) : null;
            if (dataKeyValue) {
                delete this.selectionKeys[dataKeyValue];
            }
            this.onRowUnselect.emit({
                originalEvent: event,
                data: rangeRowData,
                type: 'row'
            });
        }
    }

    isSelected(rowData: any) {
        if (rowData && this.selection()) {
            if (this.dataKey()) {
                return this.selectionKeys[ObjectUtils.resolveFieldData(rowData, this.dataKey())] !== undefined;
            } else {
                if (Array.isArray(this.selection())) return this.findIndexInSelection(rowData) > -1;
                else return this.equals(rowData, this.selection());
            }
        }

        return false;
    }

    findIndexInSelection(rowData: any) {
        let index: number = -1;
        if (this.selection() && this.selection().length) {
            for (let i = 0; i < this.selection().length; i++) {
                if (this.equals(rowData, this.selection()[i])) {
                    index = i;
                    break;
                }
            }
        }

        return index;
    }

    isRowSelectable(data: any, index: number) {
        if (this.rowSelectable() && !this.rowSelectable()!({ data, index })) {
            return false;
        }

        return true;
    }

    toggleRowWithRadio(event: any, rowData: any) {
        this.preventSelectionSetterPropagation = true;

        if (this.selection() != rowData) {
            if (!this.isRowSelectable(rowData, event.rowIndex)) {
                return;
            }

            this.selection.set(rowData);
            this.selectionChange.emit(this.selection());
            this.onRowSelect.emit({
                originalEvent: event.originalEvent,
                index: event.rowIndex,
                data: rowData,
                type: 'radiobutton'
            });

            if (this.dataKey()) {
                this.selectionKeys = {};
                this.selectionKeys[String(ObjectUtils.resolveFieldData(rowData, this.dataKey()))] = 1;
            }
        } else {
            this.selection.set(null);
            this.selectionChange.emit(this.selection());
            this.onRowUnselect.emit({
                originalEvent: event.originalEvent,
                index: event.rowIndex,
                data: rowData,
                type: 'radiobutton'
            });
        }

        this.tableService.onSelectionChange();

        if (this.isStateful()) {
            this.saveState();
        }
    }

    toggleRowWithCheckbox(event: { originalEvent: Event; rowIndex: number }, rowData: any) {
        this.selection.set(this.selection() || []);
        let selected = this.isSelected(rowData);
        let dataKeyValue = this.dataKey() ? String(ObjectUtils.resolveFieldData(rowData, this.dataKey())) : null;
        this.preventSelectionSetterPropagation = true;

        if (selected) {
            let selectionIndex = this.findIndexInSelection(rowData);
            this.selection.set(this.selection().filter((val: any, i: number) => i != selectionIndex));
            this.selectionChange.emit(this.selection());
            this.onRowUnselect.emit({
                originalEvent: event.originalEvent,
                index: event.rowIndex,
                data: rowData,
                type: 'checkbox'
            });
            if (dataKeyValue) {
                delete this.selectionKeys[dataKeyValue];
            }
        } else {
            if (!this.isRowSelectable(rowData, event.rowIndex)) {
                return;
            }

            this.selection.set(this.selection() ? [...this.selection(), rowData] : [rowData]);
            this.selectionChange.emit(this.selection());
            this.onRowSelect.emit({
                originalEvent: event.originalEvent,
                index: event.rowIndex,
                data: rowData,
                type: 'checkbox'
            });
            if (dataKeyValue) {
                this.selectionKeys[dataKeyValue] = 1;
            }
        }

        this.tableService.onSelectionChange();

        if (this.isStateful()) {
            this.saveState();
        }
    }

    toggleRowsWithCheckbox({ originalEvent }: CheckboxChangeEvent, check: boolean) {
        if (this._selectAll !== null) {
            this.selectAllChange.emit({ originalEvent: originalEvent!, checked: check });
        } else {
            const data = this.selectionPageOnly() ? this.dataToRender(this.processedData) : this.processedData;
            let selection = this.selectionPageOnly() && this.selection() ? this.selection().filter((s: any) => !data.some((d: any) => this.equals(s, d))) : [];

            if (check) {
                selection = this.frozenValue() ? [...selection, ...this.frozenValue()!, ...data] : [...selection, ...data];
                selection = this.rowSelectable() ? selection.filter((data: any, index: number) => this.rowSelectable()!({ data, index })) : selection;
            }

            this.selection.set(selection);
            this.preventSelectionSetterPropagation = true;
            this.updateSelectionKeys();
            this.selectionChange.emit(this.selection());
            this.tableService.onSelectionChange();
            this.onHeaderCheckboxToggle.emit({
                originalEvent: originalEvent!,
                checked: check
            });

            if (this.isStateful()) {
                this.saveState();
            }
        }
    }

    equals(data1: any, data2: any) {
        return this.compareSelectionBy() === 'equals' ? data1 === data2 : ObjectUtils.equals(data1, data2, this.dataKey());
    }

    /* Legacy Filtering for custom elements */
    filter(value: any, field: string, matchMode: string) {
        if (this.filterTimeout) {
            clearTimeout(this.filterTimeout);
        }
        if (!this.isFilterBlank(value)) {
            this.filters()[field] = { value: value, matchMode: matchMode };
        } else if (this.filters()[field]) {
            delete this.filters()[field];
        }

        this.filterTimeout = setTimeout(() => {
            this._filter();
            this.filterTimeout = null;
        }, this.filterDelay());

        this.anchorRowIndex = null;
    }

    filterGlobal(value: any, matchMode: string) {
        this.filter(value, 'global', matchMode);
    }

    isFilterBlank(filter: any): boolean {
        if (filter !== null && filter !== undefined) {
            if ((typeof filter === 'string' && filter.trim().length == 0) || (Array.isArray(filter) && filter.length == 0)) return true;
            else return false;
        }
        return true;
    }

    _filter() {
        if (!this.restoringFilter) {
            this.first.set(0);
            this.firstChange.emit(this.first()!);
        }

        if (this.lazy()) {
            this.onLazyLoad.emit(this.createLazyLoadMetadata());
        } else {
            if (!this.value()) {
                return;
            }
            if (!this.hasFilter()) {
                this.filteredValue = null;
                if (this.paginator()) {
                    this.totalRecords.set(this._totalRecords === 0 && this.value() ? this.value().length : this._totalRecords);
                }
            } else {
                let globalFilterFieldsArray;
                if (this.filters()['global']) {
                    if (!this.columns() && !this.globalFilterFields()) throw new Error('Global filtering requires dynamic columns or globalFilterFields to be defined.');
                    else globalFilterFieldsArray = this.globalFilterFields() || this.columns();
                }

                this.filteredValue = [];

                for (let i = 0; i < this.value().length; i++) {
                    let localMatch = true;
                    let globalMatch = false;
                    let localFiltered = false;

                    for (let prop in this.filters()) {
                        if (this.filters().hasOwnProperty(prop) && prop !== 'global') {
                            localFiltered = true;
                            let filterField = prop;
                            let filterMeta = this.filters()[filterField];

                            if (Array.isArray(filterMeta)) {
                                for (let meta of filterMeta) {
                                    localMatch = this.executeLocalFilter(filterField, this.value()[i], meta);

                                    if ((meta.operator === FilterOperator.OR && localMatch) || (meta.operator === FilterOperator.AND && !localMatch)) {
                                        break;
                                    }
                                }
                            } else {
                                localMatch = this.executeLocalFilter(filterField, this.value()[i], <any>filterMeta);
                            }

                            if (!localMatch) {
                                break;
                            }
                        }
                    }

                    if (this.filters()['global'] && !globalMatch && globalFilterFieldsArray) {
                        for (let j = 0; j < globalFilterFieldsArray.length; j++) {
                            let globalFilterField = globalFilterFieldsArray[j].field || globalFilterFieldsArray[j];
                            globalMatch = (<any>this.filterService).filters[(<any>this.filters()['global']).matchMode](
                                ObjectUtils.resolveFieldData(this.value()[i], globalFilterField),
                                (<FilterMetadata>this.filters()['global']).value,
                                this.filterLocale()
                            );

                            if (globalMatch) {
                                break;
                            }
                        }
                    }

                    let matches: boolean;
                    if (this.filters()['global']) {
                        matches = localFiltered ? localFiltered && localMatch && globalMatch : globalMatch;
                    } else {
                        matches = localFiltered && localMatch;
                    }

                    if (matches) {
                        this.filteredValue.push(this.value()[i]);
                    }
                }

                if (this.filteredValue.length === this.value().length) {
                    this.filteredValue = null;
                }

                if (this.paginator()) {
                    this.totalRecords.set(this.filteredValue ? this.filteredValue.length : this._totalRecords === 0 && this.value() ? this.value().length : (this._totalRecords ?? 0));
                }
            }
        }

        this.onFilter.emit({
            filters: <{ [s: string]: FilterMetadata | undefined }>this.filters(),
            filteredValue: this.filteredValue || this.value()
        });

        this.tableService.onValueChange(this.value());

        if (this.isStateful() && !this.restoringFilter) {
            this.saveState();
        }

        if (this.restoringFilter) {
            this.restoringFilter = false;
        }

        this.cd.markForCheck();

        if (this.scrollable()) {
            this.resetScrollTop();
        }
    }

    executeLocalFilter(field: string, rowData: any, filterMeta: FilterMetadata): boolean {
        let filterValue = filterMeta.value;
        let filterMatchMode = filterMeta.matchMode || FilterMatchMode.STARTS_WITH;
        let dataFieldValue = ObjectUtils.resolveFieldData(rowData, field);
        let filterConstraint = (<any>this.filterService).filters[filterMatchMode];

        return filterConstraint(dataFieldValue, filterValue, this.filterLocale());
    }

    hasFilter() {
        let empty = true;
        for (let prop in this.filters()) {
            if (this.filters().hasOwnProperty(prop)) {
                empty = false;
                break;
            }
        }

        return !empty;
    }

    createLazyLoadMetadata(): any {
        return {
            first: this.first(),
            rows: this.rows(),
            sortField: this.sortField(),
            sortOrder: this.sortOrder(),
            filters: this.filters(),
            globalFilter: this.filters() && this.filters()['global'] ? (<FilterMetadata>this.filters()['global']).value : null,
            multiSortMeta: this.multiSortMeta(),
            forceUpdate: () => this.cd.detectChanges()
        };
    }

    public clear() {
        this.sortField.set(null);
        this.sortOrder.set(this.defaultSortOrder());
        this.multiSortMeta.set(null);
        this.tableService.onSort(null);

        this.clearFilterValues();

        this.filteredValue = null;

        this.first.set(0);
        this.firstChange.emit(this.first()!);

        if (this.lazy()) {
            this.onLazyLoad.emit(this.createLazyLoadMetadata());
        } else {
            this.totalRecords.set(this._totalRecords === 0 && this.value() ? this.value().length : (this._totalRecords ?? 0));
        }
    }

    clearFilterValues() {
        for (const [, filterMetadata] of Object.entries(this.filters())) {
            if (Array.isArray(filterMetadata)) {
                for (let filter of filterMetadata) {
                    filter.value = null;
                }
            } else if (filterMetadata) {
                filterMetadata.value = null;
            }
        }
    }

    reset() {
        this.clear();
    }

    getExportHeader(column: any) {
        return column[<string>this.exportHeader()] || column.header || column.field;
    }
    /**
     * Data export method.
     * @param {ExportCSVOptions} object - Export options.
     * @group Method
     */
    public exportCSV(options?: ExportCSVOptions) {
        let data;
        let csv = '';
        let columns = this.columns();

        if (options && options.selectionOnly) {
            data = this.selection() || [];
        } else if (options && options.allValues) {
            data = this.value() || [];
        } else {
            data = this.filteredValue || this.value();

            if (this.frozenValue()) {
                data = data ? [...this.frozenValue()!, ...data] : this.frozenValue();
            }
        }

        const exportableColumns: any[] = (<any[]>columns).filter((column) => column.exportable !== false && column.field);

        //headers
        csv += exportableColumns.map((column) => '"' + this.getExportHeader(column) + '"').join(this.csvSeparator());

        //body
        const body = data
            .map((record: any) =>
                exportableColumns
                    .map((column) => {
                        let cellData = ObjectUtils.resolveFieldData(record, column.field);

                        if (cellData != null) {
                            if (this.exportFunction()) {
                                cellData = this.exportFunction()!({
                                    data: cellData,
                                    field: column.field
                                });
                            } else cellData = String(cellData).replace(/"/g, '""');
                        } else cellData = '';

                        return '"' + cellData + '"';
                    })
                    .join(this.csvSeparator())
            )
            .join('\n');

        if (body.length) {
            csv += '\n' + body;
        }

        let blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csv], {
            type: 'text/csv;charset=utf-8;'
        });

        let link = this.renderer.createElement('a');
        link.style.display = 'none';
        this.renderer.appendChild(this.document.body, link);
        if (link.download !== undefined) {
            link.setAttribute('href', URL.createObjectURL(blob));
            link.setAttribute('download', this.exportFilename() + '.csv');
            link.click();
        } else {
            csv = 'data:text/csv;charset=utf-8,' + csv;
            this.document.defaultView?.open(encodeURI(csv));
        }
        this.renderer.removeChild(this.document.body, link);
    }

    onLazyItemLoad(event: LazyLoadMeta) {
        this.onLazyLoad.emit({
            ...this.createLazyLoadMetadata(),
            ...event,
            rows: <number>event.last - <number>event.first
        });
    }
    /**
     * Resets scroll to top.
     * @group Method
     */
    public resetScrollTop() {
        if (this.virtualScroll()) this.scrollToVirtualIndex(0);
        else this.scrollTo({ top: 0 });
    }
    /**
     * Scrolls to given index when using virtual scroll.
     * @param {number} index - index of the element.
     * @group Method
     */
    public scrollToVirtualIndex(index: number) {
        this.scroller()?.scrollToIndex(index);
    }
    /**
     * Scrolls to given index.
     * @param {ScrollToOptions} options - scroll options.
     * @group Method
     */
    public scrollTo(options: any) {
        if (this.virtualScroll()) {
            this.scroller()?.scrollTo(options);
        } else {
            const wrapperEl = this.wrapperViewChild()?.nativeElement;
            if (wrapperEl) {
                if (wrapperEl.scrollTo) {
                    wrapperEl.scrollTo(options);
                } else {
                    wrapperEl.scrollLeft = options.left;
                    wrapperEl.scrollTop = options.top;
                }
            }
        }
    }

    updateEditingCell(cell: any, data: any, field: string, index: number) {
        this.editingCell = cell;
        this.editingCellData = data;
        this.editingCellField = field;
        this.editingCellRowIndex = index;
        this.bindDocumentEditListener();
    }

    isEditingCellValid() {
        return this.editingCell && DomHandler.find(this.editingCell, '.ng-invalid.ng-dirty').length === 0;
    }

    bindDocumentEditListener() {
        if (!this.documentEditListener) {
            this.documentEditListener = this.renderer.listen(this.document, 'click', (event) => {
                if (this.editingCell && !this.selfClick && this.isEditingCellValid()) {
                    !this.$unstyled() && DomHandler.removeClass(this.editingCell, 'p-cell-editing');
                    setAttribute(this.editingCell as HTMLElement, 'data-p-cell-editing', 'false');
                    this.editingCell = null;
                    this.onEditComplete.emit({
                        field: this.editingCellField,
                        data: this.editingCellData,
                        originalEvent: event,
                        index: <number>this.editingCellRowIndex
                    });
                    this.editingCellField = null;
                    this.editingCellData = null;
                    this.editingCellRowIndex = null;
                    this.unbindDocumentEditListener();
                    this.cd.markForCheck();

                    if (this.overlaySubscription) {
                        this.overlaySubscription.unsubscribe();
                    }
                }

                this.selfClick = false;
            });
        }
    }

    unbindDocumentEditListener() {
        if (this.documentEditListener) {
            this.documentEditListener();
            this.documentEditListener = null;
        }
    }

    initRowEdit(rowData: any) {
        let dataKeyValue = String(ObjectUtils.resolveFieldData(rowData, this.dataKey()));
        this.editingRowKeys()[dataKeyValue] = true;
    }

    saveRowEdit(rowData: any, rowElement: HTMLTableRowElement) {
        if (DomHandler.find(rowElement, '.ng-invalid.ng-dirty').length === 0) {
            let dataKeyValue = String(ObjectUtils.resolveFieldData(rowData, this.dataKey()));
            delete this.editingRowKeys()[dataKeyValue];
        }
    }

    cancelRowEdit(rowData: any) {
        let dataKeyValue = String(ObjectUtils.resolveFieldData(rowData, this.dataKey()));
        delete this.editingRowKeys()[dataKeyValue];
    }

    toggleRow(rowData: any, event?: Event) {
        if (!this.dataKey() && !this.groupRowsBy()) {
            throw new Error('dataKey or groupRowsBy must be defined to use row expansion');
        }

        let dataKeyValue = this.groupRowsBy() ? String(ObjectUtils.resolveFieldData(rowData, this.groupRowsBy())) : String(ObjectUtils.resolveFieldData(rowData, this.dataKey()));

        if (this.expandedRowKeys()[dataKeyValue] != null) {
            delete this.expandedRowKeys()[dataKeyValue];
            this.onRowCollapse.emit({
                originalEvent: <Event>event,
                data: rowData
            });
        } else {
            if (this.rowExpandMode() === 'single') {
                this.expandedRowKeys.set({});
            }

            this.expandedRowKeys()[dataKeyValue] = true;
            this.onRowExpand.emit({
                originalEvent: <Event>event,
                data: rowData
            });
        }

        if (event) {
            event.preventDefault();
        }

        if (this.isStateful()) {
            this.saveState();
        }
    }

    isRowExpanded(rowData: any): boolean {
        return this.groupRowsBy() ? this.expandedRowKeys()[String(ObjectUtils.resolveFieldData(rowData, this.groupRowsBy()))] === true : this.expandedRowKeys()[String(ObjectUtils.resolveFieldData(rowData, this.dataKey()))] === true;
    }

    isRowEditing(rowData: any): boolean {
        return this.editingRowKeys()[String(ObjectUtils.resolveFieldData(rowData, this.dataKey()))] === true;
    }

    isSingleSelectionMode() {
        return this.selectionMode() === 'single';
    }

    isMultipleSelectionMode() {
        return this.selectionMode() === 'multiple';
    }

    onColumnResizeBegin(event: any) {
        let containerLeft = DomHandler.getOffset(this.el?.nativeElement).left;
        this.resizeColumnElement = event.target.closest('th');
        this.columnResizing = true;
        if (event.type == 'touchstart') {
            this.lastResizerHelperX = event.changedTouches[0].clientX - containerLeft + this.el?.nativeElement.scrollLeft;
        } else {
            this.lastResizerHelperX = event.pageX - containerLeft + this.el?.nativeElement.scrollLeft;
        }
        this.onColumnResize(event);
        event.preventDefault();
    }

    onColumnResize(event: any) {
        let containerLeft = DomHandler.getOffset(this.el?.nativeElement).left;
        !this.$unstyled() && DomHandler.addClass(this.el?.nativeElement, 'p-unselectable-text');
        (<ElementRef>this.resizeHelperViewChild()).nativeElement.style.height = this.el?.nativeElement.offsetHeight + 'px';
        (<ElementRef>this.resizeHelperViewChild()).nativeElement.style.top = 0 + 'px';
        if (event.type == 'touchmove') {
            (<ElementRef>this.resizeHelperViewChild()).nativeElement.style.left = event.changedTouches[0].clientX - containerLeft + this.el?.nativeElement.scrollLeft + 'px';
        } else {
            (<ElementRef>this.resizeHelperViewChild()).nativeElement.style.left = event.pageX - containerLeft + this.el?.nativeElement.scrollLeft + 'px';
        }
        (<ElementRef>this.resizeHelperViewChild()).nativeElement.style.display = 'block';
    }

    onColumnResizeEnd() {
        const isRTL = getComputedStyle(this.el?.nativeElement ?? document.documentElement).direction === 'rtl';
        const rawDelta = this.resizeHelperViewChild()?.nativeElement.offsetLeft - <number>this.lastResizerHelperX;
        const delta = isRTL ? -rawDelta : rawDelta;
        const columnWidth = this.resizeColumnElement.offsetWidth;
        const newColumnWidth = columnWidth + delta;
        const elementMinWidth = this.resizeColumnElement.style.minWidth.replace(/[^\d.]/g, '');
        const minWidth = elementMinWidth ? parseFloat(elementMinWidth) : 15;

        if (newColumnWidth >= minWidth) {
            if (this.columnResizeMode() === 'fit') {
                const nextColumn = this.resizeColumnElement.nextElementSibling as HTMLElement;
                const nextColumnWidth = nextColumn.offsetWidth - delta;

                if (newColumnWidth > 15 && nextColumnWidth > 15) {
                    this.resizeTableCells(newColumnWidth, nextColumnWidth);
                }
            } else if (this.columnResizeMode() === 'expand') {
                this._initialColWidths = this._totalTableWidth();
                const tableWidth = this.tableViewChild()?.nativeElement.offsetWidth + delta;

                this.setResizeTableWidth(tableWidth + 'px');
                this.resizeTableCells(newColumnWidth, null);
            }

            this.onColResize.emit({
                element: this.resizeColumnElement,
                delta: delta
            });

            if (this.isStateful()) {
                this.saveState();
            }
        }

        (<ElementRef>this.resizeHelperViewChild()).nativeElement.style.display = 'none';
        DomHandler.removeClass(this.el?.nativeElement, 'p-unselectable-text');
    }

    private _totalTableWidth(): number[] {
        let widths = [];
        const tableHead = DomHandler.findSingle(this.el.nativeElement, '[data-pc-section="thead"]');
        let headers = DomHandler.find(tableHead, 'tr > th');
        headers.forEach((header) => (widths as any[]).push(DomHandler.getOuterWidth(header)));

        return widths;
    }

    onColumnDragStart(event: any, columnElement: any) {
        this.reorderIconWidth = DomHandler.getHiddenElementOuterWidth(this.reorderIndicatorUpViewChild()?.nativeElement);
        this.reorderIconHeight = DomHandler.getHiddenElementOuterHeight(this.reorderIndicatorDownViewChild()?.nativeElement);
        this.draggedColumn = columnElement;
        event.dataTransfer.setData('text', 'b'); // For firefox
    }

    onColumnDragEnter(event: any, dropHeader: any) {
        if (this.reorderableColumns() && this.draggedColumn && dropHeader) {
            event.preventDefault();
            let containerOffset = DomHandler.getOffset(this.el?.nativeElement);
            let dropHeaderOffset = DomHandler.getOffset(dropHeader);

            if (this.draggedColumn != dropHeader) {
                let dragIndex = DomHandler.indexWithinGroup(this.draggedColumn, 'preorderablecolumn');
                let dropIndex = DomHandler.indexWithinGroup(dropHeader, 'preorderablecolumn');
                let targetLeft = dropHeaderOffset.left - containerOffset.left;
                let targetTop = containerOffset.top - dropHeaderOffset.top;
                let columnCenter = dropHeaderOffset.left + dropHeader.offsetWidth / 2;

                (<ElementRef>this.reorderIndicatorUpViewChild()).nativeElement.style.top = dropHeaderOffset.top - containerOffset.top - (<number>this.reorderIconHeight - 1) + 'px';
                (<ElementRef>this.reorderIndicatorDownViewChild()).nativeElement.style.top = dropHeaderOffset.top - containerOffset.top + dropHeader.offsetHeight + 'px';

                if (event.pageX > columnCenter) {
                    (<ElementRef>this.reorderIndicatorUpViewChild()).nativeElement.style.left = targetLeft + dropHeader.offsetWidth - Math.ceil(<number>this.reorderIconWidth / 2) + 'px';
                    (<ElementRef>this.reorderIndicatorDownViewChild()).nativeElement.style.left = targetLeft + dropHeader.offsetWidth - Math.ceil(<number>this.reorderIconWidth / 2) + 'px';
                    this.dropPosition = 1;
                } else {
                    (<ElementRef>this.reorderIndicatorUpViewChild()).nativeElement.style.left = targetLeft - Math.ceil(<number>this.reorderIconWidth / 2) + 'px';
                    (<ElementRef>this.reorderIndicatorDownViewChild()).nativeElement.style.left = targetLeft - Math.ceil(<number>this.reorderIconWidth / 2) + 'px';
                    this.dropPosition = -1;
                }
                (<ElementRef>this.reorderIndicatorUpViewChild()).nativeElement.style.display = 'block';
                (<ElementRef>this.reorderIndicatorDownViewChild()).nativeElement.style.display = 'block';
            } else {
                event.dataTransfer.dropEffect = 'none';
            }
        }
    }

    onColumnDragLeave(event: Event) {
        if (this.reorderableColumns() && this.draggedColumn) {
            event.preventDefault();
        }
    }

    onColumnDrop(event: Event, dropColumn: any) {
        event.preventDefault();
        if (this.draggedColumn) {
            let dragIndex = DomHandler.indexWithinGroup(this.draggedColumn, 'preorderablecolumn');
            let dropIndex = DomHandler.indexWithinGroup(dropColumn, 'preorderablecolumn');
            let allowDrop = dragIndex != dropIndex;
            if (allowDrop && ((dropIndex - dragIndex == 1 && this.dropPosition === -1) || (dragIndex - dropIndex == 1 && this.dropPosition === 1))) {
                allowDrop = false;
            }

            if (allowDrop && dropIndex < dragIndex && this.dropPosition === 1) {
                dropIndex = dropIndex + 1;
            }

            if (allowDrop && dropIndex > dragIndex && this.dropPosition === -1) {
                dropIndex = dropIndex - 1;
            }

            if (allowDrop) {
                ObjectUtils.reorderArray(<any[]>this.columns(), dragIndex, dropIndex);

                this.onColReorder.emit({
                    dragIndex: dragIndex,
                    dropIndex: dropIndex,
                    columns: this.columns()
                });

                if (this.isStateful()) {
                    this.zone.runOutsideAngular(() => {
                        setTimeout(() => {
                            this.saveState();
                        });
                    });
                }
            }

            if (this.resizableColumns() && this.resizeColumnElement) {
                let width = this.columnResizeMode() === 'expand' ? this._initialColWidths : this._totalTableWidth();
                ObjectUtils.reorderArray(width, dragIndex + 1, dropIndex + 1);
                this.updateStyleElement(width, dragIndex, 0, 0);
            }

            (<ElementRef>this.reorderIndicatorUpViewChild()).nativeElement.style.display = 'none';
            (<ElementRef>this.reorderIndicatorDownViewChild()).nativeElement.style.display = 'none';
            this.draggedColumn.draggable = false;
            this.draggedColumn = null;
            this.dropPosition = null;
        }
    }

    resizeTableCells(newColumnWidth: number, nextColumnWidth: number | null) {
        let colIndex = DomHandler.index(this.resizeColumnElement);
        let width = this.columnResizeMode() === 'expand' ? this._initialColWidths : this._totalTableWidth();
        this.updateStyleElement(width, colIndex, newColumnWidth, nextColumnWidth);
    }

    updateStyleElement(width: number[], colIndex: number, newColumnWidth: number, nextColumnWidth: number | null) {
        this.destroyStyleElement();
        this.createStyleElement();

        let innerHTML = '';
        width.forEach((width, index) => {
            let colWidth = index === colIndex ? newColumnWidth : nextColumnWidth && index === colIndex + 1 ? nextColumnWidth : width;
            let style = `width: ${colWidth}px !important; max-width: ${colWidth}px !important;`;
            innerHTML += `
                #${this.id}-table > .p-datatable-thead > tr > th:nth-child(${index + 1}),
                #${this.id}-table > .p-datatable-tbody > tr > td:nth-child(${index + 1}),
                #${this.id}-table > .p-datatable-tfoot > tr > td:nth-child(${index + 1}) {
                    ${style}
                }
            `;
        });
        this.renderer.setProperty(this.styleElement, 'innerHTML', innerHTML);
    }

    onRowDragStart(event: any, index: number) {
        this.rowDragging = true;
        this.draggedRowIndex = index;
        event.dataTransfer.setData('text', 'b'); // For firefox
    }

    onRowDragOver(event: MouseEvent, index: number, rowElement: any) {
        if (this.rowDragging && this.draggedRowIndex !== index) {
            let rowY = DomHandler.getOffset(rowElement).top;
            let pageY = event.pageY;
            let rowMidY = rowY + DomHandler.getOuterHeight(rowElement) / 2;
            let prevRowElement = rowElement.previousElementSibling;

            if (pageY < rowMidY) {
                DomHandler.removeClass(rowElement, 'p-datatable-dragpoint-bottom');

                this.droppedRowIndex = index;
                if (prevRowElement && !this.$unstyled()) DomHandler.addClass(prevRowElement, 'p-datatable-dragpoint-bottom');
                else !this.$unstyled() && DomHandler.addClass(rowElement, 'p-datatable-dragpoint-top');
            } else {
                if (prevRowElement && !this.$unstyled()) DomHandler.removeClass(prevRowElement, 'p-datatable-dragpoint-bottom');
                else !this.$unstyled() && DomHandler.addClass(rowElement, 'p-datatable-dragpoint-top');

                this.droppedRowIndex = index + 1;
                !this.$unstyled() && DomHandler.addClass(rowElement, 'p-datatable-dragpoint-bottom');
            }
        }
    }

    onRowDragLeave(event: Event, rowElement: any) {
        let prevRowElement = rowElement.previousElementSibling;
        if (prevRowElement) {
            !this.$unstyled() && DomHandler.removeClass(prevRowElement, 'p-datatable-dragpoint-bottom');
        }

        !this.$unstyled() && DomHandler.removeClass(rowElement, 'p-datatable-dragpoint-bottom');
        !this.$unstyled() && DomHandler.removeClass(rowElement, 'p-datatable-dragpoint-top');
    }

    onRowDragEnd(event: Event) {
        this.rowDragging = false;
        this.draggedRowIndex = null;
        this.droppedRowIndex = null;
    }

    onRowDrop(event: Event, rowElement: any) {
        if (this.droppedRowIndex != null) {
            let dropIndex = <number>this.draggedRowIndex > this.droppedRowIndex ? this.droppedRowIndex : this.droppedRowIndex === 0 ? 0 : this.droppedRowIndex - 1;
            ObjectUtils.reorderArray(this.value(), <number>this.draggedRowIndex, dropIndex);

            if (this.virtualScroll()) {
                // TODO: Check
                this.value.set([...this.value()]);
            }

            this.onRowReorder.emit({
                dragIndex: <number>this.draggedRowIndex,
                dropIndex: dropIndex
            });
        }
        //cleanup
        this.onRowDragLeave(event, rowElement);
        this.onRowDragEnd(event);
    }

    isEmpty() {
        let data = this.filteredValue || this.value();
        return data == null || data.length == 0;
    }

    getBlockableElement(): HTMLElement {
        return this.el.nativeElement.children[0];
    }

    getStorage() {
        if (isPlatformBrowser(this.platformId)) {
            switch (this.stateStorage()) {
                case 'local':
                    return window.localStorage;

                case 'session':
                    return window.sessionStorage;

                default:
                    throw new Error(this.stateStorage() + ' is not a valid value for the state storage, supported values are "local" and "session".');
            }
        } else {
            throw new Error('Browser storage is not available in the server side.');
        }
    }

    isStateful() {
        return this.stateKey() != null;
    }

    saveState() {
        const storage = this.getStorage();
        let state: TableState = {};

        if (this.paginator()) {
            state.first = <number>this.first();
            state.rows = this.rows();
        }

        if (this.sortField()) {
            state.sortField = this.sortField() ?? undefined;
            state.sortOrder = this.sortOrder();
        }

        if (this.multiSortMeta()) {
            state.multiSortMeta = this.multiSortMeta() ?? undefined;
        }

        if (this.hasFilter()) {
            state.filters = this.filters();
        }

        if (this.resizableColumns()) {
            this.saveColumnWidths(state);
        }

        if (this.reorderableColumns()) {
            this.saveColumnOrder(state);
        }

        if (this.selection()) {
            state.selection = this.selection();
        }

        if (Object.keys(this.expandedRowKeys()).length) {
            state.expandedRowKeys = this.expandedRowKeys();
        }

        storage.setItem(<string>this.stateKey(), JSON.stringify(state));
        this.onStateSave.emit(state);
    }

    clearState() {
        const storage = this.getStorage();

        if (this.stateKey()) {
            storage.removeItem(<string>this.stateKey());
        }
    }

    restoreState() {
        const storage = this.getStorage();
        const stateString = storage.getItem(<string>this.stateKey());
        const dateFormat = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/;
        const reviver = function (key: any, value: any) {
            if (typeof value === 'string' && dateFormat.test(value)) {
                return new Date(value);
            }

            return value;
        };

        if (stateString) {
            let state: TableState = JSON.parse(stateString, reviver);

            if (this.paginator()) {
                if (this.first() !== undefined) {
                    this.first.set(state.first);
                    this.firstChange.emit(this.first()!);
                }

                if (this.rows() !== undefined) {
                    this.rows.set(state.rows);
                    this.rowsChange.emit(this.rows()!);
                }
            }

            if (state.sortField) {
                this.restoringSort = true;
                this.sortField.set(state.sortField);
                this.sortOrder.set(<number>state.sortOrder);
            }

            if (state.multiSortMeta) {
                this.restoringSort = true;
                this.multiSortMeta.set(state.multiSortMeta);
            }

            if (state.filters) {
                this.restoringFilter = true;
                this.filters.set(state.filters);
            }

            if (this.resizableColumns()) {
                this.columnWidthsState = state.columnWidths;
                this.tableWidthState = state.tableWidth;
            }

            // if (this.reorderableColumns()) {
            //     this.restoreColumnOrder();
            // }

            if (state.expandedRowKeys) {
                this.expandedRowKeys.set(state.expandedRowKeys);
            }

            if (state.selection) {
                Promise.resolve(null).then(() => this.selectionChange.emit(state.selection));
            }

            this.stateRestored = true;

            this.onStateRestore.emit(state);
        }
    }

    saveColumnWidths(state: any) {
        let widths: any[] = [];
        let headers: any[] = [];

        const container = this.el?.nativeElement;

        if (container) {
            headers = DomHandler.find(container, '[data-pc-section="thead"] > tr > th');
        }

        headers.forEach((header) => (widths as any[]).push(DomHandler.getOuterWidth(header)));
        state.columnWidths = widths.join(',');

        if (this.columnResizeMode() === 'expand' && this.tableViewChild()) {
            state.tableWidth = DomHandler.getOuterWidth(this.tableViewChild()!.nativeElement);
        }
    }

    setResizeTableWidth(width: string) {
        (<ElementRef>this.tableViewChild()).nativeElement.style.width = width;
        (<ElementRef>this.tableViewChild()).nativeElement.style.minWidth = width;
    }

    restoreColumnWidths() {
        if (this.columnWidthsState) {
            let widths = this.columnWidthsState.split(',');

            if (this.columnResizeMode() === 'expand' && this.tableWidthState) {
                this.setResizeTableWidth(this.tableWidthState + 'px');
            }

            if (ObjectUtils.isNotEmpty(widths)) {
                this.createStyleElement();

                let innerHTML = '';
                widths.forEach((width, index) => {
                    let style = `width: ${width}px !important; max-width: ${width}px !important`;

                    innerHTML += `
                        #${this.id}-table > .p-datatable-thead > tr > th:nth-child(${index + 1}),
                        #${this.id}-table > .p-datatable-tbody > tr > td:nth-child(${index + 1}),
                        #${this.id}-table > .p-datatable-tfoot > tr > td:nth-child(${index + 1}) {
                            ${style}
                        }
                    `;
                });

                this.styleElement.innerHTML = innerHTML;
            }
        }
    }

    saveColumnOrder(state: any) {
        const columns = this.columns();
        if (columns) {
            let columnOrder: string[] = [];
            columns.map((column) => {
                columnOrder.push(column.field || column.key);
            });

            state.columnOrder = columnOrder;
        }
    }

    restoreColumnOrder() {
        const storage = this.getStorage();
        const stateString = storage.getItem(<string>this.stateKey());
        if (stateString) {
            let state: TableState = JSON.parse(stateString);
            let columnOrder = state.columnOrder;

            if (columnOrder) {
                let reorderedColumns: any[] = [];

                columnOrder.map((key) => {
                    let col = this.findColumnByKey(key);
                    if (col) {
                        reorderedColumns.push(col);
                    }
                });
                this.columnOrderStateRestored = true;
                this.columns.set(reorderedColumns);
            }
        }
    }

    findColumnByKey(key: any) {
        const columns = this.columns();
        if (columns) {
            for (let col of columns) {
                if (col.key === key || col.field === key) return col;
                else continue;
            }
        } else {
            return null;
        }
    }

    createStyleElement() {
        this.styleElement = this.renderer.createElement('style');
        this.styleElement.type = 'text/css';
        DomHandler.setAttribute(this.styleElement, 'nonce', this.config?.csp()?.nonce);
        this.renderer.appendChild(this.document.head, this.styleElement);
        DomHandler.setAttribute(this.styleElement, 'nonce', this.config?.csp()?.nonce);
    }

    getGroupRowsMeta() {
        return { field: this.groupRowsBy(), order: this.groupRowsByOrder() };
    }

    createResponsiveStyle() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.responsiveStyleElement) {
                this.responsiveStyleElement = this.renderer.createElement('style');
                this.responsiveStyleElement.type = 'text/css';
                DomHandler.setAttribute(this.responsiveStyleElement, 'nonce', this.config?.csp()?.nonce);
                this.renderer.appendChild(this.document.head, this.responsiveStyleElement);

                let innerHTML = `
    @media screen and (max-width: ${this.breakpoint()}) {
        #${this.id}-table > .p-datatable-thead > tr > th,
        #${this.id}-table > .p-datatable-tfoot > tr > td {
            display: none !important;
        }

        #${this.id}-table > .p-datatable-tbody > tr > td {
            display: flex;
            width: 100% !important;
            align-items: center;
            justify-content: space-between;
        }

        #${this.id}-table > .p-datatable-tbody > tr > td:not(:last-child) {
            border: 0 none;
        }

        #${this.id}.p-datatable-gridlines > .p-datatable-table-container > .p-datatable-table > .p-datatable-tbody > tr > td:last-child {
            border-top: 0;
            border-right: 0;
            border-left: 0;
        }

        #${this.id}-table > .p-datatable-tbody > tr > td > .p-datatable-column-title {
            display: block;
        }
    }
    `;
                this.renderer.setProperty(this.responsiveStyleElement, 'innerHTML', innerHTML);
                DomHandler.setAttribute(this.responsiveStyleElement, 'nonce', this.config?.csp()?.nonce);
            }
        }
    }

    destroyResponsiveStyle() {
        if (this.responsiveStyleElement) {
            this.renderer.removeChild(this.document.head, this.responsiveStyleElement);
            this.responsiveStyleElement = null;
        }
    }

    destroyStyleElement() {
        if (this.styleElement) {
            this.renderer.removeChild(this.document.head, this.styleElement);
            this.styleElement = null;
        }
    }

    ngAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }

    onDestroy() {
        this.unbindDocumentEditListener();
        this.editingCell = null;
        this.initialized = null;

        this.destroyStyleElement();
        this.destroyResponsiveStyle();
    }

    get dataP() {
        return this.cn({
            scrollable: this.scrollable(),
            'flex-scrollable': this.scrollable() && this.scrollHeight() === 'flex',
            [this.size() as string]: this.size(),
            loading: this.loading(),
            empty: this.isEmpty()
        });
    }
}

@Component({
    selector: '[vxTableBody]',
    imports: [CommonModule],
    template: `
        @if (!dataTable.expandedRowTemplate() && !dataTable._expandedRowTemplate()) {
            @for (rowData of value(); track dataTable.rowTrackBy()(rowIndex, rowData); let rowIndex = $index) {
                @if ((dataTable.groupHeaderTemplate() || dataTable._groupHeaderTemplate()) && !dataTable.virtualScroll() && dataTable.rowGroupMode() === 'subheader' && shouldRenderRowGroupHeader(value(), rowData, getRowIndex(rowIndex))) {
                    <ng-container role="row">
                        <ng-container
                            *ngTemplateOutlet="
                                dataTable.groupHeaderTemplate() || dataTable._groupHeaderTemplate();
                                context: {
                                    $implicit: rowData,
                                    rowIndex: getRowIndex(rowIndex),
                                    columns: columns(),
                                    editing: dataTable.editMode() === 'row' && dataTable.isRowEditing(rowData),
                                    frozen: frozen()
                                }
                            "
                        ></ng-container>
                    </ng-container>
                }
                @if (dataTable.rowGroupMode() !== 'rowspan') {
                    <ng-container
                        *ngTemplateOutlet="
                            rowData ? template() : dataTable.loadingBodyTemplate() || dataTable._loadingBodyTemplate();
                            context: {
                                $implicit: rowData,
                                rowIndex: getRowIndex(rowIndex),
                                columns: columns(),
                                editing: dataTable.editMode() === 'row' && dataTable.isRowEditing(rowData),
                                frozen: frozen()
                            }
                        "
                    ></ng-container>
                }
                @if (dataTable.rowGroupMode() === 'rowspan') {
                    <ng-container
                        *ngTemplateOutlet="
                            rowData ? template() : dataTable.loadingBodyTemplate() || dataTable._loadingBodyTemplate();
                            context: {
                                $implicit: rowData,
                                rowIndex: getRowIndex(rowIndex),
                                columns: columns(),
                                editing: dataTable.editMode() === 'row' && dataTable.isRowEditing(rowData),
                                frozen: frozen(),
                                rowgroup: shouldRenderRowspan(value(), rowData, rowIndex),
                                rowspan: calculateRowGroupSize(value(), rowData, rowIndex)
                            }
                        "
                    ></ng-container>
                }
                @if ((dataTable.groupFooterTemplate() || dataTable._groupFooterTemplate()) && !dataTable.virtualScroll() && dataTable.rowGroupMode() === 'subheader' && shouldRenderRowGroupFooter(value(), rowData, getRowIndex(rowIndex))) {
                    <ng-container role="row">
                        <ng-container
                            *ngTemplateOutlet="
                                dataTable.groupFooterTemplate() || dataTable._groupFooterTemplate();
                                context: {
                                    $implicit: rowData,
                                    rowIndex: getRowIndex(rowIndex),
                                    columns: columns(),
                                    editing: dataTable.editMode() === 'row' && dataTable.isRowEditing(rowData),
                                    frozen: frozen()
                                }
                            "
                        ></ng-container>
                    </ng-container>
                }
            }
        }
        @if ((dataTable.expandedRowTemplate() || dataTable._expandedRowTemplate()) && !(frozen() && (dataTable.frozenExpandedRowTemplate() || dataTable._frozenExpandedRowTemplate()))) {
            @for (rowData of value(); track dataTable.rowTrackBy()(rowIndex, rowData); let rowIndex = $index) {
                @if (!(dataTable.groupHeaderTemplate() && dataTable._groupHeaderTemplate())) {
                    <ng-container
                        *ngTemplateOutlet="
                            template();
                            context: {
                                $implicit: rowData,
                                rowIndex: getRowIndex(rowIndex),
                                columns: columns(),
                                expanded: dataTable.isRowExpanded(rowData),
                                editing: dataTable.editMode() === 'row' && dataTable.isRowEditing(rowData),
                                frozen: frozen()
                            }
                        "
                    ></ng-container>
                }
                @if ((dataTable.groupHeaderTemplate() || dataTable._groupHeaderTemplate()) && dataTable.rowGroupMode() === 'subheader' && shouldRenderRowGroupHeader(value(), rowData, getRowIndex(rowIndex))) {
                    <ng-container role="row">
                        <ng-container
                            *ngTemplateOutlet="
                                dataTable.groupHeaderTemplate() || dataTable._groupHeaderTemplate();
                                context: {
                                    $implicit: rowData,
                                    rowIndex: getRowIndex(rowIndex),
                                    columns: columns(),
                                    expanded: dataTable.isRowExpanded(rowData),
                                    editing: dataTable.editMode() === 'row' && dataTable.isRowEditing(rowData),
                                    frozen: frozen()
                                }
                            "
                        ></ng-container>
                    </ng-container>
                }
                @if (dataTable.isRowExpanded(rowData)) {
                    <ng-container
                        *ngTemplateOutlet="
                            dataTable.expandedRowTemplate() || dataTable._expandedRowTemplate();
                            context: {
                                $implicit: rowData,
                                rowIndex: getRowIndex(rowIndex),
                                columns: columns(),
                                frozen: frozen()
                            }
                        "
                    ></ng-container>
                    @if ((dataTable.groupFooterTemplate() || dataTable._groupFooterTemplate()) && dataTable.rowGroupMode() === 'subheader' && shouldRenderRowGroupFooter(value(), rowData, getRowIndex(rowIndex))) {
                        <ng-container role="row">
                            <ng-container
                                *ngTemplateOutlet="
                                    dataTable.groupFooterTemplate() || dataTable._groupFooterTemplate();
                                    context: {
                                        $implicit: rowData,
                                        rowIndex: getRowIndex(rowIndex),
                                        columns: columns(),
                                        expanded: dataTable.isRowExpanded(rowData),
                                        editing: dataTable.editMode() === 'row' && dataTable.isRowEditing(rowData),
                                        frozen: frozen()
                                    }
                                "
                            ></ng-container>
                        </ng-container>
                    }
                }
            }
        }
        @if ((dataTable.frozenExpandedRowTemplate() || dataTable._frozenExpandedRowTemplate()) && frozen()) {
            @for (rowData of value(); track dataTable.rowTrackBy()(rowIndex, rowData); let rowIndex = $index) {
                <ng-container
                    *ngTemplateOutlet="
                        template();
                        context: {
                            $implicit: rowData,
                            rowIndex: getRowIndex(rowIndex),
                            columns: columns(),
                            expanded: dataTable.isRowExpanded(rowData),
                            editing: dataTable.editMode() === 'row' && dataTable.isRowEditing(rowData),
                            frozen: frozen()
                        }
                    "
                ></ng-container>
                @if (dataTable.isRowExpanded(rowData)) {
                    <ng-container
                        *ngTemplateOutlet="
                            dataTable.frozenExpandedRowTemplate() || dataTable._frozenExpandedRowTemplate();
                            context: {
                                $implicit: rowData,
                                rowIndex: getRowIndex(rowIndex),
                                columns: columns(),
                                frozen: frozen()
                            }
                        "
                    ></ng-container>
                }
            }
        }
        @if (dataTable.loading()) {
            <ng-container *ngTemplateOutlet="dataTable.loadingBodyTemplate() || dataTable._loadingBodyTemplate(); context: { $implicit: columns(), frozen: frozen() }"></ng-container>
        }
        @if (dataTable.isEmpty() && !dataTable.loading()) {
            <ng-container *ngTemplateOutlet="dataTable.emptyMessageTemplate() || dataTable._emptyMessageTemplate(); context: { $implicit: columns(), frozen: frozen() }"></ng-container>
        }
    `,
    changeDetection: ChangeDetectionStrategy.Default,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[attr.data-p]': 'dataP'
    }
})
export class TableBody extends BaseComponent {
    hostName = 'Table';

    columns = input<any[] | undefined>(undefined, { alias: 'vxTableBody' });

    template = input<Nullable<TemplateRef<any>>>(undefined, { alias: 'vxTableBodyTemplate' });

    value = input<any[] | undefined>(undefined, { alias: 'value' });

    frozen = input(undefined, { transform: booleanAttribute });

    frozenRows = input(undefined, { transform: booleanAttribute });

    scrollerOptions = input<any>();

    onAfterViewInit() {
        if (this.frozenRows()) {
            this.updateFrozenRowStickyPosition();
        }

        if (this.dataTable.scrollable() && this.dataTable.rowGroupMode() === 'subheader') {
            this.updateFrozenRowGroupHeaderStickyPosition();
        }
    }

    constructor(
        public dataTable: Table,
        public tableService: TableService
    ) {
        super();
        this.dataTable.tableService.valueSource$.pipe(takeUntilDestroyed()).subscribe(() => {
            if (this.dataTable.virtualScroll()) {
                this.cd.detectChanges();
            }
        });

        // Former `value` setter side effect (#19): reposition frozen rows / group header on value change.
        effect(() => {
            this.value();
            untracked(() => {
                if (this.frozenRows()) {
                    this.updateFrozenRowStickyPosition();
                }

                if (this.dataTable.scrollable() && this.dataTable.rowGroupMode() === 'subheader') {
                    this.updateFrozenRowGroupHeaderStickyPosition();
                }
            });
        });
    }

    shouldRenderRowGroupHeader(value: any, rowData: any, i: number) {
        let currentRowFieldData = ObjectUtils.resolveFieldData(rowData, this.dataTable?.groupRowsBy() || '');
        let prevRowData = value[i - (this.dataTable?.first() || 0) - 1];
        if (prevRowData) {
            let previousRowFieldData = ObjectUtils.resolveFieldData(prevRowData, this.dataTable?.groupRowsBy() || '');
            return currentRowFieldData !== previousRowFieldData;
        } else {
            return true;
        }
    }

    shouldRenderRowGroupFooter(value: any, rowData: any, i: number) {
        let currentRowFieldData = ObjectUtils.resolveFieldData(rowData, this.dataTable?.groupRowsBy() || '');
        let nextRowData = value[i - (this.dataTable?.first() || 0) + 1];
        if (nextRowData) {
            let nextRowFieldData = ObjectUtils.resolveFieldData(nextRowData, this.dataTable?.groupRowsBy() || '');
            return currentRowFieldData !== nextRowFieldData;
        } else {
            return true;
        }
    }

    shouldRenderRowspan(value: any, rowData: any, i: number) {
        let currentRowFieldData = ObjectUtils.resolveFieldData(rowData, this.dataTable?.groupRowsBy()!);
        let prevRowData = value[i - 1];
        if (prevRowData) {
            let previousRowFieldData = ObjectUtils.resolveFieldData(prevRowData, this.dataTable?.groupRowsBy() || '');
            return currentRowFieldData !== previousRowFieldData;
        } else {
            return true;
        }
    }

    calculateRowGroupSize(value: any, rowData: any, index: number) {
        let currentRowFieldData = ObjectUtils.resolveFieldData(rowData, this.dataTable?.groupRowsBy()!);
        let nextRowFieldData = currentRowFieldData;
        let groupRowSpan = 0;

        while (currentRowFieldData === nextRowFieldData) {
            groupRowSpan++;
            let nextRowData = value[++index];
            if (nextRowData) {
                nextRowFieldData = ObjectUtils.resolveFieldData(nextRowData, this.dataTable?.groupRowsBy() || '');
            } else {
                break;
            }
        }

        return groupRowSpan === 1 ? null : groupRowSpan;
    }

    updateFrozenRowStickyPosition() {
        this.el.nativeElement.style.top = DomHandler.getOuterHeight(this.el.nativeElement.previousElementSibling) + 'px';
    }

    updateFrozenRowGroupHeaderStickyPosition() {
        if (this.el.nativeElement.previousElementSibling) {
            let tableHeaderHeight = DomHandler.getOuterHeight(this.el.nativeElement.previousElementSibling);
            this.dataTable.rowGroupHeaderStyleObject.top = tableHeaderHeight + 'px';
        }
    }

    getScrollerOption(option: any, options?: any) {
        if (this.dataTable.virtualScroll()) {
            options = options || this.scrollerOptions();
            return options ? options[option] : null;
        }

        return null;
    }

    getRowIndex(rowIndex: number) {
        const index = this.dataTable.paginator() ? <number>this.dataTable.first() + rowIndex : rowIndex;
        const getItemOptions = this.getScrollerOption('getItemOptions');
        return getItemOptions ? getItemOptions(index).index : index;
    }

    get dataP() {
        return this.cn({
            hoverable: this.dataTable.rowHover() || this.dataTable.selectionMode(),
            frozen: this.frozen()
        });
    }
}

@Directive({
    selector: '[vxRowGroupHeader]',
    host: {
        '[class]': 'cx("rowGroupHeader")',
        '[style]': 'sx("rowGroupHeader")'
    },
    providers: [TableStyle]
})
export class RowGroupHeader extends BaseComponent {
    constructor(public dataTable: Table) {
        super();
    }

    _componentStyle = inject(TableStyle);

    get getFrozenRowGroupHeaderStickyPosition() {
        return this.dataTable.rowGroupHeaderStyleObject ? this.dataTable.rowGroupHeaderStyleObject.top : '';
    }
}

@Directive({
    selector: '[vxFrozenColumn]',
    host: {
        '[class]': 'cx("frozenColumn")'
    },
    providers: [TableStyle]
})
export class FrozenColumn extends BaseComponent {
    frozen = input<boolean>(true);

    alignFrozen = input<string>('left');

    resizeListener: VoidListener;

    private resizeObserver?: ResizeObserver;

    _componentStyle = inject(TableStyle);

    constructor() {
        super();
        effect(() => {
            this.frozen();
            Promise.resolve(null).then(() => this.updateStickyPosition());
        });
    }

    onAfterViewInit() {
        this.bindResizeListener();
        this.observeChanges();
    }

    bindResizeListener() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.resizeListener) {
                this.resizeListener = this.renderer.listen(this.document.defaultView, 'resize', () => {
                    this.recalculateColumns();
                });
            }
        }
    }

    unbindResizeListener() {
        if (this.resizeListener) {
            this.resizeListener();
            this.resizeListener = null;
        }
    }

    observeChanges() {
        if (isPlatformBrowser(this.platformId)) {
            const resizeObserver = new ResizeObserver(() => {
                this.recalculateColumns();
            });

            resizeObserver.observe(this.el.nativeElement);
            this.resizeObserver = resizeObserver;
        }
    }

    recalculateColumns() {
        const siblings = DomHandler.siblings(this.el.nativeElement);
        const index = DomHandler.index(this.el.nativeElement);
        const time = (siblings.length - index + 1) * 50;

        setTimeout(() => {
            this.updateStickyPosition();
        }, time);
    }

    updateStickyPosition() {
        if (this.frozen()) {
            if (this.alignFrozen() === 'right') {
                let right = 0;
                let sibling = this.el.nativeElement.nextElementSibling;
                while (sibling) {
                    right += DomHandler.getOuterWidth(sibling);
                    sibling = sibling.nextElementSibling;
                }
                this.el.nativeElement.style.right = right + 'px';
            } else {
                let left = 0;
                let sibling = this.el.nativeElement.previousElementSibling;
                while (sibling) {
                    left += DomHandler.getOuterWidth(sibling);
                    sibling = sibling.previousElementSibling;
                }
                this.el.nativeElement.style.left = left + 'px';
            }

            const filterRow = this.el.nativeElement?.parentElement?.nextElementSibling;
            if (filterRow) {
                let index = DomHandler.index(this.el.nativeElement);
                if (filterRow.children && filterRow.children[index]) {
                    filterRow.children[index].style.left = this.el.nativeElement.style.left;
                    filterRow.children[index].style.right = this.el.nativeElement.style.right;
                }
            }
        }
    }

    onDestroy() {
        this.unbindResizeListener();
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
    }
}
@Directive({
    selector: '[vxSortableColumn]',
    host: {
        '[class]': "cx('sortableColumn')",
        '[tabindex]': 'isEnabled() ? "0" : null',
        role: 'columnheader',
        '[attr.aria-sort]': 'sortOrder',
        '(click)': 'onClick($event)',
        '(keydown.space)': 'onEnterKey($event)',
        '(keydown.enter)': 'onEnterKey($event)'
    },
    providers: [TableStyle]
})
export class SortableColumn extends BaseComponent {
    field = input<string | undefined>(undefined, { alias: 'vxSortableColumn' });

    vxSortableColumnDisabled = input(undefined, { transform: booleanAttribute });

    role = this.el.nativeElement?.tagName !== 'TH' ? 'columnheader' : null;

    sorted: boolean | undefined;

    sortOrder: string | undefined;

    _componentStyle = inject(TableStyle);

    constructor(public dataTable: Table) {
        super();
        if (this.isEnabled()) {
            this.dataTable.tableService.sortSource$.pipe(takeUntilDestroyed()).subscribe((sortMeta) => {
                this.updateSortState();
            });
        }
    }

    onInit() {
        if (this.isEnabled()) {
            this.updateSortState();
        }
    }

    updateSortState() {
        let sorted = false;
        let sortOrder = 0;

        if (this.dataTable.sortMode() === 'single') {
            sorted = this.dataTable.isSorted(<string>this.field()) as boolean;
            sortOrder = this.dataTable.sortOrder();
        } else if (this.dataTable.sortMode() === 'multiple') {
            const sortMeta = this.dataTable.getSortMeta(<string>this.field());
            sorted = !!sortMeta;
            sortOrder = sortMeta ? sortMeta.order : 0;
        }

        this.sorted = sorted;
        this.sortOrder = sorted ? (sortOrder === 1 ? 'ascending' : 'descending') : 'none';
    }
    onClick(event: MouseEvent) {
        if (this.isEnabled() && !this.isFilterElement(<HTMLElement>event.target)) {
            this.updateSortState();
            this.dataTable.sort({
                originalEvent: event,
                field: this.field()
            });

            DomHandler.clearSelection();
        }
    }
    onEnterKey(event: MouseEvent) {
        this.onClick(event);

        event.preventDefault();
    }

    isEnabled() {
        return this.vxSortableColumnDisabled() !== true;
    }

    isFilterElement(element: HTMLElement) {
        return this.isFilterElementIconOrButton(element) || this.isFilterElementIconOrButton(element?.parentElement?.parentElement!);
    }

    private isFilterElementIconOrButton(element: HTMLElement) {
        return getAttribute(element, '[data-pc-name="pccolumnfilterbutton"]') || getAttribute(element, '[data-pc-section="columnfilterbuttonicon"]');
    }
}

@Component({
    selector: 'vx-sortIcon',
    imports: [CommonModule, SortAltIcon, SortAmountUpAltIcon, SortAmountDownIcon, BadgeModule],
    template: `
        @if (!(dataTable.sortIconTemplate() || dataTable._sortIconTemplate())) {
            @if (sortOrder === 0) {
                <svg data-p-icon="sort-alt" [class]="cx('sortableColumnIcon')" />
            }
            @if (sortOrder === 1) {
                <svg data-p-icon="sort-amount-up-alt" [class]="cx('sortableColumnIcon')" />
            }
            @if (sortOrder === -1) {
                <svg data-p-icon="sort-amount-down" [class]="cx('sortableColumnIcon')" />
            }
        }
        @if (dataTable.sortIconTemplate() || dataTable._sortIconTemplate()) {
            <span [class]="cx('sortableColumnIcon')">
                <ng-template *ngTemplateOutlet="dataTable.sortIconTemplate() || dataTable._sortIconTemplate(); context: { $implicit: sortOrder }"></ng-template>
            </span>
        }
        @if (isMultiSorted()) {
            <vx-badge [class]="cx('sortableColumnBadge')" [value]="getBadgeValue()" size="small"></vx-badge>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [TableStyle]
})
export class SortIcon extends BaseComponent {
    field = input<string | undefined>(undefined);

    sortOrder: number | undefined;

    _componentStyle = inject(TableStyle);

    constructor(
        public dataTable: Table,
        public cd: ChangeDetectorRef
    ) {
        super();
        this.dataTable.tableService.sortSource$.pipe(takeUntilDestroyed()).subscribe((sortMeta) => {
            this.updateSortState();
        });
    }

    onInit() {
        this.updateSortState();
    }

    onClick(event: Event) {
        event.preventDefault();
    }

    updateSortState() {
        if (this.dataTable.sortMode() === 'single') {
            this.sortOrder = this.dataTable.isSorted(<string>this.field()) ? this.dataTable.sortOrder() : 0;
        } else if (this.dataTable.sortMode() === 'multiple') {
            let sortMeta = this.dataTable.getSortMeta(<string>this.field());
            this.sortOrder = sortMeta ? sortMeta.order : 0;
        }

        this.cd.markForCheck();
    }

    getMultiSortMetaIndex() {
        let multiSortMeta = this.dataTable.multiSortMeta();
        let index = -1;

        if (multiSortMeta && this.dataTable.sortMode() === 'multiple' && this.dataTable.showInitialSortBadge() && multiSortMeta.length > 1) {
            for (let i = 0; i < multiSortMeta.length; i++) {
                let meta = multiSortMeta[i];
                if (meta.field === this.field() || meta.field === this.field()) {
                    index = i;
                    break;
                }
            }
        }

        return index;
    }

    getBadgeValue() {
        let index = this.getMultiSortMetaIndex();

        return (this.dataTable?.groupRowsBy() || '') && index > -1 ? index : index + 1;
    }

    isMultiSorted() {
        return this.dataTable.sortMode() === 'multiple' && this.getMultiSortMetaIndex() > -1;
    }
}

@Directive({
    selector: '[vxSelectableRow]',
    host: {
        '[class]': "cx('selectableRow')",
        '[tabindex]': 'setRowTabIndex()',
        '[attr.data-p-selectable-row]': 'true',
        '(click)': 'onClick($event)',
        '(touchend)': 'onTouchEnd($event)',
        '(keydown)': 'onKeyDown($event)'
    },
    providers: [TableStyle]
})
export class SelectableRow extends BaseComponent {
    data = input<any>(undefined, { alias: 'vxSelectableRow' });

    index = input<number | undefined>(undefined, { alias: 'vxSelectableRowIndex' });

    vxSelectableRowDisabled = input(undefined, { transform: booleanAttribute });

    selected: boolean | undefined;

    _componentStyle = inject(TableStyle);

    constructor(
        public dataTable: Table,
        public tableService: TableService
    ) {
        super();
        if (this.isEnabled()) {
            this.dataTable.tableService.selectionSource$.pipe(takeUntilDestroyed()).subscribe(() => {
                this.selected = this.dataTable.isSelected(this.data());
            });
        }
    }

    setRowTabIndex() {
        if (this.dataTable.selectionMode() === 'single' || this.dataTable.selectionMode() === 'multiple') {
            return !this.dataTable.selection() ? 0 : this.dataTable.anchorRowIndex === this.index() ? 0 : -1;
        }
    }

    onInit() {
        if (this.isEnabled()) {
            this.selected = this.dataTable.isSelected(this.data());
        }
    }
    onClick(event: Event) {
        if (this.isEnabled()) {
            this.dataTable.handleRowClick({
                originalEvent: event,
                rowData: this.data(),
                rowIndex: this.index()
            });
        }
    }
    onTouchEnd(event: Event) {
        if (this.isEnabled()) {
            this.dataTable.handleRowTouchEnd(event);
        }
    }
    onKeyDown(event: KeyboardEvent) {
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

            case 'Space':
                this.onSpaceKey(event);
                break;

            case 'Enter':
                this.onEnterKey(event);
                break;

            default:
                if (event.code === 'KeyA' && (event.metaKey || event.ctrlKey) && this.dataTable.selectionMode() === 'multiple') {
                    const data = this.dataTable.dataToRender(this.dataTable.processedData);
                    this.dataTable.selection.set([...data]);
                    this.dataTable.selectRange(event, data.length - 1, true);

                    event.preventDefault();
                }
                break;
        }
    }

    onArrowDownKey(event: KeyboardEvent) {
        if (!this.isEnabled()) {
            return;
        }

        const row = <HTMLTableRowElement>event.currentTarget;
        const nextRow = this.findNextSelectableRow(row);

        if (nextRow) {
            nextRow.focus();
        }

        event.preventDefault();
    }

    onArrowUpKey(event: KeyboardEvent) {
        if (!this.isEnabled()) {
            return;
        }

        const row = <HTMLTableRowElement>event.currentTarget;
        const prevRow = this.findPrevSelectableRow(row);

        if (prevRow) {
            prevRow.focus();
        }

        event.preventDefault();
    }

    onEnterKey(event: KeyboardEvent) {
        if (!this.isEnabled()) {
            return;
        }

        this.dataTable.handleRowClick({
            originalEvent: event,
            rowData: this.data(),
            rowIndex: this.index()
        });
    }

    onEndKey(event: KeyboardEvent) {
        const lastRow = this.findLastSelectableRow();
        lastRow && this.focusRowChange(this.el.nativeElement, lastRow);

        if (event.ctrlKey && event.shiftKey) {
            const data = this.dataTable.dataToRender(this.dataTable.rows());
            const lastSelectableRowIndex = DomHandler.getAttribute(lastRow, 'index');

            this.dataTable.anchorRowIndex = lastSelectableRowIndex;
            this.dataTable.selection.set(data.slice(this.index() || 0, data.length));
            this.dataTable.selectRange(event, this.index() || 0);
        }
        event.preventDefault();
    }

    onHomeKey(event: KeyboardEvent) {
        const firstRow = this.findFirstSelectableRow();

        firstRow && this.focusRowChange(this.el.nativeElement, firstRow);

        if (event.ctrlKey && event.shiftKey) {
            const data = this.dataTable.dataToRender(this.dataTable.rows());
            const firstSelectableRowIndex = DomHandler.getAttribute(firstRow, 'index');

            this.dataTable.anchorRowIndex = this.dataTable.anchorRowIndex || firstSelectableRowIndex || 0;
            this.dataTable.selection.set(data.slice(0, (this.index() || 0) + 1));
            this.dataTable.selectRange(event, this.index() || 0);
        }
        event.preventDefault();
    }

    onSpaceKey(event) {
        const isInput = event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement || event.target instanceof HTMLTextAreaElement;
        if (isInput) {
            return;
        } else {
            this.onEnterKey(event);

            if (event.shiftKey && this.dataTable.selection() !== null) {
                const data = this.dataTable.dataToRender(this.dataTable.rows());
                let index;

                if (ObjectUtils.isNotEmpty(this.dataTable.selection()) && this.dataTable.selection().length > 0) {
                    let firstSelectedRowIndex, lastSelectedRowIndex;
                    firstSelectedRowIndex = ObjectUtils.findIndexInList(this.dataTable.selection()[0], data);
                    lastSelectedRowIndex = ObjectUtils.findIndexInList(this.dataTable.selection()[this.dataTable.selection().length - 1], data);

                    index = (this.index() || 0) <= firstSelectedRowIndex ? lastSelectedRowIndex : firstSelectedRowIndex;
                } else {
                    index = ObjectUtils.findIndexInList(this.dataTable.selection(), data);
                }

                this.dataTable.anchorRowIndex = index || 0;
                this.dataTable.selection.set(index !== this.index() ? data.slice(Math.min(index || 0, this.index() || 0), Math.max(index || 0, this.index() || 0) + 1) : [this.data()]);
                this.dataTable.selectRange(event, this.index() || 0);
            }

            event.preventDefault();
        }
    }

    focusRowChange(firstFocusableRow, currentFocusedRow) {
        firstFocusableRow.tabIndex = '-1';
        currentFocusedRow.tabIndex = '0';
        DomHandler.focus(currentFocusedRow);
    }

    findLastSelectableRow() {
        const rows = DomHandler.find(this.dataTable.el.nativeElement, '[data-p-selectable-row="true"]');

        return rows ? rows[rows.length - 1] : null;
    }

    findFirstSelectableRow() {
        const firstRow = DomHandler.findSingle(this.dataTable.el.nativeElement, '[data-p-selectable-row="true"]');

        return firstRow;
    }

    findNextSelectableRow(row: HTMLTableRowElement): HTMLTableRowElement | null {
        let nextRow = <HTMLTableRowElement>row.nextElementSibling;

        if (nextRow) {
            if (find(nextRow, '[data-p-selectable-row="true"]')) return nextRow;
            else return this.findNextSelectableRow(nextRow);
        } else {
            return null;
        }
    }

    findPrevSelectableRow(row: HTMLTableRowElement): HTMLTableRowElement | null {
        let prevRow = <HTMLTableRowElement>row.previousElementSibling;
        if (prevRow) {
            if (find(prevRow, '[data-p-selectable-row="true"]')) return prevRow;
            else return this.findPrevSelectableRow(prevRow);
        } else {
            return null;
        }
    }

    isEnabled() {
        return this.vxSelectableRowDisabled() !== true;
    }
}

@Directive({
    selector: '[vxSelectableRowDblClick]',
    host: {
        '[class]': 'cx("selectableRow")',
        '(dblclick)': 'onClick($event)'
    },
    providers: [TableStyle]
})
export class SelectableRowDblClick extends BaseComponent {
    data = input<any>(undefined, { alias: 'vxSelectableRowDblClick' });

    index = input<number | undefined>(undefined, { alias: 'vxSelectableRowIndex' });

    vxSelectableRowDisabled = input(undefined, { transform: booleanAttribute });

    selected: boolean | undefined;

    _componentStyle = inject(TableStyle);

    constructor(
        public dataTable: Table,
        public tableService: TableService
    ) {
        super();
        if (this.isEnabled()) {
            this.dataTable.tableService.selectionSource$.pipe(takeUntilDestroyed()).subscribe(() => {
                this.selected = this.dataTable.isSelected(this.data());
            });
        }
    }

    onInit() {
        if (this.isEnabled()) {
            this.selected = this.dataTable.isSelected(this.data());
        }
    }
    onClick(event: Event) {
        if (this.isEnabled()) {
            this.dataTable.handleRowClick({
                originalEvent: event,
                rowData: this.data(),
                rowIndex: this.index()
            });
        }
    }

    isEnabled() {
        return this.vxSelectableRowDisabled() !== true;
    }
}

@Directive({
    selector: '[vxContextMenuRow]',
    host: {
        '[class]': 'cx("contextMenuRowSelected")',
        '[attr.tabindex]': 'isEnabled() ? 0 : undefined',
        '(contextmenu)': 'onContextMenu($event)'
    },
    providers: [TableStyle]
})
export class ContextMenuRow extends BaseComponent {
    data = input<any>(undefined, { alias: 'vxContextMenuRow' });

    index = input<number | undefined>(undefined, { alias: 'vxContextMenuRowIndex' });

    vxContextMenuRowDisabled = input(undefined, { transform: booleanAttribute });

    selected: boolean | undefined;

    _componentStyle = inject(TableStyle);

    constructor(
        public dataTable: Table,
        public tableService: TableService
    ) {
        super();
        if (this.isEnabled()) {
            this.dataTable.tableService.contextMenuSource$.pipe(takeUntilDestroyed()).subscribe((data) => {
                this.selected = data ? this.dataTable.equals(this.data(), data) : false;
            });
        }
    }
    onContextMenu(event: Event) {
        if (this.isEnabled()) {
            this.dataTable.handleRowRightClick({
                originalEvent: event,
                rowData: this.data(),
                rowIndex: this.index()
            });

            this.el.nativeElement.focus();
            event.preventDefault();
        }
    }

    isEnabled() {
        return this.vxContextMenuRowDisabled() !== true;
    }
}

@Directive({
    selector: '[vxRowToggler]',
    host: {
        '(click)': 'onClick($event)'
    }
})
export class RowToggler extends BaseComponent {
    data = input<any>(undefined, { alias: 'vxRowToggler' });

    vxRowTogglerDisabled = input(undefined, { transform: booleanAttribute });

    constructor(public dataTable: Table) {
        super();
    }
    onClick(event: Event) {
        if (this.isEnabled()) {
            this.dataTable.toggleRow(this.data(), event);
            event.preventDefault();
        }
    }

    isEnabled() {
        return this.vxRowTogglerDisabled() !== true;
    }
}

@Directive({
    selector: '[vxResizableColumn]',
    host: {
        '[class]': "cx('resizableColumn')"
    },
    providers: [TableStyle]
})
export class ResizableColumn extends BaseComponent {
    vxResizableColumnDisabled = input(undefined, { transform: booleanAttribute });

    resizer: HTMLSpanElement | undefined;

    resizerMouseDownListener: VoidListener;

    resizerTouchStartListener: VoidListener;

    resizerTouchMoveListener: VoidListener;

    resizerTouchEndListener: VoidListener;

    documentMouseMoveListener: VoidListener;

    documentMouseUpListener: VoidListener;

    _componentStyle = inject(TableStyle);

    constructor(
        public dataTable: Table,
        public zone: NgZone
    ) {
        super();
    }

    onAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.isEnabled()) {
                this.resizer = this.renderer.createElement('span');
                setAttribute(this.resizer as HTMLElement, 'data-pc-column-resizer', 'true');
                !this.$unstyled() && this.renderer.addClass(this.resizer, 'p-datatable-column-resizer');
                this.renderer.appendChild(this.el.nativeElement, this.resizer);

                this.zone.runOutsideAngular(() => {
                    this.resizerMouseDownListener = this.renderer.listen(this.resizer, 'mousedown', this.onMouseDown.bind(this));
                    this.resizerTouchStartListener = this.renderer.listen(this.resizer, 'touchstart', this.onTouchStart.bind(this));
                });
            }
        }
    }

    bindDocumentEvents() {
        this.zone.runOutsideAngular(() => {
            this.documentMouseMoveListener = this.renderer.listen(this.document, 'mousemove', this.onDocumentMouseMove.bind(this));
            this.documentMouseUpListener = this.renderer.listen(this.document, 'mouseup', this.onDocumentMouseUp.bind(this));
            this.resizerTouchMoveListener = this.renderer.listen(this.resizer, 'touchmove', this.onTouchMove.bind(this));
            this.resizerTouchEndListener = this.renderer.listen(this.resizer, 'touchend', this.onTouchEnd.bind(this));
        });
    }

    unbindDocumentEvents() {
        if (this.documentMouseMoveListener) {
            this.documentMouseMoveListener();
            this.documentMouseMoveListener = null;
        }

        if (this.documentMouseUpListener) {
            this.documentMouseUpListener();
            this.documentMouseUpListener = null;
        }
        if (this.resizerTouchMoveListener) {
            this.resizerTouchMoveListener();
            this.resizerTouchMoveListener = null;
        }

        if (this.resizerTouchEndListener) {
            this.resizerTouchEndListener();
            this.resizerTouchEndListener = null;
        }
    }

    onMouseDown(event: MouseEvent) {
        this.dataTable.onColumnResizeBegin(event);
        this.bindDocumentEvents();
    }

    onTouchStart(event: TouchEvent) {
        this.dataTable.onColumnResizeBegin(event);
        this.bindDocumentEvents();
    }

    onTouchMove(event: TouchEvent) {
        this.dataTable.onColumnResize(event);
    }
    onDocumentMouseMove(event: MouseEvent) {
        this.dataTable.onColumnResize(event);
    }

    onDocumentMouseUp(event: MouseEvent) {
        this.dataTable.onColumnResizeEnd();
        this.unbindDocumentEvents();
    }

    onTouchEnd(event: TouchEvent) {
        this.dataTable.onColumnResizeEnd();
        this.unbindDocumentEvents();
    }

    isEnabled() {
        return this.vxResizableColumnDisabled() !== true;
    }

    onDestroy() {
        if (this.resizerMouseDownListener) {
            this.resizerMouseDownListener();
            this.resizerMouseDownListener = null;
        }

        this.unbindDocumentEvents();
    }
}

@Directive({
    selector: '[vxReorderableColumn]',
    host: {
        '[class]': "cx('reorderableColumn')",
        '(drop)': 'onDrop($event)'
    },
    providers: [TableStyle]
})
export class ReorderableColumn extends BaseComponent {
    vxReorderableColumnDisabled = input(undefined, { transform: booleanAttribute });

    dragStartListener: VoidListener;

    dragOverListener: VoidListener;

    dragEnterListener: VoidListener;

    dragLeaveListener: VoidListener;

    mouseDownListener: VoidListener;

    _componentStyle = inject(TableStyle);

    constructor(
        public dataTable: Table,
        public el: ElementRef,
        public zone: NgZone
    ) {
        super();
    }

    onAfterViewInit() {
        if (this.isEnabled()) {
            this.bindEvents();
        }
    }

    bindEvents() {
        if (isPlatformBrowser(this.platformId)) {
            this.zone.runOutsideAngular(() => {
                this.mouseDownListener = this.renderer.listen(this.el.nativeElement, 'mousedown', this.onMouseDown.bind(this));

                this.dragStartListener = this.renderer.listen(this.el.nativeElement, 'dragstart', this.onDragStart.bind(this));

                this.dragOverListener = this.renderer.listen(this.el.nativeElement, 'dragover', this.onDragOver.bind(this));

                this.dragEnterListener = this.renderer.listen(this.el.nativeElement, 'dragenter', this.onDragEnter.bind(this));

                this.dragLeaveListener = this.renderer.listen(this.el.nativeElement, 'dragleave', this.onDragLeave.bind(this));
            });
        }
    }

    unbindEvents() {
        if (this.mouseDownListener) {
            this.mouseDownListener();
            this.mouseDownListener = null;
        }

        if (this.dragStartListener) {
            this.dragStartListener();
            this.dragStartListener = null;
        }

        if (this.dragOverListener) {
            this.dragOverListener();
            this.dragOverListener = null;
        }

        if (this.dragEnterListener) {
            this.dragEnterListener();
            this.dragEnterListener = null;
        }

        if (this.dragLeaveListener) {
            this.dragLeaveListener();
            this.dragLeaveListener = null;
        }
    }

    onMouseDown(event: any) {
        if (event.target.nodeName === 'INPUT' || event.target.nodeName === 'TEXTAREA' || findSingle(event.target, '[data-pc-column-resizer="true"]')) this.el.nativeElement.draggable = false;
        else this.el.nativeElement.draggable = true;
    }

    onDragStart(event: any) {
        this.dataTable.onColumnDragStart(event, this.el.nativeElement);
    }

    onDragOver(event: any) {
        event.preventDefault();
    }

    onDragEnter(event: any) {
        this.dataTable.onColumnDragEnter(event, this.el.nativeElement);
    }

    onDragLeave(event: any) {
        this.dataTable.onColumnDragLeave(event);
    }
    onDrop(event: any) {
        if (this.isEnabled()) {
            this.dataTable.onColumnDrop(event, this.el.nativeElement);
        }
    }

    isEnabled() {
        return this.vxReorderableColumnDisabled() !== true;
    }

    onDestroy() {
        this.unbindEvents();
    }
}

@Directive({
    selector: '[vxEditableColumn]',
    host: {
        '[attr.data-p-editable-column]': 'true',
        '(click)': 'onClick($event)',
        '(keydown.enter)': 'onEnterKeyDown($event)',
        '(keydown.escape)': 'onEscapeKeyDown($event)',
        '(keydown.tab)': 'onTabKeyDown($event); onShiftKeyDown($event)',
        '(keydown.shift.tab)': 'onShiftKeyDown($event)',
        '(keydown.meta.tab)': 'onShiftKeyDown($event)',
        '(keydown.arrowdown)': 'onArrowDown($event)',
        '(keydown.arrowup)': 'onArrowUp($event)',
        '(keydown.arrowleft)': 'onArrowLeft($event)',
        '(keydown.arrowright)': 'onArrowRight($event)'
    }
})
export class EditableColumn extends BaseComponent {
    data = input<any>(undefined, { alias: 'vxEditableColumn' });

    field = input<any>(undefined, { alias: 'vxEditableColumnField' });

    rowIndex = input<number | undefined>(undefined, { alias: 'vxEditableColumnRowIndex' });

    vxEditableColumnDisabled = input(undefined, { transform: booleanAttribute });

    vxFocusCellSelector = input<string | undefined>(undefined);

    overlayEventListener: any;

    constructor(
        public dataTable: Table,
        public zone: NgZone
    ) {
        super();
    }

    public onChanges(changes: SimpleChanges): void {
        if (this.el.nativeElement && !changes.data?.firstChange) {
            this.dataTable.updateEditingCell(this.el.nativeElement, this.data(), this.field(), <number>this.rowIndex());
        }
    }

    onAfterViewInit() {
        if (this.isEnabled()) {
            !this.$unstyled() && DomHandler.addClass(this.el.nativeElement, 'p-editable-column');
        }
    }
    onClick(event: MouseEvent) {
        if (this.isEnabled()) {
            this.dataTable.selfClick = true;

            if (this.dataTable.editingCell) {
                if (this.dataTable.editingCell !== this.el.nativeElement) {
                    if (!this.dataTable.isEditingCellValid()) {
                        return;
                    }

                    this.closeEditingCell(true, event);
                    this.openCell();
                }
            } else {
                this.openCell();
            }
        }
    }

    openCell() {
        this.dataTable.updateEditingCell(this.el.nativeElement, this.data(), this.field(), <number>this.rowIndex());
        !this.$unstyled() && DomHandler.addClass(this.el.nativeElement, 'p-cell-editing');
        setAttribute(this.el.nativeElement, 'data-p-cell-editing', 'true');

        this.dataTable.onEditInit.emit({
            field: this.field(),
            data: this.data(),
            index: <number>this.rowIndex()
        });
        this.zone.runOutsideAngular(() => {
            setTimeout(() => {
                let focusCellSelector = this.vxFocusCellSelector() || 'input, textarea, select';
                let focusableElement = DomHandler.findSingle(this.el.nativeElement, focusCellSelector);

                if (focusableElement) {
                    focusableElement.focus();
                }
            }, 50);
        });

        this.overlayEventListener = (e: any) => {
            if (this.el && this.el.nativeElement.contains(e.target)) {
                this.dataTable.selfClick = true;
            }
        };

        this.dataTable.overlaySubscription = this.dataTable.overlayService.clickObservable.subscribe(this.overlayEventListener);
    }

    closeEditingCell(completed: any, event: Event) {
        const eventData = {
            field: <string>this.dataTable.editingCellField,
            data: <any>this.dataTable.editingCellData,
            originalEvent: <Event>event,
            index: <number>this.dataTable.editingCellRowIndex
        };

        if (completed) {
            this.dataTable.onEditComplete.emit(eventData);
        } else {
            this.dataTable.onEditCancel.emit(eventData);

            this.dataTable.value().forEach((element) => {
                if (element[this.dataTable.editingCellField] === this.data()) {
                    element[this.dataTable.editingCellField] = this.dataTable.editingCellData;
                }
            });
        }

        !this.$unstyled() && DomHandler.removeClass(this.dataTable.editingCell, 'p-cell-editing');
        setAttribute(this.el.nativeElement, 'data-p-cell-editing', 'false');
        this.dataTable.editingCell = null;
        this.dataTable.editingCellData = null;
        this.dataTable.editingCellField = null;
        this.dataTable.unbindDocumentEditListener();

        if (this.dataTable.overlaySubscription) {
            this.dataTable.overlaySubscription.unsubscribe();
        }
    }
    onEnterKeyDown(event: KeyboardEvent) {
        if (this.isEnabled() && !event.shiftKey) {
            if (this.dataTable.isEditingCellValid()) {
                this.closeEditingCell(true, event);
            }

            event.preventDefault();
        }
    }
    onTabKeyDown(event: KeyboardEvent) {
        if (this.isEnabled()) {
            if (this.dataTable.isEditingCellValid()) {
                this.closeEditingCell(true, event);
            }

            event.preventDefault();
        }
    }
    onEscapeKeyDown(event: KeyboardEvent) {
        if (this.isEnabled()) {
            if (this.dataTable.isEditingCellValid()) {
                this.closeEditingCell(false, event);
            }

            event.preventDefault();
        }
    }
    onShiftKeyDown(event: KeyboardEvent) {
        if (this.isEnabled()) {
            if (event.shiftKey) this.moveToPreviousCell(event);
            else {
                this.moveToNextCell(event);
            }
        }
    }
    onArrowDown(event: KeyboardEvent) {
        if (this.isEnabled()) {
            let currentCell = this.findCell(event.target);
            if (currentCell) {
                let cellIndex = DomHandler.index(currentCell);
                let targetCell = this.findNextEditableColumnByIndex(currentCell, cellIndex);

                if (targetCell) {
                    if (this.dataTable.isEditingCellValid()) {
                        this.closeEditingCell(true, event);
                    }

                    DomHandler.invokeElementMethod(event.target, 'blur');
                    DomHandler.invokeElementMethod(targetCell, 'click');
                }

                event.preventDefault();
            }
        }
    }
    onArrowUp(event: KeyboardEvent) {
        if (this.isEnabled()) {
            let currentCell = this.findCell(event.target);
            if (currentCell) {
                let cellIndex = DomHandler.index(currentCell);
                let targetCell = this.findPrevEditableColumnByIndex(currentCell, cellIndex);

                if (targetCell) {
                    if (this.dataTable.isEditingCellValid()) {
                        this.closeEditingCell(true, event);
                    }

                    DomHandler.invokeElementMethod(event.target, 'blur');
                    DomHandler.invokeElementMethod(targetCell, 'click');
                }

                event.preventDefault();
            }
        }
    }
    onArrowLeft(event: KeyboardEvent) {
        if (this.isEnabled()) {
            this.moveToPreviousCell(event);
        }
    }
    onArrowRight(event: KeyboardEvent) {
        if (this.isEnabled()) {
            this.moveToNextCell(event);
        }
    }

    findCell(element: any) {
        if (element) {
            let cell = element;
            while (cell && !findSingle(cell as HTMLElement, '[data-p-cell-editing="true"]')) {
                cell = cell.parentElement;
            }

            return cell;
        } else {
            return null;
        }
    }

    moveToPreviousCell(event: KeyboardEvent) {
        let currentCell = this.findCell(event.target);
        if (currentCell) {
            let targetCell = this.findPreviousEditableColumn(currentCell);

            if (targetCell) {
                if (this.dataTable.isEditingCellValid()) {
                    this.closeEditingCell(true, event);
                }

                DomHandler.invokeElementMethod(event.target, 'blur');
                DomHandler.invokeElementMethod(targetCell, 'click');
                event.preventDefault();
            }
        }
    }

    moveToNextCell(event: KeyboardEvent) {
        let currentCell = this.findCell(event.target);
        if (currentCell) {
            let targetCell = this.findNextEditableColumn(currentCell);

            if (targetCell) {
                if (this.dataTable.isEditingCellValid()) {
                    this.closeEditingCell(true, event);
                }

                DomHandler.invokeElementMethod(event.target, 'blur');
                DomHandler.invokeElementMethod(targetCell, 'click');
                event.preventDefault();
            } else {
                if (this.dataTable.isEditingCellValid()) {
                    this.closeEditingCell(true, event);
                }
            }
        }
    }

    findPreviousEditableColumn(cell: any): HTMLTableCellElement | null {
        let prevCell = cell.previousElementSibling;

        if (!prevCell) {
            let previousRow = cell.parentElement?.previousElementSibling;
            if (previousRow) {
                prevCell = previousRow.lastElementChild;
            }
        }

        if (prevCell) {
            if (findSingle(prevCell, '[data-p-editable-column="true"]')) return prevCell;
            else return this.findPreviousEditableColumn(prevCell);
        } else {
            return null;
        }
    }

    findNextEditableColumn(cell: any): HTMLTableCellElement | null {
        let nextCell = cell.nextElementSibling;

        if (!nextCell) {
            let nextRow = cell.parentElement?.nextElementSibling;
            if (nextRow) {
                nextCell = nextRow.firstElementChild;
            }
        }

        if (nextCell) {
            if (findSingle(nextCell, '[data-p-editable-column="true"]')) return nextCell;
            else return this.findNextEditableColumn(nextCell);
        } else {
            return null;
        }
    }

    findNextEditableColumnByIndex(cell: Element, index: number) {
        let nextRow = cell.parentElement?.nextElementSibling;

        if (nextRow) {
            let nextCell = nextRow.children[index];

            if (nextCell && findSingle(nextCell, '[data-p-editable-column="true"]')) {
                return nextCell;
            }

            return null;
        } else {
            return null;
        }
    }

    findPrevEditableColumnByIndex(cell: Element, index: number) {
        let prevRow = cell.parentElement?.previousElementSibling;

        if (prevRow) {
            let prevCell = prevRow.children[index];

            if (prevCell && findSingle(prevCell, '[data-p-editable-column="true"]')) {
                return prevCell;
            }

            return null;
        } else {
            return null;
        }
    }

    isEnabled() {
        return this.vxEditableColumnDisabled() !== true;
    }

    onDestroy() {
        if (this.dataTable.overlaySubscription) {
            this.dataTable.overlaySubscription.unsubscribe();
        }
    }
}

@Directive({
    selector: '[vxEditableRow]'
})
export class EditableRow extends BaseComponent {
    data = input<any>(undefined, { alias: 'vxEditableRow' });

    vxEditableRowDisabled = input(undefined, { transform: booleanAttribute });

    isEnabled() {
        return this.vxEditableRowDisabled() !== true;
    }
}

@Directive({
    selector: '[vxInitEditableRow]',
    host: {
        class: 'p-datatable-row-editor-init',
        '(click)': 'onClick($event)'
    }
})
export class InitEditableRow extends BaseComponent {
    constructor(
        public dataTable: Table,
        public editableRow: EditableRow
    ) {
        super();
    }
    onClick(event: Event) {
        this.dataTable.initRowEdit(this.editableRow.data());
        event.preventDefault();
    }
}

@Directive({
    selector: '[vxSaveEditableRow]',
    host: {
        class: 'p-datatable-row-editor-save',
        '(click)': 'onClick($event)'
    }
})
export class SaveEditableRow extends BaseComponent {
    constructor(
        public dataTable: Table,
        public editableRow: EditableRow
    ) {
        super();
    }
    onClick(event: Event) {
        this.dataTable.saveRowEdit(this.editableRow.data(), this.editableRow.el.nativeElement);
        event.preventDefault();
    }
}

@Directive({
    selector: '[vxCancelEditableRow]',
    host: {
        '[class]': "cx('rowEditorCancel')",
        '(click)': 'onClick($event)'
    },
    providers: [TableStyle]
})
export class CancelEditableRow extends BaseComponent {
    constructor(
        public dataTable: Table,
        public editableRow: EditableRow
    ) {
        super();
    }
    _componentStyle = inject(TableStyle);
    onClick(event: Event) {
        this.dataTable.cancelRowEdit(this.editableRow.data());
        event.preventDefault();
    }
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'vx-cellEditor',
    imports: [CommonModule],
    template: `
        @if (editing) {
            <ng-container *ngTemplateOutlet="inputTemplate() || _inputTemplate()"></ng-container>
        }
        @if (!editing) {
            <ng-container *ngTemplateOutlet="outputTemplate() || _outputTemplate()"></ng-container>
        }
    `,
    encapsulation: ViewEncapsulation.None
})
export class CellEditor extends BaseComponent {
    _templates = contentChildren(PrimeTemplate);

    _inputTemplate = contentChild<TemplateRef<any>>('input');

    _outputTemplate = contentChild<TemplateRef<any>>('output');

    /**
     * Former `ngAfterContentInit` template map (#19): the `input`/`output` `vxTemplate` types
     * resolve to the last matching projected template.
     */
    inputTemplate = computed<TemplateRef<any> | undefined>(
        () =>
            this._templates()
                .filter((item) => item.getType() === 'input')
                .at(-1)?.template
    );

    outputTemplate = computed<TemplateRef<any> | undefined>(
        () =>
            this._templates()
                .filter((item) => item.getType() === 'output')
                .at(-1)?.template
    );

    constructor(
        public dataTable: Table,
        @Optional() public editableColumn: EditableColumn,
        @Optional() public editableRow: EditableRow
    ) {
        super();
    }

    get editing(): boolean {
        return (
            (this.dataTable.editingCell && this.editableColumn && this.dataTable.editingCell === this.editableColumn.el.nativeElement) ||
            (this.editableRow && this.dataTable.editMode() === 'row' && this.dataTable.isRowEditing(this.editableRow.data()))
        );
    }
}

@Component({
    selector: 'vx-tableRadioButton',
    imports: [RadioButtonModule, FormsModule],
    template: `<vx-radioButton #rb [(ngModel)]="checked" [disabled]="disabled()" [inputId]="inputId()" [name]="name()" [ariaLabel]="ariaLabel()" [binary]="true" [value]="value()" (onClick)="onClick($event)" [unstyled]="unstyled()" /> `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class TableRadioButton extends BaseComponent {
    value = input<any>();

    readonly disabled = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    readonly index = input<number | undefined, unknown>(undefined, { transform: numberAttribute });
    readonly inputId = input<string | undefined>();
    readonly name = input<string | undefined>();

    ariaLabelInput = input<string | undefined>(undefined, { alias: 'ariaLabel' });

    ariaLabel = linkedSignal<string | undefined>(() => this.ariaLabelInput());

    inputViewChild = viewChild<RadioButton>('rb');

    checked: boolean | undefined;

    constructor(
        public dataTable: Table,
        public cd: ChangeDetectorRef
    ) {
        super();
        this.dataTable.tableService.selectionSource$.pipe(takeUntilDestroyed()).subscribe(() => {
            this.checked = this.dataTable.isSelected(this.value());

            this.ariaLabel.set(this.ariaLabel() || (this.dataTable.config.translation.aria ? (this.checked ? this.dataTable.config.translation.aria.selectRow : this.dataTable.config.translation.aria.unselectRow) : undefined));
            this.cd.markForCheck();
        });
    }

    onInit() {
        this.checked = this.dataTable.isSelected(this.value());
    }

    onClick(event: RadioButtonClickEvent) {
        if (!this.disabled()) {
            this.dataTable.toggleRowWithRadio(
                {
                    originalEvent: event.originalEvent,
                    rowIndex: this.index()
                },
                this.value()
            );

            this.inputViewChild()?.inputViewChild().nativeElement?.focus();
        }
        DomHandler.clearSelection();
    }
}

@Component({
    selector: 'vx-tableCheckbox',
    imports: [CommonModule, CheckboxModule, FormsModule, SharedModule],
    template: `
        <vx-checkbox [(ngModel)]="checked" [binary]="true" (onChange)="onClick($event)" [required]="required()" [disabled]="disabled()" [inputId]="inputId()" [name]="name()" [ariaLabel]="ariaLabel()" [unstyled]="unstyled()">
            @if (dataTable.checkboxIconTemplate() || dataTable._checkboxIconTemplate(); as template) {
                <ng-template vxTemplate="icon">
                    <ng-template *ngTemplateOutlet="template; context: { $implicit: checked }" />
                </ng-template>
            }
        </vx-checkbox>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class TableCheckbox extends BaseComponent {
    value = input<any>();

    readonly disabled = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    readonly required = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    readonly index = input<number | undefined, unknown>(undefined, { transform: numberAttribute });
    readonly inputId = input<string | undefined>();
    readonly name = input<string | undefined>();

    ariaLabelInput = input<string | undefined>(undefined, { alias: 'ariaLabel' });

    ariaLabel = linkedSignal<string | undefined>(() => this.ariaLabelInput());

    checked: boolean | undefined;

    constructor(
        public dataTable: Table,
        public tableService: TableService
    ) {
        super();
        this.dataTable.tableService.selectionSource$.pipe(takeUntilDestroyed()).subscribe(() => {
            this.checked = this.dataTable.isSelected(this.value());
            this.ariaLabel.set(this.ariaLabel() || (this.dataTable.config.translation.aria ? (this.checked ? this.dataTable.config.translation.aria.selectRow : this.dataTable.config.translation.aria.unselectRow) : undefined));
            this.cd.markForCheck();
        });
    }

    onInit() {
        this.checked = this.dataTable.isSelected(this.value());
    }

    onClick({ originalEvent }: CheckboxChangeEvent) {
        if (!this.disabled()) {
            this.dataTable.toggleRowWithCheckbox(
                {
                    originalEvent: originalEvent!,
                    rowIndex: this.index() || 0
                },
                this.value()
            );
        }
        DomHandler.clearSelection();
    }
}

@Component({
    selector: 'vx-tableHeaderCheckbox',
    imports: [CommonModule, CheckboxModule, FormsModule, SharedModule],
    template: `
        <vx-checkbox [pt]="ptm('pcCheckbox')" [(ngModel)]="checked" (onChange)="onClick($event)" [binary]="true" [disabled]="isDisabled()" [inputId]="inputId()" [name]="name()" [ariaLabel]="ariaLabel()" [unstyled]="unstyled()">
            @if (dataTable.headerCheckboxIconTemplate() || dataTable._headerCheckboxIconTemplate(); as template) {
                <ng-template vxTemplate="icon">
                    <ng-template *ngTemplateOutlet="template; context: { $implicit: checked }" />
                </ng-template>
            }
        </vx-checkbox>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    hostDirectives: [Bind]
})
export class TableHeaderCheckbox extends BaseComponent {
    hostName = 'Table';

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptm('headerCheckbox'));
    }

    readonly disabled = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    readonly inputId = input<string | undefined>();
    readonly name = input<string | undefined>();

    ariaLabelInput = input<string | undefined>(undefined, { alias: 'ariaLabel' });

    ariaLabel = linkedSignal<string | undefined>(() => this.ariaLabelInput());

    checked: boolean | undefined;

    constructor(
        public dataTable: Table,
        public tableService: TableService
    ) {
        super();
        this.dataTable.tableService.valueSource$.pipe(takeUntilDestroyed()).subscribe(() => {
            this.checked = this.updateCheckedState();
            this.ariaLabel.set(this.ariaLabel() || (this.dataTable.config.translation.aria ? (this.checked ? this.dataTable.config.translation.aria.selectAll : this.dataTable.config.translation.aria.unselectAll) : undefined));
        });

        this.dataTable.tableService.selectionSource$.pipe(takeUntilDestroyed()).subscribe(() => {
            this.checked = this.updateCheckedState();
        });
    }

    onInit() {
        this.checked = this.updateCheckedState();
    }

    onClick(event: CheckboxChangeEvent) {
        if (!this.disabled()) {
            if (this.dataTable.value() && this.dataTable.value().length > 0) {
                this.dataTable.toggleRowsWithCheckbox(event, this.checked || false);
            }
        }

        DomHandler.clearSelection();
    }

    isDisabled() {
        return this.disabled() || !this.dataTable.value() || !this.dataTable.value().length;
    }

    updateCheckedState() {
        this.cd.markForCheck();

        if (this.dataTable._selectAll !== null) {
            return this.dataTable._selectAll;
        } else {
            const data = this.dataTable.selectionPageOnly() ? this.dataTable.dataToRender(this.dataTable.processedData) : this.dataTable.processedData;
            const val = this.dataTable.frozenValue() ? [...this.dataTable.frozenValue()!, ...data] : data;
            const selectableVal = this.dataTable.rowSelectable() ? val.filter((data: any, index: number) => this.dataTable.rowSelectable()!({ data, index })) : val;

            return ObjectUtils.isNotEmpty(selectableVal) && ObjectUtils.isNotEmpty(this.dataTable.selection()) && selectableVal.every((v: any) => this.dataTable.selection().some((s: any) => this.dataTable.equals(v, s)));
        }
    }
}

@Directive({
    selector: '[vxReorderableRowHandle]',
    host: {
        '[class]': "cx('reorderableRowHandle')"
    },
    providers: [TableStyle],
    hostDirectives: [Bind]
})
export class ReorderableRowHandle extends BaseComponent {
    hostName = 'Table';

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptm('reorderableRowHandle'));
    }

    _componentStyle = inject(TableStyle);

    constructor(public el: ElementRef) {
        super();
    }

    onAfterViewInit() {
        // DomHandler.addClass(this.el.nativeElement, 'p-datatable-reorderable-row-handle');
    }
}

@Directive({
    selector: '[vxReorderableRow]',
    host: {
        '(drop)': 'onDrop($event)'
    },
    hostDirectives: [Bind]
})
export class ReorderableRow extends BaseComponent {
    hostName = 'Table';

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptm('reorderableRow'));
    }

    index = input<number | undefined>(undefined, { alias: 'vxReorderableRow' });

    vxReorderableRowDisabled = input(undefined, { transform: booleanAttribute });

    mouseDownListener: VoidListener;

    dragStartListener: VoidListener;

    dragEndListener: VoidListener;

    dragOverListener: VoidListener;

    dragLeaveListener: VoidListener;

    dropListener: VoidListener;

    constructor(
        public dataTable: Table,
        public zone: NgZone
    ) {
        super();
    }

    onAfterViewInit() {
        if (this.isEnabled()) {
            this.el.nativeElement.droppable = true;
            this.bindEvents();
        }
    }

    bindEvents() {
        this.zone.runOutsideAngular(() => {
            this.mouseDownListener = this.renderer.listen(this.el.nativeElement, 'mousedown', this.onMouseDown.bind(this));

            this.dragStartListener = this.renderer.listen(this.el.nativeElement, 'dragstart', this.onDragStart.bind(this));

            this.dragEndListener = this.renderer.listen(this.el.nativeElement, 'dragend', this.onDragEnd.bind(this));

            this.dragOverListener = this.renderer.listen(this.el.nativeElement, 'dragover', this.onDragOver.bind(this));

            this.dragLeaveListener = this.renderer.listen(this.el.nativeElement, 'dragleave', this.onDragLeave.bind(this));
        });
    }

    unbindEvents() {
        if (this.mouseDownListener) {
            this.mouseDownListener();
            this.mouseDownListener = null;
        }

        if (this.dragStartListener) {
            this.dragStartListener();
            this.dragStartListener = null;
        }

        if (this.dragEndListener) {
            this.dragEndListener();
            this.dragEndListener = null;
        }

        if (this.dragOverListener) {
            this.dragOverListener();
            this.dragOverListener = null;
        }

        if (this.dragLeaveListener) {
            this.dragLeaveListener();
            this.dragLeaveListener = null;
        }
    }

    onMouseDown(event: Event) {
        const targetElement = event.target as HTMLElement;
        const isHandleClicked = this.isHandleElement(targetElement);
        this.el.nativeElement.draggable = isHandleClicked;
    }

    isHandleElement(element: HTMLElement): boolean {
        if (element?.classList.contains('p-datatable-reorderable-row-handle')) {
            return true;
        }

        if (element?.parentElement && !['TD', 'TR'].includes(element?.parentElement?.tagName)) {
            return this.isHandleElement(element?.parentElement);
        }

        return false;
    }

    onDragStart(event: DragEvent) {
        this.dataTable.onRowDragStart(event, <number>this.index());
    }

    onDragEnd(event: DragEvent) {
        this.dataTable.onRowDragEnd(event);
        this.el.nativeElement.draggable = false;
    }

    onDragOver(event: DragEvent) {
        this.dataTable.onRowDragOver(event, <number>this.index(), this.el.nativeElement);
        event.preventDefault();
    }

    onDragLeave(event: DragEvent) {
        this.dataTable.onRowDragLeave(event, this.el.nativeElement);
    }

    isEnabled() {
        return this.vxReorderableRowDisabled() !== true;
    }
    onDrop(event: DragEvent) {
        if (this.isEnabled() && this.dataTable.rowDragging) {
            this.dataTable.onRowDrop(event, this.el.nativeElement);
        }

        event.preventDefault();
    }

    onDestroy() {
        this.unbindEvents();
    }
}
/**
 * Column Filter Component.
 * @group Components
 */
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'vx-columnFilter, vx-column-filter, vx-columnfilter',
    imports: [CommonModule, FormsModule, ButtonModule, SelectModule, MotionModule, Bind, forwardRef(() => ColumnFilterFormElement), FilterIcon, FilterFillIcon, TrashIcon, PlusIcon],
    template: `
        <div [class]="cx('filter')">
            @if (display() === 'row') {
                <vx-columnFilterFormElement
                    class="p-fluid"
                    [type]="type()"
                    [field]="field()"
                    [ariaLabel]="ariaLabel()"
                    [filterConstraint]="dataTable.filters()[field()]"
                    [filterTemplate]="filterTemplate() || _filterTemplate()"
                    [placeholder]="placeholder()"
                    [minFractionDigits]="minFractionDigits()"
                    [maxFractionDigits]="maxFractionDigits()"
                    [prefix]="prefix()"
                    [suffix]="suffix()"
                    [locale]="locale()"
                    [localeMatcher]="localeMatcher()"
                    [currency]="currency()"
                    [currencyDisplay]="currencyDisplay()"
                    [useGrouping]="useGrouping()"
                    [showButtons]="showButtons()"
                    [filterOn]="filterOn()"
                    [pt]="pt()"
                    [unstyled]="unstyled()"
                ></vx-columnFilterFormElement>
            }
            @if (showMenuButton) {
                <vx-button
                    [styleClass]="cx('pcColumnFilterButton')"
                    [pt]="ptm('pcColumnFilterButton')"
                    [attr.aria-haspopup]="true"
                    [ariaLabel]="filterMenuButtonAriaLabel"
                    [attr.aria-controls]="overlayVisible ? overlayId : null"
                    [attr.aria-expanded]="overlayVisible ?? false"
                    (click)="toggleMenu($event)"
                    (keydown)="onToggleButtonKeyDown($event)"
                    [buttonProps]="filterButtonProps()?.filter"
                    #menuButton
                    [unstyled]="unstyled()"
                >
                    <ng-template #icon>
                        <ng-container>
                            @if (!filterIconTemplate() && !_filterIconTemplate() && !hasFilter) {
                                <svg data-p-icon="filter" [vxBind]="ptm('pcColumnFilterButton')['icon']" />
                            }
                            @if (!filterIconTemplate() && !_filterIconTemplate() && hasFilter) {
                                <svg data-p-icon="filter-fill" [vxBind]="ptm('pcColumnFilterButton')['icon']" />
                            }
                            @if (filterIconTemplate() || _filterIconTemplate()) {
                                <span [vxBind]="ptm('pcColumnFilterButton')['icon']" [attr.data-pc-section]="'columnfilterbuttonicon'">
                                    <ng-template *ngTemplateOutlet="filterIconTemplate() || _filterIconTemplate(); context: { hasFilter: hasFilter }"></ng-template>
                                </span>
                            }
                        </ng-container>
                    </ng-template>
                </vx-button>
            }
            @if (renderOverlay()) {
                <div
                    [vxMotion]="showMenu() && overlayVisible"
                    [vxMotionAppear]="true"
                    vxMotionName="p-anchored-overlay"
                    (vxMotionOnBeforeEnter)="onOverlayBeforeEnter($event)"
                    (vxMotionOnAfterLeave)="onOverlayAnimationAfterLeave($event)"
                    [vxMotionOptions]="computedMotionOptions()"
                    [class]="cx('filterOverlay')"
                    [vxBind]="ptm('filterOverlay')"
                    [id]="overlayId"
                    [attr.aria-modal]="true"
                    role="dialog"
                    (click)="onContentClick()"
                    (keydown.escape)="onEscape()"
                >
                    <ng-container *ngTemplateOutlet="headerTemplate() || _headerTemplate(); context: { $implicit: field() }"></ng-container>
                    @if (display() === 'row') {
                        <ul [class]="cx('filterConstraintList')" [vxBind]="ptm('filterConstraintList')">
                            @for (matchMode of matchModes; track matchMode; let i = $index) {
                                <li
                                    (click)="onRowMatchModeChange(matchMode.value)"
                                    (keydown)="onRowMatchModeKeyDown($event)"
                                    (keydown.enter)="onRowMatchModeChange(matchMode.value)"
                                    [class]="cx('filterConstraint')"
                                    [vxBind]="ptm('filterConstraint', ptmFilterConstraintOptions(matchMode))"
                                    [class.p-datatable-filter-constraint-selected]="isRowMatchModeSelected(matchMode.value)"
                                    [attr.tabindex]="i === 0 ? '0' : null"
                                >
                                    {{ matchMode.label }}
                                </li>
                            }
                            <li [class]="cx('filterConstraintSeparator')" [vxBind]="ptm('filterConstraintSeparator', { context: { index: matchModes?.length } })"></li>
                            <li [class]="cx('filterConstraint')" [vxBind]="ptm('emtpyFilterLabel')" (click)="onRowClearItemClick()" (keydown)="onRowMatchModeKeyDown($event)" (keydown.enter)="onRowClearItemClick()">
                                {{ noFilterLabel }}
                            </li>
                        </ul>
                    } @else {
                        @if (isShowOperator) {
                            <div [class]="cx('filterOperator')" [vxBind]="ptm('filterOperator')">
                                <vx-select
                                    [options]="operatorOptions"
                                    [pt]="ptm('pcFilterOperatorDropdown')"
                                    [ngModel]="operator()"
                                    (ngModelChange)="onOperatorChange($event)"
                                    [styleClass]="cx('pcFilterOperatorDropdown')"
                                    [unstyled]="unstyled()"
                                ></vx-select>
                            </div>
                        }
                        <div [class]="cx('filterRuleList')" [vxBind]="ptm('filterRuleList')">
                            @for (fieldConstraint of fieldConstraints; track fieldConstraint) {
                                <div [class]="cx('filterRule')" [vxBind]="ptm('filterRule')">
                                    @if (showMatchModes() && matchModes) {
                                        <vx-select
                                            [options]="matchModes"
                                            [ngModel]="fieldConstraint.matchMode"
                                            (ngModelChange)="onMenuMatchModeChange($event, fieldConstraint)"
                                            [styleClass]="cx('pcFilterConstraintDropdown')"
                                            [pt]="ptm('pcFilterConstraintDropdown')"
                                            [unstyled]="unstyled()"
                                        ></vx-select>
                                    }
                                    <vx-columnFilterFormElement
                                        [type]="type()"
                                        [field]="field()"
                                        [filterConstraint]="fieldConstraint"
                                        [filterTemplate]="filterTemplate() || _filterTemplate()"
                                        [placeholder]="placeholder()"
                                        [minFractionDigits]="minFractionDigits()"
                                        [maxFractionDigits]="maxFractionDigits()"
                                        [prefix]="prefix()"
                                        [suffix]="suffix()"
                                        [locale]="locale()"
                                        [localeMatcher]="localeMatcher()"
                                        [currency]="currency()"
                                        [currencyDisplay]="currencyDisplay()"
                                        [useGrouping]="useGrouping()"
                                        [filterOn]="filterOn()"
                                        [pt]="pt()"
                                        [unstyled]="unstyled()"
                                    ></vx-columnFilterFormElement>
                                    <div>
                                        @if (showRemoveIcon) {
                                            <vx-button
                                                [styleClass]="cx('pcFilterRemoveRuleButton')"
                                                [pt]="ptm('pcFilterRemoveRuleButton')"
                                                [text]="true"
                                                severity="danger"
                                                size="small"
                                                (onClick)="removeConstraint(fieldConstraint)"
                                                [ariaLabel]="removeRuleButtonLabel"
                                                [label]="removeRuleButtonLabel"
                                                [buttonProps]="filterButtonProps()?.popover?.removeRule"
                                                [unstyled]="unstyled()"
                                            >
                                                <ng-template #icon>
                                                    @if (!removeRuleIconTemplate() && !_removeRuleIconTemplate()) {
                                                        <svg data-p-icon="trash" [vxBind]="ptm('pcFilterRemoveRuleButton')['icon']" />
                                                    }
                                                    <ng-template *ngTemplateOutlet="removeRuleIconTemplate() || _removeRuleIconTemplate()"></ng-template>
                                                </ng-template>
                                            </vx-button>
                                        }
                                    </div>
                                </div>
                            }
                        </div>
                        @if (isShowAddConstraint) {
                            <vx-button
                                type="button"
                                [pt]="ptm('pcAddRuleButtonLabel')"
                                [label]="addRuleButtonLabel"
                                [attr.aria-label]="addRuleButtonLabel"
                                [styleClass]="cx('pcFilterAddRuleButton')"
                                [text]="true"
                                size="small"
                                (onClick)="addConstraint()"
                                [buttonProps]="filterButtonProps()?.popover?.addRule"
                                [unstyled]="unstyled()"
                            >
                                <ng-template #icon>
                                    @if (!addRuleIconTemplate() && !_addRuleIconTemplate()) {
                                        <svg data-p-icon="plus" [vxBind]="ptm('pcAddRuleButtonLabel')['icon']" />
                                    }
                                    <ng-template *ngTemplateOutlet="addRuleIconTemplate() || _addRuleIconTemplate()"></ng-template>
                                </ng-template>
                            </vx-button>
                        }
                        <div [class]="cx('filterButtonbar')" [vxBind]="ptm('filterButtonBar')">
                            @if (showClearButton()) {
                                <vx-button
                                    #clearBtn
                                    [outlined]="true"
                                    (onClick)="clearFilter()"
                                    [attr.aria-label]="clearButtonLabel"
                                    [label]="clearButtonLabel"
                                    [buttonProps]="filterButtonProps()?.popover?.clear"
                                    [pt]="ptm('pcFilterClearButton')"
                                    [unstyled]="unstyled()"
                                />
                            }
                            @if (showApplyButton()) {
                                <vx-button
                                    (onClick)="applyFilter()"
                                    size="small"
                                    [label]="applyButtonLabel"
                                    [attr.aria-label]="applyButtonLabel"
                                    [buttonProps]="filterButtonProps()?.popover?.apply"
                                    [pt]="ptm('pcFilterApplyButton')"
                                    [unstyled]="unstyled()"
                                />
                            }
                        </div>
                    }
                    <ng-container *ngTemplateOutlet="footerTemplate() || _footerTemplate(); context: { $implicit: field() }"></ng-container>
                </div>
            }
        </div>
    `,
    providers: [TableStyle],
    encapsulation: ViewEncapsulation.None,
    hostDirectives: [Bind]
})
export class ColumnFilter extends BaseComponent {
    hostName = 'Table';

    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(TableStyle);

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptm('columnFilter'));
    }

    ptmFilterConstraintOptions(matchMode) {
        return {
            context: {
                highlighted: matchMode && this.isRowMatchModeSelected(matchMode.value)
            }
        };
    }
    /**
     * Property represented by the column.
     * @group Props
     */
    field = input<string | undefined>(undefined);
    /**
     * Type of the input.
     * @group Props
     */
    type = input<string>('text');
    /**
     * Filter display.
     * @group Props
     */
    display = input<string>('row');
    /**
     * Decides whether to display filter menu popup.
     * @group Props
     */
    showMenu = input(true, { transform: booleanAttribute });
    /**
     * Filter match mode.
     * @group Props
     */
    matchMode = input<string | undefined>(undefined);
    /**
     * Filter operator.
     * @defaultValue 'AND'
     * @group Props
     */
    operatorInput = input<string>(FilterOperator.AND, { alias: 'operator' });

    operator = linkedSignal<string>(() => this.operatorInput());
    /**
     * Decides whether to display filter operator.
     * @group Props
     */
    showOperator = input(true, { transform: booleanAttribute });
    /**
     * Decides whether to display clear filter button when display is menu.
     * @defaultValue true
     * @group Props
     */
    showClearButton = input(true, { transform: booleanAttribute });
    /**
     * Decides whether to display apply filter button when display is menu.
     * @group Props
     */
    showApplyButton = input(true, { transform: booleanAttribute });
    /**
     * Decides whether to display filter match modes when display is menu.
     * @group Props
     */
    showMatchModes = input(true, { transform: booleanAttribute });
    /**
     * Decides whether to display add filter button when display is menu.
     * @group Props
     */
    showAddButton = input(true, { transform: booleanAttribute });
    /**
     * Decides whether to close popup on clear button click.
     * @group Props
     */
    hideOnClear = input(true, { transform: booleanAttribute });
    /**
     * Filter placeholder.
     * @group Props
     */
    placeholder = input<string | undefined>(undefined);
    /**
     * Filter match mode options.
     * @group Props
     */
    matchModeOptions = input<SelectItem[] | undefined>(undefined);
    /**
     * Defines maximum amount of constraints.
     * @group Props
     */
    maxConstraints = input(2, { transform: numberAttribute });
    /**
     * Defines minimum fraction of digits.
     * @group Props
     */
    minFractionDigits = input<number | undefined, unknown>(undefined, { transform: (value: unknown) => numberAttribute(value, undefined) });
    /**
     * Defines maximum fraction of digits.
     * @group Props
     */
    maxFractionDigits = input<number | undefined, unknown>(undefined, { transform: (value: unknown) => numberAttribute(value, undefined) });
    /**
     * Defines prefix of the filter.
     * @group Props
     */
    prefix = input<string | undefined>(undefined);
    /**
     * Defines suffix of the filter.
     * @group Props
     */
    suffix = input<string | undefined>(undefined);
    /**
     * Defines filter locale.
     * @group Props
     */
    locale = input<string | undefined>(undefined);
    /**
     * Defines filter locale matcher.
     * @group Props
     */
    localeMatcher = input<string | undefined>(undefined);
    /**
     * Enables currency input.
     * @group Props
     */
    currency = input<string | undefined>(undefined);
    /**
     * Defines the display of the currency input.
     * @group Props
     */
    currencyDisplay = input<string | undefined>(undefined);
    /**
     * Default trigger to run filtering on built-in text and numeric filters, valid values are 'enter' and 'input'.
     * @defaultValue enter
     * @group Props
     */
    filterOn = input<string | undefined>('enter');
    /**
     * Defines if filter grouping will be enabled.
     * @group Props
     */
    useGrouping = input(true, { transform: booleanAttribute });
    /**
     * Defines the visibility of buttons.
     * @group Props
     */
    showButtons = input(true, { transform: booleanAttribute });
    /**
     * Defines the aria-label of the form element.
     * @group Props
     */
    ariaLabel = input<string | undefined>(undefined);
    /**
     * Used to pass all filter button property object
     * @defaultValue {
     filter: { severity: 'secondary', text: true, rounded: true },
     inline: {
        clear: { severity: 'secondary', text: true, rounded: true }
     },
     popover: {
         addRule: { severity: 'info', text: true, size: 'small' },
         removeRule: { severity: 'danger', text: true, size: 'small' },
         apply: { size: 'small' },
         clear: { outlined: true, size: 'small' }
        }
     }
     @group Props
     */
    filterButtonProps = input<TableFilterButtonPropsOptions>({
        filter: { severity: 'secondary', text: true, rounded: true },
        inline: {
            clear: { severity: 'secondary', text: true, rounded: true }
        },
        popover: {
            addRule: { severity: 'info', text: true, size: 'small' },
            removeRule: { severity: 'danger', text: true, size: 'small' },
            apply: { size: 'small' },
            clear: { outlined: true, size: 'small' }
        }
    });
    motionOptions = input<MotionOptions | undefined>(undefined);

    computedMotionOptions = computed<MotionOptions>(() => {
        return {
            ...this.ptm('motion'),
            ...this.motionOptions()
        };
    });
    /**
     * Callback to invoke on overlay is shown.
     * @param {AnimationEvent} originalEvent - animation event.
     * @group Emits
     */
    onShow = output<{ originalEvent: AnimationEvent }>();
    /**
     * Callback to invoke on overlay is hidden.
     * @param {AnimationEvent} originalEvent - animation event.
     * @group Emits
     */
    onHide = output<{ originalEvent: AnimationEvent }>();

    icon = viewChild(Button, { read: ElementRef });

    clearButtonViewChild = viewChild<ElementRef>('clearBtn');

    _templates = contentChildren(PrimeTemplate);

    overlaySubscription: Subscription | undefined;

    renderOverlay = signal<boolean>(false);

    /**
     * Custom header template.
     * @group Templates
     */
    headerTemplate = contentChild<TemplateRef<any>>('header', { descendants: false });
    _headerTemplate = computed<TemplateRef<any> | undefined>(
        () =>
            this._templates()
                ?.filter((item) => item.getType() === 'header')
                .at(-1)?.template
    );

    /**
     * Custom filter template.
     * @group Templates
     */
    filterTemplate = contentChild<TemplateRef<any>>('filter', { descendants: false });
    _filterTemplate = computed<TemplateRef<any> | undefined>(
        () =>
            this._templates()
                ?.filter((item) => !['header', 'footer', 'filtericon', 'clearfiltericon', 'removeruleicon', 'addruleicon'].includes(item.getType()))
                .at(-1)?.template
    );

    /**
     * Custom footer template.
     * @group Templates
     */
    footerTemplate = contentChild<TemplateRef<any>>('footer', { descendants: false });
    _footerTemplate = computed<TemplateRef<any> | undefined>(
        () =>
            this._templates()
                ?.filter((item) => item.getType() === 'footer')
                .at(-1)?.template
    );
    /**
     * Custom filter icon template.
     * @group Templates
     */
    filterIconTemplate = contentChild<TemplateRef<any>>('filtericon', { descendants: false });
    _filterIconTemplate = computed<TemplateRef<any> | undefined>(
        () =>
            this._templates()
                ?.filter((item) => item.getType() === 'filtericon')
                .at(-1)?.template
    );

    /**
     * Custom remove rule button icon template.
     * @group Templates
     */
    removeRuleIconTemplate = contentChild<TemplateRef<any>>('removeruleicon', { descendants: false });
    _removeRuleIconTemplate = computed<TemplateRef<any> | undefined>(
        () =>
            this._templates()
                ?.filter((item) => item.getType() === 'removeruleicon')
                .at(-1)?.template
    );

    /**
     * Custom add rule button icon template.
     * @group Templates
     */
    addRuleIconTemplate = contentChild<TemplateRef<any>>('addruleicon', { descendants: false });
    _addRuleIconTemplate = computed<TemplateRef<any> | undefined>(
        () =>
            this._templates()
                ?.filter((item) => item.getType() === 'addruleicon')
                .at(-1)?.template
    );

    clearFilterIconTemplate = contentChild<TemplateRef<any>>('clearfiltericon', { descendants: false });
    _clearFilterIconTemplate = computed<TemplateRef<any> | undefined>(
        () =>
            this._templates()
                ?.filter((item) => item.getType() === 'clearfiltericon')
                .at(-1)?.template
    );

    operatorOptions: any[] | undefined;

    overlayVisible: boolean | undefined;

    overlay: HTMLElement | undefined | null;

    scrollHandler: ConnectedOverlayScrollHandler | null | undefined;

    documentClickListener: VoidListener;

    documentResizeListener: VoidListener;

    matchModes: SelectItem[] | undefined;

    translationSubscription: Subscription | undefined;

    resetSubscription: Subscription | undefined;

    selfClick: boolean | undefined;

    overlayEventListener: any;

    overlayId: any;

    get fieldConstraints(): FilterMetadata[] | undefined | null {
        return this.dataTable.filters() ? <FilterMetadata[]>this.dataTable.filters()[<string>this.field()] : null;
    }

    get showRemoveIcon(): boolean {
        return this.fieldConstraints ? this.fieldConstraints.length > 1 : false;
    }

    get showMenuButton(): boolean {
        return this.showMenu() && (this.display() === 'row' ? this.type() !== 'boolean' : true);
    }

    get isShowOperator(): boolean {
        return this.showOperator() && this.type() !== 'boolean';
    }

    get isShowAddConstraint(): boolean | undefined | null {
        return this.showAddButton() && this.type() !== 'boolean' && this.fieldConstraints && this.fieldConstraints.length < this.maxConstraints();
    }

    get showMenuButtonLabel() {
        return this.config.getTranslation(TranslationKeys.SHOW_FILTER_MENU);
    }

    get applyButtonLabel(): string {
        return this.config.getTranslation(TranslationKeys.APPLY);
    }

    get clearButtonLabel(): string {
        return this.config.getTranslation(TranslationKeys.CLEAR);
    }

    get addRuleButtonLabel(): string {
        return this.config.getTranslation(TranslationKeys.ADD_RULE);
    }

    get removeRuleButtonLabel(): string {
        return this.config.getTranslation(TranslationKeys.REMOVE_RULE);
    }

    get noFilterLabel(): string {
        return this.config.getTranslation(TranslationKeys.NO_FILTER);
    }

    get filterMenuButtonAriaLabel() {
        return this.config?.translation ? (this.overlayVisible ? this.config?.translation?.aria?.hideFilterMenu : this.config?.translation?.aria?.showFilterMenu) : undefined;
    }

    get removeRuleButtonAriaLabel() {
        return this.config?.translation ? this.config?.translation?.removeRule : undefined;
    }

    get filterOperatorAriaLabel() {
        return this.config?.translation ? this.config?.translation?.aria?.filterOperator : undefined;
    }

    get filterConstraintAriaLabel() {
        return this.config?.translation ? this.config?.translation?.aria?.filterConstraint : undefined;
    }

    dataTable = inject(Table);

    overlayService = inject(OverlayService);

    onInit() {
        this.overlayId = UniqueComponentId();
        if (!this.dataTable.filters()[<string>this.field()]) {
            this.initFieldFilterConstraint();
        }

        this.translationSubscription = this.config.translationObserver.subscribe(() => {
            this.generateMatchModeOptions();
            this.generateOperatorOptions();
        });

        this.generateMatchModeOptions();
        this.generateOperatorOptions();
    }

    generateMatchModeOptions() {
        this.matchModes =
            this.matchModeOptions() ||
            (this.config as any).filterMatchModeOptions[this.type()]?.map((key: any) => {
                return {
                    label: this.config.getTranslation(key),
                    value: key
                };
            });
    }

    generateOperatorOptions() {
        this.operatorOptions = [
            {
                label: this.config.getTranslation(TranslationKeys.MATCH_ALL),
                value: FilterOperator.AND
            },
            {
                label: this.config.getTranslation(TranslationKeys.MATCH_ANY),
                value: FilterOperator.OR
            }
        ];
    }

    initFieldFilterConstraint() {
        let defaultMatchMode = this.getDefaultMatchMode();
        this.dataTable.filters()[<string>this.field()] =
            this.display() == 'row'
                ? { value: null, matchMode: defaultMatchMode }
                : [
                      {
                          value: null,
                          matchMode: defaultMatchMode,
                          operator: this.operator()
                      }
                  ];
    }

    onMenuMatchModeChange(value: any, filterMeta: FilterMetadata) {
        filterMeta.matchMode = value;

        if (!this.showApplyButton()) {
            this.dataTable._filter();
        }
    }

    onRowMatchModeChange(matchMode: string) {
        const fieldFilter = <FilterMetadata>this.dataTable.filters()[<string>this.field()];
        fieldFilter.matchMode = matchMode;

        if (fieldFilter.value) {
            this.dataTable._filter();
        }

        this.hide();
    }

    onRowMatchModeKeyDown(event: KeyboardEvent) {
        let item = <HTMLLIElement>event.target;

        switch (event.key) {
            case 'ArrowDown':
                var nextItem = this.findNextItem(item);
                if (nextItem) {
                    item.removeAttribute('tabindex');
                    nextItem.tabIndex = '0';
                    nextItem.focus();
                }

                event.preventDefault();
                break;

            case 'ArrowUp':
                var prevItem = this.findPrevItem(item);
                if (prevItem) {
                    item.removeAttribute('tabindex');
                    prevItem.tabIndex = '0';
                    prevItem.focus();
                }

                event.preventDefault();
                break;
        }
    }

    onRowClearItemClick() {
        this.clearFilter();
        this.hide();
    }

    isRowMatchModeSelected(matchMode: string) {
        return (<FilterMetadata>this.dataTable.filters()[<string>this.field()]).matchMode === matchMode;
    }

    addConstraint() {
        (<FilterMetadata[]>this.dataTable.filters()[<string>this.field()]).push({
            value: null,
            matchMode: this.getDefaultMatchMode(),
            operator: this.getDefaultOperator()
        });
        DomHandler.focus(this.clearButtonViewChild()?.nativeElement);
    }

    removeConstraint(filterMeta: FilterMetadata) {
        this.dataTable.filters()[<string>this.field()] = (<FilterMetadata[]>this.dataTable.filters()[<string>this.field()]).filter((meta) => meta !== filterMeta);
        if (!this.showApplyButton()) {
            this.dataTable._filter();
        }
        DomHandler.focus(this.clearButtonViewChild()?.nativeElement);
    }

    onOperatorChange(value: any) {
        (<FilterMetadata[]>this.dataTable.filters()[<string>this.field()]).forEach((filterMeta) => {
            filterMeta.operator = value;
            this.operator.set(value);
        });

        if (!this.showApplyButton()) {
            this.dataTable._filter();
        }
    }

    toggleMenu(event: Event) {
        this.overlayVisible = !this.overlayVisible;
        this.renderOverlay.set(!this.renderOverlay());
        event.stopPropagation();
    }

    onToggleButtonKeyDown(event: KeyboardEvent) {
        switch (event.key) {
            case 'Escape':
            case 'Tab':
                this.overlayVisible = false;
                break;

            case 'ArrowDown':
                if (this.overlayVisible) {
                    let focusable = DomHandler.getFocusableElements(<HTMLElement>this.overlay);
                    if (focusable) {
                        focusable[0].focus();
                    }
                    event.preventDefault();
                } else if (event.altKey) {
                    this.overlayVisible = true;
                    event.preventDefault();
                }
                break;
            case 'Enter':
                this.toggleMenu(event);
                event.preventDefault();
                break;
        }
    }

    onEscape() {
        this.overlayVisible = false;
        this.icon()?.nativeElement.focus();
    }

    findNextItem(item: HTMLLIElement): any {
        let nextItem = <HTMLLIElement>item.nextElementSibling;

        if (nextItem) return find(nextItem, '[data-pc-section="filterconstraintseparator"]') ? this.findNextItem(nextItem) : nextItem;
        else return item.parentElement?.firstElementChild;
    }

    findPrevItem(item: HTMLLIElement): any {
        let prevItem = <HTMLLIElement>item.previousElementSibling;

        if (prevItem) return find(prevItem, '[data-pc-section="filterconstraintseparator"]') ? this.findPrevItem(prevItem) : prevItem;
        else return item.parentElement?.lastElementChild;
    }

    onContentClick() {
        this.selfClick = true;
    }

    onOverlayBeforeEnter(event: MotionEvent) {
        this.overlay = event.element as HTMLElement;
        if (this.overlay && this.overlay.parentElement !== this.document.body) {
            const buttonEl = <HTMLButtonElement>findSingle(this.el.nativeElement, '[data-pc-name="pccolumnfilterbutton"]');
            appendChild(this.document.body, this.overlay);
            addStyle(this.overlay!, { position: 'absolute', top: '0' });
            absolutePosition(this.overlay, buttonEl);
            ZIndexUtils.set('overlay', this.overlay, this.config.zIndex.overlay);
        }

        this.bindDocumentClickListener();
        this.bindDocumentResizeListener();
        this.bindScrollListener();

        this.overlayEventListener = (e: any) => {
            if (this.overlay && this.overlay.contains(e.target)) {
                this.selfClick = true;
            }
        };

        this.overlaySubscription = this.overlayService.clickObservable.subscribe(this.overlayEventListener);

        this.onShow.emit({ originalEvent: event as any });
        this.focusOnFirstElement();
    }

    onOverlayAnimationAfterLeave(event: MotionEvent) {
        this.restoreOverlayAppend();
        this.onOverlayHide();
        this.renderOverlay.set(false);
        if (this.overlaySubscription) {
            this.overlaySubscription.unsubscribe();
        }
        ZIndexUtils.clear(this.overlay);

        this.onHide.emit({ originalEvent: event as any });
    }

    restoreOverlayAppend() {
        if (this.overlay) {
            this.el.nativeElement.appendChild(this.overlay!);
        }
    }

    focusOnFirstElement() {
        if (this.overlay) {
            DomHandler.focus(DomHandler.getFirstFocusableElement(this.overlay, ''));
        }
    }

    getDefaultMatchMode(): string {
        const matchMode = this.matchMode();
        if (matchMode) {
            return matchMode;
        } else {
            if (this.type() === 'text') return FilterMatchMode.STARTS_WITH;
            else if (this.type() === 'numeric') return FilterMatchMode.EQUALS;
            else if (this.type() === 'date') return FilterMatchMode.DATE_IS;
            else return FilterMatchMode.CONTAINS;
        }
    }

    getDefaultOperator(): string | undefined {
        return this.dataTable.filters() ? (<FilterMetadata[]>this.dataTable.filters()[<string>(<string>this.field())])[0].operator : this.operator();
    }

    hasRowFilter() {
        return this.dataTable.filters()[<string>this.field()] && !this.dataTable.isFilterBlank((<FilterMetadata>this.dataTable.filters()[<string>this.field()]).value);
    }

    get hasFilter(): boolean {
        let fieldFilter = this.dataTable.filters()[<string>this.field()];
        if (fieldFilter) {
            if (Array.isArray(fieldFilter)) return !this.dataTable.isFilterBlank((<FilterMetadata[]>fieldFilter)[0].value);
            else return !this.dataTable.isFilterBlank(fieldFilter.value);
        }

        return false;
    }

    isOutsideClicked(event: any): boolean {
        return !(
            findSingle((this.overlay as HTMLElement).nextElementSibling!, '[data-pc-section="filteroverlay"]') ||
            findSingle((this.overlay as HTMLElement).nextElementSibling!, '[data-pc-name="popover"]') ||
            this.overlay?.isSameNode(event.target) ||
            this.overlay?.contains(event.target) ||
            this.icon()?.nativeElement.isSameNode(event.target) ||
            this.icon()?.nativeElement.contains(event.target) ||
            findSingle(event.target, '[data-pc-name="pcaddrulebuttonlabel"]') ||
            findSingle(event.target.parentElement, '[data-pc-name="pcaddrulebuttonlabel"]') ||
            findSingle(event.target, '[data-pc-name="pcfilterremoverulebutton"]') ||
            findSingle(event.target.parentElement, '[data-pc-name="pcfilterremoverulebutton"]')
        );
    }

    bindDocumentClickListener() {
        if (!this.documentClickListener) {
            const documentTarget: any = this.el ? this.el.nativeElement.ownerDocument : 'document';

            this.documentClickListener = this.renderer.listen(documentTarget, 'mousedown', (event) => {
                const dialogElements = document.querySelectorAll('[role="dialog"]');
                const targetIsColumnFilterMenuButton = event.target.closest('[data-pc-name="pccolumnfilterbutton"]');
                if (this.overlayVisible && this.isOutsideClicked(event) && (targetIsColumnFilterMenuButton || dialogElements?.length <= 1)) {
                    this.hide();
                }

                this.selfClick = false;
            });
        }
    }

    unbindDocumentClickListener() {
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
            this.selfClick = false;
        }
    }

    bindDocumentResizeListener() {
        if (!this.documentResizeListener) {
            this.documentResizeListener = this.renderer.listen(this.document.defaultView, 'resize', (event) => {
                if (this.overlayVisible && !DomHandler.isTouchDevice()) {
                    this.hide();
                }
            });
        }
    }

    unbindDocumentResizeListener() {
        if (this.documentResizeListener) {
            this.documentResizeListener();
            this.documentResizeListener = null;
        }
    }

    bindScrollListener() {
        if (!this.scrollHandler) {
            this.scrollHandler = new ConnectedOverlayScrollHandler(this.icon()?.nativeElement, () => {
                if (this.overlayVisible) {
                    this.hide();
                }
            });
        }

        this.scrollHandler.bindScrollListener();
    }

    unbindScrollListener() {
        if (this.scrollHandler) {
            this.scrollHandler.unbindScrollListener();
        }
    }

    hide() {
        this.overlayVisible = false;
        this.cd.markForCheck();
    }

    onOverlayHide() {
        this.unbindDocumentClickListener();
        this.unbindDocumentResizeListener();
        this.unbindScrollListener();
        this.overlay = null;
    }

    clearFilter() {
        this.initFieldFilterConstraint();
        this.dataTable._filter();
        if (this.hideOnClear()) this.hide();
    }

    applyFilter() {
        this.dataTable._filter();
        this.hide();
    }

    onDestroy() {
        if (this.overlay) {
            this.restoreOverlayAppend();
            ZIndexUtils.clear(this.overlay);
            this.onOverlayHide();
        }

        if (this.translationSubscription) {
            this.translationSubscription.unsubscribe();
        }

        if (this.resetSubscription) {
            this.resetSubscription.unsubscribe();
        }

        if (this.overlaySubscription) {
            this.overlaySubscription.unsubscribe();
        }
    }
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'vx-columnFilterFormElement',
    imports: [CommonModule, FormsModule, InputTextModule, InputNumberModule, CheckboxModule, DatePickerModule],
    template: `
        @if (filterTemplate()) {
            <ng-container
                *ngTemplateOutlet="
                    filterTemplate();
                    context: {
                        $implicit: filterConstraint().value,
                        filterCallback: filterCallback,
                        type: type(),
                        field: field(),
                        filterConstraint: filterConstraint(),
                        placeholder: placeholder(),
                        minFractionDigits: minFractionDigits(),
                        maxFractionDigits: maxFractionDigits(),
                        prefix: prefix(),
                        suffix: suffix(),
                        locale: locale(),
                        localeMatcher: localeMatcher(),
                        currency: currency(),
                        currencyDisplay: currencyDisplay(),
                        useGrouping: useGrouping(),
                        showButtons: showButtons
                    }
                "
            ></ng-container>
        } @else {
            @switch (type()) {
                @case ('text') {
                    <input
                        type="text"
                        [ariaLabel]="ariaLabel()"
                        vxInputText
                        [pt]="ptm('pcFilterInputText')"
                        [value]="filterConstraint()?.value"
                        (input)="onModelChange($event.target.value)"
                        (keydown.enter)="onTextInputEnterKeyDown($event)"
                        [attr.placeholder]="placeholder()"
                        [unstyled]="unstyled()"
                    />
                }
                @case ('numeric') {
                    <vx-inputNumber
                        [ngModel]="filterConstraint()?.value"
                        (ngModelChange)="onModelChange($event)"
                        (onKeyDown)="onNumericInputKeyDown($event)"
                        [showButtons]="showButtons"
                        [minFractionDigits]="minFractionDigits()"
                        [maxFractionDigits]="maxFractionDigits()"
                        [ariaLabel]="ariaLabel()"
                        [prefix]="prefix()"
                        [suffix]="suffix()"
                        [placeholder]="placeholder()"
                        [mode]="currency() ? 'currency' : 'decimal'"
                        [locale]="locale()"
                        [localeMatcher]="localeMatcher()"
                        [currency]="currency()"
                        [currencyDisplay]="currencyDisplay()"
                        [useGrouping]="useGrouping()"
                        [pt]="ptm('pcFilterInputNumber')"
                        [unstyled]="unstyled()"
                    ></vx-inputNumber>
                }
                @case ('boolean') {
                    <vx-checkbox [pt]="ptm('pcFilterCheckbox')" [indeterminate]="filterConstraint()?.value === null" [binary]="true" [ngModel]="filterConstraint()?.value" (ngModelChange)="onModelChange($event)" [unstyled]="unstyled()" />
                }
                @case ('date') {
                    <vx-datepicker
                        [pt]="ptm('pcFilterDatePicker')"
                        [ariaLabel]="ariaLabel()"
                        [placeholder]="placeholder()"
                        [ngModel]="filterConstraint()?.value"
                        (ngModelChange)="onModelChange($event)"
                        appendTo="body"
                        [unstyled]="unstyled()"
                    ></vx-datepicker>
                }
            }
        }
    `,
    providers: [TableStyle],
    encapsulation: ViewEncapsulation.None,
    hostDirectives: [Bind]
})
export class ColumnFilterFormElement extends BaseComponent<ColumnFilterPassThrough> {
    hostName = 'Table';

    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(TableStyle);

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptm('columnFilterFormElement'));
    }

    field = input<string | undefined>(undefined);

    type = input<string | undefined>(undefined);

    filterConstraint = input<FilterMetadata | undefined>(undefined);

    filterTemplate = input<Nullable<TemplateRef<any>>>(undefined);

    placeholder = input<string | undefined>(undefined);

    minFractionDigits = input<number | undefined, unknown>(undefined, { transform: (value: unknown) => numberAttribute(value, undefined) });

    maxFractionDigits = input<number | undefined, unknown>(undefined, { transform: (value: unknown) => numberAttribute(value, undefined) });

    prefix = input<string | undefined>(undefined);

    suffix = input<string | undefined>(undefined);

    locale = input<string | undefined>(undefined);

    localeMatcher = input<string | undefined>(undefined);

    currency = input<string | undefined>(undefined);

    currencyDisplay = input<string | undefined>(undefined);

    useGrouping = input(true, { transform: booleanAttribute });

    ariaLabel = input<string | undefined>(undefined);

    filterOn = input<string | undefined>(undefined);

    get showButtons(): boolean {
        return this.colFilter.showButtons();
    }

    filterCallback: any;

    constructor(
        public dataTable: Table,
        private colFilter: ColumnFilter
    ) {
        super();
    }

    onInit() {
        this.filterCallback = (value: any) => {
            (<any>this.filterConstraint()).value = value;
            this.dataTable._filter();
        };
    }

    onModelChange(value: any) {
        (<any>this.filterConstraint()).value = value;

        if (this.type() === 'date' || this.type() === 'boolean' || ((this.type() === 'text' || this.type() === 'numeric') && this.filterOn() === 'input') || !value) {
            this.dataTable._filter();
        }
    }

    onTextInputEnterKeyDown(event: KeyboardEvent) {
        this.dataTable._filter();
        event.preventDefault();
    }

    onNumericInputKeyDown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            this.dataTable._filter();
            event.preventDefault();
        }
    }
}

@NgModule({
    imports: [
        CommonModule,
        PaginatorModule,
        InputTextModule,
        SelectModule,
        FormsModule,
        ButtonModule,
        SelectButtonModule,
        DatePickerModule,
        InputNumberModule,
        BadgeModule,
        CheckboxModule,
        ScrollerModule,
        ArrowDownIcon,
        ArrowUpIcon,
        SpinnerIcon,
        SortAltIcon,
        SortAmountUpAltIcon,
        SortAmountDownIcon,
        FilterIcon,
        FilterFillIcon,
        FilterSlashIcon,
        PlusIcon,
        TrashIcon,
        RadioButtonModule,
        BindModule,
        MotionModule,
        Table,
        SortableColumn,
        FrozenColumn,
        RowGroupHeader,
        SelectableRow,
        RowToggler,
        ContextMenuRow,
        ResizableColumn,
        ReorderableColumn,
        EditableColumn,
        CellEditor,
        TableBody,
        SortIcon,
        TableRadioButton,
        TableCheckbox,
        TableHeaderCheckbox,
        ReorderableRowHandle,
        ReorderableRow,
        SelectableRowDblClick,
        EditableRow,
        InitEditableRow,
        SaveEditableRow,
        CancelEditableRow,
        ColumnFilter,
        ColumnFilterFormElement
    ],
    exports: [
        Table,
        SharedModule,
        SortableColumn,
        FrozenColumn,
        RowGroupHeader,
        SelectableRow,
        RowToggler,
        ContextMenuRow,
        ResizableColumn,
        ReorderableColumn,
        EditableColumn,
        CellEditor,
        SortIcon,
        TableRadioButton,
        TableCheckbox,
        TableHeaderCheckbox,
        ReorderableRowHandle,
        ReorderableRow,
        SelectableRowDblClick,
        EditableRow,
        InitEditableRow,
        SaveEditableRow,
        CancelEditableRow,
        ColumnFilter,
        ColumnFilterFormElement,
        ScrollerModule
    ],
    providers: [TableStyle]
})
export class TableModule {}
