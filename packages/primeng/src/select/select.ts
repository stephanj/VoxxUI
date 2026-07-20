import { CommonModule } from '@angular/common';
import {
    AfterViewChecked,
    AfterViewInit,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild,
    contentChildren,
    effect,
    ElementRef,
    forwardRef,
    inject,
    InjectionToken,
    input,
    linkedSignal,
    NgModule,
    NgZone,
    numberAttribute,
    output,
    signal,
    TemplateRef,
    viewChild,
    ViewEncapsulation
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MotionOptions } from '@primeuix/motion';
import { deepEquals, equals, findLastIndex, findSingle, focus, getFirstFocusableElement, getFocusableElements, getLastFocusableElement, isEmpty, isNotEmpty, isPrintableCharacter, resolveFieldData, scrollInView, uuid } from '@primeuix/utils';
import { FilterService, OverlayOptions, PrimeTemplate, ScrollerOptions, SharedModule, TranslationKeys } from 'voxx-ui/api';
import { AutoFocus } from 'voxx-ui/autofocus';
import { BaseComponent, PARENT_INSTANCE } from 'voxx-ui/basecomponent';
import { BaseInput } from 'voxx-ui/baseinput';
import { Bind, BindModule } from 'voxx-ui/bind';
import { unblockBodyScroll } from 'voxx-ui/dom';
import { IconField } from 'voxx-ui/iconfield';
import { BlankIcon, CheckIcon, ChevronDownIcon, SearchIcon, TimesIcon } from 'voxx-ui/icons';
import { InputIcon } from 'voxx-ui/inputicon';
import { InputText } from 'voxx-ui/inputtext';
import { Overlay } from 'voxx-ui/overlay';
import { Ripple } from 'voxx-ui/ripple';
import { Scroller } from 'voxx-ui/scroller';
import { Tooltip } from 'voxx-ui/tooltip';
import { Nullable } from 'voxx-ui/ts-helpers';
import {
    SelectChangeEvent,
    SelectFilterEvent,
    SelectFilterOptions,
    SelectFilterTemplateContext,
    SelectGroupTemplateContext,
    SelectIconTemplateContext,
    SelectItemTemplateContext,
    SelectLazyLoadEvent,
    SelectLoaderTemplateContext,
    SelectPassThrough,
    SelectSelectedItemTemplateContext
} from 'voxx-ui/types/select';
import { SelectStyle } from './style/selectstyle';

const SELECT_INSTANCE = new InjectionToken<Select>('SELECT_INSTANCE');
const SELECT_ITEM_INSTANCE = new InjectionToken<SelectItem>('SELECT_ITEM_INSTANCE');

export const SELECT_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Select),
    multi: true
};

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'vx-selectItem',
    imports: [CommonModule, SharedModule, Ripple, CheckIcon, BlankIcon, BindModule],
    template: `
        <li
            [id]="id()"
            [vxBind]="getPTOptions()"
            (click)="onOptionClick($event)"
            (mouseenter)="onOptionMouseEnter($event)"
            role="option"
            vxRipple
            [attr.aria-label]="label()"
            [attr.aria-setsize]="ariaSetSize()"
            [attr.aria-posinset]="ariaPosInset()"
            [attr.aria-selected]="selected()"
            [attr.data-p-focused]="focused()"
            [attr.data-p-highlight]="selected()"
            [attr.data-p-selected]="selected()"
            [attr.data-p-disabled]="disabled()"
            [style]="{ height: scrollerOptions()?.itemSize + 'px' }"
            [class]="cx('option')"
        >
            @if (checkmark()) {
                @if (selected()) {
                    <svg data-p-icon="check" [class]="cx('optionCheckIcon')" [vxBind]="$pcSelect?.ptm('optionCheckIcon')" />
                }
                @if (!selected()) {
                    <svg data-p-icon="blank" [class]="cx('optionBlankIcon')" [vxBind]="$pcSelect?.ptm('optionBlankIcon')" />
                }
            }
            @if (!template()) {
                <span [vxBind]="$pcSelect?.ptm('optionLabel')">{{ label() ?? 'empty' }}</span>
            }
            <ng-container *ngTemplateOutlet="template(); context: { $implicit: option() }"></ng-container>
        </li>
    `,
    providers: [SelectStyle, { provide: PARENT_INSTANCE, useExisting: SelectItem }]
})
export class SelectItem extends BaseComponent {
    hostName = 'select';

