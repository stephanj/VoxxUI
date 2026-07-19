import { CommonModule } from '@angular/common';
import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild,
    contentChildren,
    ElementRef,
    forwardRef,
    inject,
    InjectionToken,
    input,
    NgModule,
    NgZone,
    numberAttribute,
    output,
    signal,
    SimpleChanges,
    TemplateRef,
    viewChild,
    ViewEncapsulation
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MotionOptions } from '@primeuix/motion';
import { equals, findLastIndex, findSingle, focus, isEmpty, isNotEmpty, resolveFieldData, uuid } from '@primeuix/utils';
import { OverlayOptions, OverlayService, PrimeTemplate, ScrollerOptions, SharedModule, TranslationKeys } from 'voxx-ui/api';
import { AutoFocus } from 'voxx-ui/autofocus';
import { PARENT_INSTANCE } from 'voxx-ui/basecomponent';
import { BaseInput } from 'voxx-ui/baseinput';
import { Bind, BindModule } from 'voxx-ui/bind';
import { Chip } from 'voxx-ui/chip';
import { ConnectedOverlayScrollHandler } from 'voxx-ui/dom';
import { ChevronDownIcon, SpinnerIcon, TimesCircleIcon, TimesIcon } from 'voxx-ui/icons';
import { InputText } from 'voxx-ui/inputtext';
import { Overlay } from 'voxx-ui/overlay';
import { Ripple } from 'voxx-ui/ripple';
import { Scroller } from 'voxx-ui/scroller';
import { Nullable } from 'voxx-ui/ts-helpers';
import {
    AutoCompleteAddEvent,
    AutoCompleteCompleteEvent,
    AutoCompleteDropdownClickEvent,
    AutoCompleteGroupTemplateContext,
    AutoCompleteItemTemplateContext,
    AutoCompleteLazyLoadEvent,
    AutoCompleteLoaderTemplateContext,
    AutoCompletePassThrough,
    AutoCompleteRemoveIconTemplateContext,
    AutoCompleteSelectedItemTemplateContext,
    AutoCompleteSelectEvent,
    AutoCompleteUnselectEvent
} from 'voxx-ui/types/autocomplete';
import { AutoCompleteStyle } from './style/autocompletestyle';

const AUTOCOMPLETE_INSTANCE = new InjectionToken<AutoComplete>('AUTOCOMPLETE_INSTANCE');

export const AUTOCOMPLETE_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AutoComplete),
    multi: true
};

/**
 * Template types handled explicitly by the PrimeTemplate switch; any other type falls back to the item template.
 */
const KNOWN_TEMPLATE_TYPES = ['item', 'group', 'selecteditem', 'selectedItem', 'header', 'empty', 'footer', 'loader', 'removetokenicon', 'loadingicon', 'clearicon', 'dropdownicon'];

/**
 * AutoComplete is an input component that provides real-time suggestions when being typed.
 * @group Components
 */
