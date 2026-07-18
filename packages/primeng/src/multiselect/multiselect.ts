import { CommonModule } from '@angular/common';
import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    ContentChild,
    ContentChildren,
    effect,
    ElementRef,
    EventEmitter,
    forwardRef,
    inject,
    InjectionToken,
    input,
    Input,
    NgModule,
    NgZone,
    numberAttribute,
    Output,
    QueryList,
    Signal,
    signal,
    TemplateRef,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MotionOptions } from '@primeuix/motion';
import { deepEquals, equals, findLastIndex, findSingle, focus, getFirstFocusableElement, getFocusableElements, getLastFocusableElement, isArray, isNotEmpty, isPrintableCharacter, resolveFieldData, uuid } from '@primeuix/utils';
import { FilterService, Footer, Header, OverlayOptions, OverlayService, PrimeTemplate, ScrollerOptions, SharedModule, TranslationKeys } from 'voxx-ui/api';
import { AutoFocus } from 'voxx-ui/autofocus';
import { BaseComponent, PARENT_INSTANCE } from 'voxx-ui/basecomponent';
import { BaseEditableHolder } from 'voxx-ui/baseeditableholder';
import { Bind, BindModule } from 'voxx-ui/bind';
import { Checkbox } from 'voxx-ui/checkbox';
import { Chip } from 'voxx-ui/chip';
import { DomHandler, unblockBodyScroll } from 'voxx-ui/dom';
import { Fluid } from 'voxx-ui/fluid';
import { IconField } from 'voxx-ui/iconfield';
import { CheckIcon, ChevronDownIcon, SearchIcon, TimesIcon } from 'voxx-ui/icons';
import { InputIcon } from 'voxx-ui/inputicon';
import { InputText } from 'voxx-ui/inputtext';
import { Overlay } from 'voxx-ui/overlay';
import { Scroller } from 'voxx-ui/scroller';
import { Tooltip } from 'voxx-ui/tooltip';
import { Nullable } from 'voxx-ui/ts-helpers';
import {
    MultiSelectBlurEvent,
    MultiSelectChangeEvent,
    MultiSelectChipIconTemplateContext,
    MultiSelectDropdownIconTemplateContext,
    MultiSelectFilterEvent,
    MultiSelectFilterOptions,
    MultiSelectFilterTemplateContext,
    MultiSelectFocusEvent,
    MultiSelectGroupTemplateContext,
    MultiSelectHeaderCheckboxIconTemplateContext,
    MultiSelectItemCheckboxIconTemplateContext,
    MultiSelectItemTemplateContext,
    MultiSelectLazyLoadEvent,
    MultiSelectLoaderTemplateContext,
    MultiSelectPassThrough,
    MultiSelectRemoveEvent,
    MultiSelectSelectAllChangeEvent,
    MultiSelectSelectedItemsTemplateContext
} from 'voxx-ui/types/multiselect';
import { ObjectUtils } from 'voxx-ui/utils';
import { MultiSelectStyle } from './style/multiselectstyle';

const MULTISELECT_INSTANCE = new InjectionToken<MultiSelect>('MULTISELECT_INSTANCE');
const MULTISELECT_ITEM_INSTANCE = new InjectionToken<MultiSelectItem>('MULTISELECT_ITEM_INSTANCE');

