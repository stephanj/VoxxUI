import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
    model,
    NgModule,
    numberAttribute,
    output,
    TemplateRef,
    untracked,
    viewChild,
    ViewEncapsulation
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { findIndexInList, setAttribute, uuid } from '@primeuix/utils';
import { FilterService, PrimeTemplate, SharedModule } from 'voxx-ui/api';
import { BaseComponent, PARENT_INSTANCE } from 'voxx-ui/basecomponent';
import { Bind } from 'voxx-ui/bind';
import { ButtonModule, ButtonProps } from 'voxx-ui/button';
import { AngleDoubleDownIcon, AngleDoubleUpIcon, AngleDownIcon, AngleUpIcon } from 'voxx-ui/icons';
import { Listbox, ListboxChangeEvent } from 'voxx-ui/listbox';
import { Ripple } from 'voxx-ui/ripple';
import { Nullable } from 'voxx-ui/ts-helpers';
import { OrderListFilterEvent, OrderListFilterOptions, OrderListFilterTemplateContext, OrderListItemTemplateContext, OrderListPassThrough, OrderListSelectionChangeEvent } from 'voxx-ui/types/orderlist';
import { OrderListStyle } from './style/orderliststyle';

const ORDERLIST_INSTANCE = new InjectionToken<OrderList>('ORDERLIST_INSTANCE');

/**
 * OrderList is used to manage the order of a collection.
 * @group Components
 */