    $pcSelectItem: SelectItem | undefined = inject(SELECT_ITEM_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    $pcSelect: Select | undefined = inject(SELECT_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    id = input<string | undefined>();

    option = input<any>();

    selected = input(undefined, { transform: booleanAttribute });

    focused = input(undefined, { transform: booleanAttribute });

    label = input<string | undefined>();

    disabled = input(undefined, { transform: booleanAttribute });

    visible = input(undefined, { transform: booleanAttribute });

    itemSize = input(undefined, { transform: numberAttribute });

    ariaPosInset = input<string | undefined>();

    ariaSetSize = input<string | undefined>();

    template = input<TemplateRef<any> | undefined>();

    checkmark = input(false, { transform: booleanAttribute });

    index = input<number | undefined>();

    scrollerOptions = input<any>();

    onClick = output<any>();

    onMouseEnter = output<any>();

    _componentStyle = inject(SelectStyle);

    onOptionClick(event: Event) {
        this.onClick.emit(event);
    }

    onOptionMouseEnter(event: Event) {
        this.onMouseEnter.emit(event);
    }

    getPTOptions() {
        return (
            this.$pcSelect?.getPTItemOptions?.(this.option(), this.scrollerOptions(), this.index() ?? 0, 'option') ??
            this.$pcSelect?.ptm('option', {
                context: {
                    option: this.option(),
                    selected: this.selected(),
                    focused: this.focused(),
                    disabled: this.disabled()
                }
            })
        );
    }
}

/**
 * Select is used to choose an item from a collection of options.
 * @group Components
 */

@Component({
    selector: 'vx-select',
    imports: [CommonModule, SelectItem, Overlay, Tooltip, AutoFocus, TimesIcon, ChevronDownIcon, SearchIcon, InputText, IconField, InputIcon, Scroller, SharedModule, BindModule],
    template: `
        @if (!editable()) {
            <span
                #focusInput
                [class]="cx('label')"
                [vxBind]="ptm('label')"
                [vxTooltip]="tooltip()"
                [vxTooltipUnstyled]="unstyled()"
                [tooltipPosition]="tooltipPosition()"
                [positionStyle]="tooltipPositionStyle()"
                [tooltipStyleClass]="tooltipStyleClass()"
                [attr.aria-disabled]="$disabled()"
                [attr.id]="inputId()"
                role="combobox"
                [attr.aria-label]="ariaLabel() || (label() === 'p-emptylabel' ? undefined : label())"
                [attr.aria-labelledby]="ariaLabelledBy()"
                [attr.aria-haspopup]="'listbox'"
                [attr.aria-expanded]="overlayVisible ?? false"
                [attr.aria-controls]="overlayVisible ? $id() + '_list' : null"
                [attr.tabindex]="!$disabled() ? tabindex() : -1"
                [vxAutoFocus]="autofocus()"
                [attr.aria-activedescendant]="focused ? focusedOptionId : undefined"
                (focus)="onInputFocus($event)"
                (blur)="onInputBlur($event)"
                (keydown)="onKeyDown($event)"
                [attr.aria-required]="required()"
                [attr.required]="required() ? '' : undefined"
                [attr.disabled]="$disabled() ? '' : undefined"
                [attr.data-p]="labelDataP"
            >
                @if (!selectedItemTemplate() && !_selectedItemTemplate()) {
                    {{ label() === 'p-emptylabel' ? '&nbsp;' : label() }}
                } @else {
                    @if (isSelectedOptionEmpty()) {
                        <span>{{ label() === 'p-emptylabel' ? '&nbsp;' : label() }}</span>
                    }
                }
                @if ((selectedItemTemplate() || _selectedItemTemplate()) && !isSelectedOptionEmpty()) {
                    <ng-container [ngTemplateOutlet]="selectedItemTemplate() || _selectedItemTemplate()" [ngTemplateOutletContext]="{ $implicit: selectedOption }"></ng-container>
                }
            </span>
        }
        @if (editable()) {
            <input
                #editableInput
                type="text"
                [attr.id]="inputId()"
                [class]="cx('label')"
                [vxBind]="ptm('label')"
                [attr.aria-haspopup]="'listbox'"
                [attr.placeholder]="modelValue() === undefined || modelValue() === null ? _placeholder() : undefined"
                [attr.aria-label]="ariaLabel() || (label() === 'p-emptylabel' ? undefined : label())"
                (input)="onEditableInput($event)"
                (keydown)="onKeyDown($event)"
                [vxAutoFocus]="autofocus()"
                [attr.aria-activedescendant]="focused ? focusedOptionId : undefined"
                (focus)="onInputFocus($event)"
                (blur)="onInputBlur($event)"
                [attr.name]="name()"
                [attr.minlength]="minlength()"
                [attr.min]="min()"
                [attr.max]="max()"
                [attr.pattern]="pattern()"
                [attr.size]="inputSize()"
                [attr.maxlength]="maxlength()"
                [attr.required]="required() ? '' : undefined"
                [attr.readonly]="readonly() ? '' : undefined"
                [attr.disabled]="$disabled() ? '' : undefined"
                [attr.data-p]="labelDataP"
            />
        }
        @if (isVisibleClearIcon) {
            @if (!clearIconTemplate() && !_clearIconTemplate()) {
                <svg data-p-icon="times" [class]="cx('clearIcon')" [vxBind]="ptm('clearIcon')" (click)="clear($event)" [attr.data-pc-section]="'clearicon'" />
            }
            @if (clearIconTemplate() || _clearIconTemplate()) {
                <span [class]="cx('clearIcon')" [vxBind]="ptm('clearIcon')" (click)="clear($event)" [attr.data-pc-section]="'clearicon'">
                    <ng-template *ngTemplateOutlet="clearIconTemplate() || _clearIconTemplate(); context: { class: cx('clearIcon') }"></ng-template>
                </span>
            }
        }

        <div [class]="cx('dropdown')" [vxBind]="ptm('dropdown')" role="button" aria-label="dropdown trigger" aria-haspopup="listbox" [attr.aria-expanded]="overlayVisible ?? false" [attr.data-pc-section]="'trigger'">
            @if (loading()) {
                @if (loadingIconTemplate() || _loadingIconTemplate()) {
                    <ng-container *ngTemplateOutlet="loadingIconTemplate() || _loadingIconTemplate()"></ng-container>
                }
                @if (!loadingIconTemplate() && !_loadingIconTemplate()) {
                    @if (loadingIcon()) {
                        <span [class]="cn(cx('loadingIcon'), 'pi-spin' + loadingIcon())" [vxBind]="ptm('loadingIcon')" aria-hidden="true"></span>
                    }
                    @if (!loadingIcon()) {
                        <span [class]="cn(cx('loadingIcon'), 'pi pi-spinner pi-spin')" [vxBind]="ptm('loadingIcon')" aria-hidden="true"></span>
                    }
                }
            } @else {
                @if (!dropdownIconTemplate() && !_dropdownIconTemplate()) {
                    @if (dropdownIcon()) {
                        <span [class]="cn(cx('dropdownIcon'), dropdownIcon())" [vxBind]="ptm('dropdownIcon')"></span>
                    }
                    @if (!dropdownIcon()) {
                        <svg data-p-icon="chevron-down" [class]="cx('dropdownIcon')" [vxBind]="ptm('dropdownIcon')" />
                    }
                }
                @if (dropdownIconTemplate() || _dropdownIconTemplate()) {
                    <span [class]="cx('dropdownIcon')" [vxBind]="ptm('dropdownIcon')">
                        <ng-template *ngTemplateOutlet="dropdownIconTemplate() || _dropdownIconTemplate(); context: { class: cx('dropdownIcon') }"></ng-template>
                    </span>
                }
            }
        </div>

        <vx-overlay
            #overlay
            [hostAttrSelector]="$attrSelector"
            [(visible)]="overlayVisible"
            [options]="overlayOptions()"
            [target]="'@parent'"
            [appendTo]="$appendTo()"
            [unstyled]="unstyled()"
            [pt]="ptm('pcOverlay')"
            [motionOptions]="motionOptions()"
            (onBeforeEnter)="onOverlayBeforeEnter($event)"
            (onAfterLeave)="onOverlayAfterLeave($event)"
            (onHide)="hide()"
        >
            <ng-template #content>
                <div [class]="cn(cx('overlay'), panelStyleClass())" [style]="panelStyle()" [vxBind]="ptm('overlay')" [attr.data-p]="overlayDataP">
                    <span
                        #firstHiddenFocusableEl
                        role="presentation"
                        class="p-hidden-accessible p-hidden-focusable"
                        [attr.tabindex]="0"
                        (focus)="onFirstHiddenFocus($event)"
                        [attr.data-p-hidden-accessible]="true"
                        [attr.data-p-hidden-focusable]="true"
                        [vxBind]="ptm('hiddenFirstFocusableEl')"
                    >
                    </span>
                    <ng-container *ngTemplateOutlet="headerTemplate() || _headerTemplate()"></ng-container>
                    @if (filter()) {
                        <div [class]="cx('header')" (click)="$event.stopPropagation()" [vxBind]="ptm('header')">
                            @if (filterTemplate() || _filterTemplate()) {
                                <ng-container *ngTemplateOutlet="filterTemplate() || _filterTemplate(); context: { options: filterOptions }"></ng-container>
                            } @else {
                                <vx-iconfield [pt]="ptm('pcFilterContainer')" [unstyled]="unstyled()">
                                    <input
                                        #filter
                                        vxInputText
                                        [vxSize]="size()"
                                        type="text"
                                        role="searchbox"
                                        autocomplete="off"
                                        [value]="_filterValue() || ''"
                                        [class]="cx('pcFilter')"
                                        [variant]="$variant()"
                                        [attr.placeholder]="filterPlaceholder()"
                                        [attr.aria-owns]="$id() + '_list'"
                                        (input)="onFilterInputChange($event)"
                                        [attr.aria-label]="ariaFilterLabel()"
                                        [attr.aria-activedescendant]="focusedOptionId"
                                        (keydown)="onFilterKeyDown($event)"
                                        (blur)="onFilterBlur($event)"
                                        [pt]="ptm('pcFilter')"
                                        [unstyled]="unstyled()"
                                    />
                                    <vx-inputicon [pt]="ptm('pcFilterIconContainer')" [unstyled]="unstyled()">
                                        @if (!filterIconTemplate() && !_filterIconTemplate()) {
                                            <svg data-p-icon="search" [vxBind]="ptm('filterIcon')" />
                                        }
                                        @if (filterIconTemplate() || _filterIconTemplate()) {
                                            <span [vxBind]="ptm('filterIcon')">
                                                <ng-template *ngTemplateOutlet="filterIconTemplate() || _filterIconTemplate()"></ng-template>
                                            </span>
                                        }
                                    </vx-inputicon>
                                </vx-iconfield>
                            }
                        </div>
                    }
                    <div [class]="cx('listContainer')" [style.max-height]="virtualScroll() ? 'auto' : scrollHeight() || 'auto'" [vxBind]="ptm('listContainer')">
                        @if (virtualScroll()) {
                            <vx-scroller
                                hostName="select"
                                #scroller
                                [items]="visibleOptions()"
                                [style]="{ height: scrollHeight() }"
                                [itemSize]="virtualScrollItemSize()"
                                [autoSize]="true"
                                [lazy]="lazy()"
                                (onLazyLoad)="onLazyLoad.emit($event)"
                                [options]="virtualScrollOptions()"
                                [pt]="ptm('virtualScroller')"
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
                            <ng-container *ngTemplateOutlet="buildInItems; context: { $implicit: visibleOptions(), options: {} }"></ng-container>
                        }

                        <ng-template #buildInItems let-items let-scrollerOptions="options">
                            <ul #items [attr.id]="$id() + '_list'" [attr.aria-label]="listLabel" [class]="cn(cx('list'), scrollerOptions.contentStyleClass)" [style]="scrollerOptions.contentStyle" role="listbox" [vxBind]="ptm('list')">
                                @for (option of items; track option; let i = $index) {
                                    @if (isOptionGroup(option)) {
                                        <li [class]="cx('optionGroup')" [attr.id]="$id() + '_' + getOptionIndex(i, scrollerOptions)" [style]="{ height: scrollerOptions.itemSize + 'px' }" role="option" [vxBind]="ptm('optionGroup')">
                                            @if (!groupTemplate() && !_groupTemplate()) {
                                                <span [class]="cx('optionGroupLabel')" [vxBind]="ptm('optionGroupLabel')">{{ getOptionGroupLabel(option.optionGroup) }}</span>
                                            }
                                            <ng-container *ngTemplateOutlet="groupTemplate() || _groupTemplate(); context: { $implicit: option.optionGroup }"></ng-container>
                                        </li>
                                    }
                                    @if (!isOptionGroup(option)) {
                                        <vx-selectItem
                                            [id]="$id() + '_' + getOptionIndex(i, scrollerOptions)"
                                            [option]="option"
                                            [checkmark]="checkmark()"
                                            [selected]="isSelected(option)"
                                            [label]="getOptionLabel(option)"
                                            [disabled]="isOptionDisabled(option)"
                                            [template]="itemTemplate() || _itemTemplate()"
                                            [focused]="focusedOptionIndex() === getOptionIndex(i, scrollerOptions)"
                                            [ariaPosInset]="getAriaPosInset(getOptionIndex(i, scrollerOptions))"
                                            [ariaSetSize]="ariaSetSize"
                                            [index]="i"
                                            [unstyled]="unstyled()"
                                            [scrollerOptions]="scrollerOptions"
                                            (onClick)="onOptionSelect($event, option)"
                                            (onMouseEnter)="onOptionMouseEnter($event, getOptionIndex(i, scrollerOptions))"
                                        ></vx-selectItem>
                                    }
                                }
                                @if (_filterValue() && isEmpty()) {
                                    <li [class]="cx('emptyMessage')" [style]="{ height: scrollerOptions.itemSize + 'px' }" role="option" [vxBind]="ptm('emptyMessage')">
                                        @if (!emptyFilterTemplate() && !_emptyFilterTemplate() && !emptyTemplate()) {
                                            {{ emptyFilterMessageLabel }}
                                        } @else {
                                            <ng-container #emptyFilter *ngTemplateOutlet="emptyFilterTemplate() || _emptyFilterTemplate() || emptyTemplate() || _emptyTemplate()"></ng-container>
                                        }
                                    </li>
                                }
                                @if (!_filterValue() && isEmpty()) {
                                    <li [class]="cx('emptyMessage')" [style]="{ height: scrollerOptions.itemSize + 'px' }" role="option" [vxBind]="ptm('emptyMessage')">
                                        @if (!emptyTemplate() && !_emptyTemplate()) {
                                            {{ emptyMessageLabel || emptyFilterMessageLabel }}
                                        } @else {
                                            <ng-container #empty *ngTemplateOutlet="emptyTemplate() || _emptyTemplate()"></ng-container>
                                        }
                                    </li>
                                }
                            </ul>
                        </ng-template>
                    </div>
                    <ng-container *ngTemplateOutlet="footerTemplate() || _footerTemplate()"></ng-container>
                    <span
                        #lastHiddenFocusableEl
                        role="presentation"
                        class="p-hidden-accessible p-hidden-focusable"
                        [vxBind]="ptm('hiddenLastFocusableEl')"
                        [attr.tabindex]="0"
                        (focus)="onLastHiddenFocus($event)"
                        [attr.data-p-hidden-accessible]="true"
                        [attr.data-p-hidden-focusable]="true"
                    ></span>
                </div>
            </ng-template>
        </vx-overlay>
    `,
    host: {
        '[class]': "cn(cx('root'), styleClass())",
        '[attr.id]': '$id()',
        '[attr.data-p]': 'containerDataP',
        '(click)': 'onContainerClick($event)'
    },
    providers: [SELECT_VALUE_ACCESSOR, SelectStyle, { provide: SELECT_INSTANCE, useExisting: Select }, { provide: PARENT_INSTANCE, useExisting: Select }],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    hostDirectives: [Bind]
})
export class Select extends BaseInput<SelectPassThrough> implements AfterViewInit, AfterViewChecked {
    componentName = 'Select';

    bindDirectiveInstance = inject(Bind, { self: true });
    /**
     * Unique identifier of the component
     * @group Props
     */
    id = input<string | undefined>();
    /**
     * Height of the viewport in pixels, a scrollbar is defined if height of list exceeds this value.
     * @group Props
     */
    scrollHeight = input<string>('200px');
    /**
     * When specified, displays an input field to filter the items on keyup.
     * @group Props
     */
    filter = input(undefined, { transform: booleanAttribute });
    /**
     * Inline style of the overlay panel element.
     * @group Props
     */
    panelStyle = input<{ [klass: string]: any } | null | undefined>();
    /**
     * Style class of the element.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    styleClass = input<string | undefined>();
    /**
     * Style class of the overlay panel element.
     * @group Props
     */
    panelStyleClass = input<string | undefined>();
    /**
     * When present, it specifies that the component cannot be edited.
     * @group Props
     */
    readonly = input(undefined, { transform: booleanAttribute });
    /**
     * When present, custom value instead of predefined options can be entered using the editable input field.
     * @group Props
     */
    editable = input(undefined, { transform: booleanAttribute });
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    tabindex = input(0, { transform: numberAttribute });
    /**
     * Default text to display when no option is selected.
     * @group Props
     */
    placeholder = input<string | undefined>();
    /**
     * Icon to display in loading state.
     * @group Props
     */
    loadingIcon = input<string | undefined>();
    /**
     * Placeholder text to show when filter input is empty.
     * @group Props
     */
    filterPlaceholder = input<string | undefined>();
    /**
     * Locale to use in filtering. The default locale is the host environment's current locale.
     * @group Props
     */
    filterLocale = input<string | undefined>();
    /**
     * Identifier of the accessible input element.
     * @group Props
     */
    inputId = input<string | undefined>();
    /**
     * A property to uniquely identify a value in options.
     * @group Props
     */
    dataKey = input<string | undefined>();
    /**
     * When filtering is enabled, filterBy decides which field or fields (comma separated) to search against.
     * @group Props
     */
    filterBy = input<string | undefined>();
    /**
     * Fields used when filtering the options, defaults to optionLabel.
     * @group Props
     */
    filterFields = input<any[] | undefined>();
    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    autofocus = input(undefined, { transform: booleanAttribute });
    /**
     * Clears the filter value when hiding the select.
     * @group Props
     */
    resetFilterOnHide = input(false, { transform: booleanAttribute });
    /**
     * Whether the selected option will be shown with a check mark.
     * @group Props
     */
    checkmark = input(false, { transform: booleanAttribute });
    /**
     * Icon class of the select icon.
     * @group Props
     */
    dropdownIcon = input<string | undefined>();
    /**
     * Whether the select is in loading state.
     * @group Props
     */
    loading = input(false, { transform: booleanAttribute });
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
     * Name of the disabled field of an option.
     * @group Props
     */
    optionDisabled = input<string | undefined>();
    /**
     * Name of the label field of an option group.
     * @group Props
     */
    optionGroupLabel = input<string | undefined>('label');
    /**
     * Name of the options field of an option group.
     * @group Props
     */
    optionGroupChildren = input<string>('items');
    /**
     * Whether to display options as grouped when nested options are provided.
     * @group Props
     */
    group = input(undefined, { transform: booleanAttribute });
    /**
     * When enabled, a clear icon is displayed to clear the value.
     * @group Props
     */
    showClear = input(undefined, { transform: booleanAttribute });
    /**
     * Text to display when filtering does not return any results. Defaults to global value in i18n translation configuration.
     * @group Props
     */
    emptyFilterMessage = input<string>('');
    /**
     * Text to display when there is no data. Defaults to global value in i18n translation configuration.
     * @group Props
     */
    emptyMessage = input<string>('');
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
     * Whether to use overlay API feature. The properties of overlay API can be used like an object in it.
     * @group Props
     */
    overlayOptions = input<OverlayOptions | undefined>();
    /**
     * Defines a string that labels the filter input.
     * @group Props
     */
    ariaFilterLabel = input<string | undefined>();
    /**
     * Used to define a aria label attribute the current element.
     * @group Props
     */
    ariaLabel = input<string | undefined>();
    /**
     * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
     * @group Props
     */
    ariaLabelledBy = input<string | undefined>();
    /**
     * Defines how the items are filtered.
     * @group Props
     */
    filterMatchMode = input<'contains' | 'startsWith' | 'endsWith' | 'equals' | 'notEquals' | 'in' | 'lt' | 'lte' | 'gt' | 'gte'>('contains');
    /**
     * Advisory information to display in a tooltip on hover.
     * @group Props
     */
    tooltip = input<string>('');
    /**
     * Position of the tooltip.
     * @group Props
     */
    tooltipPosition = input<'top' | 'left' | 'right' | 'bottom'>('right');
    /**
     * Type of CSS position.
     * @group Props
     */
    tooltipPositionStyle = input<string>('absolute');
    /**
     * Style class of the tooltip.
     * @group Props
     */
    tooltipStyleClass = input<string | undefined>();
    /**
     * Fields used when filtering the options, defaults to optionLabel.
     * @group Props
     */
    focusOnHover = input(true, { transform: booleanAttribute });
    /**
     * Determines if the option will be selected on focus.
     * @group Props
     */
    selectOnFocus = input(false, { transform: booleanAttribute });
    /**
     * Whether to focus on the first visible or selected element when the overlay panel is shown.
     * @group Props
     */
    autoOptionFocus = input(false, { transform: booleanAttribute });
    /**
     * Applies focus to the filter element when the overlay is shown.
     * @group Props
     */
    autofocusFilter = input(true, { transform: booleanAttribute });
    /**
     * When specified, filter displays with this value.
     * @group Props
     */
    filterValue = input<string | undefined | null>(null);
    /**
     * An array of objects to display as the available options.
     * @group Props
     */
    options = input<any[] | null | undefined>(null);
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
    /**
     * Callback to invoke when value of select changes.
     * @param {SelectChangeEvent} event - custom change event.
     * @group Emits
     */
    onChange = output<SelectChangeEvent>();
    /**
     * Callback to invoke when data is filtered.
     * @param {SelectFilterEvent} event - custom filter event.
     * @group Emits
     */
    onFilter = output<SelectFilterEvent>();
    /**
     * Callback to invoke when select gets focus.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    onFocus = output<Event>();
    /**
     * Callback to invoke when select loses focus.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    onBlur = output<Event>();
    /**
     * Callback to invoke when component is clicked.
     * @param {MouseEvent} event - Mouse event.
     * @group Emits
     */
    onClick = output<MouseEvent>();
    /**
     * Callback to invoke when select overlay gets visible.
     * @param {AnimationEvent} event - Animation event.
     * @group Emits
     */
    onShow = output<AnimationEvent>();
    /**
     * Callback to invoke when select overlay gets hidden.
     * @param {AnimationEvent} event - Animation event.
     * @group Emits
     */
    onHide = output<AnimationEvent>();
    /**
     * Callback to invoke when select clears the value.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    onClear = output<Event>();
    /**
     * Callback to invoke in lazy mode to load new data.
     * @param {SelectLazyLoadEvent} event - Lazy load event.
     * @group Emits
     */
    onLazyLoad = output<SelectLazyLoadEvent>();

    _componentStyle = inject(SelectStyle);

    filterViewChild = viewChild<ElementRef>('filter');

    focusInputViewChild = viewChild<ElementRef>('focusInput');

    editableInputViewChild = viewChild<ElementRef>('editableInput');

    itemsViewChild = viewChild<ElementRef>('items');

    scroller = viewChild<Scroller>('scroller');

    overlayViewChild = viewChild<Overlay>('overlay');

    firstHiddenFocusableElementOnOverlay = viewChild<ElementRef>('firstHiddenFocusableEl');

    lastHiddenFocusableElementOnOverlay = viewChild<ElementRef>('lastHiddenFocusableEl');

    itemsWrapper: Nullable<HTMLDivElement>;

    $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo());

    /**
     * Custom item template.
     * @group Templates
     */
    itemTemplate = contentChild<TemplateRef<SelectItemTemplateContext>>('item', { descendants: false });

    /**
     * Custom group template.
     * @group Templates
     */
    groupTemplate = contentChild<TemplateRef<SelectGroupTemplateContext>>('group', { descendants: false });

    /**
     * Custom loader template.
     * @group Templates
     */
    loaderTemplate = contentChild<TemplateRef<SelectLoaderTemplateContext>>('loader', { descendants: false });

    /**
     * Custom selected item template.
     * @group Templates
     */
    selectedItemTemplate = contentChild<TemplateRef<SelectSelectedItemTemplateContext>>('selectedItem', { descendants: false });

    /**
     * Custom header template.
     * @group Templates
     */
    headerTemplate = contentChild<TemplateRef<void>>('header', { descendants: false });

    /**
     * Custom filter template.
     * @group Templates
     */
    filterTemplate = contentChild<TemplateRef<SelectFilterTemplateContext>>('filter', { descendants: false });

    /**
     * Custom footer template.
     * @group Templates
     */
    footerTemplate = contentChild<TemplateRef<void>>('footer', { descendants: false });

    /**
     * Custom empty filter template.
     * @group Templates
     */
    emptyFilterTemplate = contentChild<TemplateRef<void>>('emptyfilter', { descendants: false });

    /**
     * Custom empty template.
     * @group Templates
     */
    emptyTemplate = contentChild<TemplateRef<void>>('empty', { descendants: false });

    /**
     * Custom dropdown icon template.
     * @group Templates
     */
    dropdownIconTemplate = contentChild<TemplateRef<SelectIconTemplateContext>>('dropdownicon', { descendants: false });

    /**
     * Custom loading icon template.
     * @group Templates
     */
    loadingIconTemplate = contentChild<TemplateRef<void>>('loadingicon', { descendants: false });

    /**
     * Custom clear icon template.
     * @group Templates
     */
    clearIconTemplate = contentChild<TemplateRef<SelectIconTemplateContext>>('clearicon', { descendants: false });

    /**
     * Custom filter icon template.
     * @group Templates
     */
    filterIconTemplate = contentChild<TemplateRef<void>>('filtericon', { descendants: false });

    /**
     * Custom on icon template.
     * @group Templates
     */
    onIconTemplate = contentChild<TemplateRef<void>>('onicon', { descendants: false });

    /**
     * Custom off icon template.
     * @group Templates
     */
    offIconTemplate = contentChild<TemplateRef<void>>('officon', { descendants: false });

    /**
     * Custom cancel icon template.
     * @group Templates
     */
    cancelIconTemplate = contentChild<TemplateRef<void>>('cancelicon', { descendants: false });

    templates = contentChildren(PrimeTemplate);

    /**
     * Map of the `vxTemplate`-declared templates, keyed by template type. Unknown types fall
     * back to the `item` key, matching the pre-signal `ngAfterContentInit` behavior.
     */
    private _templateMap = computed(() => {
        const map: Record<string, TemplateRef<any> | undefined> = {};

        for (const item of this.templates()) {
            const type = item.getType();

            switch (type) {
                case 'item':
                case 'selectedItem':
                case 'header':
                case 'filter':
                case 'footer':
                case 'emptyfilter':
                case 'empty':
                case 'group':
                case 'loader':
                case 'dropdownicon':
                case 'loadingicon':
                case 'clearicon':
                case 'filtericon':
                case 'cancelicon':
                case 'onicon':
                case 'officon':
                    map[type] = item.template;
                    break;

                default:
                    map['item'] = item.template;
                    break;
            }
        }

        return map;
    });

    _itemTemplate = computed(() => this._templateMap()['item'] as TemplateRef<SelectItemTemplateContext> | undefined);

    _selectedItemTemplate = computed(() => this._templateMap()['selectedItem'] as TemplateRef<SelectSelectedItemTemplateContext> | undefined);

    _headerTemplate = computed(() => this._templateMap()['header'] as TemplateRef<void> | undefined);

    _filterTemplate = computed(() => this._templateMap()['filter'] as TemplateRef<SelectFilterTemplateContext> | undefined);

    _footerTemplate = computed(() => this._templateMap()['footer'] as TemplateRef<void> | undefined);

    _emptyFilterTemplate = computed(() => this._templateMap()['emptyfilter'] as TemplateRef<void> | undefined);

    _emptyTemplate = computed(() => this._templateMap()['empty'] as TemplateRef<void> | undefined);

    _groupTemplate = computed(() => this._templateMap()['group'] as TemplateRef<SelectGroupTemplateContext> | undefined);

    _loaderTemplate = computed(() => this._templateMap()['loader'] as TemplateRef<SelectLoaderTemplateContext> | undefined);

    _dropdownIconTemplate = computed(() => this._templateMap()['dropdownicon'] as TemplateRef<SelectIconTemplateContext> | undefined);

    _loadingIconTemplate = computed(() => this._templateMap()['loadingicon'] as TemplateRef<void> | undefined);

    _clearIconTemplate = computed(() => this._templateMap()['clearicon'] as TemplateRef<SelectIconTemplateContext> | undefined);

    _filterIconTemplate = computed(() => this._templateMap()['filtericon'] as TemplateRef<void> | undefined);

    _cancelIconTemplate = computed(() => this._templateMap()['cancelicon'] as TemplateRef<void> | undefined);

    _onIconTemplate = computed(() => this._templateMap()['onicon'] as TemplateRef<void> | undefined);

    _offIconTemplate = computed(() => this._templateMap()['officon'] as TemplateRef<void> | undefined);

    filterOptions: SelectFilterOptions | undefined;

    /**
     * Internal options state. Mirrors the `options` input but only propagates when the new
     * value is not deep-equal to the previous one (parity with the pre-signal setter guard).
     */
    _options = computed(() => this.options(), { equal: (a, b) => deepEquals(a, b) });

    /**
     * Internal placeholder state. Follows the `placeholder` input but can be overridden
     * locally (floating label support).
     */
    _placeholder = linkedSignal(() => this.placeholder());

    /**
     * Generated unique id, seeded by the `id` input.
     */
    $id = linkedSignal(() => this.id() ?? uuid('pn_id_'));

    value: any;

    hover: Nullable<boolean>;

    focused: Nullable<boolean>;

    overlayVisible: boolean = false;

    optionsChanged: Nullable<boolean>;

    panel: Nullable<HTMLDivElement>;

    dimensionsUpdated: Nullable<boolean>;

    hoveredItem: any;

    selectedOptionUpdated: Nullable<boolean>;

    /**
     * Internal filter state. Follows the `filterValue` input but is also written by the
     * filter input field and `resetFilter()`.
     */
    _filterValue = linkedSignal<string | undefined | null>(() => this.filterValue());

    searchValue: Nullable<string>;

    searchIndex: Nullable<number>;

    searchTimeout: any;

    previousSearchChar: Nullable<string>;

    currentSearchChar: Nullable<string>;

    preventModelTouched: Nullable<boolean>;

    focusedOptionIndex = signal<number>(-1);

    labelId: Nullable<string>;

    listId: Nullable<string>;

    clicked = signal<boolean>(false);

    get emptyMessageLabel(): string {
        return this.emptyMessage() || this.config.getTranslation(TranslationKeys.EMPTY_MESSAGE);
    }

    get emptyFilterMessageLabel(): string {
        return this.emptyFilterMessage() || this.config.getTranslation(TranslationKeys.EMPTY_FILTER_MESSAGE);
    }

    get isVisibleClearIcon(): boolean | undefined {
        return this.modelValue() != null && this.hasSelectedOption() && this.showClear() && !this.$disabled();
    }

    get listLabel(): string {
        return this.config.getTranslation(TranslationKeys.ARIA)['listLabel'];
    }

    get focusedOptionId() {
        return this.focusedOptionIndex() !== -1 ? `${this.$id()}_${this.focusedOptionIndex()}` : null;
    }

    visibleOptions = computed(() => {
        const options = this.getAllVisibleAndNonVisibleOptions();

        if (this._filterValue()) {
            const _filterBy = this.filterBy() || this.optionLabel();

            const filteredOptions =
                !_filterBy && !this.filterFields() && !this.optionValue()
                    ? this._options()?.filter((option) => {
                          if (option.label) {
                              return option.label.toString().toLowerCase().indexOf(this._filterValue()!.toLowerCase().trim()) !== -1;
                          }
                          return option.toString().toLowerCase().indexOf(this._filterValue()!.toLowerCase().trim()) !== -1;
                      })
                    : this.filterService.filter(options, this.searchFields(), this._filterValue()!.trim(), this.filterMatchMode(), this.filterLocale());

            if (this.group()) {
                const optionGroups = this._options() || [];
                const filtered: any[] = [];

                optionGroups.forEach((group) => {
                    const groupChildren = this.getOptionGroupChildren(group);
                    const filteredItems = groupChildren.filter((item) => filteredOptions?.includes(item));

                    if (filteredItems.length > 0)
                        filtered.push({
                            ...group,
                            [typeof this.optionGroupChildren() === 'string' ? this.optionGroupChildren() : 'items']: [...filteredItems]
                        });
                });

                return this.flatOptions(filtered);
            }
            return filteredOptions;
        }

        return options;
    });

    label = computed(() => {
        // use  getAllVisibleAndNonVisibleOptions verses just visible options
        // this will find the selected option whether or not the user is currently filtering  because the filtered (i.e. visible) options, are a subset of all the options
        const options = this.getAllVisibleAndNonVisibleOptions();

        // use isOptionEqualsModelValue for the use case where the dropdown is initalized with a disabled option
        const selectedOptionIndex = options.findIndex((option) => {
            const isEqual = this.isOptionValueEqualsModelValue(option);
            return isEqual;
        });

        if (selectedOptionIndex !== -1) {
            const selectedOption = options[selectedOptionIndex];
            // Always show the label for selected options, even if disabled
            return this.getOptionLabel(selectedOption);
        }

        return this._placeholder() || 'p-emptylabel';
    });

    selectedOption: any;

    constructor(
        public zone: NgZone,
        public filterService: FilterService
    ) {
        super();
        effect(() => {
            const modelValue = this.modelValue();
            const visibleOptions = this.visibleOptions();

            if (visibleOptions && isNotEmpty(visibleOptions)) {
                const selectedOptionIndex = this.findSelectedOptionIndex();

                if (selectedOptionIndex !== -1 || modelValue === undefined || (typeof modelValue === 'string' && modelValue.length === 0) || this.isModelValueNotSet() || this.editable()) {
                    this.selectedOption = visibleOptions[selectedOptionIndex];
                } else {
                    // If no valid selected option found but we have a model value,
                    // try to find the option including disabled ones for template display
                    const disabledSelectedIndex = visibleOptions.findIndex((option) => this.isSelected(option));
                    if (disabledSelectedIndex !== -1) {
                        this.selectedOption = visibleOptions[disabledSelectedIndex];
                    }
                }
            }

            if (isEmpty(visibleOptions) && (modelValue === undefined || this.isModelValueNotSet()) && isNotEmpty(this.selectedOption)) {
                this.selectedOption = null;
            }

            if (modelValue !== undefined && this.editable()) {
                this.updateEditableLabel();
            }
            this.cd.markForCheck();
        });
    }

    private isModelValueNotSet(): boolean {
        return this.modelValue() === null && !this.isOptionValueEqualsModelValue(this.selectedOption);
    }

    private getAllVisibleAndNonVisibleOptions() {
        return this.group() ? this.flatOptions(this._options()) : this._options() || [];
    }

    onInit() {
        this.autoUpdateModel();

        if (this.filterBy()) {
            this.filterOptions = {
                filter: (value) => this.onFilterInputChange(value),
                reset: () => this.resetFilter()
            };
        }
    }

    onAfterViewChecked() {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));