@Component({
    selector: 'vx-autoComplete, vx-autocomplete, vx-auto-complete',
    imports: [CommonModule, Overlay, InputText, Ripple, Scroller, AutoFocus, TimesCircleIcon, SpinnerIcon, ChevronDownIcon, Chip, SharedModule, TimesIcon, BindModule],
    template: `
        @if (!multiple()) {
            <input
                #focusInput
                [vxAutoFocus]="autofocus()"
                vxInputText
                [pt]="ptm('pcInputText')"
                [class]="cn(cx('pcInputText'), inputStyleClass())"
                [style]="inputStyle()"
                [attr.type]="type()"
                [attr.value]="inputValue()"
                [variant]="$variant()"
                [invalid]="invalid()"
                [attr.id]="inputId()"
                [attr.autocomplete]="autocomplete()"
                aria-autocomplete="list"
                role="combobox"
                [attr.placeholder]="placeholder()"
                [attr.name]="name()"
                [attr.minlength]="minlength()"
                [vxSize]="size()"
                [attr.min]="min()"
                [attr.max]="max()"
                [attr.pattern]="pattern()"
                [attr.size]="inputSize()"
                [attr.maxlength]="maxlength()"
                [attr.tabindex]="!$disabled() ? tabindex() : -1"
                [attr.required]="required() ? '' : undefined"
                [attr.readonly]="readonly() ? '' : undefined"
                [attr.disabled]="$disabled() ? '' : undefined"
                [attr.aria-label]="ariaLabel()"
                [attr.aria-labelledby]="ariaLabelledBy()"
                [attr.aria-required]="required()"
                [attr.aria-expanded]="overlayVisible ?? false"
                [attr.aria-controls]="overlayVisible ? $id() + '_list' : null"
                [attr.aria-activedescendant]="focused ? focusedOptionId : undefined"
                (input)="onInput($event)"
                (keydown)="onKeyDown($event)"
                (change)="onInputChange($event)"
                (focus)="onInputFocus($event)"
                (blur)="onInputBlur($event)"
                (paste)="onInputPaste($event)"
                (keyup)="onInputKeyUp($event)"
                [fluid]="hasFluid"
                [vxInputTextUnstyled]="unstyled()"
            />
        }
        @if ($filled() && !$disabled() && showClear() && !loading) {
            @if (!clearIconTemplate() && !_clearIconTemplate()) {
                <svg data-p-icon="times" [vxBind]="ptm('clearIcon')" [class]="cx('clearIcon')" (click)="clear()" [attr.aria-hidden]="true" />
            }
            @if (clearIconTemplate() || _clearIconTemplate()) {
                <span [vxBind]="ptm('clearIcon')" [class]="cx('clearIcon')" (click)="clear()" [attr.aria-hidden]="true">
                    <ng-template *ngTemplateOutlet="clearIconTemplate() || _clearIconTemplate()"></ng-template>
                </span>
            }
        }

        @if (multiple()) {
            <ul
                #multiContainer
                [vxBind]="ptm('inputMultiple')"
                [class]="cx('inputMultiple')"
                [attr.data-p]="inputMultipleDataP"
                [tabindex]="-1"
                role="listbox"
                [attr.aria-orientation]="'horizontal'"
                [attr.aria-activedescendant]="focused ? focusedMultipleOptionId : undefined"
                (focus)="onMultipleContainerFocus($event)"
                (blur)="onMultipleContainerBlur($event)"
                (keydown)="onMultipleContainerKeyDown($event)"
            >
                @for (option of modelValue(); track option; let i = $index) {
                    <li
                        #token
                        [vxBind]="ptm('chipItem')"
                        [class]="cx('chipItem', { i })"
                        [attr.id]="$id() + '_multiple_option_' + i"
                        role="option"
                        [attr.aria-label]="getOptionLabel(option)"
                        [attr.aria-setsize]="modelValue().length"
                        [attr.aria-posinset]="i + 1"
                        [attr.aria-selected]="true"
                    >
                        <vx-chip
                            [pt]="ptm('pcChip')"
                            [class]="cx('pcChip')"
                            [label]="!selectedItemTemplate() && !_selectedItemTemplate() && getOptionLabel(option)"
                            [disabled]="$disabled()"
                            [removable]="true"
                            (onRemove)="!readonly() ? removeOption($event, i) : ''"
                            [unstyled]="unstyled()"
                        >
                            <ng-container *ngTemplateOutlet="selectedItemTemplate() || _selectedItemTemplate(); context: { $implicit: option }"></ng-container>
                            <ng-template #removeicon>
                                @if (!removeIconTemplate() && !_removeIconTemplate()) {
                                    <span [vxBind]="ptm('chipIcon')" [class]="cx('chipIcon')" (click)="!readonly() && !$disabled() ? removeOption($event, i) : ''">
                                        <svg data-p-icon="times-circle" [class]="cx('chipIcon')" [attr.aria-hidden]="true" />
                                    </span>
                                }
                                @if (removeIconTemplate() || _removeIconTemplate()) {
                                    <span [vxBind]="ptm('chipIcon')" [attr.aria-hidden]="true">
                                        <ng-template *ngTemplateOutlet="removeIconTemplate() || _removeIconTemplate(); context: { removeCallback: removeOption.bind(this), index: i, class: cx('chipIcon') }"></ng-template>
                                    </span>
                                }
                            </ng-template>
                        </vx-chip>
                    </li>
                }
                <li [vxBind]="ptm('inputChip')" [class]="cx('inputChip')" role="option">
                    <input
                        #focusInput
                        #multiIn
                        [vxAutoFocus]="autofocus()"
                        [vxBind]="ptm('input')"
                        [class]="cx('pcInputText')"
                        [style]="inputStyle()"
                        [attr.type]="type()"
                        [attr.id]="inputId()"
                        [attr.autocomplete]="autocomplete()"
                        [attr.name]="name()"
                        [attr.minlength]="minlength()"
                        [attr.maxlength]="maxlength()"
                        [attr.size]="size()"
                        [attr.min]="min()"
                        [attr.max]="max()"
                        [attr.pattern]="pattern()"
                        role="combobox"
                        [attr.placeholder]="!$filled() ? placeholder() : null"
                        aria-autocomplete="list"
                        [attr.tabindex]="!$disabled() ? tabindex() : -1"
                        [attr.required]="required() ? '' : undefined"
                        [attr.readonly]="readonly() ? '' : undefined"
                        [attr.disabled]="$disabled() ? '' : undefined"
                        [attr.aria-label]="ariaLabel()"
                        [attr.aria-labelledby]="ariaLabelledBy()"
                        [attr.aria-required]="required()"
                        [attr.aria-expanded]="overlayVisible ?? false"
                        [attr.aria-controls]="overlayVisible ? $id() + '_list' : null"
                        [attr.aria-activedescendant]="focused ? focusedOptionId : undefined"
                        (input)="onInput($event)"
                        (keydown)="onKeyDown($event)"
                        (change)="onInputChange($event)"
                        (focus)="onInputFocus($event)"
                        (blur)="onInputBlur($event)"
                        (paste)="onInputPaste($event)"
                        (keyup)="onInputKeyUp($event)"
                    />
                </li>
            </ul>
        }
        @if (loading) {
            @if (!loadingIconTemplate() && !_loadingIconTemplate()) {
                <svg data-p-icon="spinner" [vxBind]="ptm('loader')" [class]="cx('loader')" [spin]="true" [attr.aria-hidden]="true" />
            }
            @if (loadingIconTemplate() || _loadingIconTemplate()) {
                <span [vxBind]="ptm('loader')" [class]="cx('loader')" [attr.aria-hidden]="true">
                    <ng-template *ngTemplateOutlet="loadingIconTemplate() || _loadingIconTemplate()"></ng-template>
                </span>
            }
        }
        @if (dropdown()) {
            <button #ddBtn type="button" [vxBind]="ptm('dropdown')" [attr.aria-label]="dropdownAriaLabel()" [class]="cx('dropdown')" [disabled]="$disabled()" vxRipple (click)="handleDropdownClick($event)" [attr.tabindex]="tabindex()">
                @if (dropdownIcon()) {
                    <span [class]="dropdownIcon()" [attr.aria-hidden]="true"></span>
                }
                @if (!dropdownIcon()) {
                    @if (!dropdownIconTemplate() && !_dropdownIconTemplate()) {
                        <svg data-p-icon="chevron-down" [vxBind]="ptm('dropdown')" />
                    }
                    <ng-template *ngTemplateOutlet="dropdownIconTemplate() || _dropdownIconTemplate()"></ng-template>
                }
            </button>
        }
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
            (onBeforeEnter)="onOverlayBeforeEnter()"
            (onHide)="hide()"
            [attr.data-p]="overlayDataP"
        >
            <ng-template #content>
                <div [vxBind]="ptm('overlay')" [class]="cn(cx('overlay'), panelStyleClass())" [style]="panelStyle()">
                    <ng-container *ngTemplateOutlet="headerTemplate() || _headerTemplate()"></ng-container>
                    <div [vxBind]="ptm('listContainer')" [class]="cx('listContainer')" [style.max-height]="virtualScroll() ? 'auto' : scrollHeight()" [tabindex]="-1">
                        @if (virtualScroll()) {
                            <vx-scroller
                                #scroller
                                [tabindex]="-1"
                                [pt]="ptm('virtualScroller')"
                                [items]="visibleOptions()"
                                [style]="{ height: scrollHeight() }"
                                [itemSize]="virtualScrollItemSize()"
                                [autoSize]="true"
                                [lazy]="lazy()"
                                (onLazyLoad)="onLazyLoad.emit($event)"
                                [options]="virtualScrollOptions()"
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
                    </div>

                    <ng-template #buildInItems let-items let-scrollerOptions="options">
                        <ul #items [vxBind]="ptm('list')" [class]="cn(cx('list'), scrollerOptions.contentStyleClass)" [style]="scrollerOptions.contentStyle" role="listbox" [attr.id]="$id() + '_list'" [attr.aria-label]="listLabel">
                            @for (option of items; track option; let i = $index) {
                                @if (isOptionGroup(option)) {
                                    <li [vxBind]="ptm('optionGroup')" [attr.id]="$id() + '_' + getOptionIndex(i, scrollerOptions)" [class]="cx('optionGroup')" [style]="{ height: scrollerOptions.itemSize + 'px' }" role="option">
                                        @if (!groupTemplate()) {
                                            <span>{{ getOptionGroupLabel(option.optionGroup) }}</span>
                                        }
                                        <ng-container *ngTemplateOutlet="groupTemplate(); context: { $implicit: option.optionGroup }"></ng-container>
                                    </li>
                                }
                                @if (!isOptionGroup(option)) {
                                    <li
                                        vxRipple
                                        [vxBind]="getPTOptions(option, scrollerOptions, i, 'option')"
                                        [style]="{ height: scrollerOptions.itemSize + 'px' }"
                                        [class]="cx('option', { option, i, scrollerOptions })"
                                        [attr.id]="$id() + '_' + getOptionIndex(i, scrollerOptions)"
                                        role="option"
                                        [attr.aria-label]="getOptionLabel(option)"
                                        [attr.aria-selected]="isSelected(option)"
                                        [attr.data-p-selected]="isSelected(option)"
                                        [attr.aria-disabled]="isOptionDisabled(option)"
                                        [attr.data-p-focused]="focusedOptionIndex() === getOptionIndex(i, scrollerOptions)"
                                        [attr.aria-setsize]="ariaSetSize"
                                        [attr.aria-posinset]="getAriaPosInset(getOptionIndex(i, scrollerOptions))"
                                        (click)="onOptionSelect($event, option)"
                                        (mouseenter)="onOptionMouseEnter($event, getOptionIndex(i, scrollerOptions))"
                                    >
                                        @if (!itemTemplate() && !_itemTemplate()) {
                                            <span>{{ getOptionLabel(option) }}</span>
                                        }
                                        <ng-container
                                            *ngTemplateOutlet="
                                                itemTemplate() || _itemTemplate();
                                                context: {
                                                    $implicit: option,
                                                    index: scrollerOptions.getOptions ? scrollerOptions.getOptions(i) : i
                                                }
                                            "
                                        ></ng-container>
                                    </li>
                                }
                            }
                            @if (!items || (items && items.length === 0 && showEmptyMessage())) {
                                <li [vxBind]="ptm('emptyMessage')" [class]="cx('emptyMessage')" [style]="{ height: scrollerOptions.itemSize + 'px' }" role="option">
                                    @if (!emptyTemplate() && !_emptyTemplate()) {
                                        {{ searchResultMessageText }}
                                    }
                                    <ng-container *ngTemplateOutlet="emptyTemplate() || _emptyTemplate()"></ng-container>
                                </li>
                            }
                        </ul>
                    </ng-template>
                    <ng-container *ngTemplateOutlet="footerTemplate() || _footerTemplate()"></ng-container>
                </div>
                <span role="status" aria-live="polite" class="p-hidden-accessible">
                    {{ selectedMessageText }}
                </span>
            </ng-template>
        </vx-overlay>
    `,
    providers: [AUTOCOMPLETE_VALUE_ACCESSOR, AutoCompleteStyle, { provide: AUTOCOMPLETE_INSTANCE, useExisting: AutoComplete }, { provide: PARENT_INSTANCE, useExisting: AutoComplete }],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': "cn(cx('root'), styleClass())",
        '[style]': "sx('root')",
        '[attr.data-p]': 'containerDataP',
        '(click)': 'onHostClick($event)'
    },
    hostDirectives: [Bind]
})
export class AutoComplete extends BaseInput<AutoCompletePassThrough> {
    componentName = 'AutoComplete';