export const MULTISELECT_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MultiSelect),
    multi: true
};

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'li[vxMultiSelectItem]',
    imports: [CommonModule, Checkbox, FormsModule, SharedModule],
    template: `
        <vx-checkbox [ngModel]="selected" [binary]="true" [tabindex]="-1" [variant]="variant" [ariaLabel]="label" [pt]="getPTOptions('pcOptionCheckbox')" [unstyled]="unstyled()">
            @if (itemCheckboxIconTemplate) {
                <ng-template #icon let-klass="class">
                    <ng-template *ngTemplateOutlet="itemCheckboxIconTemplate; context: { checked: selected, class: klass }"></ng-template>
                </ng-template>
            }
        </vx-checkbox>
        @if (!template) {
            <span>{{ label ?? 'empty' }}</span>
        }
        <ng-container *ngTemplateOutlet="template; context: { $implicit: option }"></ng-container>
    `,
    encapsulation: ViewEncapsulation.None,
    providers: [MultiSelectStyle],
    host: {
        '[style.height.px]': 'itemSize',
        '[attr.aria-label]': 'label',
        role: 'option',
        '[attr.aria-setsize]': 'ariaSetSize',
        '[attr.aria-posinset]': 'ariaPosInset',
        '[attr.aria-selected]': 'selected',
        '[attr.data-p-selected]': 'selected',
        '[attr.data-p-focused]': 'focused',
        '[attr.data-p-highlight]': 'selected',
        '[attr.data-p-disabled]': 'disabled',
        '[attr.aria-checked]': 'selected',
        '(click)': 'onOptionClick($event)',
        '(mouseenter)': 'onOptionMouseEnter($event)',
        '[class]': "cx('option')"
    }
})
export class MultiSelectItem extends BaseComponent {
    $pcMultiSelectItem: MultiSelectItem | undefined = inject(MULTISELECT_ITEM_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    hostName = 'MultiSelect';

    getPTOptions(key) {
        return this.ptm(key, {
            context: {
                selected: this.selected,
                focused: this.focused,
                disabled: this.disabled
            }
        });
    }

    @Input() option: any;

    @Input({ transform: booleanAttribute }) selected: boolean | undefined;

    @Input() label: string | undefined;

    @Input({ transform: booleanAttribute }) disabled: boolean | undefined;

    @Input({ transform: numberAttribute }) itemSize: number | undefined;

    @Input({ transform: booleanAttribute }) focused: boolean | undefined;

    @Input() ariaPosInset: string | undefined;

    @Input() ariaSetSize: string | undefined;

    @Input() variant: 'outlined' | 'filled' | undefined;

    @Input() template: TemplateRef<MultiSelectItemTemplateContext> | undefined;

    @Input() checkIconTemplate: TemplateRef<MultiSelectItemCheckboxIconTemplateContext> | undefined;

    @Input() itemCheckboxIconTemplate: TemplateRef<MultiSelectItemCheckboxIconTemplateContext> | undefined;

    @Input({ transform: booleanAttribute }) highlightOnSelect: boolean | undefined;

    @Output() onClick: EventEmitter<any> = new EventEmitter();

    @Output() onMouseEnter: EventEmitter<any> = new EventEmitter();

    _componentStyle = inject(MultiSelectStyle);

    onOptionClick(event: Event) {
        this.onClick.emit({
            originalEvent: event,
            option: this.option,
            selected: this.selected
        });
        event.stopPropagation();
        event.preventDefault();
    }

    onOptionMouseEnter(event: Event) {
        this.onMouseEnter.emit({
            originalEvent: event,
            option: this.option,
            selected: this.selected
        });
    }
}

/**
 * MultiSelect is used to select multiple items from a collection.
 * @group Components
 */
@Component({
    selector: 'vx-multiSelect, vx-multiselect, vx-multi-select',
    imports: [CommonModule, MultiSelectItem, Overlay, SharedModule, Tooltip, Scroller, AutoFocus, CheckIcon, SearchIcon, TimesIcon, ChevronDownIcon, IconField, InputIcon, InputText, Chip, Checkbox, FormsModule, BindModule],
    hostDirectives: [Bind],
    template: `
        <div class="p-hidden-accessible" [attr.data-p-hidden-accessible]="true" [vxBind]="ptm('hiddenInputContainer')">
            <input
                #focusInput
                [vxTooltip]="tooltip"
                [vxTooltipUnstyled]="unstyled()"
                [tooltipPosition]="tooltipPosition"
                [positionStyle]="tooltipPositionStyle"
                [tooltipStyleClass]="tooltipStyleClass"
                [attr.aria-disabled]="$disabled()"
                [attr.id]="inputId"
                role="combobox"
                [attr.aria-label]="ariaLabel"
                [attr.aria-labelledby]="ariaLabelledBy"
                [attr.aria-haspopup]="'listbox'"
                [attr.aria-expanded]="overlayVisible ?? false"
                [attr.aria-controls]="overlayVisible ? id + '_list' : null"
                [attr.tabindex]="!$disabled() ? tabindex : -1"
                [attr.aria-activedescendant]="focused ? focusedOptionId : undefined"
                (focus)="onInputFocus($event)"
                (blur)="onInputBlur($event)"
                (keydown)="onKeyDown($event)"
                [vxAutoFocus]="autofocus"
                [attr.value]="modelValue()"
                [attr.name]="name()"
                [attr.required]="required() ? '' : undefined"
                [attr.disabled]="$disabled() ? '' : undefined"
                [vxBind]="ptm('hiddenInput')"
            />
        </div>
        <div
            [vxBind]="ptm('labelContainer')"
            [class]="cx('labelContainer')"
            [vxTooltip]="tooltip"
            [vxTooltipUnstyled]="unstyled()"
            (mouseleave)="labelContainerMouseLeave()"
            [tooltipDisabled]="_disableTooltip"
            [tooltipPosition]="tooltipPosition"
            [positionStyle]="tooltipPositionStyle"
            [tooltipStyleClass]="tooltipStyleClass"
        >
            <div [vxBind]="ptm('label')" [class]="cx('label')" [attr.data-p]="labelDataP">
                @if (!selectedItemsTemplate && !_selectedItemsTemplate) {
                    @if (display === 'comma') {
                        {{ label() || 'empty' }}
                    }
                    @if (display === 'chip') {
                        @if (chipSelectedItems() && chipSelectedItems().length === maxSelectedLabels) {
                            {{ getSelectedItemsLabel() }}
                        } @else {
                            @for (item of chipSelectedItems(); track item; let i = $index) {
                                <div #token [vxBind]="ptm('chipItem')" [class]="cx('chipItem')">
                                    <vx-chip [pt]="ptm('pcChip')" [unstyled]="unstyled()" [class]="cx('pcChip')" [label]="getLabelByValue(item)" [removable]="!$disabled() && !readonly" (onRemove)="removeOption(item, $event)" [removeIcon]="chipIcon">
                                        @if (chipIconTemplate || _chipIconTemplate || removeTokenIconTemplate || _removeTokenIconTemplate) {
                                            <ng-template #removeicon>
                                                @if (!$disabled() && !readonly) {
                                                    @if (chipIconTemplate || _chipIconTemplate || removeTokenIconTemplate || _removeTokenIconTemplate) {
                                                        <span [class]="cx('chipIcon')" (click)="removeOption(item, $event)" [attr.aria-hidden]="true" [vxBind]="ptm('chipIcon')">
                                                            <ng-container *ngTemplateOutlet="chipIconTemplate || _chipIconTemplate || removeTokenIconTemplate || _removeTokenIconTemplate; context: { class: 'p-multiselect-chip-icon' }"></ng-container>
                                                        </span>
                                                    }
                                                }
                                            </ng-template>
                                        }
                                    </vx-chip>
                                </div>
                            }
                        }
                        @if (!modelValue() || modelValue().length === 0) {
                            {{ placeholder() || 'empty' }}
                        }
                    }
                }
                @if (selectedItemsTemplate || _selectedItemsTemplate) {
                    <ng-container *ngTemplateOutlet="selectedItemsTemplate || _selectedItemsTemplate; context: { $implicit: selectedOptions, removeChip: removeOption.bind(this) }"></ng-container>
                    @if (!modelValue() || modelValue().length === 0) {
                        {{ placeholder() || 'empty' }}
                    }
                }
            </div>
        </div>
        @if (isVisibleClearIcon) {
            @if (!clearIconTemplate && !_clearIconTemplate) {
                <svg data-p-icon="times" [vxBind]="ptm('clearIcon')" [class]="cx('clearIcon')" (click)="clear($event)" [attr.aria-hidden]="true" />
            }
            @if (clearIconTemplate || _clearIconTemplate) {
                <span [vxBind]="ptm('clearIcon')" [class]="cx('clearIcon')" (click)="clear($event)" [attr.aria-hidden]="true">
                    <ng-template *ngTemplateOutlet="clearIconTemplate || _clearIconTemplate"></ng-template>
                </span>
            }
        }
        <div [vxBind]="ptm('dropdown')" [class]="cx('dropdown')">
            @if (loading) {
                @if (loadingIconTemplate || _loadingIconTemplate) {
                    <ng-container *ngTemplateOutlet="loadingIconTemplate || _loadingIconTemplate"></ng-container>
                }
                @if (!loadingIconTemplate && !_loadingIconTemplate) {
                    @if (loadingIcon) {
                        <span [vxBind]="ptm('loadingIcon')" [class]="cn(cx('loadingIcon'), 'pi-spin ' + loadingIcon)" [attr.aria-hidden]="true"></span>
                    }
                    @if (!loadingIcon) {
                        <span [vxBind]="ptm('loadingIcon')" [class]="cn(cx('loadingIcon'), 'pi pi-spinner pi-spin')" [attr.aria-hidden]="true"></span>
                    }
                }
            } @else {
                @if (!dropdownIconTemplate && !_dropdownIconTemplate) {
                    @if (dropdownIcon) {
                        <span [vxBind]="ptm('dropdownIcon')" [class]="cx('dropdownIcon') ?? ''" [ngClass]="dropdownIcon" [attr.aria-hidden]="true" [attr.data-p]="dropdownIconDataP"></span>
                    }
                    @if (!dropdownIcon) {
                        <svg data-p-icon="chevron-down" [vxBind]="ptm('dropdownIcon')" [class]="cx('dropdownIcon')" [attr.aria-hidden]="true" [attr.data-p]="dropdownIconDataP" />
                    }
                }
                @if (dropdownIconTemplate || _dropdownIconTemplate) {
                    <span [vxBind]="ptm('dropdownIcon')" [class]="cx('dropdownIcon')" [attr.aria-hidden]="true">
                        <ng-template *ngTemplateOutlet="dropdownIconTemplate || _dropdownIconTemplate; context: { dataP: dropdownIconDataP }"></ng-template>
                    </span>
                }
            }
        </div>
        <vx-overlay
            #overlay
            [hostAttrSelector]="$attrSelector"
            [(visible)]="overlayVisible"
            [options]="overlayOptions"
            [target]="'@parent'"
            [appendTo]="$appendTo()"
            [unstyled]="unstyled()"
            [pt]="ptm('pcOverlay')"
            [motionOptions]="motionOptions()"
            (onBeforeEnter)="onOverlayBeforeEnter($event)"
            (onAfterLeave)="onOverlayAfterLeave($event)"
            (onHide)="onOverlayHide($event)"
        >
            <ng-template #content>
                <div [vxBind]="ptm('overlay')" [attr.data-p]="overlayDataP" [attr.id]="id + '_list'" [class]="cn(cx('overlay'), panelStyleClass)" [ngStyle]="panelStyle">
                    <span
                        #firstHiddenFocusableEl
                        role="presentation"
                        class="p-hidden-accessible p-hidden-focusable"
                        [attr.tabindex]="0"
                        (focus)="onFirstHiddenFocus($event)"
                        [attr.data-p-hidden-accessible]="true"
                        [attr.data-p-hidden-focusable]="true"
                        [vxBind]="ptm('firstHiddenFocusableEl')"
                    >
                    </span>
                    <ng-container *ngTemplateOutlet="headerTemplate || _headerTemplate"></ng-container>
                    @if (showHeader) {
                        <div [vxBind]="ptm('header')" [class]="cx('header')">
                            <ng-content select="vx-header"></ng-content>
                            @if (filterTemplate || _filterTemplate) {
                                <ng-container *ngTemplateOutlet="filterTemplate || _filterTemplate; context: { options: filterOptions }"></ng-container>
                            } @else {
                                @if (showToggleAll && !selectionLimit) {
                                    <vx-checkbox
                                        [pt]="getHeaderCheckboxPTOptions('pcHeaderCheckbox')"
                                        [ngModel]="allSelected()"
                                        [ariaLabel]="toggleAllAriaLabel"
                                        [binary]="true"
                                        (onChange)="onToggleAll($event)"
                                        [variant]="$variant()"
                                        [disabled]="$disabled()"
                                        [unstyled]="unstyled()"
                                        #headerCheckbox
                                    >
                                        <ng-template #icon let-klass="class">
                                            @if (!headerCheckboxIconTemplate && !_headerCheckboxIconTemplate && allSelected()) {
                                                <svg data-p-icon="check" [class]="klass" [vxBind]="getHeaderCheckboxPTOptions('pcHeaderCheckbox.icon')" />
                                            }
                                            <ng-template
                                                *ngTemplateOutlet="
                                                    headerCheckboxIconTemplate || _headerCheckboxIconTemplate;
                                                    context: {
                                                        checked: allSelected(),
                                                        partialSelected: partialSelected(),
                                                        class: klass
                                                    }
                                                "
                                            ></ng-template>
                                        </ng-template>
                                    </vx-checkbox>
                                }
                                @if (filter) {
                                    <vx-iconfield [pt]="ptm('pcFilterContainer')" [class]="cx('pcFilterContainer')" [unstyled]="unstyled()">
                                        <input
                                            #filterInput
                                            vxInputText
                                            [pt]="ptm('pcFilter')"
                                            [variant]="$variant()"
                                            type="text"
                                            [attr.autocomplete]="autocomplete"
                                            role="searchbox"
                                            [attr.aria-owns]="id + '_list'"
                                            [attr.aria-activedescendant]="focusedOptionId"
                                            [value]="_filterValue() || ''"
                                            (input)="onFilterInputChange($event)"
                                            (keydown)="onFilterKeyDown($event)"
                                            (click)="onInputClick($event)"
                                            (blur)="onFilterBlur($event)"
                                            [class]="cx('pcFilter')"
                                            [attr.disabled]="$disabled() ? '' : undefined"
                                            [attr.placeholder]="filterPlaceHolder"
                                            [attr.aria-label]="ariaFilterLabel"
                                            [unstyled]="unstyled()"
                                        />
                                        <vx-inputicon [pt]="ptm('pcFilterIconContainer')" [unstyled]="unstyled()">
                                            @if (!filterIconTemplate && !_filterIconTemplate) {
                                                <svg data-p-icon="search" [vxBind]="ptm('filterIcon')" />
                                            }
                                            @if (filterIconTemplate || _filterIconTemplate) {
                                                <span [vxBind]="ptm('filterIcon')" class="p-multiselect-filter-icon">
                                                    <ng-template *ngTemplateOutlet="filterIconTemplate || _filterIconTemplate"></ng-template>
                                                </span>
                                            }
                                        </vx-inputicon>
                                    </vx-iconfield>
                                }
                            }
                        </div>
                    }
                    <div [vxBind]="ptm('listContainer')" [class]="cx('listContainer')" [style.max-height]="virtualScroll ? 'auto' : scrollHeight || 'auto'">
                        @if (virtualScroll) {
                            <vx-scroller
                                #scroller
                                [items]="visibleOptions()"
                                [style]="{ height: scrollHeight }"
                                [itemSize]="virtualScrollItemSize"
                                [autoSize]="true"
                                [tabindex]="-1"
                                [lazy]="lazy"
                                (onLazyLoad)="onLazyLoad.emit($event)"
                                [options]="virtualScrollOptions"
                            >
                                <ng-template #content let-items let-scrollerOptions="options">
                                    <ng-container *ngTemplateOutlet="buildInItems; context: { $implicit: items, options: scrollerOptions }"></ng-container>
                                </ng-template>
                                @if (loaderTemplate || _loaderTemplate) {
                                    <ng-template #loader let-scrollerOptions="options">
                                        <ng-container *ngTemplateOutlet="loaderTemplate || _loaderTemplate; context: { options: scrollerOptions }"></ng-container>
                                    </ng-template>
                                }
                            </vx-scroller>
                        }
                        @if (!virtualScroll) {
                            <ng-container *ngTemplateOutlet="buildInItems; context: { $implicit: visibleOptions(), options: {} }"></ng-container>
                        }

                        <ng-template #buildInItems let-items let-scrollerOptions="options">
                            <ul #items [vxBind]="ptm('list')" [class]="cn(cx('list'), scrollerOptions.contentStyleClass)" [style]="scrollerOptions.contentStyle" role="listbox" aria-multiselectable="true" [attr.aria-label]="listLabel">
                                @for (option of items; track option; let i = $index) {
                                    @if (isOptionGroup(option)) {
                                        <li [vxBind]="ptm('optionGroup')" [attr.id]="id + '_' + getOptionIndex(i, scrollerOptions)" [class]="cx('optionGroup')" [ngStyle]="{ height: scrollerOptions.itemSize + 'px' }" role="option">
                                            @if (!groupTemplate && option.optionGroup) {
                                                <span>{{ getOptionGroupLabel(option.optionGroup) }}</span>
                                            }
                                            @if (option.optionGroup && groupTemplate) {
                                                <ng-container [ngTemplateOutlet]="groupTemplate" [ngTemplateOutletContext]="{ $implicit: option.optionGroup }"></ng-container>
                                            }
                                        </li>
                                    }
                                    @if (!isOptionGroup(option)) {
                                        <li
                                            vxMultiSelectItem
                                            vxRipple
                                            [vxBind]="getPTOptions(option, scrollerOptions, i, 'option')"
                                            [id]="id + '_' + getOptionIndex(i, scrollerOptions)"
                                            [option]="option"
                                            [selected]="isSelected(option)"
                                            [label]="getOptionLabel(option)"
                                            [disabled]="isOptionDisabled(option)"
                                            [template]="itemTemplate || _itemTemplate"
                                            [itemCheckboxIconTemplate]="itemCheckboxIconTemplate || _itemCheckboxIconTemplate"
                                            [itemSize]="scrollerOptions.itemSize"
                                            [focused]="focusedOptionIndex() === getOptionIndex(i, scrollerOptions)"
                                            [ariaPosInset]="getAriaPosInset(getOptionIndex(i, scrollerOptions))"
                                            [ariaSetSize]="ariaSetSize"
                                            [variant]="$variant()"
                                            [highlightOnSelect]="highlightOnSelect"
                                            (onClick)="onOptionSelect($event, false, getOptionIndex(i, scrollerOptions))"
                                            (onMouseEnter)="onOptionMouseEnter($event, getOptionIndex(i, scrollerOptions))"
                                            [pt]="pt"
                                            [unstyled]="unstyled()"
                                        ></li>
                                    }
                                }

                                @if (hasFilter() && isEmpty()) {
                                    <li [vxBind]="ptm('emptyMessage')" [class]="cx('emptyMessage')" [ngStyle]="{ height: scrollerOptions.itemSize + 'px' }" role="option">
                                        @if (!emptyFilterTemplate && !_emptyFilterTemplate && !emptyTemplate && !_emptyTemplate) {
                                            {{ emptyFilterMessageLabel }}
                                        } @else {
                                            <ng-container *ngTemplateOutlet="emptyFilterTemplate || _emptyFilterTemplate || emptyTemplate || _emptyFilterTemplate"></ng-container>
                                        }
                                    </li>
                                }
                                @if (!hasFilter() && isEmpty()) {
                                    <li [vxBind]="ptm('emptyMessage')" [class]="cx('emptyMessage')" [ngStyle]="{ height: scrollerOptions.itemSize + 'px' }" role="option">
                                        @if (!emptyTemplate && !_emptyTemplate) {
                                            {{ emptyMessageLabel }}
                                        } @else {
                                            <ng-container *ngTemplateOutlet="emptyTemplate || _emptyTemplate"></ng-container>
                                        }
                                    </li>
                                }
                            </ul>
                        </ng-template>
                    </div>
                    @if (footerFacet || footerTemplate || _footerTemplate) {
                        <div>
                            <ng-content select="vx-footer"></ng-content>
                            <ng-container *ngTemplateOutlet="footerTemplate || _footerTemplate"></ng-container>
                        </div>
                    }

                    <span
                        #lastHiddenFocusableEl
                        role="presentation"
                        class="p-hidden-accessible p-hidden-focusable"
                        [attr.tabindex]="0"
                        (focus)="onLastHiddenFocus($event)"
                        [attr.data-p-hidden-accessible]="true"
                        [attr.data-p-hidden-focusable]="true"
                        [vxBind]="ptm('lastHiddenFocusableEl')"
                    ></span>
                </div>
            </ng-template>
        </vx-overlay>
    `,
    providers: [MULTISELECT_VALUE_ACCESSOR, MultiSelectStyle, { provide: MULTISELECT_INSTANCE, useExisting: MultiSelect }, { provide: PARENT_INSTANCE, useExisting: MultiSelect }],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[attr.id]': 'id',
        '[attr.data-p]': 'containerDataP',
        '(click)': 'onContainerClick($event)',
        '[class]': "cn(cx('root'), styleClass)",
        '[style]': "sx('root')"
    }
})
export class MultiSelect extends BaseEditableHolder<MultiSelectPassThrough> {
    componentName = 'MultiSelect';