        if (this.optionsChanged && this.overlayVisible) {
            this.optionsChanged = false;

            this.zone.runOutsideAngular(() => {
                setTimeout(() => {
                    if (this.overlayViewChild()) {
                        this.overlayViewChild()!.alignOverlay();
                    }
                }, 1);
            });
        }

        if (this.selectedOptionUpdated && this.itemsWrapper) {
            let selectedItem = <any>findSingle(this.overlayViewChild()?.overlayViewChild()?.nativeElement, 'li[data-p-selected="true"]');
            if (selectedItem) {
                scrollInView(this.itemsWrapper, selectedItem);
            }
            this.selectedOptionUpdated = false;
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
        if (this.selectOnFocus() && this.autoOptionFocus() && !this.hasSelectedOption()) {
            this.focusedOptionIndex.set(this.findFirstFocusedOptionIndex());
            this.onOptionSelect(null, this.visibleOptions()[this.focusedOptionIndex()], false);
        }
    }

    onOptionSelect(event, option, isHide = true, preventChange = false) {
        // Check if option is disabled before proceeding
        if (this.isOptionDisabled(option)) {
            return;
        }

        if (!this.isSelected(option)) {
            const value = this.getOptionValue(option);
            this.updateModel(value, event);
            this.focusedOptionIndex.set(this.findSelectedOptionIndex());
            preventChange === false && this.onChange.emit({ originalEvent: event, value: value });
        }
        if (isHide) {
            this.hide(true);
        }
    }

