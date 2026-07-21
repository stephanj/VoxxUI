import { CDK_DRAG_CONFIG, CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
    DestroyRef,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    InjectionToken,
    NgModule,
    TemplateRef,
    ViewEncapsulation,
    booleanAttribute,
    computed,
    contentChild,
    contentChildren,
    effect,
    forwardRef,
    inject,
    input,
    linkedSignal,
    numberAttribute,
    output,
    signal,
    untracked,
    viewChild
} from '@angular/core';
import { Listbox as AriaListbox, Option as AriaOption } from '@angular/aria/listbox';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { deepEquals, equals, findLastIndex, findSingle, focus, getFirstFocusableElement, isEmpty, isFunction, isNotEmpty, isPrintableCharacter, resolveFieldData, uuid } from '@primeuix/utils';
import { FilterService, Footer, Header, PrimeTemplate, ScrollerOptions, SharedModule } from 'voxx-ui/api';
import { PARENT_INSTANCE } from 'voxx-ui/basecomponent';
import { BaseEditableHolder } from 'voxx-ui/baseeditableholder';
import { Bind, BindModule, withoutAriaOwnedAttrs } from 'voxx-ui/bind';
import { Checkbox } from 'voxx-ui/checkbox';
import { IconField } from 'voxx-ui/iconfield';
import { BlankIcon, CheckIcon, SearchIcon } from 'voxx-ui/icons';
import { InputIcon } from 'voxx-ui/inputicon';
import { InputText } from 'voxx-ui/inputtext';
import { Ripple } from 'voxx-ui/ripple';
import { Scroller, ScrollerLazyLoadEvent } from 'voxx-ui/scroller';
import {
    ListBoxPassThrough,
    ListboxChangeEvent,
    ListboxCheckIconTemplateContext,
    ListboxCheckmarkTemplateContext,
    ListboxClickEvent,
    ListboxDoubleClickEvent,
    ListboxFilterEvent,
    ListboxFilterOptions,
    ListboxFilterTemplateContext,
    ListboxFooterTemplateContext,
    ListboxGroupTemplateContext,
    ListboxHeaderTemplateContext,
    ListboxItemTemplateContext,
    ListboxLoaderTemplateContext,
    ListboxSelectAllChangeEvent
} from 'voxx-ui/types/listbox';
import { ListBoxStyle } from './style/listboxstyle';

const LISTBOX_INSTANCE = new InjectionToken<Listbox>('LISTBOX_INSTANCE');

export const LISTBOX_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Listbox),
    multi: true
};
/**
 * ListBox is used to select one or more values from a list of items.
 * @group Components
 */