    /**
     * Unique identifier of the component
     * @group Props
     */
    @Input() id: string | undefined;
    /**
     * Defines a string that labels the input for accessibility.
     * @group Props
     */
    @Input() ariaLabel: string | undefined;
    /**
     * Style class of the element.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    @Input() styleClass: string | undefined;
    /**
     * Inline style of the overlay panel.
     * @group Props
     */
    @Input() panelStyle: any;
    /**
     * Style class of the overlay panel element.
     * @group Props
     */
    @Input() panelStyleClass: string | undefined;
    /**
     * Identifier of the focus input to match a label defined for the component.
     * @group Props
     */
    @Input() inputId: string | undefined;
    /**
     * When present, it specifies that the component cannot be edited.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) readonly: boolean | undefined;
    /**
     * Whether to display options as grouped when nested options are provided.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) group: boolean | undefined;
    /**
     * When specified, displays an input field to filter the items on keyup.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) filter: boolean = true;
    /**
     * Defines placeholder of the filter input.
     * @group Props
     */
    @Input() filterPlaceHolder: string | undefined;
    /**
     * Locale to use in filtering. The default locale is the host environment's current locale.
     * @group Props
     */
    @Input() filterLocale: string | undefined;
    /**
     * Specifies the visibility of the options panel.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) overlayVisible: boolean | undefined = false;
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    @Input({ transform: numberAttribute }) tabindex: number | undefined = 0;
    /**
     * A property to uniquely identify a value in options.
     * @group Props
     */
    @Input() dataKey: string | undefined;
    /**
     * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
     * @group Props
     */
    @Input() ariaLabelledBy: string | undefined;
    /**
     * Whether to show labels of selected item labels or use default label.
     * @group Props
     * @defaultValue true
     */
    @Input() set displaySelectedLabel(val: boolean) {
        this._displaySelectedLabel = val;
    }
    get displaySelectedLabel(): boolean {
        return this._displaySelectedLabel;
    }
    /**
     * Decides how many selected item labels to show at most.
     * @group Props
     * @defaultValue 3
     */
    @Input() set maxSelectedLabels(val: number | null | undefined) {
        this._maxSelectedLabels = val;
    }
    get maxSelectedLabels(): number | null | undefined {
        return this._maxSelectedLabels;
    }
    /**
     * Maximum number of selectable items.
     * @group Props
     */
    @Input({ transform: numberAttribute }) selectionLimit: number | undefined;
    /**
     * Label to display after exceeding max selected labels e.g. ({0} items selected), defaults "ellipsis" keyword to indicate a text-overflow.
     * @group Props
     */
    @Input() selectedItemsLabel: string | undefined;
    /**
     * Whether to show the checkbox at header to toggle all items at once.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) showToggleAll: boolean = true;
    /**
     * Text to display when filtering does not return any results.
     * @group Props
     */
    @Input() emptyFilterMessage: string = '';
    /**
     * Text to display when there is no data. Defaults to global value in i18n translation configuration.
     * @group Props
     */
    @Input() emptyMessage: string = '';
    /**
     * Clears the filter value when hiding the dropdown.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) resetFilterOnHide: boolean = false;
    /**
     * Icon class of the dropdown icon.
     * @group Props
     */
    @Input() dropdownIcon: string | undefined;
    /**
     * Icon class of the chip icon.
     * @group Props
     */
    @Input() chipIcon: string | undefined;
    /**
     * Name of the label field of an option.
     * @group Props
     */
    @Input() optionLabel: string | undefined;
    /**
     * Name of the value field of an option.
     * @group Props
     */
    @Input() optionValue: string | undefined;
    /**
     * Name of the disabled field of an option.
     * @group Props
     */
    @Input() optionDisabled: string | undefined;
    /**
     * Name of the label field of an option group.
     * @group Props
     */
    @Input() optionGroupLabel: string | undefined = 'label';
    /**
     * Name of the options field of an option group.
     * @group Props
     */
    @Input() optionGroupChildren: string = 'items';
    /**
     * Whether to show the header.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) showHeader: boolean = true;
    /**
     * When filtering is enabled, filterBy decides which field or fields (comma separated) to search against.
     * @group Props
     */
    @Input() filterBy: string | undefined;
    /**
     * Height of the viewport in pixels, a scrollbar is defined if height of list exceeds this value.
     * @group Props
     */
    @Input() scrollHeight: string = '200px';
    /**
     * Defines if data is loaded and interacted with in lazy manner.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) lazy: boolean = false;
    /**
     * Whether the data should be loaded on demand during scroll.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) virtualScroll: boolean | undefined;
    /**
     * Whether the multiselect is in loading state.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) loading: boolean | undefined = false;
    /**
     * Height of an item in the list for VirtualScrolling.
     * @group Props
     */
    @Input({ transform: numberAttribute }) virtualScrollItemSize: number | undefined;
    /**
     * Icon to display in loading state.
     * @group Props
     */
    @Input() loadingIcon: string | undefined;
    /**
     * Whether to use the scroller feature. The properties of scroller component can be used like an object in it.
     * @group Props
     */
    @Input() virtualScrollOptions: ScrollerOptions | undefined;
    /**
     * Whether to use overlay API feature. The properties of overlay API can be used like an object in it.
     * @group Props
     */
    @Input() overlayOptions: OverlayOptions | undefined;
    /**
     * Defines a string that labels the filter input.
     * @group Props
     */
    @Input() ariaFilterLabel: string | undefined;
    /**
     * Defines how the items are filtered.
     * @group Props
     */
    @Input() filterMatchMode: 'contains' | 'startsWith' | 'endsWith' | 'equals' | 'notEquals' | 'in' | 'lt' | 'lte' | 'gt' | 'gte' = 'contains';
    /**
     * Advisory information to display in a tooltip on hover.
     * @group Props
     */
    @Input() tooltip: string = '';
    /**
     * Position of the tooltip.
     * @group Props
     */
    @Input() tooltipPosition: 'top' | 'left' | 'right' | 'bottom' = 'right';
    /**
     * Type of CSS position.
     * @group Props
     */
    @Input() tooltipPositionStyle: string = 'absolute';
    /**
     * Style class of the tooltip.
     * @group Props
     */
    @Input() tooltipStyleClass: string | undefined;
    /**
     * Applies focus to the filter element when the overlay is shown.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) autofocusFilter: boolean = false;
    /**
     * Defines how the selected items are displayed.
     * @group Props
     */
    @Input() display: string | 'comma' | 'chip' = 'comma';
    /**
     * Defines the autocomplete is active.
     * @group Props
     */
    @Input() autocomplete: string = 'off';
    /**
     * When enabled, a clear icon is displayed to clear the value.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) showClear: boolean = false;
    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) autofocus: boolean | undefined;
    /**
     * Label to display when there are no selections.
     * @group Props
     */
    @Input() set placeholder(val: string | undefined) {
        this._placeholder.set(val);
    }
    get placeholder(): Signal<string | undefined> {
        return this._placeholder.asReadonly();
    }
    /**
     * An array of objects to display as the available options.
     * @group Props
     */
    @Input() get options(): any[] | undefined {
        return this._options();
    }
    set options(val: any[] | undefined) {
        if (!deepEquals(this._options(), val)) {
            this._options.set(val || []);
        }
    }
    /**
     * When specified, filter displays with this value.
     * @group Props
     */
    @Input() get filterValue(): string | undefined | null {
        return this._filterValue();
    }
    set filterValue(val: string | undefined | null) {
        this._filterValue.set(val);
    }
    /**
     * Whether all data is selected.
     * @group Props
     */
    @Input() get selectAll(): boolean | undefined | null {
        return this._selectAll;
    }
    set selectAll(value: boolean | undefined | null) {
        this._selectAll = value;
    }
    /**
     * Indicates whether to focus on options when hovering over them, defaults to optionLabel.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) focusOnHover: boolean = true;
    /**
     * Fields used when filtering the options, defaults to optionLabel.
     * @group Props
     */
    @Input() filterFields: any[] | undefined;
    /**
     * Determines if the option will be selected on focus.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) selectOnFocus: boolean = false;
    /**
     * Whether to focus on the first visible or selected element when the overlay panel is shown.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) autoOptionFocus: boolean = false;
    /**
     * Whether the selected option will be add highlight class.
     * @group Props
     */
    @Input({ transform: booleanAttribute }) highlightOnSelect: boolean = true;
    /**
     * Specifies the size of the component.
     * @defaultValue undefined
     * @group Props
     */
    size = input<'large' | 'small' | undefined>();
    /**
     * Specifies the input variant of the component.
     * @defaultValue undefined
     * @group Props
     */
    variant = input<'filled' | 'outlined' | undefined>();
    /**
     * Spans 100% width of the container when enabled.
     * @defaultValue undefined
     * @group Props
     */
    fluid = input(undefined, { transform: booleanAttribute });
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
     * Callback to invoke when value changes.
     * @param {MultiSelectChangeEvent} event - Custom change event.
     * @group Emits
     */
    @Output() onChange: EventEmitter<MultiSelectChangeEvent> = new EventEmitter<MultiSelectChangeEvent>();
    /**
     * Callback to invoke when data is filtered.
     * @param {MultiSelectFilterEvent} event - Custom filter event.
     * @group Emits
     */
    @Output() onFilter: EventEmitter<MultiSelectFilterEvent> = new EventEmitter<MultiSelectFilterEvent>();
    /**
     * Callback to invoke when multiselect receives focus.
     * @param {MultiSelectFocusEvent} event - Custom focus event.
     * @group Emits
     */
    @Output() onFocus: EventEmitter<MultiSelectFocusEvent> = new EventEmitter<MultiSelectFocusEvent>();
    /**
     * Callback to invoke when multiselect loses focus.
     * @param {MultiSelectBlurEvent} event - Custom blur event.
     * @group Emits
     */
    @Output() onBlur: EventEmitter<MultiSelectBlurEvent> = new EventEmitter<MultiSelectBlurEvent>();
    /**
     * Callback to invoke when component is clicked.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    @Output() onClick: EventEmitter<Event> = new EventEmitter<Event>();
    /**
     * Callback to invoke when input field is cleared.
     * @group Emits
     */
    @Output() onClear: EventEmitter<void> = new EventEmitter<void>();
    /**
     * Callback to invoke when overlay panel becomes visible.
     * @param {AnimationEvent} event - Animation event.
     * @group Emits
     */
    @Output() onPanelShow: EventEmitter<AnimationEvent> = new EventEmitter<AnimationEvent>();
    /**
     * Callback to invoke when overlay panel becomes hidden.
     * @param {AnimationEvent} event - Animation event.
     * @group Emits
     */
    @Output() onPanelHide: EventEmitter<AnimationEvent> = new EventEmitter<AnimationEvent>();
    /**
     * Callback to invoke in lazy mode to load new data.
     * @param {MultiSelectLazyLoadEvent} event - Lazy load event.
     * @group Emits
     */
    @Output() onLazyLoad: EventEmitter<MultiSelectLazyLoadEvent> = new EventEmitter<MultiSelectLazyLoadEvent>();
    /**
     * Callback to invoke in lazy mode to load new data.
     * @param {MultiSelectRemoveEvent} event - Remove event.
     * @group Emits
     */
    @Output() onRemove: EventEmitter<MultiSelectRemoveEvent> = new EventEmitter<MultiSelectRemoveEvent>();
    /**
     * Callback to invoke when all data is selected.
     * @param {MultiSelectSelectAllChangeEvent} event - Custom select event.
     * @group Emits
     */
    @Output() onSelectAllChange: EventEmitter<MultiSelectSelectAllChangeEvent> = new EventEmitter<MultiSelectSelectAllChangeEvent>();