    onOptionMouseEnter(event, index) {
        if (this.focusOnHover()) {
            this.changeFocusedOptionIndex(event, index);
        }
    }

    updateModel(value, event?) {
        this.value = value;
        this.onModelChange(value);
        this.writeModelValue(value);
        this.selectedOptionUpdated = true;
    }

    allowModelChange() {
        return !!this.modelValue() && !this._placeholder() && (this.modelValue() === undefined || this.modelValue() === null) && !this.editable() && this._options() && this._options()!.length;
    }

    isSelected(option) {
        return this.isOptionValueEqualsModelValue(option);
    }

    private isOptionValueEqualsModelValue(option: any) {
        // Don't check isValidOption here since we need to match disabled options too
        return option !== undefined && option !== null && !this.isOptionGroup(option) && equals(this.modelValue(), this.getOptionValue(option), this.equalityKey());
    }

    onAfterViewInit() {
        if (this.editable()) {
            this.updateEditableLabel();
        }
        this.updatePlaceHolderForFloatingLabel();
    }

    updatePlaceHolderForFloatingLabel(): void {
        const parentElement = this.el.nativeElement.parentElement;
        const isInFloatingLabel = parentElement?.classList.contains('p-float-label');
        if (parentElement && isInFloatingLabel && !this.selectedOption) {
            const label = parentElement.querySelector('label');
            if (label) {
                this._placeholder.set(label.textContent);
            }
        }
    }