@Component({
    selector: 'vx-listbox, vx-listBox, vx-list-box',
    imports: [CommonModule, Ripple, Scroller, InputIcon, SearchIcon, Checkbox, CheckIcon, IconField, InputText, BlankIcon, FormsModule, SharedModule, DragDropModule, BindModule, AriaListbox, AriaOption],
    template: `
        <span
            #firstHiddenFocusableElement
            role="presentation"
            class="p-hidden-accessible p-hidden-focusable"
            [tabindex]="useAria() ? -1 : !$disabled() ? tabindex() : -1"
            (focus)="onFirstHiddenFocus($event)"
            [attr.data-p-hidden-focusable]="true"
            [vxBind]="ptm('hiddenFirstFocusableElement')"
        >
        </span>
        @if (headerFacet() || headerTemplate() || _headerTemplate()) {
            <div [class]="cx('header')" [vxBind]="ptm('header')">
                <ng-content select="vx-header"></ng-content>
                <ng-container *ngTemplateOutlet="headerTemplate() || _headerTemplate(); context: { $implicit: modelValue(), options: visibleOptions() }"></ng-container>
            </div>
        }
        @if ((checkbox() && multiple() && showToggleAll()) || filter()) {
            <div [class]="cx('header')" [vxBind]="ptm('header')">
                @if (checkbox() && multiple() && showToggleAll()) {
                    <vx-checkbox
                        #headerchkbox
                        (onChange)="onToggleAll($event)"
                        [class]="cx('optionCheckIcon')"
                        [ngModel]="allSelected()"
                        [disabled]="$disabled()"
                        [tabindex]="-1"
                        [variant]="config.inputStyle() === 'filled' || config.inputVariant() === 'filled' ? 'filled' : 'outlined'"
                        [binary]="true"
                        [attr.aria-label]="toggleAllAriaLabel"
                        [pt]="ptm('pcCheckbox')"
                        [unstyled]="unstyled()"
                    >
                        @if (checkIconTemplate() || _checkIconTemplate()) {
                            <ng-template #icon>
                                <ng-template *ngTemplateOutlet="checkIconTemplate() || _checkIconTemplate(); context: { $implicit: allSelected() }"></ng-template>
                            </ng-template>
                        }
                    </vx-checkbox>
                }
                @if (filterTemplate() || _filterTemplate()) {
                    <ng-container *ngTemplateOutlet="filterTemplate() || _filterTemplate(); context: { options: filterOptions }"></ng-container>
                } @else {
                    @if (filter()) {
                        <vx-iconfield [pt]="ptm('pcFilterContainer')" hostName="listbox" [unstyled]="unstyled()">
                            <input
                                #filterInput
                                vxInputText
                                type="text"
                                [class]="cx('pcFilter')"
                                role="searchbox"
                                [value]="_filterValue() || ''"
                                [attr.disabled]="$disabled() ? '' : undefined"
                                [attr.aria-owns]="$id() + '_list'"
                                [attr.aria-activedescendant]="useAria() ? ariaListbox()?.activeDescendant() : focusedOptionId"
                                [attr.placeholder]="filterPlaceHolder()"
                                [attr.aria-label]="ariaFilterLabel()"
                                [attr.tabindex]="!$disabled() && !focused ? tabindex() : -1"
                                (input)="onFilterChange($event)"
                                (keydown)="onFilterKeyDown($event)"
                                (blur)="onFilterBlur($event)"
                                [pt]="ptm('pcFilter')"
                                [unstyled]="unstyled()"
                                hostName="listbox"
                            />
                            <vx-inputicon [pt]="ptm('pcFilterIconContainer')" [unstyled]="unstyled()">
                                @if (!filterIconTemplate() && !_filterIconTemplate()) {
                                    <svg data-p-icon="search" [attr.aria-hidden]="true" [vxBind]="ptm('filterIcon')" />
                                }
                                @if (filterIconTemplate() || _filterIconTemplate()) {
                                    <span [attr.aria-hidden]="true">
                                        <ng-template *ngTemplateOutlet="filterIconTemplate() || _filterIconTemplate()"></ng-template>
                                    </span>
                                }
                            </vx-inputicon>
                        </vx-iconfield>
                    }
                    <span role="status" [vxBind]="ptm('hiddenFilterResult')" [attr.aria-live]="'polite'" class="p-hidden-accessible" [attr.data-p-hidden-accessible]="true">
                        {{ filterResultMessageText }}
                    </span>
                }
            </div>
        }
        <div
            #container
            [class]="cn(cx('listContainer'), listStyleClass())"
            [style]="listStyle()"
            [style.max-height]="virtualScroll() ? 'auto' : scrollHeight() || 'auto'"
            cdkDropList
            [cdkDropListData]="cdkDropData()"
            (cdkDropListDropped)="drop($event)"
            (cdkDropListEntered)="onDragEntered()"
            (cdkDropListExited)="onDragExited()"
            [vxBind]="ptm('listContainer')"
        >
            @if (hasFilter() && isEmpty()) {
                <div [class]="cx('emptyMessage')" [vxBind]="ptm('emptyMessage')">
                    @if (!emptyFilterTemplate() && !_emptyFilterTemplate() && !_emptyTemplate() && !emptyTemplate()) {
                        {{ emptyFilterMessageText }}
                    } @else {
                        <ng-container #emptyFilter *ngTemplateOutlet="emptyFilterTemplate() || _emptyFilterTemplate() || _emptyTemplate() || emptyTemplate()"></ng-container>
                    }
                </div>
            } @else if (!hasFilter() && isEmpty()) {
                <div [class]="cx('emptyMessage')" [vxBind]="ptm('emptyMessage')">
                    @if (!emptyTemplate() && !_emptyTemplate()) {
                        {{ emptyMessage() }}
                    } @else {
                        <ng-container #empty *ngTemplateOutlet="emptyTemplate() || _emptyTemplate()"></ng-container>
                    }
                </div>
            } @else {
                @if (virtualScroll()) {
                    <vx-scroller
                        [pt]="ptm('virtualScroller')"
                        hostName="listbox"
                        #scroller
                        [items]="visibleOptions()"
                        [style]="{ height: scrollHeight() }"
                        [itemSize]="virtualScrollItemSize()"
                        [autoSize]="true"
                        [lazy]="lazy()"
                        [options]="virtualScrollOptions()"
                        (onLazyLoad)="onLazyLoad.emit($event)"
                        [tabindex]="scrollerTabIndex"
                    >
                        <ng-template #content let-items let-scrollerOptions="options">
                            <ng-container *ngTemplateOutlet="buildInItems; context: { $implicit: items, options: scrollerOptions }"></ng-container>
                        </ng-template>
                        @if (loaderTemplate() || _loaderTemplate()) {
                            <ng-template #loader let-scrollerOptions="options">
                                <ng-container *ngTemplateOutlet="loaderTemplate() || _loaderTemplate(); context: { options: scrollerOptions }"></ng-container>
                            </ng-template>
                        }
                    </vx-scroller>
                }
                @if (!virtualScroll()) {
                    @if (useAria()) {
                        <ng-container *ngTemplateOutlet="ariaItems; context: { $implicit: visibleOptions() }"></ng-container>
                    } @else {
                        <ng-container *ngTemplateOutlet="buildInItems; context: { $implicit: visibleOptions(), options: {} }"></ng-container>
                    }
                }

                <!--
                    @angular/aria listbox path (#27 pilot). Active only on the non-virtualScroll,
                    non-metaKeySelection path (see useAria()). The [ngListbox] primitive OWNS
                    role="listbox", tabindex, aria-activedescendant, aria-multiselectable,
                    aria-disabled, aria-readonly, aria-orientation and the keyboard/roving engine;
                    each [ngOption] OWNS role="option", aria-selected, aria-disabled and its id.
                    VoxxUI keeps: the selection MODEL (routed through the value-key adapter),
                    onChange/onClick/onDblClick events, filtering, live-region announcements,
                    focusOnHover and PT (via withoutAriaOwnedAttrs precedence).
                -->
                <ng-template #ariaItems let-items>
                    <ul
                        ngListbox
                        #ariaListEl="ngListbox"
                        [id]="$id() + '_list'"
                        [class]="cx('list')"
                        [multi]="!!multiple()"
                        focusMode="activedescendant"
                        selectionMode="explicit"
                        [wrap]="false"
                        [disabled]="!!$disabled()"
                        [readonly]="!!readonly()"
                        [tabindex]="!$disabled() ? tabindex() : -1"
                        [attr.aria-label]="ariaLabel()"
                        (focus)="onAriaFocus($event)"
                        (blur)="onAriaBlur($event)"
                        (keydown)="captureAriaEvent($event)"
                        (pointerdown)="captureAriaEvent($event)"
                        [vxBind]="ariaPt(ptm('list'))"
                    >
                        @for (option of items; track option; let i = $index) {
                            @if (isOptionGroup(option)) {
                                <li [attr.id]="$id() + '_' + getOptionIndex(i, {})" [class]="cx('optionGroup')" role="presentation" [vxBind]="ariaPt(getPTOptions(option.optionGroup, {}, i, 'optionGroup'))">
                                    @if (!groupTemplate() && !_groupTemplate()) {
                                        <span>{{ getOptionGroupLabel(option.optionGroup) }}</span>
                                    }
                                    <ng-container *ngTemplateOutlet="groupTemplate() || _groupTemplate(); context: { $implicit: option.optionGroup }"></ng-container>
                                </li>
                            }
                            @if (!isOptionGroup(option)) {
                                <li
                                    ngOption
                                    vxRipple
                                    [value]="optionKey(option)"
                                    [label]="getOptionLabel(option)"
                                    [disabled]="isOptionDisabled(option)"
                                    [id]="$id() + '_' + getOptionIndex(i, {})"
                                    [class]="cx('option', { option, i, scrollerOptions: {} })"
                                    [attr.aria-label]="getOptionLabel(option)"
                                    [attr.aria-setsize]="ariaSetSize"
                                    [attr.aria-posinset]="getAriaPosInset(getOptionIndex(i, {}))"
                                    [attr.data-p-selected]="isSelected(option)"
                                    [attr.data-p-focused]="focusedOptionIndex() === getOptionIndex(i, {})"
                                    [attr.data-p-disabled]="isOptionDisabled(option)"
                                    [vxBind]="ariaPt(getPTOptions(option, {}, i, 'option'))"
                                    (click)="onAriaOptionClick($event, option, getOptionIndex(i, {}))"
                                    (dblclick)="onOptionDoubleClick($event, option)"
                                    (mouseenter)="onAriaOptionMouseEnter(i)"
                                    (touchend)="onOptionTouchEnd()"
                                >
                                    @if (checkbox() && multiple()) {
                                        <vx-checkbox
                                            [class]="cx('optionCheckIcon')"
                                            [ngModel]="isSelected(option)"
                                            [readonly]="true"
                                            [disabled]="$disabled() || isOptionDisabled(option)"
                                            [tabindex]="-1"
                                            [variant]="config.inputStyle() === 'filled' || config.inputVariant() === 'filled' ? 'filled' : 'outlined'"
                                            [binary]="true"
                                            [pt]="ptm('pcCheckbox')"
                                            hostName="listbox"
                                            [unstyled]="unstyled()"
                                        >
                                            @if (checkIconTemplate() || _checkIconTemplate()) {
                                                <ng-template #icon>
                                                    <ng-template *ngTemplateOutlet="checkIconTemplate() || _checkIconTemplate(); context: { $implicit: isSelected(option) }"></ng-template>
                                                </ng-template>
                                            }
                                        </vx-checkbox>
                                    }
                                    @if (checkmark()) {
                                        @if (!checkmarkTemplate() && !_checkmarkTemplate()) {
                                            @if (!isSelected(option)) {
                                                <svg data-p-icon="blank" [class]="cx('optionBlankIcon')" [vxBind]="ptm('optionBlankIcon')" />
                                            }
                                            @if (isSelected(option)) {
                                                <svg data-p-icon="check" [class]="cx('optionCheckIcon')" [vxBind]="ptm('optionCheckIcon')" />
                                            }
                                        }
                                        <ng-container *ngTemplateOutlet="checkmarkTemplate() || _checkmarkTemplate(); context: { implicit: isSelected(option) }"></ng-container>
                                    }
                                    @if (!itemTemplate() && !_itemTemplate()) {
                                        <span>{{ getOptionLabel(option) }}</span>
                                    }
                                    <ng-container
                                        *ngTemplateOutlet="
                                            itemTemplate() || _itemTemplate();
                                            context: {
                                                $implicit: option,
                                                index: getOptionIndex(i, {}),
                                                selected: isSelected(option),
                                                disabled: isOptionDisabled(option)
                                            }
                                        "
                                    ></ng-container>
                                </li>
                            }
                        }
                    </ul>
                </ng-template>

                <ng-template #buildInItems let-items let-scrollerOptions="options">
                    <ul
                        #list
                        [id]="$id() + '_list'"
                        [class]="cn(cx('list'), scrollerOptions.contentStyleClass)"
                        role="listbox"
                        [tabindex]="-1"
                        [attr.aria-multiselectable]="true"
                        [style]="scrollerOptions.contentStyle"
                        [attr.aria-activedescendant]="focused ? focusedOptionId : undefined"
                        [attr.aria-label]="ariaLabel()"
                        [attr.aria-disabled]="$disabled()"
                        (focus)="onListFocus($event)"
                        (blur)="onListBlur($event)"
                        (keydown)="onListKeyDown($event)"
                        [vxBind]="ptm('list')"
                    >
                        @for (option of items; track option; let i = $index) {
                            @if (isOptionGroup(option)) {
                                <li
                                    [attr.id]="$id() + '_' + getOptionIndex(i, scrollerOptions)"
                                    [class]="cx('optionGroup')"
                                    [vxBind]="getPTOptions(option.optionGroup, scrollerOptions, i, 'optionGroup')"
                                    [style]="{ height: scrollerOptions.itemSize + 'px' }"
                                    role="option"
                                    cdkDrag
                                    [cdkDragData]="option"
                                    [cdkDragDisabled]="!dragdrop()"
                                    (cdkDragStarted)="isDragging.set(true)"
                                    (cdkDragEnded)="isDragging.set(false)"
                                >
                                    @if (!groupTemplate() && !_groupTemplate()) {
                                        <span>{{ getOptionGroupLabel(option.optionGroup) }}</span>
                                    }
                                    <ng-container *ngTemplateOutlet="groupTemplate() || _groupTemplate(); context: { $implicit: option.optionGroup }"></ng-container>
                                </li>
                            }
                            @if (!isOptionGroup(option)) {
                                <li
                                    vxRipple
                                    [class]="cx('option', { option, i, scrollerOptions })"
                                    role="option"
                                    [attr.id]="$id() + '_' + getOptionIndex(i, scrollerOptions)"
                                    [style]="{ height: scrollerOptions.itemSize + 'px' }"
                                    [attr.aria-label]="getOptionLabel(option)"
                                    [attr.aria-selected]="isSelected(option)"
                                    [attr.aria-disabled]="isOptionDisabled(option)"
                                    [attr.aria-setsize]="ariaSetSize"
                                    [attr.ariaPosInset]="getAriaPosInset(getOptionIndex(i, scrollerOptions))"
                                    [attr.data-p-selected]="isSelected(option)"
                                    [attr.data-p-focused]="focusedOptionIndex() === getOptionIndex(i, scrollerOptions)"
                                    [attr.data-p-disabled]="isOptionDisabled(option)"
                                    [vxBind]="getPTOptions(option, scrollerOptions, i, 'option')"
                                    (click)="onOptionSelect($event, option, getOptionIndex(i, scrollerOptions))"
                                    (dblclick)="onOptionDoubleClick($event, option)"
                                    (mousedown)="onOptionMouseDown($event, getOptionIndex(i, scrollerOptions))"
                                    (mouseenter)="onOptionMouseEnter($event, getOptionIndex(i, scrollerOptions))"
                                    (touchend)="onOptionTouchEnd()"
                                    cdkDrag
                                    [cdkDragData]="option"
                                    [cdkDragDisabled]="!dragdrop()"
                                    (cdkDragStarted)="isDragging.set(true)"
                                    (cdkDragEnded)="isDragging.set(false)"
                                >
                                    @if (checkbox() && multiple()) {
                                        <vx-checkbox
                                            [class]="cx('optionCheckIcon')"
                                            [ngModel]="isSelected(option)"
                                            [readonly]="true"
                                            [disabled]="$disabled() || isOptionDisabled(option)"
                                            [tabindex]="-1"
                                            [variant]="config.inputStyle() === 'filled' || config.inputVariant() === 'filled' ? 'filled' : 'outlined'"
                                            [binary]="true"
                                            [pt]="ptm('pcCheckbox')"
                                            hostName="listbox"
                                            [unstyled]="unstyled()"
                                        >
                                            @if (checkIconTemplate() || _checkIconTemplate()) {
                                                <ng-template #icon>
                                                    <ng-template *ngTemplateOutlet="checkIconTemplate() || _checkIconTemplate(); context: { $implicit: isSelected(option) }"></ng-template>
                                                </ng-template>
                                            }
                                        </vx-checkbox>
                                    }
                                    @if (checkmark()) {
                                        @if (!checkmarkTemplate() && !_checkmarkTemplate()) {
                                            @if (!isSelected(option)) {
                                                <svg data-p-icon="blank" [class]="cx('optionBlankIcon')" [vxBind]="ptm('optionBlankIcon')" />
                                            }
                                            @if (isSelected(option)) {
                                                <svg data-p-icon="check" [class]="cx('optionCheckIcon')" [vxBind]="ptm('optionCheckIcon')" />
                                            }
                                        }
                                        <ng-container *ngTemplateOutlet="checkmarkTemplate() || _checkmarkTemplate(); context: { implicit: isSelected(option) }"></ng-container>
                                    }
                                    @if (!itemTemplate() && !_itemTemplate()) {
                                        <span>{{ getOptionLabel(option) }}</span>
                                    }
                                    <ng-container
                                        *ngTemplateOutlet="
                                            itemTemplate() || _itemTemplate();
                                            context: {
                                                $implicit: option,
                                                index: getOptionIndex(i, scrollerOptions),
                                                selected: isSelected(option),
                                                disabled: isOptionDisabled(option)
                                            }
                                        "
                                    ></ng-container>
                                </li>
                            }
                        }
                    </ul>
                </ng-template>
            }
        </div>
        @if (footerFacet() || footerTemplate() || _footerTemplate()) {
            <div>
                <ng-content select="vx-footer"></ng-content>
                <ng-container *ngTemplateOutlet="footerTemplate() || _footerTemplate(); context: { $implicit: modelValue(), options: visibleOptions() }"></ng-container>
            </div>
        }
        @if (isEmpty()) {
            <span role="status" aria-live="polite" class="p-hidden-accessible" [vxBind]="ptm('hiddenEmptyMessage')">
                {{ emptyMessage() }}
            </span>
        }
        <span role="status" aria-live="polite" class="p-hidden-accessible" [vxBind]="ptm('hiddenSelectedMessage')">
            {{ selectedMessageText }}
        </span>
        <span
            #lastHiddenFocusableElement
            role="presentation"
            class="p-hidden-accessible p-hidden-focusable"
            [tabindex]="useAria() ? -1 : !$disabled() ? tabindex() : -1"
            (focus)="onLastHiddenFocus($event)"
            [attr.data-p-hidden-focusable]="true"
            [vxBind]="ptm('hiddenLastFocusableEl')"
        >
        </span>
    `,
    providers: [
        LISTBOX_VALUE_ACCESSOR,
        ListBoxStyle,
        {
            provide: CDK_DRAG_CONFIG,
            useValue: {
                zIndex: 1200
            }
        },
        { provide: LISTBOX_INSTANCE, useExisting: Listbox },
        { provide: PARENT_INSTANCE, useExisting: Listbox }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[attr.id]': '$id()',
        '[class]': "cn(cx('root'), styleClass())",
        '[attr.data-p]': 'containerDataP',
        '(focusout)': 'onHostFocusOut($event)'
    },
    hostDirectives: [Bind]
})
export class Listbox extends BaseEditableHolder<ListBoxPassThrough> {
    componentName = 'Listbox';

