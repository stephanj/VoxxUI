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
    model,
    NgModule,
    numberAttribute,
    output,
    TemplateRef,
    viewChild,
    ViewEncapsulation
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { PrimeTemplate, SharedModule } from 'voxx-ui/api';
import { AutoFocus } from 'voxx-ui/autofocus';
import { PARENT_INSTANCE } from 'voxx-ui/basecomponent';
import { BaseEditableHolder } from 'voxx-ui/baseeditableholder';
import { Bind, BindModule } from 'voxx-ui/bind';
import { ToggleSwitchChangeEvent, ToggleSwitchHandleTemplateContext, ToggleSwitchPassThrough } from 'voxx-ui/types/toggleswitch';
import { ToggleSwitchStyle } from './style/toggleswitchstyle';

const TOGGLESWITCH_INSTANCE = new InjectionToken<ToggleSwitch>('TOGGLESWITCH_INSTANCE');

export const TOGGLESWITCH_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ToggleSwitch),
    multi: true
};
/**
 * ToggleSwitch is used to select a boolean value.
 * @group Components
 */
@Component({
    selector: 'vx-toggleswitch, vx-toggleSwitch, vx-toggle-switch',
    imports: [CommonModule, AutoFocus, SharedModule, BindModule],
    template: `
        <input
            #input
            [attr.id]="inputId()"
            type="checkbox"
            role="switch"
            [class]="cx('input')"
            [checked]="checked()"
            [attr.required]="required() ? '' : undefined"
            [attr.disabled]="$disabled() ? '' : undefined"
            [attr.aria-checked]="checked()"
            [attr.aria-labelledby]="ariaLabelledBy()"
            [attr.aria-label]="ariaLabel()"
            [attr.name]="name()"
            [attr.tabindex]="tabindex()"
            (focus)="onFocus()"
            (blur)="onBlur()"
            [vxAutoFocus]="autofocus()"
            [vxBind]="ptm('input')"
        />
        <div [class]="cx('slider')" [vxBind]="ptm('slider')" [attr.data-p]="dataP">
            <div [class]="cx('handle')" [vxBind]="ptm('handle')" [attr.data-p]="dataP">
                @if (handleTemplate() || _handleTemplate()) {
                    <ng-container *ngTemplateOutlet="handleTemplate() || _handleTemplate(); context: { checked: checked() }" />
                }
            </div>
        </div>
    `,
    providers: [TOGGLESWITCH_VALUE_ACCESSOR, ToggleSwitchStyle, { provide: TOGGLESWITCH_INSTANCE, useExisting: ToggleSwitch }, { provide: PARENT_INSTANCE, useExisting: ToggleSwitch }],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': "cn(cx('root'), styleClass())",
        '[style]': "sx('root')",
        '[attr.data-p-checked]': 'checked()',
        '[attr.data-p-disabled]': '$disabled()',
        '[attr.data-p]': 'dataP',
        '(click)': 'onHostClick($event)'
    },
    hostDirectives: [Bind]
})
export class ToggleSwitch extends BaseEditableHolder<ToggleSwitchPassThrough> {
    componentName = 'ToggleSwitch';

    $pcToggleSwitch: ToggleSwitch | undefined = inject(TOGGLESWITCH_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    /**
     * Signal Forms (Angular v22) value model.
     *
     * Exposing a `value` `model()` makes ToggleSwitch usable directly with the
     * `[formField]` directive as a `FormValueControl` — the field value is the
     * component's `trueValue`/`falseValue`. It is kept in sync with `modelValue`
     * (the render source that `checked()` derives from) by
     * {@link BaseEditableHolder.bindFormValue}. The classic `NG_VALUE_ACCESSOR`
     * path is untouched, so `[(ngModel)]`/`formControlName` keep working.
     *
     * Note: we deliberately do not add `implements FormValueControl<any>` because
     * ToggleSwitch also exposes a derived `checked()` accessor (for `trueValue`/
     * `falseValue` support), which the contract's `checked?: undefined` guard
     * forbids. The `[formField]` directive detects the `value` model structurally,
     * so the integration works at runtime regardless.
     * @group Props
     */
    value = model<any>();

    constructor() {
        super();
        this.bindFormValue(this.value);
    }

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }

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
    tabindex = input<number | undefined, unknown>(undefined, { transform: numberAttribute });
    /**
     * Identifier of the input element.
     * @group Props
     */
    inputId = input<string | undefined>();
    /**
     * When present, it specifies that the component cannot be edited.
     * @group Props
     */
    readonly = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Value in checked state.
     * @group Props
     */
    trueValue = input<any>(true);
    /**
     * Value in unchecked state.
     * @group Props
     */
    falseValue = input<any>(false);
    /**
     * Used to define a string that autocomplete attribute the current element.
     * @group Props
     */
    ariaLabel = input<string | undefined>();
    /**
     * Specifies the size of the component.
     * @defaultValue undefined
     * @group Props
     */
    size = input<'large' | 'small' | undefined>();
    /**
     * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
     * @group Props
     */
    ariaLabelledBy = input<string | undefined>();
    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    autofocus = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Callback to invoke when the on value change.
     * @param {ToggleSwitchChangeEvent} event - Custom change event.
     * @group Emits
     */
    onChange = output<ToggleSwitchChangeEvent>();

    input = viewChild.required<ElementRef>('input');
    /**
     * Custom handle template.
     * @param {ToggleSwitchHandleTemplateContext} context - handle context.
     * @see {@link ToggleSwitchHandleTemplateContext}
     * @group Templates
     */
    handleTemplate = contentChild<TemplateRef<ToggleSwitchHandleTemplateContext>>('handle', { descendants: false });

    templates = contentChildren(PrimeTemplate);

    _handleTemplate = computed<TemplateRef<ToggleSwitchHandleTemplateContext> | undefined>(() => this.templates().at(-1)?.template);

    focused: boolean = false;

    _componentStyle = inject(ToggleSwitchStyle);

    onHostClick(event: MouseEvent) {
        this.onClick(event);
    }

    onClick(event: Event) {
        if (!this.$disabled() && !this.readonly()) {
            this.writeModelValue(this.checked() ? this.falseValue() : this.trueValue());

            this.onModelChange(this.modelValue());
            this.onChange.emit({
                originalEvent: event,
                checked: this.modelValue()
            });

            this.input().nativeElement.focus();
        }
    }

    onFocus() {
        this.focused = true;
    }

    onBlur() {
        this.focused = false;
        this.markTouched();
    }

    checked() {
        return this.modelValue() === this.trueValue();
    }

    /**
     * @override
     *
     * @see {@link BaseEditableHolder.writeControlValue}
     * Writes the value to the control.
     */
    writeControlValue(value: any, setModelValue: (value: any) => void): void {
        setModelValue(value);
        this.cd.markForCheck();
    }

    get dataP() {
        return this.cn({
            checked: this.checked(),
            disabled: this.$disabled(),
            invalid: this.invalid()
        });
    }
}

@NgModule({
    imports: [ToggleSwitch, SharedModule],
    exports: [ToggleSwitch, SharedModule]
})
export class ToggleSwitchModule {}