    updateEditableLabel(): void {
        const editableInput = this.editableInputViewChild();
        if (editableInput) {
            editableInput.nativeElement.value = this.getOptionLabel(this.selectedOption) || this.modelValue() || '';
        }
    }

    clearEditableLabel(): void {
        const editableInput = this.editableInputViewChild();
        if (editableInput) {
            editableInput.nativeElement.value = '';
        }
    }

    getOptionIndex(index, scrollerOptions) {
        return this.virtualScrollerDisabled ? index : scrollerOptions && scrollerOptions.getItemOptions(index)['index'];
    }

    getOptionLabel(option: any) {
        return this.optionLabel() !== undefined && this.optionLabel() !== null ? resolveFieldData(option, this.optionLabel()) : option && option.label !== undefined ? option.label : option;
    }

    getOptionValue(option: any) {
        return this.optionValue() && this.optionValue() !== null ? resolveFieldData(option, this.optionValue()) : !this.optionLabel() && option && option.value !== undefined ? option.value : option;
    }

    getPTItemOptions(option: any, itemOptions: any, index: number, key: string) {
        return this.ptm(key, {
            context: {
                option,
                index,
                selected: this.isSelected(option),
                focused: this.focusedOptionIndex() === this.getOptionIndex(index, itemOptions),
                disabled: this.isOptionDisabled(option)
            }
        });
    }