    hostName = input<any>('');

    bindDirectiveInstance = inject(Bind, { self: true });

    $pcListbox: Listbox | undefined = inject(LISTBOX_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }

    /**
     * Unique identifier of the component.
     * @group Props
     */
    id = input<string | undefined>();
    /**
     * Text to display when the search is active. Defaults to global value in i18n translation configuration.
     * @group Props
     * @defaultValue '{0} results are available'
     */
    searchMessage = input<string | undefined>();
    /**
     * Text to display when filtering does not return any results. Defaults to global value in i18n translation configuration.
     * @group Props
     * @defaultValue 'No selected item'
     */
    emptySelectionMessage = input<string | undefined>();
    /**
     * Text to be displayed in hidden accessible field when options are selected. Defaults to global value in i18n translation configuration.
     * @group Props
     * @defaultValue '{0} items selected'
     */
    selectionMessage = input<string | undefined>();
    /**
     * Whether to focus on the first visible or selected element when the overlay panel is shown.
     * @group Props
     */
    autoOptionFocus = input(true, { transform: booleanAttribute });
    /**
     * Defines a string that labels the input for accessibility.
     * @group Props
     */
    ariaLabel = input<string | undefined>();
    /**
     * When enabled, the focused option is selected.
     * @group Props
     */
    selectOnFocus = input(undefined, { transform: booleanAttribute });
    /**
     * Locale to use in searching. The default locale is the host environment's current locale.
     * @group Props
     */
    searchLocale = input(undefined, { transform: booleanAttribute });
    /**
     * When enabled, the hovered option will be focused.
     * @group Props
     */
    focusOnHover = input(true, { transform: booleanAttribute });
    /**
     * Text to display when filtering.
     * @group Props
     */
    filterMessage = input<string | undefined>();
    /**
     * Fields used when filtering the options, defaults to optionLabel.
     * @group Props
     */
    filterFields = input<any[] | undefined>();
    /**
     * Defines if data is loaded and interacted with in lazy manner.
     * @group Props
     */
    lazy = input(false, { transform: booleanAttribute });
    /**
     * Whether the data should be loaded on demand during scroll.
     * @group Props
     */
    virtualScroll = input(undefined, { transform: booleanAttribute });
    /**
     * Height of an item in the list for VirtualScrolling.
     * @group Props
     */
    virtualScrollItemSize = input(undefined, { transform: numberAttribute });
    /**
     * Whether to use the scroller feature. The properties of scroller component can be used like an object in it.
     * @group Props
     */
    virtualScrollOptions = input<ScrollerOptions | undefined>();
    /**
     * Height of the viewport in pixels, a scrollbar is defined if height of list exceeds this value.
     * @group Props
     */
    scrollHeight = input<string>('14rem');
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    tabindex = input(0, { transform: numberAttribute });
    /**
     * When specified, allows selecting multiple values.
     * @group Props
     */
    multiple = input(undefined, { transform: booleanAttribute });
    /**
     * Style class of the container.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    styleClass = input<string | undefined>();
    /**
     * Inline style of the list element.
     * @group Props
     */
    listStyle = input<{ [klass: string]: any } | null | undefined>();
    /**
     * Style class of the list element.
     * @group Props
     */
    listStyleClass = input<string | undefined>();
    /**
     * When present, it specifies that the element value cannot be changed.
     * @group Props
     */
    readonly = input(undefined, { transform: booleanAttribute });
    /**
     * When specified, allows selecting items with checkboxes.
     * @group Props
     */
    checkbox = input(false, { transform: booleanAttribute });
    /**
     * When specified, displays a filter input at header.
     * @group Props
     */
    filter = input(false, { transform: booleanAttribute });
    /**
     * When filtering is enabled, filterBy decides which field or fields (comma separated) to search against.
     * @group Props
     */
    filterBy = input<string | undefined>();
    /**
     * Defines how the items are filtered.
     * @group Props
     */
    filterMatchMode = input<'contains' | 'startsWith' | 'endsWith' | 'equals' | 'notEquals' | 'in' | 'lt' | 'lte' | 'gt' | 'gte' | string>('contains');
    /**
     * Locale to use in filtering. The default locale is the host environment's current locale.
     * @group Props
     */
    filterLocale = input<string | undefined>();
    /**
     * Defines how multiple items can be selected, when true metaKey needs to be pressed to select or unselect an item and when set to false selection of each item can be toggled individually. On touch enabled devices, metaKeySelection is turned off automatically.
     * @group Props
     */
    metaKeySelection = input(false, { transform: booleanAttribute });
    /**
     * A property to uniquely identify a value in options.
     * @group Props
     */
    dataKey = input<string | undefined>();
    /**
     * Whether header checkbox is shown in multiple mode.
     * @group Props
     */
    showToggleAll = input(true, { transform: booleanAttribute });
    /**
     * Name of the label field of an option.
     * @group Props
     */
    optionLabel = input<string | undefined>();
    /**
     * Name of the value field of an option.
     * @group Props
     */
    optionValue = input<string | undefined>();
    /**
     * Name of the options field of an option group.
     * @group Props
     */
    optionGroupChildren = input<string | undefined>('items');
    /**
     * Name of the label field of an option group.
     * @group Props
     */
    optionGroupLabel = input<string | undefined>('label');
    /**
     * Name of the disabled field of an option or function to determine disabled state.
     * @group Props
     */
    optionDisabled = input<string | ((item: any) => boolean) | undefined>();
    /**
     * Defines a string that labels the filter input.
     * @group Props
     */
    ariaFilterLabel = input<string | undefined>();
    /**
     * Defines placeholder of the filter input.
     * @group Props
     */
    filterPlaceHolder = input<string | undefined>();
    /**
     * Text to display when filtering does not return any results.
     * @group Props
     */
    emptyFilterMessage = input<string | undefined>();
    /**
     * Text to display when there is no data. Defaults to global value in i18n translation configuration.
     * @group Props
     */
    emptyMessage = input<string | undefined>();
    /**
     * Whether to display options as grouped when nested options are provided.
     * @group Props
     */
    group = input(undefined, { transform: booleanAttribute });
    /**
     * An array of selectitems to display as the available options.
     * @group Props
     */
    options = input<any[] | undefined>();
    /**
     * When specified, filter displays with this value.
     * @group Props
     */
    filterValue = input<string | undefined | null>();
    /**
     * Whether all data is selected.
     * @group Props
     */
    selectAll = input<boolean | undefined | null>(null);
    /**
     * Whether to displays rows with alternating colors.
     * @group Props
     * @defaultValue false
     */
    striped = input(false, { transform: booleanAttribute });
    /**
     * Whether the selected option will be add highlight class.
     * @group Props
     * @defaultValue true
     */
    highlightOnSelect = input(true, { transform: booleanAttribute });
    /**
     * Whether the selected option will be shown with a check mark.
     * @group Props
     * @defaultValue false
     */
    checkmark = input(false, { transform: booleanAttribute });
    /**
     * Whether to enable dragdrop based reordering.
     * @group Props
     */
    dragdrop = input(false, { transform: booleanAttribute });
    /**
     * Array to use for CDK drop list data binding. When not provided, uses options array.
     * @group Props
     */
    dropListData = input<any[] | undefined>();