    @ViewChild('overlay') overlayViewChild: Nullable<Overlay>;

    @ViewChild('filterInput') filterInputChild: Nullable<ElementRef>;

    @ViewChild('focusInput') focusInputViewChild: Nullable<ElementRef>;

    @ViewChild('items') itemsViewChild: Nullable<ElementRef>;

    @ViewChild('scroller') scroller: Nullable<Scroller>;

    @ViewChild('lastHiddenFocusableEl') lastHiddenFocusableElementOnOverlay: Nullable<ElementRef>;

    @ViewChild('firstHiddenFocusableEl') firstHiddenFocusableElementOnOverlay: Nullable<ElementRef>;

    @ViewChild('headerCheckbox') headerCheckboxViewChild: Nullable<Checkbox>;

    @ContentChild(Footer) footerFacet: any;

    @ContentChild(Header) headerFacet: any;

    _componentStyle = inject(MultiSelectStyle);

    bindDirectiveInstance = inject(Bind, { self: true });

    searchValue: Nullable<string>;

    searchTimeout: any;

    _selectAll: boolean | undefined | null = null;

    _placeholder = signal<string | undefined>(undefined);

    _disableTooltip = false;

    value: any[];

    public _filteredOptions: any[] | undefined | null;

    public focus: boolean | undefined;

