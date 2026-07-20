import { CommonModule } from '@angular/common';
import {
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
    numberAttribute,
    output,
    SimpleChanges,
    TemplateRef,
    ViewEncapsulation
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Aria, PrimeTemplate, SelectItem, SharedModule } from 'voxx-ui/api';
import { BaseComponent, PARENT_INSTANCE } from 'voxx-ui/basecomponent';
import { Bind } from 'voxx-ui/bind';
import { Select, SelectChangeEvent } from 'voxx-ui/select';
import { AngleDoubleLeftIcon, AngleDoubleRightIcon, AngleLeftIcon, AngleRightIcon } from 'voxx-ui/icons';
import { InputNumber } from 'voxx-ui/inputnumber';
import { Ripple } from 'voxx-ui/ripple';
import { PaginatorDropdownItemTemplateContext, PaginatorPassThrough, PaginatorState, PaginatorTemplateContext } from 'voxx-ui/types/paginator';
import { PaginatorStyle } from './style/paginatorstyle';

const PAGINATOR_INSTANCE = new InjectionToken<Paginator>('PAGINATOR_INSTANCE');

/**
 * Paginator is a generic component to display content in paged format.
 * @group Components
 */
@Component({
    selector: 'vx-paginator',
    imports: [CommonModule, Select, InputNumber, FormsModule, Ripple, AngleDoubleLeftIcon, AngleDoubleRightIcon, AngleLeftIcon, AngleRightIcon, SharedModule, Bind],
    template: `
        @if (templateLeft()) {
            <div [vxBind]="ptm('contentStart')" [class]="cx('contentStart')">
                <ng-container *ngTemplateOutlet="templateLeft(); context: { $implicit: paginatorState }"></ng-container>
            </div>
        }
        @if (showCurrentPageReport()) {
            <span [vxBind]="ptm('current')" [class]="cx('current')">{{ currentPageReport }}</span>
        }
        @if (showFirstLastIcon()) {
            <button [vxBind]="ptm('first')" type="button" (click)="changePageToFirst($event)" vxRipple [class]="cx('first')" [attr.aria-label]="getAriaLabel('firstPageLabel')">
                @if (!firstPageLinkIconTemplate() && !_firstPageLinkIconTemplate()) {
                    <svg [vxBind]="ptm('firstIcon')" data-p-icon="angle-double-left" [class]="cx('firstIcon')" />
                }
                @if (firstPageLinkIconTemplate() || _firstPageLinkIconTemplate()) {
                    <span [class]="cx('firstIcon')">
                        <ng-template *ngTemplateOutlet="firstPageLinkIconTemplate() || _firstPageLinkIconTemplate()"></ng-template>
                    </span>
                }
            </button>
        }
        <button [vxBind]="ptm('prev')" type="button" [disabled]="isFirstPage() || empty()" (click)="changePageToPrev($event)" vxRipple [class]="cx('prev')" [attr.aria-label]="getAriaLabel('prevPageLabel')">
            @if (!previousPageLinkIconTemplate() && !_previousPageLinkIconTemplate()) {
                <svg [vxBind]="ptm('prevIcon')" data-p-icon="angle-left" [class]="cx('prevIcon')" />
            }
            @if (previousPageLinkIconTemplate() || _previousPageLinkIconTemplate()) {
                <span [class]="cx('prevIcon')">
                    <ng-template *ngTemplateOutlet="previousPageLinkIconTemplate() || _previousPageLinkIconTemplate()"></ng-template>
                </span>
            }
        </button>
        @if (showPageLinks()) {
            <span [vxBind]="ptm('pages')" [class]="cx('pages')">
                @for (pageLink of pageLinks; track pageLink) {
                    <button
                        [vxBind]="ptm('page')"
                        type="button"
                        [class]="cx('page', { pageLink })"
                        [attr.aria-label]="getPageAriaLabel(pageLink)"
                        [attr.aria-current]="pageLink - 1 == getPage() ? 'page' : undefined"
                        (click)="onPageLinkClick($event, pageLink - 1)"
                        vxRipple
                    >
                        {{ getLocalization(pageLink) }}
                    </button>
                }
            </span>
        }
        @if (showJumpToPageDropdown()) {
            <vx-select
                [options]="pageItems"
                [ngModel]="getPage()"
                [disabled]="empty()"
                [attr.aria-label]="getAriaLabel('jumpToPageDropdownLabel')"
                [styleClass]="cx('pcJumpToPageDropdown')"
                (onChange)="onPageDropdownChange($event)"
                [appendTo]="dropdownAppendTo() || $appendTo()"
                [scrollHeight]="dropdownScrollHeight()"
                [pt]="ptm('pcJumpToPageDropdown')"
                [unstyled]="unstyled()"
            >
                <ng-template vxTemplate="selectedItem">{{ currentPageReport }}</ng-template>
                @if (jumpToPageItemTemplate()) {
                    <ng-template let-item vxTemplate="item">
                        <ng-container *ngTemplateOutlet="jumpToPageItemTemplate(); context: { $implicit: item }"></ng-container>
                    </ng-template>
                }
                @if (dropdownIconTemplate() || _dropdownIconTemplate()) {
                    <ng-template vxTemplate="dropdownicon">
                        <ng-container *ngTemplateOutlet="dropdownIconTemplate() || _dropdownIconTemplate()"></ng-container>
                    </ng-template>
                }
            </vx-select>
        }
        <button [vxBind]="ptm('next')" type="button" [disabled]="isLastPage() || empty()" (click)="changePageToNext($event)" vxRipple [class]="cx('next')" [attr.aria-label]="getAriaLabel('nextPageLabel')">
            @if (!nextPageLinkIconTemplate() && !_nextPageLinkIconTemplate()) {
                <svg [vxBind]="ptm('nextIcon')" data-p-icon="angle-right" [class]="cx('nextIcon')" />
            }
            @if (nextPageLinkIconTemplate() || _nextPageLinkIconTemplate()) {
                <span [class]="cx('nextIcon')">
                    <ng-template *ngTemplateOutlet="nextPageLinkIconTemplate() || _nextPageLinkIconTemplate()"></ng-template>
                </span>
            }
        </button>
        @if (showFirstLastIcon()) {
            <button [vxBind]="ptm('last')" type="button" [disabled]="isLastPage() || empty()" (click)="changePageToLast($event)" vxRipple [class]="cx('last')" [attr.aria-label]="getAriaLabel('lastPageLabel')">
                @if (!lastPageLinkIconTemplate() && !_lastPageLinkIconTemplate()) {
                    <svg [vxBind]="ptm('lastIcon')" data-p-icon="angle-double-right" [class]="cx('lastIcon')" />
                }
                @if (lastPageLinkIconTemplate() || _lastPageLinkIconTemplate()) {
                    <span [class]="cx('lastIcon')">
                        <ng-template *ngTemplateOutlet="lastPageLinkIconTemplate() || _lastPageLinkIconTemplate()"></ng-template>
                    </span>
                }
            </button>
        }
        @if (showJumpToPageInput()) {
            <vx-inputnumber [pt]="ptm('pcJumpToPageInput')" [ngModel]="currentPage()" [class]="cx('pcJumpToPageInput')" [disabled]="empty()" (ngModelChange)="changePage($event - 1)" [unstyled]="unstyled()"></vx-inputnumber>
        }
        @if (rowsPerPageOptions()) {
            <vx-select
                [options]="rowsPerPageItems"
                [(ngModel)]="rows"
                [styleClass]="cx('pcRowPerPageDropdown')"
                [disabled]="empty()"
                (onChange)="onRppChange($event)"
                [appendTo]="dropdownAppendTo() || $appendTo()"
                [scrollHeight]="dropdownScrollHeight()"
                [ariaLabel]="getAriaLabel('rowsPerPageLabel')"
                [pt]="ptm('pcRowPerPageDropdown')"
                [unstyled]="unstyled()"
            >
                @if (dropdownItemTemplate()) {
                    <ng-template let-item vxTemplate="item">
                        <ng-container *ngTemplateOutlet="dropdownItemTemplate(); context: { $implicit: item }"></ng-container>
                    </ng-template>
                }
                @if (dropdownIconTemplate() || _dropdownIconTemplate()) {
                    <ng-template vxTemplate="dropdownicon">
                        <ng-container *ngTemplateOutlet="dropdownIconTemplate() || _dropdownIconTemplate()"></ng-container>
                    </ng-template>
                }
            </vx-select>
        }
        @if (templateRight()) {
            <div [vxBind]="ptm('contentEnd')" [class]="cx('contentEnd')">
                <ng-container *ngTemplateOutlet="templateRight(); context: { $implicit: paginatorState }"></ng-container>
            </div>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [PaginatorStyle, { provide: PAGINATOR_INSTANCE, useExisting: Paginator }, { provide: PARENT_INSTANCE, useExisting: Paginator }],
    host: {
        '[class]': "cn(cx('paginator'), styleClass())",
        '[style.display]': 'display'
    },
    hostDirectives: [Bind]
})
export class Paginator extends BaseComponent<PaginatorPassThrough> {
    componentName = 'Paginator';

    bindDirectiveInstance = inject(Bind, { self: true });

    $pcPaginator: Paginator | undefined = inject(PAGINATOR_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }
    /**
     * Number of page links to display.
     * @group Props
     */
    // pageLinkSize / totalRecords / rows / first are internally mutated (page navigation, the
    // rows-per-page dropdown two-way binding) or written imperatively by specs. Each is an
    // aliased input() feeding a writable linkedSignal, exposed via get/set so every `this.xxx`
    // read/write site and template binding stays unchanged (#18).
    pageLinkSizeInput = input<number, unknown>(5, { alias: 'pageLinkSize', transform: numberAttribute });
    private _pageLinkSizeState = linkedSignal(() => this.pageLinkSizeInput());
    /**
     * Number of page links to display.
     * @group Props
     */
    get pageLinkSize(): number {
        return this._pageLinkSizeState();
    }
    set pageLinkSize(val: number) {
        this._pageLinkSizeState.set(val);
    }
    /**
     * Style class of the component.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    styleClass = input<string | undefined>(undefined);
    alwaysShowInput = input<boolean, unknown>(true, { alias: 'alwaysShow', transform: booleanAttribute });
    private _alwaysShowState = linkedSignal(() => this.alwaysShowInput());
    /**
     * Whether to show it even there is only one page.
     * @group Props
     */
    get alwaysShow(): boolean {
        return this._alwaysShowState();
    }
    set alwaysShow(val: boolean) {
        this._alwaysShowState.set(val);
    }
    /**
     * Target element to attach the dropdown overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @deprecated since v20.0.0. Use `appendTo` instead.
     * @group Props
     */
    dropdownAppendTo = input<HTMLElement | ElementRef | TemplateRef<any> | string | null | undefined | any>(undefined);
    /**
     * Template instance to inject into the left side of the paginator.
     * @param {PaginatorTemplateContext} context - Paginator template context.
     * @see {@link PaginatorTemplateContext}
     * @group Props
     */
    templateLeft = input<TemplateRef<PaginatorTemplateContext> | undefined>(undefined);
    /**
     * Template instance to inject into the right side of the paginator.
     * @param {PaginatorTemplateContext} context - Paginator template context.
     * @see {@link PaginatorTemplateContext}
     * @group Props
     */
    templateRight = input<TemplateRef<PaginatorTemplateContext> | undefined>(undefined);
    /**
     * Dropdown height of the viewport in pixels, a scrollbar is defined if height of list exceeds this value.
     * @group Props
     */
    dropdownScrollHeight = input<string>('200px');
    currentPageReportTemplateInput = input<string>('{currentPage} of {totalPages}', { alias: 'currentPageReportTemplate' });
    private _currentPageReportTemplateState = linkedSignal(() => this.currentPageReportTemplateInput());
    /**
     * Template of the current page report element. Available placeholders are {currentPage},{totalPages},{rows},{first},{last} and {totalRecords}
     * @group Props
     */
    get currentPageReportTemplate(): string {
        return this._currentPageReportTemplateState();
    }
    set currentPageReportTemplate(val: string) {
        this._currentPageReportTemplateState.set(val);
    }
    /**
     * Whether to display current page report.
     * @group Props
     */
    showCurrentPageReport = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * When enabled, icons are displayed on paginator to go first and last page.
     * @group Props
     */
    showFirstLastIcon = input<boolean, unknown>(true, { transform: booleanAttribute });
    totalRecordsInput = input<number, unknown>(0, { alias: 'totalRecords', transform: numberAttribute });
    private _totalRecordsState = linkedSignal(() => this.totalRecordsInput());
    /**
     * Number of total records.
     * @group Props
     */
    get totalRecords(): number {
        return this._totalRecordsState();
    }
    set totalRecords(val: number) {
        this._totalRecordsState.set(val);
    }
    rowsInput = input<number, unknown>(0, { alias: 'rows', transform: numberAttribute });
    private _rowsState = linkedSignal(() => this.rowsInput());
    /**
     * Data count to display per page.
     * @group Props
     */
    get rows(): number {
        return this._rowsState();
    }
    set rows(val: number) {
        this._rowsState.set(val);
    }
    /**
     * Array of integer/object values to display inside rows per page dropdown. A object that have 'showAll' key can be added to it to show all data. Exp; [10,20,30,{showAll:'All'}]
     * @group Props
     */
    rowsPerPageOptions = input<any[] | undefined>(undefined);
    /**
     * Whether to display a dropdown to navigate to any page.
     * @group Props
     */
    showJumpToPageDropdown = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Whether to display a input to navigate to any page.
     * @group Props
     */
    showJumpToPageInput = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Template instance to inject into the jump to page dropdown item inside in the paginator.
     * @param {PaginatorDropdownItemTemplateContext} context - dropdown item context.
     * @see {@link PaginatorDropdownItemTemplateContext}
     * @group Props
     */
    jumpToPageItemTemplate = input<TemplateRef<PaginatorDropdownItemTemplateContext> | undefined>(undefined);
    /**
     * Whether to show page links.
     * @group Props
     */
    showPageLinks = input<boolean, unknown>(true, { transform: booleanAttribute });
    localeInput = input<string | undefined>(undefined, { alias: 'locale' });
    private _localeState = linkedSignal(() => this.localeInput());
    /**
     * Locale to be used in formatting.
     * @group Props
     */
    get locale(): string | undefined {
        return this._localeState();
    }
    set locale(val: string | undefined) {
        this._localeState.set(val);
    }
    /**
     * Template instance to inject into the rows per page dropdown item inside in the paginator.
     * @param {PaginatorDropdownItemTemplateContext} context - dropdown item context.
     * @see {@link PaginatorDropdownItemTemplateContext}
     * @group Props
     */
    dropdownItemTemplate = input<TemplateRef<PaginatorDropdownItemTemplateContext> | undefined>(undefined);

    firstInput = input<number>(0, { alias: 'first' });
    private _firstState = linkedSignal(() => this.firstInput());
    /**
     * Zero-relative number of the first row to be displayed.
     * @group Props
     */
    get first(): number {
        return this._firstState();
    }
    set first(val: number) {
        this._firstState.set(val);
    }
    /**
     * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @defaultValue 'self'
     * @group Props
     */
    appendTo = input<HTMLElement | ElementRef | TemplateRef<any> | 'self' | 'body' | null | undefined | any>(undefined);
    /**
     * Callback to invoke when page changes, the event object contains information about the new state.
     * @param {PaginatorState} event - Paginator state.
     * @group Emits
     */
    onPageChange = output<PaginatorState>();

    /**
     * Template for the dropdown icon.
     * @group Templates
     */
    dropdownIconTemplate = contentChild<TemplateRef<void>>('dropdownicon', { descendants: false });

    /**
     * Template for the first page link icon.
     * @group Templates
     */
    firstPageLinkIconTemplate = contentChild<TemplateRef<void>>('firstpagelinkicon', { descendants: false });

    /**
     * Template for the previous page link icon.
     * @group Templates
     */
    previousPageLinkIconTemplate = contentChild<TemplateRef<void>>('previouspagelinkicon', { descendants: false });

    /**
     * Template for the last page link icon.
     * @group Templates
     */
    lastPageLinkIconTemplate = contentChild<TemplateRef<void>>('lastpagelinkicon', { descendants: false });

    /**
     * Template for the next page link icon.
     * @group Templates
     */
    nextPageLinkIconTemplate = contentChild<TemplateRef<void>>('nextpagelinkicon', { descendants: false });

    templates = contentChildren(PrimeTemplate);

    /**
     * Former `ngAfterContentInit` template map (#18): each icon `vxTemplate` type resolves to the
     * last matching projected template.
     */
    _dropdownIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'dropdownicon')
                .at(-1)?.template
    );

    _firstPageLinkIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'firstpagelinkicon')
                .at(-1)?.template
    );

    _previousPageLinkIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'previouspagelinkicon')
                .at(-1)?.template
    );

    _lastPageLinkIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'lastpagelinkicon')
                .at(-1)?.template
    );

    _nextPageLinkIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'nextpagelinkicon')
                .at(-1)?.template
    );

    pageLinks: number[] | undefined;

    pageItems: SelectItem[] | undefined;

    rowsPerPageItems: SelectItem[] | undefined;

    paginatorState: any;

    _componentStyle = inject(PaginatorStyle);

    $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo());

    get display(): string | null {
        return this.alwaysShow || (this.pageLinks && this.pageLinks.length > 1) ? null : 'none';
    }

    constructor() {
        super();
    }

    onInit() {
        this.updatePaginatorState();
    }

    getAriaLabel(labelType: keyof Aria): string | undefined {
        return this.config.translation.aria ? this.config.translation.aria[labelType] : undefined;
    }

    getPageAriaLabel(value: number): string | undefined {
        return this.config.translation.aria ? this.config.translation.aria.pageLabel?.replace(/{page}/g, `${value}`) : undefined;
    }

    getLocalization(digit: number): string {
        const numerals = [...new Intl.NumberFormat(this.locale, { useGrouping: false }).format(9876543210)].reverse();
        const index = new Map(numerals.map((d, i) => [i, d]));
        if (digit > 9) {
            const numbers = String(digit).split('');
            return numbers.map((number) => index.get(Number(number))).join('');
        } else {
            return index.get(digit) as string;
        }
    }

    onChanges(simpleChange: SimpleChanges): void {
        // The internally-mutated inputs are aliased signal inputs (`totalRecordsInput` aliased
        // `totalRecords`, etc.), so ngOnChanges reports them under their class-property key; the
        // pure `rowsPerPageOptions` input keeps its own name. Accept either key for robustness.
        const first = simpleChange.firstInput ?? simpleChange.first;

        if (simpleChange.totalRecordsInput ?? simpleChange.totalRecords) {
            this.updatePageLinks();
            this.updatePaginatorState();
            this.updateFirst();
            this.updateRowsPerPageOptions();
        }

        if (first) {
            this.first = first.currentValue;
            this.updatePageLinks();
            this.updatePaginatorState();
        }

        if (simpleChange.rowsInput ?? simpleChange.rows) {
            this.updatePageLinks();
            this.updatePaginatorState();
        }

        if (simpleChange.rowsPerPageOptions) {
            this.updateRowsPerPageOptions();
        }

        if (simpleChange.pageLinkSizeInput ?? simpleChange.pageLinkSize) {
            this.updatePageLinks();
        }
    }

    updateRowsPerPageOptions(): void {
        if (this.rowsPerPageOptions()) {
            this.rowsPerPageItems = [];
            let showAllItem: SelectItem | null = null;

            for (let opt of this.rowsPerPageOptions()!) {
                if (typeof opt == 'object' && opt['showAll']) {
                    showAllItem = { label: opt['showAll'], value: this.totalRecords };
                } else {
                    this.rowsPerPageItems.push({ label: String(this.getLocalization(opt)), value: opt });
                }
            }

            if (showAllItem) {
                this.rowsPerPageItems.push(showAllItem);
            }
        }
    }

    isFirstPage(): boolean {
        return this.getPage() === 0;
    }

    isLastPage(): boolean {
        return this.getPage() === this.getPageCount() - 1;
    }

    getPageCount(): number {
        return Math.ceil(this.totalRecords / this.rows);
    }

    calculatePageLinkBoundaries(): [number, number] {
        let numberOfPages = this.getPageCount(),
            visiblePages = Math.min(this.pageLinkSize, numberOfPages);

        //calculate range, keep current in middle if necessary
        let start = Math.max(0, Math.ceil(this.getPage() - visiblePages / 2)),
            end = Math.min(numberOfPages - 1, start + visiblePages - 1);

        //check when approaching to last page
        var delta = this.pageLinkSize - (end - start + 1);
        start = Math.max(0, start - delta);

        return [start, end];
    }

    updatePageLinks(): void {
        this.pageLinks = [];
        let boundaries = this.calculatePageLinkBoundaries(),
            start = boundaries[0],
            end = boundaries[1];

        for (let i = start; i <= end; i++) {
            this.pageLinks.push(i + 1);
        }

        if (this.showJumpToPageDropdown()) {
            this.pageItems = [];
            for (let i = 0; i < this.getPageCount(); i++) {
                this.pageItems.push({ label: String(i + 1), value: i });
            }
        }
    }

    changePage(p: number): void {
        var pc = this.getPageCount();

        if (p >= 0 && p < pc) {
            this.first = this.rows * p;
            var state = {
                page: p,
                first: this.first,
                rows: this.rows,
                pageCount: pc
            };
            this.updatePageLinks();

            this.onPageChange.emit(state);
            this.updatePaginatorState();
        }
    }

    updateFirst(): void {
        const page = this.getPage();
        if (page > 0 && this.totalRecords && this.first >= this.totalRecords) {
            Promise.resolve(null).then(() => this.changePage(page - 1));
        }
    }

    getPage(): number {
        return Math.floor(this.first / this.rows);
    }

    changePageToFirst(event: Event): void {
        if (!this.isFirstPage()) {
            this.changePage(0);
        }

        event.preventDefault();
    }

    changePageToPrev(event: Event): void {
        this.changePage(this.getPage() - 1);
        event.preventDefault();
    }

    changePageToNext(event: Event): void {
        this.changePage(this.getPage() + 1);
        event.preventDefault();
    }

    changePageToLast(event: Event): void {
        if (!this.isLastPage()) {
            this.changePage(this.getPageCount() - 1);
        }

        event.preventDefault();
    }

    onPageLinkClick(event: Event, page: number): void {
        this.changePage(page);
        event.preventDefault();
    }

    onRppChange(event: SelectChangeEvent | Event): void {
        this.changePage(this.getPage());
    }

    onPageDropdownChange(event: SelectChangeEvent): void {
        this.changePage(event.value);
    }

    updatePaginatorState(): void {
        this.paginatorState = {
            page: this.getPage(),
            pageCount: this.getPageCount(),
            rows: this.rows,
            first: this.first,
            totalRecords: this.totalRecords
        };
    }

    empty(): boolean {
        return this.getPageCount() === 0;
    }

    currentPage(): number {
        return this.getPageCount() > 0 ? this.getPage() + 1 : 0;
    }

    get currentPageReport(): string {
        return this.currentPageReportTemplate
            .replace('{currentPage}', String(this.currentPage()))
            .replace('{totalPages}', String(this.getPageCount()))
            .replace('{first}', String(this.totalRecords > 0 ? this.first + 1 : 0))
            .replace('{last}', String(Math.min(this.first + this.rows, this.totalRecords)))
            .replace('{rows}', String(this.rows))
            .replace('{totalRecords}', String(this.totalRecords));
    }
}

@NgModule({
    imports: [Paginator, SharedModule],
    exports: [Paginator, SharedModule]
})
export class PaginatorModule {}