    /**
     * Computed property for stable CDK drop list data reference
     */
    cdkDropData = computed(() => {
        return this.dropListData() || this._options();
    });
    /**
     * Spans 100% width of the container when enabled.
     * @defaultValue undefined
     * @group Props
     */
    fluid = input(undefined, { transform: booleanAttribute });
    /**
     * Callback to invoke on value change.
     * @param {ListboxChangeEvent} event - Custom change event.
     * @group Emits
     */
    onChange = output<ListboxChangeEvent>();
    /**
     * Callback to invoke when option is clicked.
     * @param {ListboxClickEvent} event - Custom click event.
     * @group Emits
     */
    onClick = output<ListboxClickEvent>();
    /**
     * Callback to invoke when option is double clicked.
     * @param {ListboxDoubleClickEvent} event - Custom double click event.
     * @group Emits
     */
    onDblClick = output<ListboxDoubleClickEvent>();
    /**
     * Callback to invoke when data is filtered.
     * @param {ListboxFilterEvent} event - Custom filter event.
     * @group Emits
     */
    onFilter = output<ListboxFilterEvent>();
    /**
     * Callback to invoke when component receives focus.
     * @param {FocusEvent} event - Focus event.
     * @group Emits
     */
    onFocus = output<FocusEvent>();
    /**
     * Callback to invoke when component loses focus.
     * @param {FocusEvent} event - Blur event.
     * @group Emits
     */
    onBlur = output<FocusEvent>();
    /**
     * Callback to invoke when all data is selected.
     * @param {ListboxSelectAllChangeEvent} event - Custom select event.
     * @group Emits
     */
    onSelectAllChange = output<ListboxSelectAllChangeEvent>();
    /**
     * Emits on lazy load.
     * @param {ScrollerLazyLoadEvent} event - Scroller lazy load event.
     * @group Emits
     */
    onLazyLoad = output<ScrollerLazyLoadEvent>();
    /**
     * Emits on item is dropped.
     * @param {CdkDragDrop<string[]>} event - Scroller lazy load event.
     * @group Emits
     */
    onDrop = output<CdkDragDrop<string[]>>();

    headerCheckboxViewChild = viewChild<any>('headerchkbox');

    filterViewChild = viewChild<ElementRef>('filter');

    lastHiddenFocusableElement = viewChild<ElementRef>('lastHiddenFocusableElement');

    firstHiddenFocusableElement = viewChild<ElementRef>('firstHiddenFocusableElement');

    scroller = viewChild<Scroller>('scroller');

    listViewChild = viewChild<ElementRef>('list');

    containerViewChild = viewChild<ElementRef>('container');

    headerFacet = contentChild(Header);

    footerFacet = contentChild(Footer);

    /**
     * Custom item template.
     * @param {ListboxItemTemplateContext} context - item context.
     * @see {@link ListboxItemTemplateContext}
     * @group Templates
     */
    itemTemplate = contentChild<TemplateRef<ListboxItemTemplateContext>>('item', { descendants: false });

    /**
     * Custom group template.
     * @param {ListboxGroupTemplateContext} context - group context.
     * @see {@link ListboxGroupTemplateContext}
     * @group Templates
     */
    groupTemplate = contentChild<TemplateRef<ListboxGroupTemplateContext>>('group', { descendants: false });

    /**
     * Custom header template.
     * @param {ListboxHeaderTemplateContext} context - header context.
     * @see {@link ListboxHeaderTemplateContext}
     * @group Templates
     */
    headerTemplate = contentChild<TemplateRef<ListboxHeaderTemplateContext>>('header', { descendants: false });

    /**
     * Custom filter template.
     * @param {ListboxFilterTemplateContext} context - filter context.
     * @see {@link ListboxFilterTemplateContext}
     * @group Templates
     */
    filterTemplate = contentChild<TemplateRef<ListboxFilterTemplateContext>>('filter', { descendants: false });

    /**
     * Custom footer template.
     * @param {ListboxFooterTemplateContext} context - footer context.
     * @see {@link ListboxFooterTemplateContext}
     * @group Templates
     */
    footerTemplate = contentChild<TemplateRef<ListboxFooterTemplateContext>>('footer', { descendants: false });

    /**
     * Custom empty filter message template.
     * @group Templates
     */
    emptyFilterTemplate = contentChild<TemplateRef<void>>('emptyfilter', { descendants: false });

    /**
     * Custom empty message template.
     * @group Templates
     */
    emptyTemplate = contentChild<TemplateRef<void>>('empty', { descendants: false });

    /**
     * Custom filter icon template.
     * @group Templates
     */
    filterIconTemplate = contentChild<TemplateRef<void>>('filtericon', { descendants: false });

    /**
     * Custom check icon template.
     * @param {ListboxCheckIconTemplateContext} context - check icon context.
     * @see {@link ListboxCheckIconTemplateContext}
     * @group Templates
     */
    checkIconTemplate = contentChild<TemplateRef<ListboxCheckIconTemplateContext>>('checkicon', { descendants: false });

    /**
     * Custom checkmark icon template.
     * @param {ListboxCheckmarkTemplateContext} context - checkmark context.
     * @see {@link ListboxCheckmarkTemplateContext}
     * @group Templates
     */
    checkmarkTemplate = contentChild<TemplateRef<ListboxCheckmarkTemplateContext>>('checkmark', { descendants: false });

    /**
     * Custom loader template.
     * @param {ListboxLoaderTemplateContext} context - loader context.
     * @see {@link ListboxLoaderTemplateContext}
     * @group Templates
     */
    loaderTemplate = contentChild<TemplateRef<ListboxLoaderTemplateContext>>('loader', { descendants: false });

    templates = contentChildren(PrimeTemplate);