    isSelectedOptionEmpty() {
        return isEmpty(this.selectedOption);
    }

    isOptionDisabled(option: any) {
        return this.optionDisabled() ? resolveFieldData(option, this.optionDisabled()) : option && option.disabled !== undefined ? option.disabled : false;
    }

    getOptionGroupLabel(optionGroup: any) {
        return this.optionGroupLabel() !== undefined && this.optionGroupLabel() !== null ? resolveFieldData(optionGroup, this.optionGroupLabel()) : optionGroup && optionGroup.label !== undefined ? optionGroup.label : optionGroup;
    }

    getOptionGroupChildren(optionGroup: any) {
        return this.optionGroupChildren() !== undefined && this.optionGroupChildren() !== null ? resolveFieldData(optionGroup, this.optionGroupChildren()) : optionGroup.items;
    }

    getAriaPosInset(index) {
        return (
            (this.optionGroupLabel()
                ? index -
                  this.visibleOptions()
                      .slice(0, index)
                      .filter((option) => this.isOptionGroup(option)).length
                : index) + 1
        );
    }

    get ariaSetSize() {
        return this.visibleOptions().filter((option) => !this.isOptionGroup(option)).length;
    }

    /**
     * Callback to invoke on filter reset.
     * @group Method
     */
    public resetFilter(): void {
        this._filterValue.set(null);

        const filterInput = this.filterViewChild();
        if (filterInput && filterInput.nativeElement) {
            filterInput.nativeElement.value = '';
        }
    }

    onContainerClick(event: any) {
        if (this.$disabled() || this.readonly() || this.loading()) {
            return;
        }

        if (event.target.tagName === 'INPUT' || event.target.getAttribute('data-pc-section') === 'clearicon' || event.target.closest('[data-pc-section="clearicon"]')) {
            return;
        } else if (!this.overlayViewChild() || !this.overlayViewChild()!.el.nativeElement.contains(event.target)) {
            this.overlayVisible ? this.hide(true) : this.show(true);
        }

        this.focusInputViewChild()?.nativeElement.focus({ preventScroll: true });
        this.onClick.emit(event);
        this.clicked.set(true);
        this.cd.detectChanges();
    }

    isEmpty() {
        return !this._options() || (this.visibleOptions() && this.visibleOptions().length === 0);
    }

    onEditableInput(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.searchValue = '';
        const matched = this.searchOptions(event, value);
        !matched && this.focusedOptionIndex.set(-1);

        this.onModelChange(value);
        this.updateModel(value || null, event);
        setTimeout(() => {
            this.onChange.emit({ originalEvent: event, value: value });
        }, 1);

        !this.overlayVisible && isNotEmpty(value) && this.show();
    }
    /**
     * Displays the panel.
     * @group Method
     */
    public show(isFocus?) {
        this.overlayVisible = true;

        this.focusedOptionIndex.set(this.focusedOptionIndex() !== -1 ? this.focusedOptionIndex() : this.autoOptionFocus() ? this.findFirstFocusedOptionIndex() : this.editable() ? -1 : this.findSelectedOptionIndex());

        if (isFocus) {
            focus(this.focusInputViewChild()?.nativeElement);
        }

        this.cd.markForCheck();
    }

    onOverlayBeforeEnter(event: any) {
        this.itemsWrapper = <any>findSingle(this.overlayViewChild()?.overlayViewChild()?.nativeElement, this.virtualScroll() ? '[data-pc-name="virtualscroller"]' : '[data-pc-section="listcontainer"]');
        this.virtualScroll() && this.scroller()?.setContentEl(this.itemsViewChild()?.nativeElement);

        if (this._options() && this._options()!.length) {
            if (this.virtualScroll()) {
                const selectedIndex = this.modelValue() ? this.focusedOptionIndex() : -1;
                if (selectedIndex !== -1) {
                    setTimeout(() => {
                        this.scroller()?.scrollToIndex(selectedIndex);
                    }, 10);
                }
            } else {
                let selectedListItem = findSingle(this.itemsWrapper as HTMLElement, '[data-p-selected="true"]');
                if (selectedListItem) {
                    selectedListItem.scrollIntoView({ block: 'nearest', inline: 'nearest' });
                }
            }
        }

        const filterInput = this.filterViewChild();
        if (filterInput && filterInput.nativeElement) {
            this.preventModelTouched = true;

            if (this.autofocusFilter() && !this.editable()) {
                filterInput.nativeElement.focus();
            }
        }
        this.onShow.emit(event);
    }