    $pcAutoComplete: AutoComplete | undefined = inject(AUTOCOMPLETE_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    /**
     * Minimum number of characters to initiate a search.
     * @deprecated since v20.0.0, use `minQueryLength` instead.
     * @group Props
     */
    minLength = input<number, unknown>(1, { transform: numberAttribute });
    /**
     * Minimum number of characters to initiate a search.
     * @group Props
     */
    minQueryLength = input<number | undefined, unknown>(undefined, { transform: numberAttribute });
    /**
     * Delay between keystrokes to wait before sending a query.
     * @group Props
     */
    delay = input<number, unknown>(300, { transform: numberAttribute });
    /**
     * Inline style of the overlay panel element.
     * @group Props
     */
    panelStyle = input<{ [klass: string]: any } | null | undefined>();
    /**
     * Style class of the component.
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
     * Inline style of the input field.
     * @group Props
     */
    inputStyle = input<{ [klass: string]: any } | null | undefined>();
    /**
     * Identifier of the focus input to match a label defined for the component.
     * @group Props
     */
    inputId = input<string | undefined>();
    /**
     * Inline style of the input field.
     * @group Props
     */
    inputStyleClass = input<string | undefined>();
    /**
     * Hint text for the input field.
     * @group Props
     */
    placeholder = input<string | undefined>();
    /**
     * When present, it specifies that the input cannot be typed.
     * @group Props
     */
    readonly = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Maximum height of the suggestions panel.
     * @group Props
     */
    scrollHeight = input<string>('200px');
    /**
     * Defines if data is loaded and interacted with in lazy manner.
     * @group Props
     */
    lazy = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Whether the data should be loaded on demand during scroll.
     * @group Props
     */
    virtualScroll = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Height of an item in the list for VirtualScrolling.
     * @group Props
     */
    virtualScrollItemSize = input<number | undefined, unknown>(undefined, { transform: numberAttribute });
    /**
     * Whether to use the scroller feature. The properties of scroller component can be used like an object in it.
     * @group Props
     */
    virtualScrollOptions = input<ScrollerOptions | undefined>();
    /**
     * When enabled, highlights the first item in the list by default.
     * @group Props
     */
    autoHighlight = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * When present, autocomplete clears the manual input if it does not match of the suggestions to force only accepting values from the suggestions.
     * @group Props
     */
    forceSelection = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Type of the input, defaults to "text".
     * @group Props
     */
    type = input<string>('text');
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
     * Defines a string that labels the input for accessibility.
     * @group Props
     */
    ariaLabel = input<string | undefined>();
    /**
     * Defines a string that labels the dropdown button for accessibility.
     * @group Props
     */
    dropdownAriaLabel = input<string | undefined>();
    /**
     * Specifies one or more IDs in the DOM that labels the input field.
     * @group Props
     */
    ariaLabelledBy = input<string | undefined>();
    /**
     * Icon class of the dropdown icon.
     * @group Props
     */
    dropdownIcon = input<string | undefined>();
    /**
     * Ensures uniqueness of selected items on multiple mode.
     * @group Props
     */
    unique = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Whether to display options as grouped when nested options are provided.
     * @group Props
     */
    group = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Whether to run a query when input receives focus.
     * @group Props
     */
    completeOnFocus = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * When enabled, a clear icon is displayed to clear the value.
     * @group Props
     */
    showClear = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Displays a button next to the input field when enabled.
     * @group Props
     */
    dropdown = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Whether to show the empty message or not.
     * @group Props
     */
    showEmptyMessage = input<boolean | undefined, unknown>(true, { transform: booleanAttribute });
    /**
     * Specifies the behavior dropdown button. Default "blank" mode sends an empty string and "current" mode sends the input value.
     * @group Props
     */
    dropdownMode = input<string>('blank');
    /**
     * Specifies if multiple values can be selected.
     * @group Props
     */
    multiple = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * When enabled, the input value is added to the selected items on tab key press when multiple is true and typeahead is false.
     * @group Props
     */
    addOnTab = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    tabindex = input<number | undefined, unknown>(undefined, { transform: numberAttribute });
    /**
     * A property to uniquely identify a value in options.
     * @group Props
     */
    dataKey = input<string | undefined>();
    /**
     * Text to display when there is no data. Defaults to global value in i18n translation configuration.
     * @group Props
     */
    emptyMessage = input<string | undefined>();
    /**
     * Transition options of the show animation.
     * @group Props
     * @deprecated since v21.0.0, use `motionOptions` instead.
     */
    showTransitionOptions = input<string>('.12s cubic-bezier(0, 0, 0.2, 1)');
    /**
     * Transition options of the hide animation.
     * @group Props
     * @deprecated since v21.0.0, use `motionOptions` instead.
     */
    hideTransitionOptions = input<string>('.1s linear');
    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    autofocus = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Used to define a string that autocomplete attribute the current element.
     * @group Props
     */
    autocomplete = input<string>('off');
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
     * Options for the overlay element.
     * @group Props
     */
    overlayOptions = input<OverlayOptions | undefined>();
    /**
     * An array of suggestions to display.
     * @group Props
     */
    suggestions = input<any[] | null | undefined>(null);
    /**
     * Property name or getter function to use as the label of an option.
     * @group Props
     */
    optionLabel = input<string | ((item: any) => string) | undefined>();
    /**
     * Property name or getter function to use as the value of an option.
     * @group Props
     */
    optionValue = input<string | ((item: any) => string) | undefined>();
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
    autoOptionFocus = input<boolean | undefined, unknown>(false, { transform: booleanAttribute });
    /**
     * When enabled, the focused option is selected.
     * @group Props
     */
    selectOnFocus = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Locale to use in searching. The default locale is the host environment's current locale.
     * @group Props
     */
    searchLocale = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Property name or getter function to use as the disabled flag of an option, defaults to false when not defined.
     * @group Props
     */
    optionDisabled = input<string | ((item: any) => string) | undefined>();
    /**
     * When enabled, the hovered option will be focused.
     * @group Props
     */
    focusOnHover = input<boolean | undefined, unknown>(true, { transform: booleanAttribute });
    /**
     * Whether typeahead is active or not.
     * @defaultValue true
     * @group Props
     */
    typeahead = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Whether to add an item on blur event if the input has value and typeahead is false with multiple mode.
     * @defaultValue false
     * @group Props
     */
    addOnBlur = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Separator char to add item when typeahead is false and multiple mode is enabled.
     * @group Props
     */
    separator = input<string | RegExp | undefined>();
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
     * Callback to invoke to search for suggestions.
     * @param {AutoCompleteCompleteEvent} event - Custom complete event.
     * @group Emits
     */
    completeMethod = output<AutoCompleteCompleteEvent>();
    /**
     * Callback to invoke when a suggestion is selected.
     * @param {AutoCompleteSelectEvent} event - custom select event.
     * @group Emits
     */
    onSelect = output<AutoCompleteSelectEvent>();
    /**
     * Callback to invoke when a selected value is removed.
     * @param {AutoCompleteUnselectEvent} event - custom unselect event.
     * @group Emits
     */
    onUnselect = output<AutoCompleteUnselectEvent>();
    /**
     * Callback to invoke when an item is added via addOnBlur or separator features.
     * @param {AutoCompleteAddEvent} event - Custom add event.
     * @group Emits
     */
    onAdd = output<AutoCompleteAddEvent>();
    /**
     * Callback to invoke when the component receives focus.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    onFocus = output<Event>();
    /**
     * Callback to invoke when the component loses focus.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    onBlur = output<Event>();
    /**
     * Callback to invoke to when dropdown button is clicked.
     * @param {AutoCompleteDropdownClickEvent} event - custom dropdown click event.
     * @group Emits
     */
    onDropdownClick = output<AutoCompleteDropdownClickEvent>();
    /**
     * Callback to invoke when clear button is clicked.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    onClear = output<Event | undefined>();
    /**
     * Callback to invoke on input key down.
     * @param {KeyboardEvent} event - Keyboard event.
     * @group Emits
     */
    onInputKeydown = output<KeyboardEvent>();
    /**
     * Callback to invoke on input key up.
     * @param {KeyboardEvent} event - Keyboard event.
     * @group Emits
     */
    onKeyUp = output<KeyboardEvent>();
    /**
     * Callback to invoke on overlay is shown.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    onShow = output<Event | undefined>();
    /**
     * Callback to invoke on overlay is hidden.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    onHide = output<Event | undefined>();
    /**
     * Callback to invoke on lazy load data.
     * @param {AutoCompleteLazyLoadEvent} event - Lazy load event.
     * @group Emits
     */
    onLazyLoad = output<AutoCompleteLazyLoadEvent>();

    inputEL = viewChild<ElementRef>('focusInput');

    multiInputEl = viewChild<ElementRef>('multiIn');

    multiContainerEL = viewChild<ElementRef>('multiContainer');

    dropdownButton = viewChild<ElementRef>('ddBtn');

    itemsViewChild = viewChild<ElementRef>('items');

    scroller = viewChild<Scroller>('scroller');

    overlayViewChild = viewChild<Overlay>('overlay');

    itemsWrapper: Nullable<HTMLDivElement>;

    /**
     * Custom item template.
     * @group Templates
     */
    itemTemplate = contentChild<TemplateRef<AutoCompleteItemTemplateContext>>('item');

    /**
     * Custom empty message template.
     * @group Templates
     */
    emptyTemplate = contentChild<TemplateRef<void>>('empty');

    /**
     * Custom header template.
     * @group Templates
     */
    headerTemplate = contentChild<TemplateRef<void>>('header');

    /**
     * Custom footer template.
     * @group Templates
     */
    footerTemplate = contentChild<TemplateRef<void>>('footer');

    /**
     * Custom selected item template.
     * @group Templates
     */
    selectedItemTemplate = contentChild<TemplateRef<AutoCompleteSelectedItemTemplateContext>>('selecteditem');

    /**
     * Custom group template.
     * @group Templates
     */
    groupTemplate = contentChild<TemplateRef<AutoCompleteGroupTemplateContext>>('group');

    /**
     * Custom loader template.
     * @group Templates
     */
    loaderTemplate = contentChild<TemplateRef<AutoCompleteLoaderTemplateContext>>('loader');

    /**
     * Custom remove icon template.
     * @group Templates
     */
    removeIconTemplate = contentChild<TemplateRef<AutoCompleteRemoveIconTemplateContext>>('removeicon');

    /**
     * Custom loading icon template.
     * @group Templates
     */
    loadingIconTemplate = contentChild<TemplateRef<void>>('loadingicon');

    /**
     * Custom clear icon template.
     * @group Templates
     */
    clearIconTemplate = contentChild<TemplateRef<void>>('clearicon');

    /**
     * Custom dropdown icon template.
     * @group Templates
     */
    dropdownIconTemplate = contentChild<TemplateRef<void>>('dropdownicon');

    onHostClick(event: MouseEvent) {
        this.onContainerClick(event);
    }

    value: string | any;

    timeout: Nullable<any>;

    overlayVisible: boolean | undefined;

    suggestionsUpdated: Nullable<boolean>;

    highlightOption: any;

    highlightOptionChanged: Nullable<boolean>;

    focused: boolean = false;

    loading: Nullable<boolean>;

    scrollHandler: Nullable<ConnectedOverlayScrollHandler>;

    listId: string | undefined;

    searchTimeout: any;

    dirty: boolean = false;

    private _generatedId = uuid('pn_id_');

    /**
     * Resolved identifier of the component: the `id` input when provided, otherwise a generated unique id.
     */
    $id = computed(() => this.id() || this._generatedId);

    templates = contentChildren(PrimeTemplate);

    _itemTemplate = computed<TemplateRef<AutoCompleteItemTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'item' || !KNOWN_TEMPLATE_TYPES.includes(item.getType()))
                .at(-1)?.template
    );

    _groupTemplate = computed<TemplateRef<AutoCompleteGroupTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'group')
                .at(-1)?.template
    );

    _selectedItemTemplate = computed<TemplateRef<AutoCompleteSelectedItemTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'selecteditem' || item.getType() === 'selectedItem')
                .at(-1)?.template
    );

    _headerTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'header')
                .at(-1)?.template
    );

    _emptyTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'empty')
                .at(-1)?.template
    );

    _footerTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'footer')
                .at(-1)?.template
    );

    _loaderTemplate = computed<TemplateRef<AutoCompleteLoaderTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'loader')
                .at(-1)?.template
    );

    _removeIconTemplate = computed<TemplateRef<AutoCompleteRemoveIconTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'removetokenicon')
                .at(-1)?.template
    );

    _loadingIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'loadingicon')
                .at(-1)?.template
    );

    _clearIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'clearicon')
                .at(-1)?.template
    );

    _dropdownIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'dropdownicon')
                .at(-1)?.template
    );

    focusedMultipleOptionIndex = signal<number>(-1);

    focusedOptionIndex = signal<number>(-1);

    _componentStyle = inject(AutoCompleteStyle);

    $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo());

    visibleOptions = computed(() => {
        return this.group() ? this.flatOptions(this.suggestions()) : this.suggestions() || [];
    });

    inputValue = computed(() => {
        const modelValue = this.modelValue();
        const selectedOption = this.optionValueSelected ? (this.suggestions() || []).find((option: any) => equals(option, modelValue, this.equalityKey())) : modelValue;

        if (isNotEmpty(modelValue)) {
            if (typeof modelValue === 'object' || this.optionValueSelected) {
                const label = this.getOptionLabel(selectedOption);

                return label != null ? label : modelValue;
            } else {
                return modelValue;
            }
        } else {
            return '';
        }
    });

    get focusedMultipleOptionId() {
        return this.focusedMultipleOptionIndex() !== -1 ? `${this.$id()}_multiple_option_${this.focusedMultipleOptionIndex()}` : null;
    }

    get focusedOptionId() {
        return this.focusedOptionIndex() !== -1 ? `${this.$id()}_${this.focusedOptionIndex()}` : null;
    }

    get searchResultMessageText() {
        return isNotEmpty(this.visibleOptions()) && this.overlayVisible ? this.searchMessageText.replaceAll('{0}', this.visibleOptions().length) : this.emptySearchMessageText;
    }

    get searchMessageText() {
        return this.searchMessage() || this.config.translation.searchMessage || '';
    }

    get emptySearchMessageText() {
        return this.emptyMessage() || this.config.translation.emptySearchMessage || '';
    }

    get selectionMessageText() {
        return this.selectionMessage() || this.config.translation.selectionMessage || '';
    }

    get emptySelectionMessageText() {
        return this.emptySelectionMessage() || this.config.translation.emptySelectionMessage || '';
    }

    get selectedMessageText() {
        return this.hasSelectedOption() ? this.selectionMessageText.replaceAll('{0}', this.multiple() ? this.modelValue()?.length : '1') : this.emptySelectionMessageText;
    }

    get ariaSetSize() {
        return this.visibleOptions().filter((option) => !this.isOptionGroup(option)).length;
    }

    get listLabel(): string {
        return this.config.getTranslation(TranslationKeys.ARIA)['listLabel'];
    }

    get virtualScrollerDisabled() {
        return !this.virtualScroll();
    }

    get optionValueSelected() {
        return typeof this.modelValue() === 'string' && this.optionValue();
    }

    chipItemClass(index) {
        return this._componentStyle.classes.chipItem({ instance: this, i: index });
    }

    constructor(
        public overlayService: OverlayService,
        private zone: NgZone
    ) {
        super();
    }

    onChanges(changes: SimpleChanges) {
        if (changes['suggestions']) {
            this.handleSuggestionsChange();
        }
    }

    onAfterViewChecked() {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
        //Use timeouts as since Angular 4.2, AfterViewChecked is broken and not called after panel is updated
        if (this.suggestionsUpdated && this.overlayViewChild()) {
            this.zone.runOutsideAngular(() => {
                setTimeout(() => {
                    this.overlayViewChild()?.alignOverlay();
                }, 1);
                this.suggestionsUpdated = false;
            });
        }
    }

    handleSuggestionsChange() {
        if (this.loading) {
            (this.suggestions()?.length ?? 0) > 0 || this.showEmptyMessage() || !!this.emptyTemplate() ? this.show() : this.hide();
            const focusedOptionIndex = this.overlayVisible && this.autoOptionFocus() ? this.findFirstFocusedOptionIndex() : -1;
            this.focusedOptionIndex.set(focusedOptionIndex);
            this.suggestionsUpdated = true;
            this.loading = false;
            this.cd.markForCheck();
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

    isOptionGroup(option) {
        return this.optionGroupLabel() && option.optionGroup && option.group;
    }

    findFirstOptionIndex() {
        return this.visibleOptions().findIndex((option) => this.isValidOption(option));
    }

    findLastOptionIndex() {
        return findLastIndex(this.visibleOptions(), (option) => this.isValidOption(option));
    }

    findFirstFocusedOptionIndex() {
        const selectedIndex = this.findSelectedOptionIndex();

        return selectedIndex < 0 ? this.findFirstOptionIndex() : selectedIndex;
    }

    findLastFocusedOptionIndex() {
        const selectedIndex = this.findSelectedOptionIndex();

        return selectedIndex < 0 ? this.findLastOptionIndex() : selectedIndex;
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

    isValidSelectedOption(option) {
        return this.isValidOption(option) && this.isSelected(option);
    }

    isValidOption(option) {
        return option && !(this.isOptionDisabled(option) || this.isOptionGroup(option));
    }

    isOptionDisabled(option) {
        return this.optionDisabled() ? resolveFieldData(option, this.optionDisabled()) : false;
    }

    isSelected(option) {
        if (this.multiple()) {
            return this.unique() ? (this.modelValue() as string[])?.some((model) => equals(model, option, this.equalityKey())) : false;
        }
        return equals(this.modelValue(), option, this.equalityKey());
    }

    isOptionMatched(option, value) {
        return this.isValidOption(option) && this.getOptionLabel(option).toLocaleLowerCase(this.searchLocale()) === value.toLocaleLowerCase(this.searchLocale());
    }

    isInputClicked(event) {
        return event.target === this.inputEL()?.nativeElement;
    }

    isDropdownClicked(event) {
        const dropdownButton = this.dropdownButton();

        return dropdownButton?.nativeElement ? event.target === dropdownButton.nativeElement || dropdownButton.nativeElement.contains(event.target) : false;
    }

    equalityKey() {
        return this.optionValue() ? undefined : this.dataKey();
    }

    onContainerClick(event) {
        if (this.$disabled() || this.loading || this.isInputClicked(event) || this.isDropdownClicked(event)) {
            return;
        }

        const overlay = this.overlayViewChild();

        if (!overlay || !overlay.overlayViewChild?.nativeElement.contains(event.target)) {
            focus(this.inputEL()?.nativeElement);
        }
    }

    handleDropdownClick(event) {
        let query: string | undefined = undefined;

        if (this.overlayVisible) {
            this.hide(true);
        } else {
            focus(this.inputEL()?.nativeElement);
            query = this.inputEL()?.nativeElement?.value as string;

            if (this.dropdownMode() === 'blank') this.search(event, '', 'dropdown');
            else if (this.dropdownMode() === 'current') this.search(event, query, 'dropdown');
        }

        this.onDropdownClick.emit({ originalEvent: event, query });
    }

    onInput(event) {
        if (this.typeahead()) {
            const _minLength = this.minQueryLength() || this.minLength();

            if (this.searchTimeout) {
                clearTimeout(this.searchTimeout);
            }

            let query = event.target.value;
            if (this.maxlength() !== null) {
                query = query.split('').slice(0, this.maxlength()).join('');
            }

            if (!this.multiple() && !this.forceSelection()) {
                this.updateModel(query);
            }

            if (query.length === 0 && !this.multiple()) {
                this.onClear.emit(undefined);

                setTimeout(() => {
                    this.hide();
                }, this.delay() / 2);
            } else {
                if (query.length >= _minLength) {
                    this.focusedOptionIndex.set(-1);

                    this.searchTimeout = setTimeout(() => {
                        this.search(event, query, 'input');
                    }, this.delay());
                } else {
                    this.hide();
                }
            }
        }
    }

    onInputChange(event) {
        this.updateInputWithForceSelection(event);
    }

    onInputFocus(event) {
        if (this.$disabled()) {
            // For ScreenReaders
            return;
        }

        if (!this.dirty && this.completeOnFocus()) {
            this.search(event, event.target.value, 'focus');
        }
        this.dirty = true;
        this.focused = true;
        const focusedOptionIndex = this.focusedOptionIndex() !== -1 ? this.focusedOptionIndex() : this.overlayVisible && this.autoOptionFocus() ? this.findFirstFocusedOptionIndex() : -1;
        this.focusedOptionIndex.set(focusedOptionIndex);
        this.overlayVisible && this.scrollInView(this.focusedOptionIndex());
        this.onFocus.emit(event);
    }

    onMultipleContainerFocus(event) {
        if (this.$disabled()) {
            // For ScreenReaders
            return;
        }

        this.focused = true;
    }

    onMultipleContainerBlur(event) {
        this.focusedMultipleOptionIndex.set(-1);
        this.focused = false;
    }

    onMultipleContainerKeyDown(event) {
        if (this.$disabled()) {
            event.preventDefault();

            return;
        }

        switch (event.code) {
            case 'ArrowLeft':
                this.onArrowLeftKeyOnMultiple(event);
                break;

            case 'ArrowRight':
                this.onArrowRightKeyOnMultiple(event);
                break;

            case 'Backspace':
                this.onBackspaceKeyOnMultiple(event);
                break;

            default:
                break;
        }
    }

    onInputBlur(event) {
        this.dirty = false;
        this.focused = false;
        this.focusedOptionIndex.set(-1);

        if (this.addOnBlur() && this.multiple() && !this.typeahead()) {
            const inputValue = (this.multiInputEl()?.nativeElement?.value || event.target.value || '').trim();
            if (inputValue && !this.isSelected(inputValue)) {
                this.updateModel([...(this.modelValue() || []), inputValue]);
                this.onAdd.emit({ originalEvent: event, value: inputValue });
                if (this.multiInputEl()?.nativeElement) {
                    this.multiInputEl()!.nativeElement.value = '';
                } else {
                    event.target.value = '';
                }
            }
        }

        this.onModelTouched();
        this.onBlur.emit(event);
    }

    onInputPaste(event) {
        if (this.separator() && this.multiple() && !this.typeahead()) {
            const pastedData = (event.clipboardData || (window as any)['clipboardData'])?.getData('Text');
            if (pastedData) {
                const values = pastedData.split(this.separator());
                const newValues = [...(this.modelValue() || [])];

                values.forEach((value: string) => {
                    const trimmedValue = value.trim();
                    if (trimmedValue && !this.isSelected(trimmedValue)) {
                        newValues.push(trimmedValue);
                    }
                });

                if (newValues.length > (this.modelValue() || []).length) {
                    const addedValues = newValues.slice((this.modelValue() || []).length);
                    this.updateModel(newValues);
                    addedValues.forEach((addedValue) => {
                        this.onAdd.emit({ originalEvent: event, value: addedValue });
                    });
                    if (this.multiInputEl()?.nativeElement) {
                        this.multiInputEl()!.nativeElement.value = '';
                    } else {
                        event.target.value = '';
                    }
                    event.preventDefault();
                }
            }
        } else {
            this.onKeyDown(event);
        }
    }

    onInputKeyUp(event) {
        this.onKeyUp.emit(event);
    }

    onKeyDown(event) {
        if (this.$disabled()) {
            event.preventDefault();

            return;
        }

        // Emit keydown event for external handling
        this.onInputKeydown.emit(event);

        switch (event.code) {
            case 'ArrowDown':
                this.onArrowDownKey(event);
                break;

            case 'ArrowUp':
                this.onArrowUpKey(event);
                break;

            case 'ArrowLeft':
                this.onArrowLeftKey(event);
                break;

            case 'ArrowRight':
                this.onArrowRightKey(event);
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
            case 'NumpadEnter':
                this.onEnterKey(event);
                break;

            case 'Escape':
                this.onEscapeKey(event);
                break;

            case 'Tab':
                this.onTabKey(event);
                break;

            case 'Backspace':
                this.onBackspaceKey(event);
                break;

            case 'ShiftLeft':
            case 'ShiftRight':
                //NOOP
                break;

            default:
                this.handleSeparatorKey(event);
                break;
        }
    }

    handleSeparatorKey(event) {
        const separator = this.separator();

        if (separator && this.multiple() && !this.typeahead()) {
            if (separator === event.key || (typeof separator === 'string' && event.key === separator) || (separator instanceof RegExp && event.key.match(separator))) {
                const inputValue = (this.multiInputEl()?.nativeElement?.value || event.target.value || '').trim();
                if (inputValue && !this.isSelected(inputValue)) {
                    this.updateModel([...(this.modelValue() || []), inputValue]);
                    this.onAdd.emit({ originalEvent: event, value: inputValue });
                    if (this.multiInputEl()?.nativeElement) {
                        this.multiInputEl()!.nativeElement.value = '';
                    } else {
                        event.target.value = '';
                    }
                    event.preventDefault();
                }
            }
        }
    }

    onArrowDownKey(event) {
        if (!this.overlayVisible) {
            return;
        }

        const optionIndex = this.focusedOptionIndex() !== -1 ? this.findNextOptionIndex(this.focusedOptionIndex()) : this.findFirstFocusedOptionIndex();

        this.changeFocusedOptionIndex(event, optionIndex);

        event.preventDefault();
        event.stopPropagation();
    }

    onArrowUpKey(event) {
        if (!this.overlayVisible) {
            return;
        }

        if (event.altKey) {
            if (this.focusedOptionIndex() !== -1) {
                this.onOptionSelect(event, this.visibleOptions()[this.focusedOptionIndex()]);
            }

            this.overlayVisible && this.hide();
            event.preventDefault();
        } else {
            const optionIndex = this.focusedOptionIndex() !== -1 ? this.findPrevOptionIndex(this.focusedOptionIndex()) : this.findLastFocusedOptionIndex();

            this.changeFocusedOptionIndex(event, optionIndex);

            event.preventDefault();
            event.stopPropagation();
        }
    }

    onArrowLeftKey(event) {
        const target = event.currentTarget;
        this.focusedOptionIndex.set(-1);
        if (this.multiple()) {
            if (isEmpty(target.value) && this.hasSelectedOption()) {
                focus(this.multiContainerEL()?.nativeElement);
                this.focusedMultipleOptionIndex.set(this.modelValue().length);
            } else {
                event.stopPropagation(); // To prevent onArrowLeftKeyOnMultiple method
            }
        }
    }

    onArrowRightKey(event) {
        this.focusedOptionIndex.set(-1);

        this.multiple() && event.stopPropagation(); // To prevent onArrowRightKeyOnMultiple method
    }

    onHomeKey(event) {
        const { currentTarget } = event;
        const len = currentTarget.value.length;

        currentTarget.setSelectionRange(0, event.shiftKey ? len : 0);
        this.focusedOptionIndex.set(-1);

        event.preventDefault();
    }

    onEndKey(event) {
        const { currentTarget } = event;
        const len = currentTarget.value.length;

        currentTarget.setSelectionRange(event.shiftKey ? 0 : len, len);
        this.focusedOptionIndex.set(-1);

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
        if (!this.typeahead() && !this.forceSelection()) {
            if (this.multiple()) {
                const inputValue = event.target.value?.trim();
                if (inputValue && !this.isSelected(inputValue)) {
                    this.updateModel([...(this.modelValue() || []), inputValue]);
                    this.onAdd.emit({ originalEvent: event, value: inputValue });
                    this.inputEL()?.nativeElement && (this.inputEL()!.nativeElement.value = '');
                }
            }
        }
        if (!this.overlayVisible) {
            return;
        } else {
            if (this.focusedOptionIndex() !== -1) {
                this.onOptionSelect(event, this.visibleOptions()[this.focusedOptionIndex()]);
            }

            this.hide();
        }

        event.preventDefault();
    }

    onEscapeKey(event) {
        this.overlayVisible && this.hide(true);
        event.preventDefault();
    }

    onTabKey(event) {
        // If there's a focused option in the dropdown, select it
        if (this.focusedOptionIndex() !== -1) {
            this.onOptionSelect(event, this.visibleOptions()[this.focusedOptionIndex()]);
            return;
        }

        // Handle tab key behavior for multiple mode without typeahead
        if (this.multiple() && !this.typeahead()) {
            const inputValue = (this.multiInputEl()?.nativeElement?.value || this.inputEL()?.nativeElement?.value || '').trim();

            if (this.addOnTab()) {
                if (inputValue && !this.isSelected(inputValue)) {
                    // Add the value and keep focus
                    this.updateModel([...(this.modelValue() || []), inputValue]);
                    this.onAdd.emit({ originalEvent: event, value: inputValue });
                    if (this.multiInputEl()?.nativeElement) {
                        this.multiInputEl()!.nativeElement.value = '';
                    } else if (this.inputEL()?.nativeElement) {
                        this.inputEL()!.nativeElement.value = '';
                    }

                    this.updateInputValue();
                    event.preventDefault(); // Keep focus on the component
                    this.overlayVisible && this.hide();
                    return;
                }
                // If no value or already selected, allow normal tab behavior (blur)
            }
            // If addOnTab is false or no value to add, allow normal tab behavior
            // which will trigger blur and potentially addOnBlur
        }

        this.overlayVisible && this.hide();
    }

    onBackspaceKey(event) {
        if (this.multiple()) {
            if (isNotEmpty(this.modelValue()) && !this.inputEL()?.nativeElement?.value) {
                const removedValue = this.modelValue()[this.modelValue().length - 1];
                const newValue = this.modelValue().slice(0, -1);
                this.updateModel(newValue);
                this.onUnselect.emit({ originalEvent: event, value: removedValue });
            }

            event.stopPropagation(); // To prevent onBackspaceKeyOnMultiple method
        }
    }

    onArrowLeftKeyOnMultiple(event) {
        const optionIndex = this.focusedMultipleOptionIndex() < 1 ? 0 : this.focusedMultipleOptionIndex() - 1;
        this.focusedMultipleOptionIndex.set(optionIndex);
    }

    onArrowRightKeyOnMultiple(event) {
        let optionIndex = this.focusedMultipleOptionIndex();
        optionIndex++;

        this.focusedMultipleOptionIndex.set(optionIndex);
        if (optionIndex > this.modelValue().length - 1) {
            this.focusedMultipleOptionIndex.set(-1);
            focus(this.inputEL()?.nativeElement);
        }
    }

    onBackspaceKeyOnMultiple(event) {
        if (this.focusedMultipleOptionIndex() !== -1) {
            this.removeOption(event, this.focusedMultipleOptionIndex());
        }
    }

    onOptionSelect(event, option, isHide = true) {
        if (this.multiple()) {
            this.inputEL()?.nativeElement && (this.inputEL()!.nativeElement.value = '');

            if (!this.isSelected(option)) {
                this.updateModel([...(this.modelValue() || []), option]);
            }
        } else {
            this.updateModel(option);
        }

        this.onSelect.emit({ originalEvent: event, value: option });

        isHide && this.hide(true);
    }

    onOptionMouseEnter(event, index) {
        if (this.focusOnHover()) {
            this.changeFocusedOptionIndex(event, index);
        }
    }

    search(event, query, source) {
        //allow empty string but not undefined or null
        if (query === undefined || query === null) {
            return;
        }

        //do not search blank values on input change
        if (source === 'input' && query.trim().length === 0) {
            return;
        }
        this.loading = true;
        this.completeMethod.emit({ originalEvent: event, query });
    }

    removeOption(event, index) {
        event.stopPropagation();

        const removedOption = this.modelValue()[index];
        const value = (this.modelValue() as string[]).filter((_, i) => i !== index);

        this.updateModel(value);
        this.onUnselect.emit({ originalEvent: event, value: removedOption });
        focus(this.inputEL()?.nativeElement);
    }

    updateModel(options) {
        let value = null;
        if (options) {
            value = this.multiple() ? options.map((option) => this.getOptionValue(option)) : this.getOptionValue(options);
        }

        this.value = value;
        this.writeModelValue(options);
        this.onModelChange(value);
        this.updateInputValue();
        this.cd.markForCheck();
    }

    updateInputValue() {
        const inputEL = this.inputEL();

        if (inputEL && inputEL.nativeElement) {
            if (!this.multiple()) {
                inputEL.nativeElement.value = this.inputValue();
            } else {
                inputEL.nativeElement.value = '';
            }
        }
    }

    updateInputWithForceSelection(event: any) {
        const input = this.inputEL()?.nativeElement;
        const inputCleared = !input?.value && isNotEmpty(this.modelValue());

        if (!this.forceSelection() || this.overlayVisible || (!input?.value && !inputCleared)) {
            return;
        }

        const _minLength = this.minQueryLength() ?? this.minLength();

        if (!inputCleared && input.value.length < _minLength) {
            return;
        }

        const matchedOption = this.visibleOptions()?.find((option) => this.isOptionMatched(option, input.value));

        if (!matchedOption) {
            input.value = '';
            if (!this.multiple()) {
                this.clear();
            }
            return;
        }

        if (matchedOption && !this.isSelected(matchedOption)) {
            this.onOptionSelect(event, matchedOption);
        }
    }

    autoUpdateModel() {
        if ((this.selectOnFocus() || this.autoHighlight()) && this.autoOptionFocus() && !this.hasSelectedOption()) {
            const focusedOptionIndex = this.findFirstFocusedOptionIndex();
            this.focusedOptionIndex.set(focusedOptionIndex);
            this.onOptionSelect(null, this.visibleOptions()[this.focusedOptionIndex()], false);
        }
    }

    scrollInView(index = -1) {
        const id = index !== -1 ? `${this.$id()}_${index}` : this.focusedOptionId;
        const itemsViewChild = this.itemsViewChild();

        if (itemsViewChild && itemsViewChild.nativeElement) {
            const element = findSingle(itemsViewChild.nativeElement, `li[id="${id}"]`);
            if (element) {
                element.scrollIntoView && element.scrollIntoView({ block: 'nearest', inline: 'nearest' });
            } else if (!this.virtualScrollerDisabled) {
                setTimeout(() => {
                    this.virtualScroll() && this.scroller()?.scrollToIndex(index !== -1 ? index : this.focusedOptionIndex());
                }, 0);
            }
        }
    }

    changeFocusedOptionIndex(event, index) {
        if (this.focusedOptionIndex() !== index) {
            this.focusedOptionIndex.set(index);
            this.scrollInView();

            if (this.selectOnFocus()) {
                this.onOptionSelect(event, this.visibleOptions()[index], false);
            }
        }
    }

    show(isFocus = false) {
        this.dirty = true;
        this.overlayVisible = true;
        const focusedOptionIndex = this.focusedOptionIndex() !== -1 ? this.focusedOptionIndex() : this.autoOptionFocus() ? this.findFirstFocusedOptionIndex() : -1;
        this.focusedOptionIndex.set(focusedOptionIndex);
        isFocus && focus(this.inputEL()?.nativeElement);
        if (isFocus) {
            focus(this.inputEL()?.nativeElement);
        }
        this.onShow.emit(undefined);
        this.cd.markForCheck();
    }

    hide(isFocus = false) {
        const _hide = () => {
            this.dirty = isFocus;
            this.overlayVisible = false;
            this.focusedOptionIndex.set(-1);
            isFocus && focus(this.inputEL()?.nativeElement);
            this.onHide.emit(undefined);
            this.updateInputWithForceSelection(null);
            this.cd.markForCheck();
        };

        setTimeout(() => {
            _hide();
        }, 0); // For ScreenReaders
    }

    clear() {
        this.updateModel(null);
        this.inputEL()?.nativeElement && (this.inputEL()!.nativeElement.value = '');
        this.onClear.emit(undefined);
    }

    hasSelectedOption() {
        return isNotEmpty(this.modelValue());
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

    getOptionLabel(option: any) {
        return this.optionLabel() ? resolveFieldData(option, this.optionLabel()) : option && option.label != undefined ? option.label : option;
    }

    getOptionValue(option) {
        return this.optionValue() ? resolveFieldData(option, this.optionValue()) : option && option.value != undefined ? option.value : option;
    }

    getOptionIndex(index, scrollerOptions) {
        return this.virtualScrollerDisabled ? index : scrollerOptions && scrollerOptions.getItemOptions(index)['index'];
    }

    getOptionGroupLabel(optionGroup: any) {
        return this.optionGroupLabel() ? resolveFieldData(optionGroup, this.optionGroupLabel()) : optionGroup && optionGroup.label != undefined ? optionGroup.label : optionGroup;
    }

    getOptionGroupChildren(optionGroup: any) {
        return this.optionGroupChildren() ? resolveFieldData(optionGroup, this.optionGroupChildren()) : optionGroup.items;
    }

    getPTOptions(option: any, scrollerOptions: any, index: number, key: string) {
        return this.ptm(key, {
            context: {
                option,
                index: this.getOptionIndex(index, scrollerOptions),
                selected: this.isSelected(option),
                focused: this.focusedOptionIndex() === this.getOptionIndex(index, scrollerOptions),
                disabled: this.isOptionDisabled(option)
            }
        });
    }

    onOverlayBeforeEnter() {
        this.itemsWrapper = <any>findSingle(this.overlayViewChild()?.overlayViewChild?.nativeElement, this.virtualScroll() ? '[data-pc-name="virtualscroller"]' : '[data-pc-name="pcoverlay"]');

        if (this.virtualScroll()) {
            this.scroller()?.setContentEl(this.itemsViewChild()?.nativeElement);
            this.scroller()?.viewInit();
        }
        if (this.visibleOptions() && this.visibleOptions().length) {
            if (this.virtualScroll()) {
                const selectedIndex = this.modelValue() ? this.focusedOptionIndex() : -1;

                if (selectedIndex !== -1) {
                    this.scroller()?.scrollToIndex(selectedIndex);
                }
            } else {
                let selectedListItem = findSingle(this.itemsWrapper as HTMLElement, '[data-pc-section="option"][data-p-selected="true"]');

                if (selectedListItem) {
                    selectedListItem.scrollIntoView({ block: 'nearest', inline: 'center' });
                }
            }
        }
    }

    get containerDataP() {
        return this.cn({
            fluid: this.hasFluid
        });
    }

    get overlayDataP() {
        return this.cn({
            [`overlay-${this.$appendTo()}`]: true
        });
    }

    get inputMultipleDataP() {
        return this.cn({
            invalid: this.invalid(),
            disabled: this.$disabled(),
            focus: this.focused,
            fluid: this.hasFluid,
            filled: this.$variant() === 'filled',
            empty: !this.$filled(),
            [this.size() as string]: this.size()
        });
    }

    /**
     * @override
     *
     * @see {@link BaseEditableHolder.writeControlValue}
     * Writes the value to the control.
     */
    writeControlValue(value: any, setModelValue: (value: any) => void): void {
        if (this.multiple()) {
            const resolved = (value || []).map((val: any) => {
                const match = this.visibleOptions().find((option: any) => equals(val, option, this.equalityKey()));
                return match ?? val;
            });
            setModelValue(isEmpty(value) ? value : resolved);
        } else {
            const option = this.visibleOptions().find((option: any) => equals(value, option, this.equalityKey()));
            setModelValue(isEmpty(option) ? value : option);
        }

        this.value = value;
        this.updateInputValue();
        this.cd.markForCheck();
    }

    onDestroy() {
        if (this.scrollHandler) {
            this.scrollHandler.destroy();
            this.scrollHandler = null;
        }
    }
}

@NgModule({
    imports: [AutoComplete, SharedModule],
    exports: [AutoComplete, SharedModule]
})
export class AutoCompleteModule {}