    /**
     * Resolves the `pTemplate`-declared templates by type (#18). The default branch mirrors the
     * legacy `ngAfterContentInit` loop: an unknown type is treated as the item template, and the
     * last matching template wins.
     */
    private _templateMap = computed(() => {
        const map = new Map<string, TemplateRef<any> | undefined>();

        this.templates().forEach((item) => {
            switch (item.getType()) {
                case 'group':
                case 'header':
                case 'filter':
                case 'footer':
                case 'empty':
                case 'emptyfilter':
                case 'filtericon':
                case 'checkicon':
                case 'checkmark':
                case 'loader':
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

    _itemTemplate = computed(() => this._templateMap().get('item') as TemplateRef<ListboxItemTemplateContext> | undefined);

    _groupTemplate = computed(() => this._templateMap().get('group') as TemplateRef<ListboxGroupTemplateContext> | undefined);

    _headerTemplate = computed(() => this._templateMap().get('header') as TemplateRef<ListboxHeaderTemplateContext> | undefined);

    _filterTemplate = computed(() => this._templateMap().get('filter') as TemplateRef<ListboxFilterTemplateContext> | undefined);

    _footerTemplate = computed(() => this._templateMap().get('footer') as TemplateRef<ListboxFooterTemplateContext> | undefined);

    _emptyFilterTemplate = computed(() => this._templateMap().get('emptyfilter') as TemplateRef<void> | undefined);

    _emptyTemplate = computed(() => this._templateMap().get('empty') as TemplateRef<void> | undefined);

    _filterIconTemplate = computed(() => this._templateMap().get('filtericon') as TemplateRef<void> | undefined);

    _checkIconTemplate = computed(() => this._templateMap().get('checkicon') as TemplateRef<ListboxCheckIconTemplateContext> | undefined);

    _checkmarkTemplate = computed(() => this._templateMap().get('checkmark') as TemplateRef<ListboxCheckmarkTemplateContext> | undefined);

    _loaderTemplate = computed(() => this._templateMap().get('loader') as TemplateRef<ListboxLoaderTemplateContext> | undefined);

    /**
     * Filter display value; follows the `filterValue` input and is mutated when the user types in the filter input (#18).
     */
    public _filterValue = linkedSignal<string | null | undefined>(() => this.filterValue());

    public _filteredOptions: any[] | undefined | null;

    filterOptions: ListboxFilterOptions | undefined;

    public filtered: boolean | undefined | null;

    public value: any | undefined | null;

    public optionTouched: boolean | undefined | null;

    public focus: boolean | undefined | null;

    public headerCheckboxFocus: boolean | undefined | null;

    focused: boolean | undefined;

    scrollerTabIndex: number = 0;

    _componentStyle = inject(ListBoxStyle);

    /**
     * Effective identifier of the component: the `id` input when provided, a generated unique id otherwise.
     */
    $id = linkedSignal(() => this.id() ?? uuid('pn_id_'));

    get focusedOptionId() {
        return this.focusedOptionIndex() !== -1 ? `${this.$id()}_${this.focusedOptionIndex()}` : null;
    }

    get filterResultMessageText() {
        return isNotEmpty(this.visibleOptions()) ? this.filterMessageText.replaceAll('{0}', this.visibleOptions().length) : this.emptyFilterMessageText;
    }

    get filterMessageText() {
        return this.filterMessage() || this.config.translation.searchMessage || '';
    }

    get searchMessageText() {
        return this.searchMessage() || this.config.translation.searchMessage || '';
    }

    get emptyFilterMessageText() {
        return this.emptyFilterMessage() || this.config.translation.emptySearchMessage || this.config.translation.emptyFilterMessage || '';
    }

    get selectionMessageText() {
        return this.selectionMessage() || this.config.translation.selectionMessage || '';
    }

    get emptySelectionMessageText() {
        return this.emptySelectionMessage() || this.config.translation.emptySelectionMessage || '';
    }

    get selectedMessageText() {
        return this.hasSelectedOption() ? this.selectionMessageText.replaceAll('{0}', this.multiple() ? this.modelValue().length : '1') : this.emptySelectionMessageText;
    }

    get ariaSetSize() {
        return this.visibleOptions().filter((option) => !this.isOptionGroup(option)).length;
    }

    get virtualScrollerDisabled() {
        return !this.virtualScroll();
    }

    get searchFields() {
        return this.filterBy()?.split(',') || this.filterFields() || [this.optionLabel()];
    }

    get toggleAllAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria[this.allSelected() ? 'selectAll' : 'unselectAll'] : undefined;
    }

    searchValue: string | undefined;

    searchTimeout: any;

    /**
     * Select-all state; follows the `selectAll` input (#18).
     */
    _selectAll = linkedSignal(() => this.selectAll());

    /**
     * Normalized options; follows the `options` input while keeping the previous array reference
     * when the incoming value is deep-equal (mirrors the legacy setter guard), and is mutated
     * locally by drag and drop reordering (#18).
     */
    _options = linkedSignal<any[] | undefined, any[]>({
        source: this.options,
        computation: (options, previous) => (previous && deepEquals(previous.value, options) ? previous.value : options || [])
    });

    startRangeIndex = signal<number>(-1);

    focusedOptionIndex = signal<number>(-1);

    isDragging = signal<boolean>(false);

    // ─────────────────────────────────────────────────────────────────────────
    //  @angular/aria listbox pilot (#27)
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Whether the `@angular/aria` `[ngListbox]` keyboard/focus/roving engine drives
     * this instance. Enabled for the plain, non-virtualScroll path only.
     *
     * `virtualScroll` keeps the hand-rolled engine because the aria primitive's
     * DOM-based item registry (`SortedCollection`) only sees the windowed rows the
     * scroller renders, so full-dataset navigation/typeahead would break (#23 blocker).
     *
     * `metaKeySelection` keeps the hand-rolled engine because the aria selection
     * model has no ctrl/cmd-gated "meta" selection mode — it is a documented,
     * screen-reader-visible behavior the primitive cannot express.
     *
     * `selectOnFocus` keeps the hand-rolled engine because VoxxUI selects on plain
     * focus/hover in single mode, whereas aria's `follow` selection mode only selects
     * on arrow navigation (never on hover) and is all-or-nothing — the primitive can't
     * express VoxxUI's shim, so we keep the whole feature hand-rolled (mirrors the Tabs
     * `selectOnFocus` decision in #26).
     */
    useAria = computed(() => !this.virtualScroll() && !this.metaKeySelection() && !this.selectOnFocus());

    /** The in-template `[ngListbox]` primitive instance (present only on the aria path). */
    ariaListbox = viewChild(AriaListbox);

    /**
     * pt/aria precedence helper exposed to the template: strips aria-owned attrs
     * (`role`/`aria-*`/`tabindex`/`id`) from a pt bag so pt can never fight the
     * primitive's reactive host bindings on the managed `ul`/`li`. See
     * `voxx-ui/bind` aria-precedence.ts (#26/#28).
     */
    ariaPt(attrs: any): any {
        return withoutAriaOwnedAttrs(attrs);
    }

    /** Last pointer/keyboard event on the aria listbox, used to reconstruct the `onChange` payload. */
    private _lastAriaEvent: Event | null = null;

    /** Guards the aria→model effect from echoing a model→aria push back out. */
    private _ariaSyncGuard = false;

    /**
     * Stable identity key for aria value matching. The aria primitive matches option
     * values by `===` identity only; VoxxUI matches by `dataKey`/`optionValue`
     * object-equality. We therefore feed the primitive a primitive KEY (the `dataKey`
     * field when present, otherwise the resolved option value / the option itself) and
     * map keys back to real option values before touching the model.
     */
    valueKey(value: any): any {
        const dataKey = this.dataKey();
        return dataKey && value != null && typeof value === 'object' ? resolveFieldData(value, dataKey) : value;
    }

    /** aria `[value]` for an option = the key of its model value. */
    optionKey(option: any): any {
        return this.valueKey(this.getOptionValue(option));
    }

    /** modelValue → array of aria keys (single mode is wrapped as a 0/1-length array). */
    private ariaKeysFromModel(): any[] {
        const mv = this.modelValue();
        const arr = this.multiple() ? mv || [] : mv == null ? [] : [mv];
        return arr.map((v) => this.valueKey(v));
    }

    /** aria keys → model value (array for multiple, scalar/null for single). */
    private modelFromAriaKeys(keys: any[]): any {
        const map = new Map<any, any>();
        for (const option of this.visibleOptions()) {
            if (this.isValidOption(option)) {
                map.set(this.optionKey(option), this.getOptionValue(option));
            }
        }
        const values = (keys || []).map((k) => (map.has(k) ? map.get(k) : k));
        return this.multiple() ? values : values.length ? values[0] : null;
    }

    private static _sameKeys(a: any[], b: any[]): boolean {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (!b.includes(a[i])) return false;
        }
        return true;
    }

    /** Records the last raw interaction event so `onChange` can carry an `originalEvent`. */
    captureAriaEvent(event: Event) {
        this._lastAriaEvent = event;
    }

    /**
     * Click selection is VoxxUI-owned on the aria path (keyboard selection stays
     * aria-owned). The aria primitive's own container click→toggle is routed through a
     * navigate-then-select step whose selection only fires when the active item *moves*,
     * so a plain click on the already-active option is a silent no-op — which breaks
     * VoxxUI's "click always toggles" contract. We therefore `stopPropagation()` so the
     * primitive never runs its click selection, move its active descendant to the clicked
     * option (`gotoIndex`, keeping keyboard nav continuous), and toggle through VoxxUI's
     * existing `onOptionSelect` (metaKeySelection is gated to the legacy path, so this is
     * a deterministic plain toggle). The model→aria effect then mirrors the new selection
     * back into the primitive's value so Space/Enter afterwards stay consistent.
     */
    onAriaOptionClick(event: MouseEvent, option: any, index: number) {
        event.stopPropagation();
        this._lastAriaEvent = event;
        this.ariaListbox()?.gotoIndex(index);
        this.onOptionSelect(event, option, index);
        this._lastAriaEvent = null;
    }

    /** `focusOnHover` → move the aria active (focused) item to the hovered option. */
    onAriaOptionMouseEnter(index: number) {
        if (this.focusOnHover() && this.focused) {
            this.ariaListbox()?.gotoIndex(index);
        }
    }

    onAriaFocus(event: FocusEvent) {
        this.focused = true;
        this.onFocus.emit(event);
    }

    onAriaBlur(event: FocusEvent) {
        this.focused = false;
        this.searchValue = '';
        this.markTouched();
        this.onBlur.emit(event);
    }

    constructor(public filterService: FilterService) {
        super();

        // model → aria: mirror VoxxUI's modelValue into the primitive's key-based value.
        // Re-runs when options (re)register so a value set before registration still lands.
        effect(() => {
            const al = this.ariaListbox();
            if (!al) return;
            al._collection.orderedItems();
            const keys = this.ariaKeysFromModel();
            untracked(() => {
                if (!Listbox._sameKeys(al.value(), keys)) {
                    this._ariaSyncGuard = true;
                    al.value.set(keys);
                    this._ariaSyncGuard = false;
                }
            });
        });

        // aria → model: user interaction (click / Space / Enter / Ctrl+A / range) updates
        // the primitive value; route it back through the shared updateModel write path,
        // reconstructing the { originalEvent, value } payload from the captured event.
        //
        // Only GENUINE user interactions carry a captured pointer/keyboard event
        // (`_lastAriaEvent`). This gates out the primitive's own init-time value churn
        // (the empty [] it starts with, and its "drop values without a matching item"
        // pass), which would otherwise race the model→aria push above and wipe a
        // programmatically-set model before it lands.
        effect(() => {
            const al = this.ariaListbox();
            if (!al) return;
            const keys = al.value();
            untracked(() => {
                if (this._ariaSyncGuard) return;
                if (!this._lastAriaEvent) return;
                if (Listbox._sameKeys(keys, this.ariaKeysFromModel())) return;
                const value = this.modelFromAriaKeys(keys);
                this.updateModel(value, this._lastAriaEvent);
                this._lastAriaEvent = null;
            });
        });

        // Keep the focusedOptionIndex signal (PT `context.focused`, filter
        // aria-activedescendant, scroll-in-view) in sync with aria's active descendant.
        effect(() => {
            const al = this.ariaListbox();
            if (!al || !this.useAria()) return;
            const activeId = al.activeDescendant();
            untracked(() => {
                const prefix = `${this.$id()}_`;
                const idx = activeId && activeId.startsWith(prefix) ? parseInt(activeId.slice(prefix.length), 10) : -1;
                this.focusedOptionIndex.set(Number.isNaN(idx) ? -1 : idx);
            });
        });
    }

    onHostFocusOut(event: FocusEvent) {
        this.onFocusout(event);
    }

    visibleOptions = computed(() => {
        const options = this.group() ? this.flatOptions(this._options()) : this._options() || [];
        return this._filterValue() ? this.filterService.filter(options, this.searchFields, this._filterValue(), this.filterMatchMode(), this.filterLocale()) : options;
    });

    destroyRef = inject(DestroyRef);

    onInit() {
        this.config.translationObserver.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.cd.markForCheck();
        });

        this.autoUpdateModel();

        if (this.filterBy()) {
            this.filterOptions = {
                filter: (value) => this.onFilterChange(value),
                reset: () => this.resetFilter()
            };
        }
    }

    flatOptions(options) {
        return (options || []).reduce((result, option, index) => {
            result.push({ optionGroup: option, group: true, index });

            const optionGroupChildren = this.getOptionGroupChildren(option);

            optionGroupChildren && optionGroupChildren.forEach((o) => result.push(o));

            return result;
        }, []);
    }

    autoUpdateModel() {
        if (this.selectOnFocus() && this.autoOptionFocus() && !this.hasSelectedOption() && !this.multiple()) {
            const focusedOptionIndex = this.findFirstFocusedOptionIndex();
            this.focusedOptionIndex.set(focusedOptionIndex);
            this.onOptionSelect(null, this.visibleOptions()[this.focusedOptionIndex()]);
        }
    }
    /**
     * Updates the model value.
     * @group Method
     */
    public updateModel(value, event?) {
        this.value = value;
        this.writeModelValue(value);
        this.onModelChange(value);

        this.onChange.emit({ originalEvent: event, value: this.value });
    }

    removeOption(option) {
        return this.modelValue().filter((val) => !equals(val, this.getOptionValue(option), this.equalityKey() || ''));
    }

    onOptionSelect(event, option, index = -1) {
        if (this.$disabled() || this.isOptionDisabled(option) || this.readonly()) {
            return;
        }

        event && this.onClick.emit({ originalEvent: event, option, value: this.value });
        this.multiple() ? this.onOptionSelectMultiple(event, option) : this.onOptionSelectSingle(event, option);
        this.optionTouched = false;
        index !== -1 && this.focusedOptionIndex.set(index);
    }

    onOptionSelectMultiple(event, option) {
        let selected = this.isSelected(option);
        let value: any[] = [];
        let metaSelection = this.optionTouched ? false : this.metaKeySelection();

        if (metaSelection) {
            let metaKey = event.metaKey || event.ctrlKey;

            if (selected) {
                value = metaKey ? this.removeOption(option) : [this.getOptionValue(option)];
            } else {
                value = metaKey ? this.modelValue() || [] : [];
                value = [...(value || []), this.getOptionValue(option)];
            }
        } else {
            value = selected ? this.removeOption(option) : [...(this.modelValue() || []), this.getOptionValue(option)];
        }

        this.updateModel(value, event);
    }

    onOptionSelectSingle(event, option) {
        let selected = this.isSelected(option);
        let valueChanged = false;
        let value = null;
        let metaSelection = this.optionTouched ? false : this.metaKeySelection();

        if (metaSelection) {
            let metaKey = event.metaKey || event.ctrlKey;

            if (selected) {
                if (metaKey) {
                    value = null;
                    valueChanged = true;
                }
            } else {
                value = this.getOptionValue(option);
                valueChanged = true;
            }
        } else {
            value = selected ? null : this.getOptionValue(option);
            valueChanged = true;
        }

        if (valueChanged) {
            this.updateModel(value, event);
        }
    }

    onOptionSelectRange(event, start = -1, end = -1) {
        start === -1 && (start = this.findNearestSelectedOptionIndex(end, true));
        end === -1 && (end = this.findNearestSelectedOptionIndex(start));

        if (start !== -1 && end !== -1) {
            const rangeStart = Math.min(start, end);
            const rangeEnd = Math.max(start, end);
            const value = this.visibleOptions()
                .slice(rangeStart, rangeEnd + 1)
                .filter((option) => this.isValidOption(option))
                .map((option) => this.getOptionValue(option));

            this.updateModel(value, event);
        }
    }

    onToggleAll(event) {
        if (this.$disabled() || this.readonly()) {
            return;
        }
        focus(this.headerCheckboxViewChild()?.nativeElement);

        if (this._selectAll() !== null) {
            this.onSelectAllChange.emit({
                originalEvent: event,
                checked: !this.allSelected()
            });
        } else {
            const value = this.allSelected()
                ? []
                : this.visibleOptions()
                      .filter((option) => this.isValidOption(option))
                      .map((option) => this.getOptionValue(option));

            this.updateModel(value, event);
            this.onChange.emit({ originalEvent: event, value: this.value });
        }
    }

    allSelected() {
        return this._selectAll() !== null ? this._selectAll() : isNotEmpty(this.visibleOptions()) && this.visibleOptions().every((option) => this.isOptionGroup(option) || this.isOptionDisabled(option) || this.isSelected(option));
    }

    onOptionTouchEnd() {
        if (this.$disabled()) {
            return;
        }

        this.optionTouched = true;
    }

    onOptionMouseDown(event: MouseEvent, index: number) {
        this.changeFocusedOptionIndex(event, index);
    }

    onOptionMouseEnter(event: MouseEvent, index: number) {
        if (this.focusOnHover() && this.focused) {
            this.changeFocusedOptionIndex(event, index);
        }
    }

    onOptionDoubleClick(event: MouseEvent, option: any) {
        if (this.$disabled() || this.isOptionDisabled(option) || this.readonly()) {
            return;
        }

        this.onDblClick.emit({
            originalEvent: event,
            option: option,
            value: this.value
        });
    }

    onFirstHiddenFocus(event: FocusEvent) {
        focus(this.listViewChild()?.nativeElement);
        const firstFocusableEl = getFirstFocusableElement(this.el?.nativeElement, ':not([data-p-hidden-focusable="true"])');
        const lastHiddenFocusableElement = this.lastHiddenFocusableElement();
        const firstHiddenFocusableElement = this.firstHiddenFocusableElement();
        lastHiddenFocusableElement?.nativeElement && (lastHiddenFocusableElement.nativeElement.tabIndex = isEmpty(firstFocusableEl) ? -1 : undefined);
        firstHiddenFocusableElement?.nativeElement && (firstHiddenFocusableElement.nativeElement.tabIndex = -1);
    }

    onLastHiddenFocus(event: FocusEvent) {
        const relatedTarget = event.relatedTarget;

        if (relatedTarget === this.listViewChild()?.nativeElement) {
            const firstFocusableEl = <any>getFirstFocusableElement(this.el?.nativeElement, ':not([data-p-hidden-focusable="true"])');

            focus(firstFocusableEl);
            const firstHiddenFocusableElement = this.firstHiddenFocusableElement();
            firstHiddenFocusableElement?.nativeElement && (firstHiddenFocusableElement.nativeElement.tabIndex = undefined);
        } else {
            focus(this.firstHiddenFocusableElement()?.nativeElement);
        }
        const lastHiddenFocusableElement = this.lastHiddenFocusableElement();
        lastHiddenFocusableElement?.nativeElement && (lastHiddenFocusableElement.nativeElement.tabIndex = -1);
    }

    onFocusout(event: FocusEvent) {
        const firstHiddenFocusableElement = this.firstHiddenFocusableElement();
        const lastHiddenFocusableElement = this.lastHiddenFocusableElement();

        if (!this.el.nativeElement.contains(event.relatedTarget) && lastHiddenFocusableElement && firstHiddenFocusableElement) {
            firstHiddenFocusableElement.nativeElement.tabIndex = lastHiddenFocusableElement.nativeElement.tabIndex = undefined;
            this.scrollerTabIndex = 0;
        }
    }

    onListFocus(event: FocusEvent) {
        this.focused = true;
        const focusedOptionIndex = this.focusedOptionIndex() !== -1 ? this.focusedOptionIndex() : this.autoOptionFocus() ? this.findFirstFocusedOptionIndex() : this.findSelectedOptionIndex();
        this.focusedOptionIndex.set(focusedOptionIndex);
        this.scrollInView(focusedOptionIndex);
        this.onFocus.emit(event);

        this.scrollerTabIndex = -1;
    }

    onListBlur(event: FocusEvent) {
        this.focused = false;
        this.focusedOptionIndex.set(-1);
        this.startRangeIndex.set(-1);
        this.searchValue = '';
        this.onBlur.emit(event);
    }

    onHeaderCheckboxKeyDown(event) {
        if (this.$disabled()) {
            event.preventDefault();

            return;
        }

        switch (event.code) {
            case 'Space':
                this.onToggleAll(event);
                break;
            case 'Enter':
                this.onToggleAll(event);
                break;
            case 'Tab':
                this.onHeaderCheckboxTabKeyDown(event);
                break;
            default:
                break;
        }
    }

    onHeaderCheckboxTabKeyDown(event) {
        focus(this.listViewChild()?.nativeElement);
        event.preventDefault();
    }

    onFilterChange(event: Event) {
        let value: string = (event.target as HTMLInputElement).value?.trim();
        this._filterValue.set(value);
        this.focusedOptionIndex.set(-1);
        this.startRangeIndex.set(-1);
        this.onFilter.emit({ originalEvent: event, filter: this._filterValue() });

        !this.virtualScrollerDisabled && this.scroller()?.scrollToIndex(0);
    }

    onFilterBlur(event: FocusEvent) {
        this.focusedOptionIndex.set(-1);
        this.startRangeIndex.set(-1);
    }

    onListKeyDown(event: KeyboardEvent) {
        const metaKey = event.metaKey || event.ctrlKey;

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

            case 'PageDown':
                this.onPageDownKey(event);
                break;

            case 'PageUp':
                this.onPageUpKey(event);
                break;

            case 'Enter':
            case 'Space':
            case 'NumpadEnter':
                this.onSpaceKey(event);
                break;

            case 'Tab':
                //NOOP
                break;

            case 'ShiftLeft':
            case 'ShiftRight':
                this.onShiftKey();
                break;

            default:
                if (this.multiple() && event.code === 'KeyA' && metaKey) {
                    const value = this.visibleOptions()
                        .filter((option) => this.isValidOption(option))
                        .map((option) => this.getOptionValue(option));

                    this.updateModel(value, event);

                    event.preventDefault();
                    break;
                }

                if (!metaKey && isPrintableCharacter(event.key)) {
                    this.searchOptions(event, event.key);
                    event.preventDefault();
                }

                break;
        }
    }

    onFilterKeyDown(event: KeyboardEvent) {
        switch (event.code) {
            case 'ArrowDown':
                this.onArrowDownKey(event);
                break;

            case 'ArrowUp':
                this.onArrowUpKey(event);
                break;

            case 'ArrowLeft':
            case 'ArrowRight':
                this.onArrowLeftKey(event, true);
                break;

            case 'Home':
                this.onHomeKey(event, true);
                break;

            case 'End':
                this.onEndKey(event, true);
                break;

            case 'Enter':
                this.onEnterKey(event);
                break;

            case 'ShiftLeft':
            case 'ShiftRight':
                this.onShiftKey();
                break;

            default:
                break;
        }
    }

    onArrowDownKey(event: KeyboardEvent) {
        const optionIndex = this.focusedOptionIndex() !== -1 ? this.findNextOptionIndex(this.focusedOptionIndex()) : this.findFirstFocusedOptionIndex();

        if (this.multiple() && event.shiftKey) {
            this.onOptionSelectRange(event, this.startRangeIndex(), optionIndex);
        }

        this.changeFocusedOptionIndex(event, optionIndex);
        event.preventDefault();
    }

    onArrowUpKey(event: KeyboardEvent) {
        const optionIndex = this.focusedOptionIndex() !== -1 ? this.findPrevOptionIndex(this.focusedOptionIndex()) : this.findLastFocusedOptionIndex();

        if (this.multiple() && event.shiftKey) {
            this.onOptionSelectRange(event, optionIndex, this.startRangeIndex());
        }

        this.changeFocusedOptionIndex(event, optionIndex);
        event.preventDefault();
    }

    onArrowLeftKey(event: KeyboardEvent, pressedInInputText = false) {
        pressedInInputText && this.focusedOptionIndex.set(-1);
    }

    onHomeKey(event: KeyboardEvent, pressedInInputText: boolean = false) {
        if (pressedInInputText) {
            (event.currentTarget as HTMLInputElement).setSelectionRange(0, 0);
            this.focusedOptionIndex.set(-1);
        } else {
            let metaKey = event.metaKey || event.ctrlKey;
            let optionIndex = this.findFirstOptionIndex();

            if (this.multiple() && event.shiftKey && metaKey) {
                this.onOptionSelectRange(event, optionIndex, this.startRangeIndex());
            }

            this.changeFocusedOptionIndex(event, optionIndex);
        }

        event.preventDefault();
    }

    onEndKey(event: KeyboardEvent, pressedInInputText: boolean = false) {
        if (pressedInInputText) {
            const target = event.currentTarget as HTMLInputElement;
            const len = target.value.length;

            target.setSelectionRange(len, len);
            this.focusedOptionIndex.set(-1);
        } else {
            let metaKey = event.metaKey || event.ctrlKey;
            let optionIndex = this.findLastOptionIndex();

            if (this.multiple() && event.shiftKey && metaKey) {
                this.onOptionSelectRange(event, this.startRangeIndex(), optionIndex);
            }

            this.changeFocusedOptionIndex(event, optionIndex);
        }

        event.preventDefault();
    }

    onPageDownKey(event: KeyboardEvent) {
        this.scrollInView(0);
        event.preventDefault();
    }

    onPageUpKey(event: KeyboardEvent) {
        this.scrollInView(this.visibleOptions().length - 1);
        event.preventDefault();
    }

    onEnterKey(event) {
        if (this.focusedOptionIndex() !== -1) {
            if (this.multiple() && event.shiftKey) this.onOptionSelectRange(event, this.focusedOptionIndex());
            else this.onOptionSelect(event, this.visibleOptions()[this.focusedOptionIndex()]);
        }

        event.preventDefault();
    }

    onSpaceKey(event: KeyboardEvent) {
        this.onEnterKey(event);
    }

    onShiftKey() {
        const focusedOptionIndex = this.focusedOptionIndex();
        this.startRangeIndex.set(focusedOptionIndex);
    }

    getOptionGroupChildren(optionGroup) {
        return this.optionGroupChildren() ? resolveFieldData(optionGroup, this.optionGroupChildren()) : optionGroup.items;
    }

    getOptionGroupLabel(optionGroup: any) {
        return this.optionGroupLabel() ? resolveFieldData(optionGroup, this.optionGroupLabel()) : optionGroup && optionGroup.label !== undefined ? optionGroup.label : optionGroup;
    }

    getOptionLabel(option) {
        return this.optionLabel() ? resolveFieldData(option, this.optionLabel()) : option.label != undefined ? option.label : option;
    }

    getOptionIndex(index, scrollerOptions) {
        return this.virtualScrollerDisabled ? index : scrollerOptions && scrollerOptions.getItemOptions(index)['index'];
    }

    getOptionValue(option: any) {
        return this.optionValue() ? resolveFieldData(option, this.optionValue()) : !this.optionLabel() && option && option.value !== undefined ? option.value : option;
    }

    getAriaPosInset(index: number) {
        return (
            (this.optionGroupLabel()
                ? index -
                  this.visibleOptions()
                      .slice(0, index)
                      .filter((option) => this.isOptionGroup(option)).length
                : index) + 1
        );
    }

    getPTOptions(option: any, itemOptions: any, index: number, key: string) {
        return this.ptm(key, {
            context: {
                selected: this.isSelected(option),
                focused: this.focusedOptionIndex() === this.getOptionIndex(index, itemOptions),
                disabled: this.isOptionDisabled(option)
            }
        });
    }

    hasSelectedOption() {
        return isNotEmpty(this.modelValue());
    }

    isOptionGroup(option) {
        return this.optionGroupLabel() && option.optionGroup && option.group;
    }

    changeFocusedOptionIndex(event, index) {
        if (this.focusedOptionIndex() !== index) {
            this.focusedOptionIndex.set(index);
            this.scrollInView();

            if (this.selectOnFocus() && !this.multiple()) {
                this.onOptionSelect(event, this.visibleOptions()[index]);
            }
        }
    }

    searchOptions(event, char) {
        this.searchValue = (this.searchValue || '') + char;

        let optionIndex = -1;
        let matched = false;

        if (this.focusedOptionIndex() !== -1) {
            optionIndex = this.visibleOptions()
                .slice(this.focusedOptionIndex())
                .findIndex((option) => this.isOptionMatched(option));
            optionIndex =
                optionIndex === -1
                    ? this.visibleOptions()
                          .slice(0, this.focusedOptionIndex())
                          .findIndex((option) => this.isOptionMatched(option))
                    : optionIndex + this.focusedOptionIndex();
        } else {
            optionIndex = this.visibleOptions().findIndex((option) => this.isOptionMatched(option));
        }

        if (optionIndex !== -1) {
            matched = true;
        }

        if (optionIndex === -1 && this.focusedOptionIndex() === -1) {
            optionIndex = this.findFirstFocusedOptionIndex();
        }

        if (optionIndex !== -1) {
            this.changeFocusedOptionIndex(event, optionIndex);
        }

        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        this.searchTimeout = setTimeout(() => {
            this.searchValue = '';
            this.searchTimeout = null;
        }, 500);

        return matched;
    }

    isOptionMatched(option) {
        return this.isValidOption(option) && this.getOptionLabel(option)?.toLocaleLowerCase(this.filterLocale()).startsWith(this.searchValue?.toLocaleLowerCase(this.filterLocale()));
    }

    scrollInView(index = -1) {
        const id = index !== -1 ? `${this.$id()}_${index}` : this.focusedOptionId;
        const element = findSingle(this.listViewChild()?.nativeElement, `li[id="${id}"]`);

        if (element) {
            element.scrollIntoView && element.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        } else if (!this.virtualScrollerDisabled) {
            this.virtualScroll() && this.scroller()?.scrollToIndex(index !== -1 ? index : this.focusedOptionIndex());
        }
    }

    findFirstOptionIndex() {
        return this.visibleOptions().findIndex((option) => this.isValidOption(option));
    }

    findLastOptionIndex() {
        return findLastIndex(this.visibleOptions(), (option) => this.isValidOption(option));
    }

    findFirstFocusedOptionIndex() {
        const selectedIndex = this.findFirstSelectedOptionIndex();

        return selectedIndex < 0 ? this.findFirstOptionIndex() : selectedIndex;
    }

    findLastFocusedOptionIndex() {
        const selectedIndex = this.findLastSelectedOptionIndex();

        return selectedIndex < 0 ? this.findLastOptionIndex() : selectedIndex;
    }

    findLastSelectedOptionIndex() {
        return this.hasSelectedOption() ? findLastIndex(this.visibleOptions(), (option) => this.isValidSelectedOption(option)) : -1;
    }

    findNextOptionIndex(index) {
        const matchedOptionIndex =
            index < this.visibleOptions().length - 1
                ? this.visibleOptions()
                      .slice(index + 1)
                      .findIndex((option) => this.isValidOption(option))
                : -1;

        return matchedOptionIndex > -1 ? matchedOptionIndex + index + 1 : index;
    }

    findNextSelectedOptionIndex(index) {
        const matchedOptionIndex =
            this.hasSelectedOption() && index < this.visibleOptions().length - 1
                ? this.visibleOptions()
                      .slice(index + 1)
                      .findIndex((option) => this.isValidSelectedOption(option))
                : -1;

        return matchedOptionIndex > -1 ? matchedOptionIndex + index + 1 : -1;
    }

    findPrevSelectedOptionIndex(index) {
        const matchedOptionIndex = this.hasSelectedOption() && index > 0 ? findLastIndex(this.visibleOptions().slice(0, index), (option) => this.isValidSelectedOption(option)) : -1;

        return matchedOptionIndex > -1 ? matchedOptionIndex : -1;
    }

    findFirstSelectedOptionIndex() {
        return this.hasSelectedOption() ? this.visibleOptions().findIndex((option) => this.isValidSelectedOption(option)) : -1;
    }

    findPrevOptionIndex(index) {
        const matchedOptionIndex = index > 0 ? findLastIndex(this.visibleOptions().slice(0, index), (option) => this.isValidOption(option)) : -1;

        return matchedOptionIndex > -1 ? matchedOptionIndex : index;
    }

    findSelectedOptionIndex() {
        if (this.$filled()) {
            if (this.multiple()) {
                for (let index = this.modelValue().length - 1; index >= 0; index--) {
                    const value = this.modelValue()[index];
                    const matchedOptionIndex = this.visibleOptions().findIndex((option) => this.isValidSelectedOption(option) && this.isEquals(value, this.getOptionValue(option)));

                    if (matchedOptionIndex > -1) return matchedOptionIndex;
                }
            } else {
                return this.visibleOptions().findIndex((option) => this.isValidSelectedOption(option));
            }
        }

        return -1;
    }

    findNearestSelectedOptionIndex(index, firstCheckUp = false) {
        let matchedOptionIndex = -1;

        if (this.hasSelectedOption()) {
            if (firstCheckUp) {
                matchedOptionIndex = this.findPrevSelectedOptionIndex(index);
                matchedOptionIndex = matchedOptionIndex === -1 ? this.findNextSelectedOptionIndex(index) : matchedOptionIndex;
            } else {
                matchedOptionIndex = this.findNextSelectedOptionIndex(index);
                matchedOptionIndex = matchedOptionIndex === -1 ? this.findPrevSelectedOptionIndex(index) : matchedOptionIndex;
            }
        }

        return matchedOptionIndex > -1 ? matchedOptionIndex : index;
    }

    equalityKey() {
        return this.optionValue() ? null : this.dataKey();
    }

    isValidSelectedOption(option) {
        return this.isValidOption(option) && this.isSelected(option);
    }

    isOptionDisabled(option: any) {
        const optionDisabled = this.optionDisabled();

        if (isFunction(optionDisabled)) {
            return optionDisabled(option);
        }
        return optionDisabled ? resolveFieldData(option, optionDisabled) : false;
    }

    isEquals(value1, value2) {
        return equals(value1, value2, this.equalityKey() || '');
    }

    isSelected(option) {
        const optionValue = this.getOptionValue(option);

        if (this.multiple()) return (this.modelValue() || []).some((value) => this.isEquals(value, optionValue));
        else return this.isEquals(this.modelValue(), optionValue);
    }

    isValidOption(option) {
        return option && !(this.isOptionDisabled(option) || this.isOptionGroup(option));
    }

    isEmpty() {
        return !this._options()?.length || !this.visibleOptions()?.length;
    }

    hasFilter() {
        return this._filterValue() && (this._filterValue()?.trim().length || 0) > 0;
    }

    resetFilter() {
        const filterViewChild = this.filterViewChild();

        if (filterViewChild && filterViewChild.nativeElement) {
            filterViewChild.nativeElement.value = '';
        }

        this._filterValue.set(null);
    }

    onDragEntered() {
        this.isDragging.set(true);
        this.el.nativeElement.setAttribute('p-listbox-dragging', 'true');
    }

    onDragExited() {
        this.isDragging.set(false);
        this.el.nativeElement.setAttribute('p-listbox-dragging', 'false');
    }

    drop(event: CdkDragDrop<string[]>) {
        this.isDragging.set(false);
        if (event) {
            // If dragdrop is enabled and same container (reordering), automatically handle reordering
            if (this.dragdrop() && event.previousContainer === event.container) {
                const currentOptions = [...this._options()];
                moveItemInArray(currentOptions, event.previousIndex, event.currentIndex);
                this._options.set(currentOptions);
                this.changeFocusedOptionIndex(event, event.currentIndex);

                // Update model value if needed for selection preservation
                if (this.modelValue()) {
                    this.writeModelValue(this.modelValue());
                    this.onModelChange(this.modelValue());
                }

                // Mark for change detection
                this.cd.markForCheck();
            }

            // Always emit the event for custom handling
            this.onDrop.emit(event);
        }
    }

    get containerDataP() {
        return this.cn({
            invalid: this.invalid(),
            disabled: this.$disabled()
        });
    }

    /**
     * @override
     *
     * @see {@link BaseEditableHolder.writeControlValue}
     * Writes the value to the control.
     */
    writeControlValue(value: any, setModelValue: (value: any) => void): void {
        this.value = value;
        setModelValue(this.value);
        this.cd.markForCheck();
    }
}

@NgModule({
    imports: [Listbox, SharedModule],
    exports: [Listbox, SharedModule]
})
export class ListboxModule {}