    onOverlayAfterLeave(event: any) {
        this.itemsWrapper = null;
        this.onModelTouched();
        this.onHide.emit(event);
    }
    /**
     * Hides the panel.
     * @group Method
     */
    public hide(isFocus?) {
        this.overlayVisible = false;
        this.focusedOptionIndex.set(-1);
        this.clicked.set(false);
        this.searchValue = '';

        if (this.overlayOptions()?.mode === 'modal') {
            unblockBodyScroll();
        }
        if (this.filter() && this.resetFilterOnHide()) {
            this.resetFilter();
        }
        if (isFocus) {
            if (this.focusInputViewChild()) {
                focus(this.focusInputViewChild()?.nativeElement);
            }
            if (this.editable() && this.editableInputViewChild()) {
                focus(this.editableInputViewChild()?.nativeElement);
            }
        }
        this.cd.markForCheck();
    }

    onInputFocus(event: Event) {
        if (this.$disabled()) {
            // For ScreenReaders
            return;
        }

        this.focused = true;
        const focusedOptionIndex = this.focusedOptionIndex() !== -1 ? this.focusedOptionIndex() : this.overlayVisible && this.autoOptionFocus() ? this.findFirstFocusedOptionIndex() : -1;
        this.focusedOptionIndex.set(focusedOptionIndex);
        this.overlayVisible && this.scrollInView(this.focusedOptionIndex());

        this.onFocus.emit(event);
    }

    onInputBlur(event: Event) {
        this.focused = false;
        this.onBlur.emit(event);

        if (!this.preventModelTouched && !this.overlayVisible) {
            this.onModelTouched();
        }
        this.preventModelTouched = false;
    }

    onKeyDown(event: KeyboardEvent, search: boolean = false) {
        if (this.$disabled() || this.readonly() || this.loading()) {
            return;
        }

        switch (event.code) {
            //down
            case 'ArrowDown':
                this.onArrowDownKey(event);
                break;

            //up
            case 'ArrowUp':
                this.onArrowUpKey(event, this.editable());
                break;

            case 'ArrowLeft':
            case 'ArrowRight':
                this.onArrowLeftKey(event, this.editable());
                break;

            case 'Delete':
                this.onDeleteKey(event);
                break;

            case 'Home':
                this.onHomeKey(event, this.editable());
                break;

            case 'End':
                this.onEndKey(event, this.editable());
                break;

            case 'PageDown':
                this.onPageDownKey(event);
                break;

            case 'PageUp':
                this.onPageUpKey(event);
                break;

            //space
            case 'Space':
                this.onSpaceKey(event, search);
                break;

            //enter
            case 'Enter':
            case 'NumpadEnter':
                this.onEnterKey(event);
                break;

            //escape and tab
            case 'Escape':
                this.onEscapeKey(event);
                break;

            case 'Tab':
                this.onTabKey(event);
                break;

            case 'Backspace':
                this.onBackspaceKey(event, this.editable());
                break;

            case 'ShiftLeft':
            case 'ShiftRight':
                //NOOP
                break;

            default:
                if (!event.metaKey && isPrintableCharacter(event.key)) {
                    !this.overlayVisible && this.show();
                    !this.editable() && this.searchOptions(event, event.key);
                }

                break;
        }

        this.clicked.set(false);
    }

    onFilterKeyDown(event) {
        switch (event.code) {
            case 'ArrowDown':
                this.onArrowDownKey(event);
                break;

            case 'ArrowUp':
                this.onArrowUpKey(event, true);
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
            case 'NumpadEnter':
                this.onEnterKey(event, true);
                break;

            case 'Escape':
                this.onEscapeKey(event);
                break;

            case 'Tab':
                this.onTabKey(event, true);
                break;

            default:
                break;
        }
    }

    onFilterBlur(event) {
        this.focusedOptionIndex.set(-1);
    }

    onArrowDownKey(event: KeyboardEvent) {
        if (!this.overlayVisible) {
            this.show();
            this.editable() && this.changeFocusedOptionIndex(event, this.findSelectedOptionIndex());
        } else {
            const optionIndex = this.focusedOptionIndex() !== -1 ? this.findNextOptionIndex(this.focusedOptionIndex()) : this.clicked() ? this.findFirstOptionIndex() : this.findFirstFocusedOptionIndex();

            this.changeFocusedOptionIndex(event, optionIndex);
        }
        // const optionIndex = this.focusedOptionIndex() !== -1 ? this.findNextOptionIndex(this.focusedOptionIndex()) : this.findFirstFocusedOptionIndex();
        // this.changeFocusedOptionIndex(event, optionIndex);

        // !this.overlayVisible && this.show();
        event.preventDefault();
        event.stopPropagation();
    }

    changeFocusedOptionIndex(event, index) {
        if (this.focusedOptionIndex() !== index) {
            this.focusedOptionIndex.set(index);
            this.scrollInView();

            if (this.selectOnFocus()) {
                const option = this.visibleOptions()[index];
                this.onOptionSelect(event, option, false);
            }
        }
    }

    get virtualScrollerDisabled() {
        return !this.virtualScroll();
    }

    scrollInView(index = -1) {
        const id = index !== -1 ? `${this.$id()}_${index}` : this.focusedOptionId;

        const itemsElement = this.itemsViewChild();
        if (itemsElement && itemsElement.nativeElement) {
            const element = findSingle(itemsElement.nativeElement, `li[id="${id}"]`);
            if (element) {
                element.scrollIntoView && element.scrollIntoView({ block: 'nearest', inline: 'nearest' });
            } else if (!this.virtualScrollerDisabled) {
                setTimeout(() => {
                    this.virtualScroll() && this.scroller()?.scrollToIndex(index !== -1 ? index : this.focusedOptionIndex());
                }, 0);
            }
        }
    }

    hasSelectedOption() {
        return this.modelValue() !== undefined;
    }

    isValidSelectedOption(option) {
        return this.isValidOption(option) && this.isSelected(option);
    }

    equalityKey() {
        return this.optionValue() ? undefined : this.dataKey();
    }

    findFirstFocusedOptionIndex() {
        const selectedIndex = this.findSelectedOptionIndex();
        return selectedIndex < 0 ? this.findFirstOptionIndex() : selectedIndex;
    }

    findFirstOptionIndex() {
        return this.visibleOptions().findIndex((option) => this.isValidOption(option));
    }