    public filtered: boolean | undefined;

    /**
     * Custom item template.
     * @group Templates
     */
    @ContentChild('item', { descendants: false }) itemTemplate: TemplateRef<MultiSelectItemTemplateContext> | undefined;

    /**
     * Custom group template.
     * @group Templates
     */
    @ContentChild('group', { descendants: false }) groupTemplate: TemplateRef<MultiSelectGroupTemplateContext> | undefined;

    /**
     * Custom loader template.
     * @group Templates
     */
    @ContentChild('loader', { descendants: false }) loaderTemplate: TemplateRef<MultiSelectLoaderTemplateContext> | undefined;

    /**
     * Custom header template.
     * @group Templates
     */
    @ContentChild('header', { descendants: false }) headerTemplate: TemplateRef<void> | undefined;

    /**
     * Custom filter template.
     * @group Templates
     */
    @ContentChild('filter', { descendants: false }) filterTemplate: TemplateRef<MultiSelectFilterTemplateContext> | undefined;

    /**
     * Custom footer template.
     * @group Templates
     */
    @ContentChild('footer', { descendants: false }) footerTemplate: TemplateRef<void> | undefined;

    /**
     * Custom empty filter template.
     * @group Templates
     */
    @ContentChild('emptyfilter', { descendants: false }) emptyFilterTemplate: TemplateRef<void> | undefined;

    /**
     * Custom empty template.
     * @group Templates
     */
    @ContentChild('empty', { descendants: false }) emptyTemplate: TemplateRef<void> | undefined;

    /**
     * Custom selected items template.
     * @group Templates
     */
    @ContentChild('selecteditems', { descendants: false }) selectedItemsTemplate: TemplateRef<MultiSelectSelectedItemsTemplateContext> | undefined;

    /**
     * Custom loading icon template.
     * @group Templates
     */
    @ContentChild('loadingicon', { descendants: false }) loadingIconTemplate: TemplateRef<void> | undefined;

    /**
     * Custom filter icon template.
     * @group Templates
     */
    @ContentChild('filtericon', { descendants: false }) filterIconTemplate: TemplateRef<void> | undefined;

    /**
     * Custom remove token icon template.
     * @group Templates
     */
    @ContentChild('removetokenicon', { descendants: false }) removeTokenIconTemplate: TemplateRef<MultiSelectChipIconTemplateContext> | undefined;

    /**
     * Custom chip icon template.
     * @group Templates
     */
    @ContentChild('chipicon', { descendants: false }) chipIconTemplate: TemplateRef<MultiSelectChipIconTemplateContext> | undefined;

    /**
     * Custom clear icon template.
     * @group Templates
     */
    @ContentChild('clearicon', { descendants: false }) clearIconTemplate: TemplateRef<void> | undefined;

    /**
     * Custom dropdown icon template.
     * @group Templates
     */
    @ContentChild('dropdownicon', { descendants: false }) dropdownIconTemplate: TemplateRef<MultiSelectDropdownIconTemplateContext> | undefined;

    /**
     * Custom item checkbox icon template.
     * @group Templates
     */
    @ContentChild('itemcheckboxicon', { descendants: false }) itemCheckboxIconTemplate: TemplateRef<MultiSelectItemCheckboxIconTemplateContext> | undefined;

    /**
     * Custom header checkbox icon template.
     * @group Templates
     */
    @ContentChild('headercheckboxicon', { descendants: false }) headerCheckboxIconTemplate: TemplateRef<MultiSelectHeaderCheckboxIconTemplateContext> | undefined;

    @ContentChildren(PrimeTemplate) templates: Nullable<QueryList<PrimeTemplate>>;

    _itemTemplate: TemplateRef<MultiSelectItemTemplateContext> | undefined;

    _groupTemplate: TemplateRef<MultiSelectGroupTemplateContext> | undefined;

    _loaderTemplate: TemplateRef<MultiSelectLoaderTemplateContext> | undefined;

    _headerTemplate: TemplateRef<void> | undefined;

    _filterTemplate: TemplateRef<MultiSelectFilterTemplateContext> | undefined;

    _footerTemplate: TemplateRef<void> | undefined;

    _emptyFilterTemplate: TemplateRef<void> | undefined;

    _emptyTemplate: TemplateRef<void> | undefined;

    _selectedItemsTemplate: TemplateRef<MultiSelectSelectedItemsTemplateContext> | undefined;

    _loadingIconTemplate: TemplateRef<void> | undefined;

    _filterIconTemplate: TemplateRef<void> | undefined;

    _removeTokenIconTemplate: TemplateRef<MultiSelectChipIconTemplateContext> | undefined;

    _chipIconTemplate: TemplateRef<MultiSelectChipIconTemplateContext> | undefined;

    _clearIconTemplate: TemplateRef<void> | undefined;

    _dropdownIconTemplate: TemplateRef<MultiSelectDropdownIconTemplateContext> | undefined;

    _itemCheckboxIconTemplate: TemplateRef<MultiSelectItemCheckboxIconTemplateContext> | undefined;

    _headerCheckboxIconTemplate: TemplateRef<MultiSelectHeaderCheckboxIconTemplateContext> | undefined;

    $variant = computed(() => this.variant() || this.config.inputStyle() || this.config.inputVariant() || undefined);