@Component({
    selector: 'vx-orderList, vx-orderlist, vx-order-list',
    imports: [CommonModule, ButtonModule, Ripple, DragDropModule, AngleDoubleDownIcon, AngleDoubleUpIcon, AngleUpIcon, AngleDownIcon, Listbox, FormsModule, SharedModule, Bind],
    template: `
        <div [vxBind]="ptm('controls')" [class]="cx('controls')">
            <button [pt]="ptm('pcMoveUpButton')" type="button" [disabled]="moveDisabled()" vxButton vxRipple (click)="moveUp()" [attr.aria-label]="moveUpAriaLabel" [buttonProps]="getButtonProps('up')" hostName="orderlist" [unstyled]="unstyled()">
                @if (!moveUpIconTemplate() && !_moveUpIconTemplate()) {
                    <svg data-p-icon="angle-up" vxButtonIcon [pt]="ptm('pcMoveUpButton')['icon']" />
                }
                <ng-template *ngTemplateOutlet="moveUpIconTemplate() || _moveUpIconTemplate()"></ng-template>
            </button>
            <button [pt]="ptm('pcMoveTopButton')" type="button" [disabled]="moveDisabled()" vxButton vxRipple (click)="moveTop()" [attr.aria-label]="moveTopAriaLabel" [buttonProps]="getButtonProps('top')" hostName="orderlist" [unstyled]="unstyled()">
                @if (!moveTopIconTemplate() && !_moveTopIconTemplate()) {
                    <svg data-p-icon="angle-double-up" vxButtonIcon [pt]="ptm('pcMoveTopButton')['icon']" />
                }
                <ng-template *ngTemplateOutlet="moveTopIconTemplate() || _moveTopIconTemplate()"></ng-template>
            </button>
            <button
                [pt]="ptm('pcMoveDownButton')"
                type="button"
                [disabled]="moveDisabled()"
                vxButton
                vxRipple
                (click)="moveDown()"
                [attr.aria-label]="moveDownAriaLabel"
                [buttonProps]="getButtonProps('down')"
                hostName="orderlist"
                [unstyled]="unstyled()"
            >
                @if (!moveDownIconTemplate() && !_moveDownIconTemplate()) {
                    <svg data-p-icon="angle-down" vxButtonIcon [pt]="ptm('pcMoveDownButton')['icon']" />
                }
                <ng-template *ngTemplateOutlet="moveDownIconTemplate() || _moveDownIconTemplate()"></ng-template>
            </button>
            <button
                [pt]="ptm('pcMoveBottomButton')"
                type="button"
                [disabled]="moveDisabled()"
                vxButton
                vxRipple
                (click)="moveBottom()"
                [attr.aria-label]="moveBottomAriaLabel"
                [buttonProps]="getButtonProps('bottom')"
                hostName="orderlist"
                [unstyled]="unstyled()"
            >
                @if (!moveBottomIconTemplate() && !_moveBottomIconTemplate()) {
                    <svg data-p-icon="angle-double-down" vxButtonIcon [pt]="ptm('pcMoveBottomButton')['icon']" />
                }
                <ng-template *ngTemplateOutlet="moveBottomIconTemplate() || _moveBottomIconTemplate()"></ng-template>
            </button>
        </div>
        <vx-listbox
            [pt]="ptm('pcListbox')"
            #listelement
            [multiple]="true"
            [options]="value()"
            [(ngModel)]="selection"
            [optionLabel]="dataKey() ?? 'name'"
            [id]="id + '_list'"
            [listStyle]="listStyle()"
            [striped]="stripedRows()"
            [tabindex]="tabindex()"
            (onFocus)="onListFocus($event)"
            (onBlur)="onListBlur($event)"
            (onChange)="onChangeSelection($event)"
            [ariaLabel]="ariaLabel()"
            [disabled]="disabled()"
            [metaKeySelection]="metaKeySelection()"
            [scrollHeight]="scrollHeight()"
            [autoOptionFocus]="autoOptionFocus()"
            [filter]="filterBy()"
            [filterBy]="filterBy()"
            [filterLocale]="filterLocale()"
            [filterPlaceHolder]="filterPlaceholder()"
            [dragdrop]="dragdrop()"
            (onDrop)="onDrop($event)"
            hostName="orderlist"
            [unstyled]="unstyled()"
        >
            @if (headerTemplate() || _headerTemplate()) {
                <ng-template #header>
                    <ng-template *ngTemplateOutlet="headerTemplate() || _headerTemplate()"></ng-template>
                </ng-template>
            }
            @if (itemTemplate() || _itemTemplate()) {
                <ng-template #item let-option let-selected="selected" let-index="index">
                    <ng-template *ngTemplateOutlet="itemTemplate() || _itemTemplate(); context: { $implicit: option, selected: selected, index: index }"></ng-template>
                </ng-template>
            }
            @if (emptyMessageTemplate() || _emptyMessageTemplate()) {
                <ng-template #empty>
                    <ng-template *ngTemplateOutlet="emptyMessageTemplate() || _emptyMessageTemplate()"></ng-template>
                </ng-template>
            }
            @if (emptyFilterMessageTemplate() || _emptyFilterMessageTemplate()) {
                <ng-template #emptyfilter>
                    <ng-template *ngTemplateOutlet="emptyFilterMessageTemplate() || _emptyFilterMessageTemplate()"></ng-template>
                </ng-template>
            }
            @if (filterIconTemplate() || _filterIconTemplate()) {
                <ng-template #filtericon>
                    <ng-template *ngTemplateOutlet="filterIconTemplate() || _filterIconTemplate()"></ng-template>
                </ng-template>
            }
            @if (filterTemplate() || _filterTemplate()) {
                <ng-template #filter let-options="options">
                    <ng-template *ngTemplateOutlet="filterTemplate() || _filterTemplate(); context: { options: options }"></ng-template>
                </ng-template>
            }
        </vx-listbox>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [OrderListStyle, { provide: ORDERLIST_INSTANCE, useExisting: OrderList }, { provide: PARENT_INSTANCE, useExisting: OrderList }],
    host: {
        '[class]': "cn(cx('root'), styleClass())"
    },
    hostDirectives: [Bind]
})
export class OrderList extends BaseComponent<OrderListPassThrough> {
    componentName = 'OrderList';

    bindDirectiveInstance = inject(Bind, { self: true });

    $pcOrderList: OrderList | undefined = inject(ORDERLIST_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }
    /**
     * Text for the caption.
     * @group Props
     */
    header = input<string | undefined>();

    /**
     * Style class of the component.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    styleClass = input<string | undefined>();

    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    tabindex = input(undefined, { transform: numberAttribute });

    /**
     * Defines a string that labels the input for accessibility.
     * @group Props
     */
    ariaLabel = input<string | undefined>();

    /**
     * Specifies one or more IDs in the DOM that labels the input field.
     * @group Props
     */
    ariaLabelledBy = input<string | undefined>();

    /**
     * Inline style of the list element.
     * @group Props
     */
    listStyle = input<{ [klass: string]: any } | null | undefined>();

    /**
     * A boolean value that indicates whether the component should be responsive.
     * @group Props
     */
    responsive = input(undefined, { transform: booleanAttribute });

    /**
     * When specified displays an input field to filter the items on keyup and decides which fields to search against.
     * @group Props
     */
    filterBy = input<string | undefined>();

    /**
     * Placeholder of the filter input.
     * @group Props
     */
    filterPlaceholder = input<string | undefined>();

    /**
     * Locale to use in filtering. The default locale is the host environment's current locale.
     * @group Props
     */
    filterLocale = input<string | undefined>();

    /**
     * When true metaKey needs to be pressed to select or unselect an item and when set to false selection of each item can be toggled individually. On touch enabled devices, metaKeySelection is turned off automatically.
     * @group Props
     */
    metaKeySelection = input(false, { transform: booleanAttribute });

    /**
     * Whether to enable dragdrop based reordering.
     * @group Props
     */
    dragdrop = input(false, { transform: booleanAttribute });

    /**
     * Defines the location of the buttons with respect to the list.
     * @group Props
     */
    controlsPosition = input<'left' | 'right'>('left');

    /**
     * Defines a string that labels the filter input.
     * @group Props
     */
    ariaFilterLabel = input<string | undefined>();

    /**
     * Defines how the items are filtered.
     * @group Props
     */
    filterMatchMode = input<'contains' | 'startsWith' | 'endsWith' | 'equals' | 'notEquals' | 'in' | 'lt' | 'lte' | 'gt' | 'gte'>('contains');

    /**
     * Indicates the width of the screen at which the component should change its behavior.
     * @group Props
     */
    breakpoint = input<string>('960px');

    /**
     * Whether to displays rows with alternating colors.
     * @group Props
     */
    stripedRows = input(undefined, { transform: booleanAttribute });

    /**
     * When present, it specifies that the component should be disabled.
     * @group Props
     */
    disabled = input(undefined, { transform: booleanAttribute });

    /**
     * Function to optimize the dom operations by delegating to ngForTrackBy, default algorithm checks for object identity.
     * @group Props
     */
    trackBy = input<Function>((index: number, item: any) => item);

    /**
     * Height of the viewport, a scrollbar is defined if height of list exceeds this value.
     * @group Props
     */
    scrollHeight = input<string>('14rem');

    /**
     * Whether to focus on the first visible or selected element.
     * @group Props
     */
    autoOptionFocus = input(true, { transform: booleanAttribute });
    /**
     * Name of the field that uniquely identifies the record in the data.
     * @group Props
     */
    dataKey = input<string | undefined>();
    /**
     * A list of values that are currently selected. Two-way bindable; `selectionChange` emits
     * whenever the selection is updated from within the component. Replaces the previous
     * `selection` getter/setter pair backed by `d_selection` (#18).
     * @group Props
     */
    selection = model<any[]>([]);

    /**
     * The `value` input. Writes through the input re-run the original setter side effects
     * (re-filter when a filter is active, seed `visibleOptions` for drag and drop) via the
     * `value` linkedSignal computation (#18).
     * @group Props
     */
    valueInput = input<any[] | undefined>(undefined, { alias: 'value' });

    /**
     * Array of values displayed in the component - component state seeded from the `value` input.
     *
     * Replaces the previous `value` getter/setter pair (backed by `_value`) with a callable
     * equivalent: `value()` returns the current list and a write to the `value` input re-runs
     * the original setter logic through the `linkedSignal` computation. Reordering updates the
     * list immutably via `value.set(...)` (#18); the array bound to the `value` input is no
     * longer mutated in place.
     */
    value = linkedSignal<any[] | undefined, any[] | undefined>({
        source: this.valueInput,
        computation: (val) => {
            untracked(() => {
                if (this.filterValue) {
                    this.filter(val);
                } else if (this.dragdrop()) {
                    // Initialize visibleOptions for drag&drop even when no filtering is active
                    this.visibleOptions = [...(val || [])];
                }
            });

            return val;
        }
    });

    /**
     * Used to pass all properties of the ButtonProps to the Button component.
     * @group Props
     */
    buttonProps = input<ButtonProps>({ severity: 'secondary' });

    /**
     * Used to pass all properties of the ButtonProps to the move up button inside the component.
     * @group Props
     */
    moveUpButtonProps = input<ButtonProps>();

    /**
     * Used to pass all properties of the ButtonProps to the move top button inside the component.
     * @group Props
     */
    moveTopButtonProps = input<ButtonProps>();

    /**
     * Used to pass all properties of the ButtonProps to the move down button inside the component.
     * @group Props
     */
    moveDownButtonProps = input<ButtonProps>();

    /**
     * Used to pass all properties of the ButtonProps to the move bottom button inside the component.
     * @group Props
     */
    moveBottomButtonProps = input<ButtonProps>();

    /**
     * Callback to invoke when list is reordered.
     * @param {*} any - list instance.
     * @group Emits
     */
    onReorder = output<any>();

    /**
     * Callback to invoke when selection changes.
     * @param {OrderListSelectionChangeEvent} event - Custom change event.
     * @group Emits
     */
    onSelectionChange = output<OrderListSelectionChangeEvent>();

    /**
     * Callback to invoke when filtering occurs.
     * @param {OrderListFilterEvent} event - Custom filter event.
     * @group Emits
     */
    onFilterEvent = output<OrderListFilterEvent>();

    /**
     * Callback to invoke when the list is focused
     * @param {Event} event - Browser event.
     * @group Emits
     */
    onFocus = output<Event>();

    /**
     * Callback to invoke when the list is blurred
     * @param {Event} event - Browser event.
     * @group Emits
     */
    onBlur = output<Event>();

    listViewChild = viewChild<Listbox>('listelement');

    filterViewChild = viewChild<ElementRef>('filter');

    /**
     * Custom item template.
     * @param {OrderListItemTemplateContext} context - item context.
     * @see {@link OrderListItemTemplateContext}
     * @group Templates
     */
    itemTemplate = contentChild<TemplateRef<OrderListItemTemplateContext>>('item', { descendants: false });

    /**
     * Custom empty template.
     * @group Templates
     */
    emptyMessageTemplate = contentChild<TemplateRef<void>>('empty', { descendants: false });

    /**
     * Custom empty filter template.
     * @group Templates
     */
    emptyFilterMessageTemplate = contentChild<TemplateRef<void>>('emptyfilter', { descendants: false });

    /**
     * Custom filter template.
     * @param {OrderListFilterTemplateContext} context - filter context.
     * @see {@link OrderListFilterTemplateContext}
     * @group Templates
     */
    filterTemplate = contentChild<TemplateRef<OrderListFilterTemplateContext>>('filter', { descendants: false });

    /**
     * Custom header template.
     * @group Templates
     */
    headerTemplate = contentChild<TemplateRef<void>>('header', { descendants: false });

    /**
     * Custom move up icon template.
     * @group Templates
     */
    moveUpIconTemplate = contentChild<TemplateRef<void>>('moveupicon', { descendants: false });

    /**
     * Custom move top icon template.
     * @group Templates
     */
    moveTopIconTemplate = contentChild<TemplateRef<void>>('movetopicon', { descendants: false });

    /**
     * Custom move down icon template.
     * @group Templates
     */
    moveDownIconTemplate = contentChild<TemplateRef<void>>('movedownicon', { descendants: false });

    /**
     * Custom move bottom icon template.
     * @group Templates
     */
    moveBottomIconTemplate = contentChild<TemplateRef<void>>('movebottomicon', { descendants: false });

    /**
     * Custom filter icon template.
     * @group Templates
     */
    filterIconTemplate = contentChild<TemplateRef<void>>('filtericon', { descendants: false });

    get moveUpAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria.moveUp : undefined;
    }

    get moveTopAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria.moveTop : undefined;
    }

    get moveDownAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria.moveDown : undefined;
    }

    get moveBottomAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria.moveBottom : undefined;
    }

    _componentStyle = inject(OrderListStyle);

    filterOptions: Nullable<OrderListFilterOptions>;

    movedUp: Nullable<boolean>;

    movedDown: Nullable<boolean>;

    itemTouched: Nullable<boolean>;

    styleElement: any;

    id: string = uuid('pn_id_');

    public filterValue: Nullable<string>;

    public visibleOptions: Nullable<any[]>;

    filterService = inject(FilterService);

    getButtonProps(direction: string) {
        switch (direction) {
            case 'up':
                return { ...this.buttonProps(), ...this.moveUpButtonProps() };
            case 'top':
                return { ...this.buttonProps(), ...this.moveTopButtonProps() };
            case 'down':
                return { ...this.buttonProps(), ...this.moveDownButtonProps() };
            case 'bottom':
                return { ...this.buttonProps(), ...this.moveBottomButtonProps() };
            default:
                return this.buttonProps();
        }
    }

    onInit() {
        if (this.responsive()) {
            this.createStyle();
        }

        if (this.filterBy()) {
            this.filterOptions = {
                filter: (value) => this.onFilterKeyup(value),
                reset: () => this.resetFilter()
            };
        }

        // Initialize visibleOptions for drag&drop if enabled and value exists
        if (this.dragdrop() && this.value() && !this.visibleOptions) {
            this.visibleOptions = [...this.value()!];
        }
    }

    templates = contentChildren(PrimeTemplate);

    /**
     * Resolves the `vxTemplate`-declared templates by type (#18). The default branch mirrors the
     * legacy `ngAfterContentInit` loop: an unknown type is treated as the item template, and the
     * last matching template wins.
     */
    private _templateMap = computed(() => {
        const map = new Map<string, TemplateRef<any> | undefined>();

        this.templates().forEach((item) => {
            switch (item.getType()) {
                case 'empty':
                case 'emptyfilter':
                case 'filter':
                case 'header':
                case 'moveupicon':
                case 'movetopicon':
                case 'movedownicon':
                case 'movebottomicon':
                case 'filtericon':
                    map.set(item.getType(), item.template);
                    break;

                case 'item':
                default:
                    map.set('item', item.template);
                    break;
            }
        });

        return map;
    });

    _itemTemplate = computed(() => this._templateMap().get('item') as TemplateRef<OrderListItemTemplateContext> | undefined);

    _emptyMessageTemplate = computed(() => this._templateMap().get('empty') as TemplateRef<void> | undefined);

    _emptyFilterMessageTemplate = computed(() => this._templateMap().get('emptyfilter') as TemplateRef<void> | undefined);

    _filterTemplate = computed(() => this._templateMap().get('filter') as TemplateRef<OrderListFilterTemplateContext> | undefined);

    _headerTemplate = computed(() => this._templateMap().get('header') as TemplateRef<void> | undefined);

    _moveUpIconTemplate = computed(() => this._templateMap().get('moveupicon') as TemplateRef<void> | undefined);

    _moveTopIconTemplate = computed(() => this._templateMap().get('movetopicon') as TemplateRef<void> | undefined);

    _moveDownIconTemplate = computed(() => this._templateMap().get('movedownicon') as TemplateRef<void> | undefined);

    _moveBottomIconTemplate = computed(() => this._templateMap().get('movebottomicon') as TemplateRef<void> | undefined);

    _filterIconTemplate = computed(() => this._templateMap().get('filtericon') as TemplateRef<void> | undefined);

    onChangeSelection(e: ListboxChangeEvent) {
        //binding - the model write emits selectionChange
        this.selection.set(e.value);

        //event
        this.onSelectionChange.emit({ originalEvent: e.originalEvent, value: e.value });
    }

    onFilterKeyup(event: KeyboardEvent) {
        this.filterValue = ((<HTMLInputElement>event.target).value.trim() as any).toLocaleLowerCase(this.filterLocale());
        this.filter();

        this.onFilterEvent.emit({
            originalEvent: event,
            value: this.visibleOptions as any[]
        });
    }

    filter(source: any[] | undefined = this.value()) {
        let searchFields: string[] = (this.filterBy() as string).split(',');
        this.visibleOptions = this.filterService.filter(source as any[], searchFields, this.filterValue, this.filterMatchMode(), this.filterLocale());
    }

    /**
     * Callback to invoke on filter reset.
     * @group Method
     */
    public resetFilter() {
        this.filterValue = '';
        const filterViewChild = this.filterViewChild();
        filterViewChild && ((<HTMLInputElement>filterViewChild.nativeElement).value = '');
    }

    isItemVisible(item: any): boolean | undefined {
        if (this.filterValue && this.filterValue.trim().length) {
            for (let i = 0; i < (this.visibleOptions as any[]).length; i++) {
                if (item == (this.visibleOptions as any[])[i]) {
                    return true;
                }
            }
        } else {
            return true;
        }
    }

    isSelected(item: any) {
        return findIndexInList(item, this.selection()) !== -1;
    }

    isEmpty() {
        return this.filterValue ? !this.visibleOptions || this.visibleOptions.length === 0 : !this.value() || this.value()!.length === 0;
    }

    moveUp() {
        if (this.selection() && this.value() instanceof Array) {
            const value = [...this.value()!];
            // Sort selection by their current index to process them from top to bottom
            const sortedSelection = this.sortByIndexInList(this.selection(), value);

            for (let selectedItem of sortedSelection) {
                let selectedItemIndex: number = findIndexInList(selectedItem, value);
                // Only move if not at top and there's a valid position above
                if (selectedItemIndex > 0) {
                    let movedItem = value[selectedItemIndex];
                    let temp = value[selectedItemIndex - 1];
                    value[selectedItemIndex - 1] = movedItem;
                    value[selectedItemIndex] = temp;
                }
                // Don't break - continue with other items even if one can't move
            }

            this.value.set(value);

            if (this.dragdrop()) {
                if (this.filterValue) {
                    this.filter();
                } else if (this.visibleOptions) {
                    // Update visibleOptions to match value when no filtering
                    this.visibleOptions = [...value];
                }
            }

            this.movedUp = true;
            this.onReorder.emit(this.selection());
        }
        this.listViewChild()?.cd?.markForCheck();
    }

    moveTop() {
        if (this.selection()) {
            const value = [...(this.value() || [])];

            for (let i = this.selection().length - 1; i >= 0; i--) {
                let selectedItem = this.selection()[i];
                let selectedItemIndex: number = findIndexInList(selectedItem, value);

                if (selectedItemIndex != 0) {
                    let movedItem = value.splice(selectedItemIndex, 1)[0];
                    value.unshift(movedItem);
                } else {
                    break;
                }
            }

            this.value.set(value);

            if (this.dragdrop()) {
                if (this.filterValue) {
                    this.filter();
                } else if (this.visibleOptions) {
                    // Update visibleOptions to match value when no filtering
                    this.visibleOptions = [...value];
                }
            }

            this.onReorder.emit(this.selection());
            setTimeout(() => {
                this.listViewChild()?.scrollInView(0);
            });
        }
        this.listViewChild()?.cd?.markForCheck();
    }

    moveDown() {
        if (this.selection() && this.value() instanceof Array) {
            const value = [...this.value()!];
            const sortedSelection = this.sortByIndexInList(this.selection(), value).reverse();

            for (let selectedItem of sortedSelection) {
                let selectedItemIndex: number = findIndexInList(selectedItem, value);
                if (selectedItemIndex < value.length - 1) {
                    let movedItem = value[selectedItemIndex];
                    let temp = value[selectedItemIndex + 1];
                    value[selectedItemIndex + 1] = movedItem;
                    value[selectedItemIndex] = temp;
                }
            }

            this.value.set(value);

            if (this.dragdrop()) {
                if (this.filterValue) {
                    this.filter();
                } else if (this.visibleOptions) {
                    this.visibleOptions = [...value];
                }
            }

            this.movedDown = true;
            this.onReorder.emit(this.selection());
        }

        this.listViewChild()?.cd?.markForCheck();
    }

    moveBottom() {
        if (this.selection()) {
            const value = [...(this.value() || [])];

            for (let i = 0; i < this.selection().length; i++) {
                let selectedItem = this.selection()[i];
                let selectedItemIndex: number = findIndexInList(selectedItem, value);

                if (selectedItemIndex != value.length - 1) {
                    let movedItem = value.splice(selectedItemIndex, 1)[0];
                    value.push(movedItem);
                } else {
                    break;
                }
            }

            this.value.set(value);

            if (this.dragdrop()) {
                if (this.filterValue) {
                    this.filter();
                } else if (this.visibleOptions) {
                    this.visibleOptions = [...value];
                }
            }

            this.onReorder.emit(this.selection());
            this.listViewChild()?.scrollInView(value.length ? value.length - 1 : 0);
        }
        this.listViewChild()?.cd?.markForCheck();
    }

    onDrop(event: CdkDragDrop<string[]>) {
        let previousIndex = event.previousIndex;
        let currentIndex = event.currentIndex;

        // Store the original state before any modifications
        const originalValue = [...(this.value() || [])];
        const originalVisibleOptions = this.visibleOptions ? [...this.visibleOptions] : null;

        if (previousIndex !== currentIndex) {
            // Determine items to move
            let itemsToMove: any[] = [];

            // Check if dragged item is in selected items AND we have multiple selections
            if (this.selection() && this.selection().length > 1 && findIndexInList(event.item.data, this.selection()) !== -1) {
                // Multi-selection: Move all selected items
                itemsToMove = [...this.selection()];

                // For multi-selection, start from the original state to undo Listbox's automatic reordering
                const value = [...originalValue];
                if (originalVisibleOptions) {
                    this.visibleOptions = [...originalVisibleOptions];
                }

                // Sort items by their index in the array to maintain relative order
                itemsToMove = this.sortByIndexInList(itemsToMove, value);

                // Calculate how many selected items are before the drop position
                let itemsBefore = 0;
                for (const item of itemsToMove) {
                    const itemIndex = findIndexInList(item, value);
                    if (itemIndex !== -1 && itemIndex < currentIndex) {
                        itemsBefore++;
                    }
                }

                // Remove all selected items (in reverse order to avoid index shifting)
                for (let i = itemsToMove.length - 1; i >= 0; i--) {
                    const itemIndex = findIndexInList(itemsToMove[i], value);
                    if (itemIndex !== -1) {
                        value.splice(itemIndex, 1);
                    }
                }

                // Calculate the final target index
                // If we're dragging down, we need to subtract the number of items that were before the target
                const targetIndex = Math.max(0, currentIndex - itemsBefore);

                // Insert all selected items at the target position
                for (let i = 0; i < itemsToMove.length; i++) {
                    value.splice(targetIndex + i, 0, itemsToMove[i]);
                }

                this.value.set(value);

                // Update visibleOptions to match value
                if (this.dragdrop()) {
                    if (this.filterValue) {
                        this.filter();
                    } else if (this.visibleOptions) {
                        this.visibleOptions = [...value];
                    }
                }

                // Ensure change detection runs
                this.cd?.markForCheck();

                this.onReorder.emit(itemsToMove);
            } else {
                // Single item: Move only the dragged item
                itemsToMove = [event.item.data];

                const value = [...(this.value() || [])];

                if (this.filterValue) {
                    previousIndex = findIndexInList(event.item.data, value);
                    currentIndex = findIndexInList(this.visibleOptions?.[currentIndex], value);
                }

                moveItemInArray(value, previousIndex, currentIndex);
                this.value.set(value);

                // Sync visibleOptions for non-filtered case
                if (this.dragdrop() && this.visibleOptions && !this.filterValue) {
                    this.visibleOptions = [...value];
                }

                this.onReorder.emit([event.item.data]);
            }
        }
    }

    // Helper method to sort items by their index in a list
    private sortByIndexInList(items: any[], list: any[]): any[] {
        return items.sort((a, b) => {
            const indexA = findIndexInList(a, list);
            const indexB = findIndexInList(b, list);
            return indexA - indexB;
        });
    }

    onListFocus(event: any) {
        this.onFocus.emit(event);
    }

    onListBlur(event: any) {
        this.onBlur.emit(event);
    }

    getVisibleOptions() {
        return this.visibleOptions && this.visibleOptions.length > 0 ? this.visibleOptions : this.value() && this.value()!.length > 0 ? this.value() : null;
    }

    moveDisabled() {
        if (this.disabled() || !this.selection().length) {
            return true;
        }
    }

    createStyle() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.styleElement) {
                this.renderer.setAttribute(this.el.nativeElement.children[0], this.id, '');
                this.styleElement = this.renderer.createElement('style');
                this.renderer.setAttribute(this.styleElement, 'type', 'text/css');
                setAttribute(this.styleElement, 'nonce', this.config?.csp()?.nonce);
                this.renderer.appendChild(this.document.head, this.styleElement);

                let innerHTML = `
                    @media screen and (max-width: ${this.breakpoint()}) {
                        .p-orderlist[${this.$attrSelector}] {
                            flex-direction: column;
                        }

                        .p-orderlist[${this.$attrSelector}] .p-orderlist-controls {
                            padding: var(--content-padding);
                            flex-direction: row;
                        }

                        .p-orderlist[${this.$attrSelector}] .p-orderlist-controls .p-button {
                            margin-right: var(--inline-spacing);
                            margin-bottom: 0;
                        }

                        .p-orderlist[${this.$attrSelector}] .p-orderlist-controls .p-button:last-child {
                            margin-right: 0;
                        }
                    }
                `;
                this.renderer.setProperty(this.styleElement, 'innerHTML', innerHTML);
                setAttribute(this.styleElement, 'nonce', this.config?.csp()?.nonce);
            }
        }
    }

    destroyStyle() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.styleElement) {
                this.renderer.removeChild(this.document, this.styleElement);
                this.styleElement = null;
                ``;
            }
        }
    }

    onDestroy() {
        this.destroyStyle();
    }
}

@NgModule({
    imports: [OrderList, SharedModule],
    exports: [OrderList, SharedModule]
})
export class OrderListModule {}