    findSelectedOptionIndex() {
        return this.hasSelectedOption() ? this.visibleOptions().findIndex((option) => this.isValidSelectedOption(option)) : -1;
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

    findPrevOptionIndex(index) {
        const matchedOptionIndex = index > 0 ? findLastIndex(this.visibleOptions().slice(0, index), (option) => this.isValidOption(option)) : -1;

        return matchedOptionIndex > -1 ? matchedOptionIndex : index;
    }

    findLastOptionIndex() {
        return findLastIndex(this.visibleOptions(), (option) => this.isValidOption(option));
    }

    findLastFocusedOptionIndex() {
        const selectedIndex = this.findSelectedOptionIndex();

        return selectedIndex < 0 ? this.findLastOptionIndex() : selectedIndex;
    }

    isValidOption(option) {
        return option !== undefined && option !== null && !(this.isOptionDisabled(option) || this.isOptionGroup(option));
    }

    isOptionGroup(option) {
        return this.optionGroupLabel() !== undefined && this.optionGroupLabel() !== null && option.optionGroup !== undefined && option.optionGroup !== null && option.group;
    }

    onArrowUpKey(event: KeyboardEvent, pressedInInputText: boolean = false) {
        if (event.altKey && !pressedInInputText) {
            if (this.focusedOptionIndex() !== -1) {
                const option = this.visibleOptions()[this.focusedOptionIndex()];
                this.onOptionSelect(event, option);
            }

            this.overlayVisible && this.hide();
        } else {
            const optionIndex = this.focusedOptionIndex() !== -1 ? this.findPrevOptionIndex(this.focusedOptionIndex()) : this.clicked() ? this.findLastOptionIndex() : this.findLastFocusedOptionIndex();

            this.changeFocusedOptionIndex(event, optionIndex);

            !this.overlayVisible && this.show();
        }
        event.preventDefault();
        event.stopPropagation();
    }

    onArrowLeftKey(event: KeyboardEvent, pressedInInputText: boolean = false) {
        pressedInInputText && this.focusedOptionIndex.set(-1);
    }

    onDeleteKey(event: KeyboardEvent) {
        if (this.showClear()) {
            this.clear(event);
            event.preventDefault();
        }
    }

    onHomeKey(event: any, pressedInInputText: boolean = false) {
        if (pressedInInputText && event.currentTarget && event.currentTarget.setSelectionRange) {
            const target = event.currentTarget;
            if (event.shiftKey) {
                target.setSelectionRange(0, target.value.length);
            } else {
                target.setSelectionRange(0, 0);
                this.focusedOptionIndex.set(-1);
            }
        } else {
            this.changeFocusedOptionIndex(event, this.findFirstOptionIndex());

            !this.overlayVisible && this.show();
        }

        event.preventDefault();
    }

    onEndKey(event: any, pressedInInputText = false) {
        if (pressedInInputText && event.currentTarget && event.currentTarget.setSelectionRange) {
            const target = event.currentTarget;

            if (event.shiftKey) {
                target.setSelectionRange(0, target.value.length);
            } else {
                const len = target.value.length;

                target.setSelectionRange(len, len);
                this.focusedOptionIndex.set(-1);
            }
        } else {
            this.changeFocusedOptionIndex(event, this.findLastOptionIndex());

            !this.overlayVisible && this.show();
        }

        event.preventDefault();
    }

    onPageDownKey(event: KeyboardEvent) {
        this.scrollInView(this.visibleOptions().length - 1);
        event.preventDefault();
    }

    onPageUpKey(event: KeyboardEvent) {
        this.scrollInView(0);
        event.preventDefault();
    }

    onSpaceKey(event: KeyboardEvent, pressedInInputText: boolean = false) {
        !this.editable() && !pressedInInputText && this.onEnterKey(event);
    }

    onEnterKey(event, pressedInInput = false) {
        if (!this.overlayVisible) {
            this.focusedOptionIndex.set(-1);
            this.onArrowDownKey(event);
        } else {
            if (this.focusedOptionIndex() !== -1) {
                const option = this.visibleOptions()[this.focusedOptionIndex()];
                this.onOptionSelect(event, option);
            }

            !pressedInInput && this.hide();
        }

        event.preventDefault();
    }

    onEscapeKey(event: KeyboardEvent) {
        if (this.overlayVisible) {
            this.hide(true);
            event.preventDefault();
            event.stopPropagation();
        }
    }

    onTabKey(event, pressedInInputText = false) {
        if (!pressedInInputText) {
            if (this.overlayVisible && this.hasFocusableElements()) {
                focus(event.shiftKey ? this.lastHiddenFocusableElementOnOverlay()?.nativeElement : this.firstHiddenFocusableElementOnOverlay()?.nativeElement);
                event.preventDefault();
            } else {
                if (this.focusedOptionIndex() !== -1 && this.overlayVisible) {
                    const option = this.visibleOptions()[this.focusedOptionIndex()];
                    this.onOptionSelect(event, option);
                }
                this.overlayVisible && this.hide(this.filter());
            }
        }
        event.stopPropagation();
    }

    onFirstHiddenFocus(event) {
        const focusableEl =
            event.relatedTarget === this.focusInputViewChild()?.nativeElement ? getFirstFocusableElement(this.overlayViewChild()?.el?.nativeElement, ':not([data-p-hidden-focusable="true"])') : this.focusInputViewChild()?.nativeElement;
        focus(focusableEl);
    }

    onLastHiddenFocus(event) {
        const focusableEl =
            event.relatedTarget === this.focusInputViewChild()?.nativeElement ? getLastFocusableElement(this.overlayViewChild()?.overlayViewChild()?.nativeElement, ':not([data-p-hidden-focusable="true"])') : this.focusInputViewChild()?.nativeElement;

        focus(focusableEl);
    }

    hasFocusableElements() {
        return getFocusableElements(this.overlayViewChild()?.overlayViewChild()?.nativeElement, ':not([data-p-hidden-focusable="true"])').length > 0;
    }

    onBackspaceKey(event: KeyboardEvent, pressedInInputText = false) {
        if (pressedInInputText) {
            !this.overlayVisible && this.show();
        }
    }

    searchFields() {
        return this.filterBy()?.split(',') || this.filterFields() || [this.optionLabel()];
    }

    searchOptions(event, char) {
        this.searchValue = (this.searchValue || '') + char;

        let optionIndex = -1;
        let matched = false;

        optionIndex = this.visibleOptions().findIndex((option) => this.isOptionMatched(option));

        if (optionIndex !== -1) {
            matched = true;
        }

        if (optionIndex === -1 && this.focusedOptionIndex() === -1) {
            optionIndex = this.findFirstFocusedOptionIndex();
        }

        if (optionIndex !== -1) {
            setTimeout(() => {
                this.changeFocusedOptionIndex(event, optionIndex);
            });
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
        return this.isValidOption(option) && this.getOptionLabel(option).toString().toLocaleLowerCase(this.filterLocale()).startsWith(this.searchValue?.toLocaleLowerCase(this.filterLocale()));
    }

    onFilterInputChange(event: Event | any): void {
        let value: string = (event.target as HTMLInputElement).value;
        this._filterValue.set(value);
        this.focusedOptionIndex.set(-1);
        this.onFilter.emit({ originalEvent: event, filter: this._filterValue() });
        !this.virtualScrollerDisabled && this.scroller()?.scrollToIndex(0);
        setTimeout(() => {
            this.overlayViewChild()?.alignOverlay();
        });
        this.cd.markForCheck();
    }

    applyFocus(): void {
        if (this.editable()) (findSingle(this.el.nativeElement, '[data-pc-section="label"]') as any).focus();
        else focus(this.focusInputViewChild()?.nativeElement);
    }
    /**
     * Applies focus.
     * @group Method
     */
    public focus(): void {
        this.applyFocus();
    }
    /**
     * Clears the model.
     * @group Method
     */
    public clear(event?: Event) {
        this.updateModel(null, event);
        this.clearEditableLabel();
        this.onModelTouched();
        this.onChange.emit({ originalEvent: event, value: this.value });
        this.onClear.emit(event as Event);
        this.resetFilter();
    }

    /**
     * @override
     *
     * @see {@link BaseEditableHolder.writeControlValue}
     * Writes the value to the control.
     */
    writeControlValue(value: any, setModelValue: (value: any) => void): void {
        if (this.filter()) {
            this.resetFilter();
        }

        this.value = value;
        this.allowModelChange() && this.onModelChange(value);
        setModelValue(this.value);
        this.updateEditableLabel();
        this.cd.markForCheck();
    }

    get containerDataP() {
        return this.cn({
            invalid: this.invalid(),
            disabled: this.$disabled(),
            focus: this.focused,
            fluid: this.hasFluid,
            filled: this.$variant() === 'filled',
            [this.size() as string]: this.size()
        });
    }

    get labelDataP() {
        return this.cn({
            placeholder: this.label() === this._placeholder(),
            clearable: this.showClear(),
            disabled: this.$disabled(),
            [this.size() as string]: this.size(),
            empty: !this.editable() && !this.selectedItemTemplate() && (!this.label() || this.label() === 'p-emptylabel' || this.label()?.length === 0)
        });
    }

    get dropdownIconDataP() {
        return this.cn({
            [this.size() as string]: this.size()
        });
    }

    get overlayDataP() {
        return this.cn({
            ['overlay-' + this.$appendTo()]: 'overlay-' + this.$appendTo()
        });
    }
}

@NgModule({
    imports: [Select, SharedModule],
    exports: [Select, SharedModule]
})
export class SelectModule {}