    $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo());

    $pcMultiSelect: MultiSelect | undefined = inject(MULTISELECT_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    pcFluid: Fluid | null = inject(Fluid, { optional: true, host: true, skipSelf: true });

    get hasFluid() {
        return this.fluid() ?? !!this.pcFluid;
    }

    onAfterContentInit() {
        (this.templates as QueryList<PrimeTemplate>).forEach((item) => {
            switch (item.getType()) {
                case 'item':
                    this._itemTemplate = item.template;
                    break;

                case 'group':
                    this._groupTemplate = item.template;
                    break;

                case 'selectedItems':
                case 'selecteditems':
                    this._selectedItemsTemplate = item.template;
                    break;

                case 'header':
                    this._headerTemplate = item.template;
                    break;

                case 'filter':
                    this._filterTemplate = item.template;
                    break;

                case 'emptyfilter':
                    this._emptyFilterTemplate = item.template;
                    break;

                case 'empty':
                    this._emptyTemplate = item.template;
                    break;

                case 'footer':
                    this._footerTemplate = item.template;
                    break;

                case 'loader':
                    this._loaderTemplate = item.template;
                    break;

                case 'headercheckboxicon':
                    this._headerCheckboxIconTemplate = item.template;
                    break;

                case 'loadingicon':
                    this._loadingIconTemplate = item.template;
                    break;

                case 'filtericon':
                    this._filterIconTemplate = item.template;
                    break;

                case 'removetokenicon':
                    this._removeTokenIconTemplate = item.template;
                    break;

                case 'clearicon':
                    this._clearIconTemplate = item.template;
                    break;

                case 'dropdownicon':
                    this._dropdownIconTemplate = item.template;
                    break;

                case 'itemcheckboxicon':
                    this._itemCheckboxIconTemplate = item.template;
                    break;

                case 'chipicon':
                    this._chipIconTemplate = item.template;
                    break;

                default:
                    this._itemTemplate = item.template;
                    break;
            }
        });
    }

    public headerCheckboxFocus: boolean | undefined;

    filterOptions: MultiSelectFilterOptions | undefined;

    preventModelTouched: boolean | undefined;

    focused: boolean = false;

    itemsWrapper: any;

    _displaySelectedLabel: boolean = true;

    _maxSelectedLabels: number | null | undefined = 3;

    modelValue = signal<any>(null);

    _filterValue = signal<any>(null);

    _options = signal<any[]>([]);

    startRangeIndex = signal<number>(-1);

    focusedOptionIndex = signal<number>(-1);

    selectedOptions: any;

    clickInProgress: boolean = false;

    get emptyMessageLabel(): string {
        return this.emptyMessage || this.config.getTranslation(TranslationKeys.EMPTY_MESSAGE);
    }

    get emptyFilterMessageLabel(): string {
        return this.emptyFilterMessage || this.config.getTranslation(TranslationKeys.EMPTY_FILTER_MESSAGE);
    }

    get isVisibleClearIcon(): boolean | undefined {
        return this.modelValue() != null && this.modelValue() !== '' && isNotEmpty(this.modelValue()) && this.showClear && !this.$disabled() && !this.readonly && this.$filled();
    }

    get toggleAllAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria[this.allSelected() ? 'selectAll' : 'unselectAll'] : undefined;
    }

    get listLabel(): string {
        return this.config.getTranslation(TranslationKeys.ARIA)['listLabel'];
    }

    private getAllVisibleAndNonVisibleOptions() {
        return this.group ? this.flatOptions(this.options) : this.options || [];
    }

    visibleOptions = computed(() => {
        const options = this.getAllVisibleAndNonVisibleOptions();
        const isArrayOfObjects = isArray(options) && ObjectUtils.isObject(options[0]);

        if (this._filterValue()) {
            let filteredOptions;

            if (isArrayOfObjects) {
                filteredOptions = this.filterService.filter(options, this.searchFields(), this._filterValue(), this.filterMatchMode, this.filterLocale);
            } else {
                filteredOptions = options.filter((option) => option.toString().toLocaleLowerCase().includes(this._filterValue().toLocaleLowerCase()));
            }

            if (this.group) {
                const optionGroups = this.options || [];
                const filtered: any[] = [];

                optionGroups.forEach((group) => {
                    const groupChildren = this.getOptionGroupChildren(group);
                    const filteredItems = groupChildren.filter((item) => filteredOptions.includes(item));

                    if (filteredItems.length > 0)
                        filtered.push({
                            ...group,
                            [typeof this.optionGroupChildren === 'string' ? this.optionGroupChildren : 'items']: [...filteredItems]
                        });
                });

                return this.flatOptions(filtered);
            }

            return filteredOptions;
        }
        return options;
    });

    label = computed(() => {
        let label;
        const modelValue = this.modelValue();

        if (modelValue && modelValue?.length && this.displaySelectedLabel) {
            if (isNotEmpty(this.maxSelectedLabels) && modelValue?.length > (this.maxSelectedLabels || 0)) {
                return this.getSelectedItemsLabel();
            } else {
                label = '';

                for (let i = 0; i < modelValue.length; i++) {
                    if (i !== 0) {
                        label += ', ';
                    }

                    label += this.getLabelByValue(modelValue[i]);
                }
            }
        } else {
            label = this.placeholder() || '';
        }
        return label;
    });

    chipSelectedItems = computed(() => {
        return isNotEmpty(this.maxSelectedLabels) && this.modelValue() && this.modelValue()?.length > (this.maxSelectedLabels || 0) ? this.modelValue()?.slice(0, this.maxSelectedLabels) : this.modelValue();
    });

    constructor(
        private zone: NgZone,
        public filterService: FilterService,
        public overlayService: OverlayService
    ) {
        super();
        effect(() => {
            const modelValue = this.modelValue();

            const allVisibleAndNonVisibleOptions = this.getAllVisibleAndNonVisibleOptions();
            if (allVisibleAndNonVisibleOptions && isNotEmpty(allVisibleAndNonVisibleOptions)) {
                if (this.optionValue && this.optionLabel && modelValue) {
                    this.selectedOptions = allVisibleAndNonVisibleOptions.filter((option) => modelValue.includes(option[this.optionLabel!]) || modelValue.includes(option[this.optionValue!]));
                } else {
                    this.selectedOptions = modelValue;
                }
                this.cd.markForCheck();
            }
        });
    }

    onInit() {
        this.id = this.id || uuid('pn_id_');
        this.autoUpdateModel();

        if (this.filterBy) {
            this.filterOptions = {
                filter: (value) => this.onFilterInputChange(value),
                reset: () => this.resetFilter()
            };
        }
    }

    maxSelectionLimitReached() {
        return this.selectionLimit && this.modelValue() && this.modelValue().length === this.selectionLimit;
    }

    onAfterViewInit() {
        if (this.overlayVisible) {
            this.show();
        }
    }

    onAfterViewChecked() {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
        if (this.filtered) {
            this.zone.runOutsideAngular(() => {
                setTimeout(() => {
                    this.overlayViewChild?.alignOverlay();
                }, 1);
            });
            this.filtered = false;
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
        if (this.selectOnFocus && this.autoOptionFocus && !this.hasSelectedOption()) {
            this.focusedOptionIndex.set(this.findFirstFocusedOptionIndex());
            const value = this.getOptionValue(this.visibleOptions()[this.focusedOptionIndex()]);
            this.onOptionSelect({ originalEvent: null, option: [value] });
        }
    }

    /**
     * Updates the model value.
     * @group Method
     */
    public updateModel(value, event?) {
        this.value = value;
        this.onModelChange(value);
        this.writeValue(value);
    }

    onInputClick(event) {
        event.stopPropagation();
        event.preventDefault();
        this.focusedOptionIndex.set(-1);
    }

    onOptionSelect(event, isFocus = false, index = -1) {
        const { originalEvent, option } = event;
        if (this.$disabled() || this.isOptionDisabled(option)) {
            return;
        }

        let selected = this.isSelected(option);
        let value: any[] = [];

        if (selected) {
            value = this.modelValue().filter((val) => !equals(val, this.getOptionValue(option), this.equalityKey() || ''));
        } else {
            value = [...(this.modelValue() || []), this.getOptionValue(option)];
        }

        this.updateModel(value, originalEvent);
        index !== -1 && this.focusedOptionIndex.set(index);

        isFocus && focus(this.focusInputViewChild?.nativeElement);

        this.onChange.emit({
            originalEvent: event,
            value: value,
            itemValue: option
        });
    }

    findSelectedOptionIndex() {
        return this.hasSelectedOption() ? this.visibleOptions().findIndex((option) => this.isValidSelectedOption(option)) : -1;
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

    searchFields() {
        return (this.filterBy || this.optionLabel || 'label').split(',');
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

    findPrevSelectedOptionIndex(index) {
        const matchedOptionIndex = this.hasSelectedOption() && index > 0 ? findLastIndex(this.visibleOptions().slice(0, index), (option) => this.isValidSelectedOption(option)) : -1;

        return matchedOptionIndex > -1 ? matchedOptionIndex : -1;
    }

    findFirstFocusedOptionIndex() {
        const selectedIndex = this.findFirstSelectedOptionIndex();

        return selectedIndex < 0 ? this.findFirstOptionIndex() : selectedIndex;
    }

    findFirstOptionIndex() {
        return this.visibleOptions().findIndex((option) => this.isValidOption(option));
    }

    findFirstSelectedOptionIndex() {
        return this.hasSelectedOption() ? this.visibleOptions().findIndex((option) => this.isValidSelectedOption(option)) : -1;
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

    equalityKey() {
        return this.optionValue ? null : this.dataKey;
    }

    hasSelectedOption() {
        return isNotEmpty(this.modelValue());
    }

    isValidSelectedOption(option) {
        return this.isValidOption(option) && this.isSelected(option);
    }

    isOptionGroup(option) {
        return option && (this.group || this.optionGroupLabel) && option.optionGroup && option.group;
    }

    isValidOption(option) {
        return option && !(this.isOptionDisabled(option) || this.isOptionGroup(option));
    }

    isOptionDisabled(option: any) {
        if (this.maxSelectionLimitReached() && !this.isSelected(option)) {
            return true;
        }
        return this.optionDisabled ? resolveFieldData(option, this.optionDisabled) : option && option.disabled !== undefined ? option.disabled : false;
    }

    isSelected(option) {
        const optionValue = this.getOptionValue(option);
        return (this.modelValue() || []).some((value) => equals(value, optionValue, this.equalityKey() || ''));
    }

    isOptionMatched(option) {
        return this.isValidOption(option) && this.getOptionLabel(option).toString().toLocaleLowerCase(this.filterLocale).startsWith(this.searchValue?.toLocaleLowerCase(this.filterLocale));
    }

    isEmpty() {
        return !this._options() || (this.visibleOptions() && this.visibleOptions().length === 0);
    }

    getOptionIndex(index, scrollerOptions) {
        return this.virtualScrollerDisabled ? index : scrollerOptions && scrollerOptions.getItemOptions(index)['index'];
    }

    getAriaPosInset(index) {
        return (
            (this.optionGroupLabel
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

    getLabelByValue(value) {
        const options = this.group ? this.flatOptions(this._options()) : this._options() || [];
        const matchedOption = options.find((option) => !this.isOptionGroup(option) && equals(this.getOptionValue(option), value, this.equalityKey() || ''));
        return matchedOption ? this.getOptionLabel(matchedOption) : null;
    }

    getSelectedItemsLabel() {
        let pattern = /{(.*?)}/;
        let message = this.selectedItemsLabel ? this.selectedItemsLabel : this.config.getTranslation(TranslationKeys.SELECTION_MESSAGE);

        if (pattern.test(message)) {
            return message.replace(message.match(pattern)[0], this.modelValue().length + '');
        }

        return message;
    }

    getOptionLabel(option: any) {
        return this.optionLabel ? resolveFieldData(option, this.optionLabel) : option && option.label != undefined ? option.label : option;
    }

    getOptionValue(option: any) {
        return this.optionValue ? resolveFieldData(option, this.optionValue) : !this.optionLabel && option && option.value !== undefined ? option.value : option;
    }

    getOptionGroupLabel(optionGroup: any) {
        return this.optionGroupLabel ? resolveFieldData(optionGroup, this.optionGroupLabel) : optionGroup && optionGroup.label != undefined ? optionGroup.label : optionGroup;
    }

    getOptionGroupChildren(optionGroup: any) {
        return optionGroup ? (this.optionGroupChildren ? resolveFieldData(optionGroup, this.optionGroupChildren) : optionGroup.items) : [];
    }

    onKeyDown(event: KeyboardEvent) {
        if (this.$disabled()) {
            event.preventDefault();
            return;
        }

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
                this.onEnterKey(event);
                break;

            case 'Escape':
                this.onEscapeKey(event);
                break;

            case 'Tab':
                this.onTabKey(event);
                break;

            case 'ShiftLeft':
            case 'ShiftRight':
                this.onShiftKey();
                break;

            default:
                if (event.code === 'KeyA' && metaKey) {
                    const value = this.visibleOptions()
                        .filter((option) => this.isValidOption(option))
                        .map((option) => this.getOptionValue(option));

                    this.updateModel(value, event);

                    event.preventDefault();
                    break;
                }

                if (!metaKey && isPrintableCharacter(event.key)) {
                    !this.overlayVisible && this.show();
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
                this.onEnterKey(event);
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

    onArrowLeftKey(event: KeyboardEvent, pressedInInputText: boolean = false) {
        pressedInInputText && this.focusedOptionIndex.set(-1);
    }

    onArrowDownKey(event) {
        const optionIndex = this.focusedOptionIndex() !== -1 ? this.findNextOptionIndex(this.focusedOptionIndex()) : this.findFirstFocusedOptionIndex();

        if (event.shiftKey) {
            this.onOptionSelectRange(event, this.startRangeIndex(), optionIndex);
        }

        this.changeFocusedOptionIndex(event, optionIndex);
        !this.overlayVisible && this.show();
        event.preventDefault();
        event.stopPropagation();
    }

    onArrowUpKey(event, pressedInInputText = false) {
        if (event.altKey && !pressedInInputText) {
            if (this.focusedOptionIndex() !== -1) {
                this.onOptionSelect(event, this.visibleOptions()[this.focusedOptionIndex()]);
            }

            this.overlayVisible && this.hide();
            event.preventDefault();
        } else {
            const optionIndex = this.focusedOptionIndex() !== -1 ? this.findPrevOptionIndex(this.focusedOptionIndex()) : this.findLastFocusedOptionIndex();

            if (event.shiftKey) {
                this.onOptionSelectRange(event, optionIndex, this.startRangeIndex());
            }

            this.changeFocusedOptionIndex(event, optionIndex);

            !this.overlayVisible && this.show();
            event.preventDefault();
        }
        event.stopPropagation();
    }

    onHomeKey(event, pressedInInputText = false) {
        const { currentTarget } = event;

        if (pressedInInputText) {
            const len = currentTarget.value.length;

            currentTarget.setSelectionRange(0, event.shiftKey ? len : 0);
            this.focusedOptionIndex.set(-1);
        } else {
            let metaKey = event.metaKey || event.ctrlKey;
            let optionIndex = this.findFirstOptionIndex();

            if (event.shiftKey && metaKey) {
                this.onOptionSelectRange(event, optionIndex, this.startRangeIndex());
            }

            this.changeFocusedOptionIndex(event, optionIndex);

            !this.overlayVisible && this.show();
        }

        event.preventDefault();
    }

    onEndKey(event, pressedInInputText = false) {
        const { currentTarget } = event;

        if (pressedInInputText) {
            const len = currentTarget.value.length;
            currentTarget.setSelectionRange(event.shiftKey ? 0 : len, len);
            this.focusedOptionIndex.set(-1);
        } else {
            let metaKey = event.metaKey || event.ctrlKey;
            let optionIndex = this.findLastFocusedOptionIndex();

            if (event.shiftKey && metaKey) {
                this.onOptionSelectRange(event, this.startRangeIndex(), optionIndex);
            }

            this.changeFocusedOptionIndex(event, optionIndex);

            !this.overlayVisible && this.show();
        }

        event.preventDefault();
    }

    onPageDownKey(event) {
        this.scrollInView(this.visibleOptions().length - 1);
        event.preventDefault();
    }

    onPageUpKey(event) {
        this.scrollInView(0);
        event.preventDefault();
    }

    onEnterKey(event) {
        if (!this.overlayVisible) {
            this.onArrowDownKey(event);
        } else {
            if (this.focusedOptionIndex() !== -1) {
                if (event.shiftKey) {
                    this.onOptionSelectRange(event, this.focusedOptionIndex());
                } else {
                    this.onOptionSelect({ originalEvent: event, option: this.visibleOptions()[this.focusedOptionIndex()] });
                }
            }
        }

        event.preventDefault();
    }

    onEscapeKey(event: KeyboardEvent) {
        if (this.overlayVisible) {
            this.hide(true);
            event.stopPropagation();
            event.preventDefault();
        }
    }

    onTabKey(event, pressedInInputText = false) {
        if (!pressedInInputText) {
            if (this.overlayVisible && this.hasFocusableElements()) {
                focus(event.shiftKey ? this.lastHiddenFocusableElementOnOverlay?.nativeElement : this.firstHiddenFocusableElementOnOverlay?.nativeElement);

                event.preventDefault();
            } else {
                if (this.focusedOptionIndex() !== -1) {
                    const option = this.visibleOptions()[this.focusedOptionIndex()];

                    !this.isSelected(option) && this.onOptionSelect({ originalEvent: event, option });
                }

                this.overlayVisible && this.hide(this.filter);
            }
        }
    }

    onShiftKey() {
        this.startRangeIndex.set(this.focusedOptionIndex());
    }

    onContainerClick(event: any) {
        if (this.$disabled() || this.loading || this.readonly || event.target?.isSameNode?.(this.focusInputViewChild?.nativeElement)) {
            return;
        }

        if (!this.overlayViewChild || !this.overlayViewChild.el.nativeElement.contains(event.target)) {
            if (this.clickInProgress) {
                return;
            }

            this.clickInProgress = true;

            setTimeout(() => {
                this.clickInProgress = false;
            }, 150);

            this.overlayVisible ? this.hide(true) : this.show(true);
        }
        this.focusInputViewChild?.nativeElement.focus({ preventScroll: true });
        this.onClick.emit(event);
        this.cd.detectChanges();
    }

    onFirstHiddenFocus(event) {
        const focusableEl =
            event.relatedTarget === this.focusInputViewChild?.nativeElement ? getFirstFocusableElement(this.overlayViewChild?.overlayViewChild?.nativeElement, ':not([data-p-hidden-focusable="true"])') : this.focusInputViewChild?.nativeElement;

        focus(focusableEl);
    }

    onInputFocus(event: Event) {
        this.focused = true;
        const focusedOptionIndex = this.focusedOptionIndex() !== -1 ? this.focusedOptionIndex() : this.overlayVisible && this.autoOptionFocus ? this.findFirstFocusedOptionIndex() : -1;
        this.focusedOptionIndex.set(focusedOptionIndex);
        this.overlayVisible && this.scrollInView(this.focusedOptionIndex());
        this.onFocus.emit({ originalEvent: event });
    }

    onInputBlur(event: Event) {
        this.focused = false;
        this.onBlur.emit({ originalEvent: event });

        if (!this.preventModelTouched) {
            this.onModelTouched();
        }
        this.preventModelTouched = false;
    }

    onFilterInputChange(event: Event) {
        let value: string = (event.target as HTMLInputElement).value;
        this._filterValue.set(value);
        this.focusedOptionIndex.set(-1);
        this.onFilter.emit({ originalEvent: event, filter: this._filterValue() });

        !this.virtualScrollerDisabled && this.scroller?.scrollToIndex(0);
        setTimeout(() => {
            this.overlayViewChild?.alignOverlay();
        });
    }

    onLastHiddenFocus(event) {
        const focusableEl =
            event.relatedTarget === this.focusInputViewChild?.nativeElement ? getLastFocusableElement(this.overlayViewChild?.overlayViewChild?.nativeElement, ':not([data-p-hidden-focusable="true"])') : this.focusInputViewChild?.nativeElement;

        focus(focusableEl);
    }

    onOptionMouseEnter(event, index) {
        if (this.focusOnHover) {
            this.changeFocusedOptionIndex(event, index);
        }
    }

    onFilterBlur(event) {
        this.focusedOptionIndex.set(-1);
    }

    onToggleAll(event) {
        if (this.$disabled() || this.readonly) {
            return;
        }

        if (this.selectAll != null) {
            this.onSelectAllChange.emit({
                originalEvent: event,
                checked: !this.allSelected()
            });
        } else {
            // pre-selected disabled options should always be selected.
            const selectedDisabledOptions = this.getAllVisibleAndNonVisibleOptions().filter(
                (option) => this.isSelected(option) && (this.optionDisabled ? resolveFieldData(option, this.optionDisabled) : option && option.disabled !== undefined ? option.disabled : false)
            );

            const visibleOptions = this.allSelected()
                ? this.visibleOptions().filter((option) => !this.isValidOption(option) && this.isSelected(option))
                : this.visibleOptions().filter((option) => this.isSelected(option) || this.isValidOption(option));

            const selectedOptionsBeforeSearch = this.filter && !this.allSelected() ? this.getAllVisibleAndNonVisibleOptions().filter((option) => this.isSelected(option) && this.isValidOption(option)) : [];

            const optionValues = [...selectedOptionsBeforeSearch, ...selectedDisabledOptions, ...visibleOptions].map((option) => this.getOptionValue(option));
            const value = [...new Set(optionValues)];

            this.updateModel(value, event);

            // because onToggleAll could have been called during filtering, this additional test needs to be performed before calling onSelectAllChange.emit
            if (!value.length || value.length === this.getAllVisibleAndNonVisibleOptions().length) {
                this.onSelectAllChange.emit({
                    originalEvent: event,
                    checked: !!value.length
                });
            }
        }

        if (this.partialSelected()) {
            this.selectedOptions = [];
            this.cd.markForCheck();
        }

        this.onChange.emit({ originalEvent: event, value: this.value });
        DomHandler.focus(this.headerCheckboxViewChild?.inputViewChild?.nativeElement);
        this.headerCheckboxFocus = true;

        event.originalEvent.preventDefault();
        event.originalEvent.stopPropagation();
    }

    changeFocusedOptionIndex(event, index) {
        if (this.focusedOptionIndex() !== index) {
            this.focusedOptionIndex.set(index);
            this.scrollInView();
        }
    }

    get virtualScrollerDisabled() {
        return !this.virtualScroll;
    }

    scrollInView(index = -1) {
        const id = index !== -1 ? `${this.id}_${index}` : this.focusedOptionId;
        if (this.itemsViewChild && this.itemsViewChild.nativeElement) {
            const element = findSingle(this.itemsViewChild.nativeElement, `li[id="${id}"]`);
            if (element) {
                element.scrollIntoView && element.scrollIntoView({ block: 'nearest', inline: 'nearest' });
            } else if (!this.virtualScrollerDisabled) {
                setTimeout(() => {
                    this.virtualScroll && this.scroller?.scrollToIndex(index !== -1 ? index : this.focusedOptionIndex());
                }, 0);
            }
        }
    }

    get focusedOptionId() {
        return this.focusedOptionIndex() !== -1 ? `${this.id}_${this.focusedOptionIndex()}` : null;
    }

    allSelected() {
        return this.selectAll !== null ? this.selectAll : isNotEmpty(this.visibleOptions()) && this.visibleOptions().every((option) => this.isOptionGroup(option) || this.isOptionDisabled(option) || this.isSelected(option));
    }

    partialSelected() {
        return this.selectedOptions && this.selectedOptions.length > 0 && this.selectedOptions.length < (this.options?.length || 0);
    }

    /**
     * Displays the panel.
     * @group Method
     */
    public show(isFocus?) {
        this.overlayVisible = true;

        const focusedOptionIndex = this.focusedOptionIndex() !== -1 ? this.focusedOptionIndex() : this.autoOptionFocus ? this.findFirstFocusedOptionIndex() : this.findSelectedOptionIndex();
        this.focusedOptionIndex.set(focusedOptionIndex);

        if (isFocus) {
            focus(this.focusInputViewChild?.nativeElement);
        }

        this.cd.markForCheck();
    }

    /**
     * Hides the panel.
     * @group Method
     */
    public hide(isFocus?) {
        this.overlayVisible = false;
        this.focusedOptionIndex.set(-1);

        if (this.filter && this.resetFilterOnHide) {
            this.resetFilter();
        }
        if (this.overlayOptions?.mode === 'modal') {
            unblockBodyScroll();
        }

        isFocus && focus(this.focusInputViewChild?.nativeElement);
        this.cd.markForCheck();
    }

    onOverlayBeforeEnter(event: any) {
        this.itemsWrapper = <any>findSingle(this.overlayViewChild?.overlayViewChild?.nativeElement, this.virtualScroll ? '[data-pc-name="virtualscroller"]' : '[data-pc-section="listcontainer"]');
        this.virtualScroll && this.scroller?.setContentEl(this.itemsViewChild?.nativeElement);

        if (this.options && this.options.length) {
            if (this.virtualScroll) {
                const selectedIndex = this.modelValue() ? this.focusedOptionIndex() : -1;
                if (selectedIndex !== -1) {
                    this.scroller?.scrollToIndex(selectedIndex);
                }
            } else {
                let selectedListItem = findSingle(this.itemsWrapper, '[data-pc-section="option"][data-p-selected="true"]');

                if (selectedListItem) {
                    selectedListItem.scrollIntoView({ block: 'nearest', inline: 'nearest' });
                }
            }
        }

        if (this.filterInputChild && this.filterInputChild.nativeElement) {
            this.preventModelTouched = true;

            if (this.autofocusFilter) {
                this.filterInputChild.nativeElement.focus();
            }
        }

        this.onPanelShow.emit(event);
    }

    onOverlayAfterLeave(event: any) {
        this.itemsWrapper = null;
        this.onModelTouched();
        this.onPanelHide.emit(event);
    }

    resetFilter() {
        if (this.filterInputChild && this.filterInputChild.nativeElement) {
            this.filterInputChild.nativeElement.value = '';
        }

        this._filterValue.set(null);
        this._filteredOptions = null;
    }

    onOverlayHide(event: any) {
        // Called when overlay completes its hide animation
        // Don't call hide() again to avoid recursive calls
        this.focusedOptionIndex.set(-1);
        if (this.filter && this.resetFilterOnHide) {
            this.resetFilter();
        }
    }

    close(event: Event) {
        this.hide();
        event.preventDefault();
        event.stopPropagation();
    }

    clear(event: Event) {
        this.value = [];
        this.updateModel(null, event);
        this.selectedOptions = [];
        this.onClear.emit();
        this._disableTooltip = true;

        event.stopPropagation();
    }

    labelContainerMouseLeave() {
        if (this._disableTooltip) this._disableTooltip = false;
    }

    removeOption(optionValue, event) {
        let value = this.modelValue().filter((val) => !equals(val, optionValue, this.equalityKey() || ''));

        this.updateModel(value, event);
        this.onChange.emit({
            originalEvent: event,
            value: value,
            itemValue: optionValue
        });
        this.onRemove.emit({
            newValue: value,
            removed: optionValue
        });

        event && event.stopPropagation();
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

    findLastSelectedOptionIndex() {
        return this.hasSelectedOption() ? findLastIndex(this.visibleOptions(), (option) => this.isValidSelectedOption(option)) : -1;
    }

    findLastFocusedOptionIndex() {
        const selectedIndex = this.findLastSelectedOptionIndex();

        return selectedIndex < 0 ? this.findLastOptionIndex() : selectedIndex;
    }

    findLastOptionIndex() {
        return findLastIndex(this.visibleOptions(), (option) => this.isValidOption(option));
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

    hasFocusableElements() {
        return getFocusableElements(this.overlayViewChild?.overlayViewChild?.nativeElement, ':not([data-p-hidden-focusable="true"])').length > 0;
    }

    hasFilter() {
        return this._filterValue() && this._filterValue().trim().length > 0;
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
            placeholder: this.label === this.placeholder,
            clearable: this.showClear,
            disabled: this.disabled,
            [this.size() as string]: this.size(),
            'has-chip': this.display === 'chip' && this.value && this.value.length && (this.maxSelectedLabels ? this.value.length <= this.maxSelectedLabels : true),
            empty: !this.placeholder && !this.$filled
        });
    }

    get dropdownIconDataP() {
        return this.cn({
            [this.size() as string]: this.size()
        });
    }

    get overlayDataP() {
        return this.cn({
            ['overlay-' + this.appendTo]: 'overlay-' + this.appendTo
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
        setModelValue(value);
        this.cd.markForCheck();
    }

    getHeaderCheckboxPTOptions(key: string) {
        return this.ptm(key, {
            context: {
                selected: this.allSelected()
            }
        });
    }

    getPTOptions(option, itemOptions, index, key) {
        return this.ptm(key, {
            context: {
                selected: this.isSelected(option),
                focused: this.focusedOptionIndex() === this.getOptionIndex(index, itemOptions),
                disabled: this.isOptionDisabled(option)
            }
        });
    }
}

@NgModule({
    imports: [MultiSelect, SharedModule],
    exports: [MultiSelect, SharedModule]
})
export class MultiSelectModule {}
