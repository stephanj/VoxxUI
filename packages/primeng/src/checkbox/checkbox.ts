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
    linkedSignal,
    NgModule,
    numberAttribute,
    output,
    TemplateRef,
    viewChild,
    ViewEncapsulation
} from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { contains, equals } from '@primeuix/utils';
import { PrimeTemplate, SharedModule } from 'voxx-ui/api';
import { PARENT_INSTANCE } from 'voxx-ui/basecomponent';
import { BaseEditableHolder } from 'voxx-ui/baseeditableholder';
import { Bind, BindModule } from 'voxx-ui/bind';
import { CheckIcon } from 'voxx-ui/icons/check';
import { MinusIcon } from 'voxx-ui/icons/minus';
import { CheckboxChangeEvent, CheckboxIconTemplateContext, CheckboxPassThrough } from 'voxx-ui/types/checkbox';
import { CheckboxStyle } from './style/checkboxstyle';

const CHECKBOX_INSTANCE = new InjectionToken<Checkbox>('CHECKBOX_INSTANCE');

export const CHECKBOX_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Checkbox),
    multi: true
};
/**
 * Checkbox is an extension to standard checkbox element with theming.
 * @group Components
 */
@Component({
    selector: 'vx-checkbox, vx-checkBox, vx-check-box',
    imports: [CommonModule, SharedModule, CheckIcon, MinusIcon, BindModule],
    template: `
        <input
            #input
            [attr.id]="inputId()"
            type="checkbox"
            [attr.value]="value()"
            [attr.name]="name()"
            [checked]="checked"
            [attr.tabindex]="tabindex()"
            [attr.required]="required() ? '' : undefined"
            [attr.readonly]="readonly() ? '' : undefined"
            [attr.disabled]="$disabled() ? '' : undefined"
            [attr.aria-labelledby]="ariaLabelledBy()"
            [attr.aria-label]="ariaLabel()"
            [style]="inputStyle()"
            [class]="cn(cx('input'), inputClass())"
            [vxBind]="ptm('input')"
            (focus)="onInputFocus($event)"
            (blur)="onInputBlur($event)"
            (change)="handleChange($event)"
        />
        <div [class]="cx('box')" [vxBind]="ptm('box')" [attr.data-p]="dataP">
            @if (!checkboxIconTemplate() && !_checkboxIconTemplate()) {
                @if (checked) {
                    @if (checkboxIcon()) {
                        <span [class]="cn(cx('icon'), checkboxIcon())" [vxBind]="ptm('icon')" [attr.data-p]="dataP"></span>
                    }
                    @if (!checkboxIcon()) {
                        <svg data-p-icon="check" [class]="cx('icon')" [vxBind]="ptm('icon')" [attr.data-p]="dataP" />
                    }
                }
                @if (_indeterminate()) {
                    <svg data-p-icon="minus" [class]="cx('icon')" [vxBind]="ptm('icon')" [attr.data-p]="dataP" />
                }
            }
            <ng-template *ngTemplateOutlet="checkboxIconTemplate() || _checkboxIconTemplate(); context: { checked: checked, class: cx('icon'), dataP: dataP }"></ng-template>
        </div>
    `,
    providers: [CHECKBOX_VALUE_ACCESSOR, CheckboxStyle, { provide: CHECKBOX_INSTANCE, useExisting: Checkbox }, { provide: PARENT_INSTANCE, useExisting: Checkbox }],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': "cn(cx('root'), styleClass())",
        '[attr.data-p-highlight]': 'checked',
        '[attr.data-p-checked]': 'checked',
        '[attr.data-p-disabled]': '$disabled()',
        '[attr.data-p]': 'dataP'
    },
    hostDirectives: [Bind]
})
export class Checkbox extends BaseEditableHolder<CheckboxPassThrough> {
    componentName = 'Checkbox';

    hostName = input<any>('');
    /**
     * Value of the checkbox.
     * @group Props
     */
    value = input<any>();
    /**
     * Allows to select a boolean value instead of multiple values.
     * @group Props
     */
    binary = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
     * @group Props
     */
    ariaLabelledBy = input<string | undefined>();
    /**
     * Used to define a string that labels the input element.
     * @group Props
     */
    ariaLabel = input<string | undefined>();
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    tabindex = input<number | undefined, unknown>(undefined, { transform: numberAttribute });
    /**
     * Identifier of the focus input to match a label defined for the component.
     * @group Props
     */
    inputId = input<string | undefined>();
    /**
     * Inline style of the input element.
     * @group Props
     */
    inputStyle = input<{ [klass: string]: any } | null | undefined>();
    /**
     * Style class of the component.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    styleClass = input<string | undefined>();
    /**
     * Style class of the input element.
     * @group Props
     */
    inputClass = input<string | undefined>();
    /**
     * When present, it specifies input state as indeterminate.
     * @group Props
     */
    indeterminate = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Form control value.
     * @group Props
     */
    formControl = input<FormControl | undefined>();
    /**
     * Icon class of the checkbox icon.
     * @group Props
     */
    checkboxIcon = input<string | undefined>();
    /**
     * When present, it specifies that the component cannot be edited.
     * @group Props
     */
    readonly = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    autofocus = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
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
     * Specifies the input variant of the component.
     * @defaultValue undefined
     * @group Props
     */
    variant = input<'filled' | 'outlined' | undefined>();
    /**
     * Specifies the size of the component.
     * @defaultValue undefined
     * @group Props
     */
    size = input<'large' | 'small' | undefined>();
    /**
     * Callback to invoke on value change.
     * @param {CheckboxChangeEvent} event - Custom value change event.
     * @group Emits
     */
    onChange = output<CheckboxChangeEvent>();
    /**
     * Callback to invoke when the receives focus.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    onFocus = output<Event>();
    /**
     * Callback to invoke when the loses focus.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    onBlur = output<Event>();

    inputViewChild = viewChild.required<ElementRef>('input');

    get checked() {
        return this._indeterminate() ? false : this.binary() ? this.modelValue() === this.trueValue() : contains(this.value(), this.modelValue());
    }

    /**
     * Indeterminate display state. Follows the `indeterminate` input and is reset locally when
     * the user toggles the checkbox (see {@link updateModel}) — a subsequent `indeterminate`
     * input change takes over again (`linkedSignal`, #16).
     */
    _indeterminate = linkedSignal<boolean>(() => this.indeterminate());
    /**
     * Custom checkbox icon template.
     * @group Templates
     */
    checkboxIconTemplate = contentChild<TemplateRef<CheckboxIconTemplateContext>>('icon', { descendants: false });

    templates = contentChildren(PrimeTemplate);

    _checkboxIconTemplate = computed<TemplateRef<CheckboxIconTemplateContext> | undefined>(() => {
        let iconTemplate: TemplateRef<CheckboxIconTemplateContext> | undefined;

        for (const item of this.templates()) {
            switch (item.getType()) {
                case 'icon':
                case 'checkboxicon':
                    iconTemplate = item.template;
                    break;
            }
        }

        return iconTemplate;
    });

    focused: boolean = false;

    _componentStyle = inject(CheckboxStyle);

    bindDirectiveInstance = inject(Bind, { self: true });

    $pcCheckbox: Checkbox | undefined = inject(CHECKBOX_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    $variant = computed(() => this.variant() || this.config.inputStyle() || this.config.inputVariant() || undefined);

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }

    updateModel(event) {
        let newModelValue;

        /*
         * When `formControlName` or `formControl` is used - `writeValue` is not called after control changes.
         * Otherwise it is causing multiple references to the actual value: there is one array reference inside the component and another one in the control value.
         * `selfControl` is the source of truth of references, it is made to avoid reference loss.
         * */
        const selfControl = this.injector.get<NgControl | null>(NgControl, null, { optional: true, self: true });

        const formControl = this.formControl();

        const currentModelValue = selfControl && !formControl ? selfControl.value : this.modelValue();

        if (!this.binary()) {
            if (this.checked || this._indeterminate()) newModelValue = currentModelValue.filter((val) => !equals(val, this.value()));
            else newModelValue = currentModelValue ? [...currentModelValue, this.value()] : [this.value()];

            this.onModelChange(newModelValue);
            this.writeModelValue(newModelValue);

            if (formControl) {
                formControl.setValue(newModelValue);
            }
        } else {
            newModelValue = this._indeterminate() ? this.trueValue() : this.checked ? this.falseValue() : this.trueValue();
            this.writeModelValue(newModelValue);
            this.onModelChange(newModelValue);
        }

        if (this._indeterminate()) {
            this._indeterminate.set(false);
        }

        this.onChange.emit({ checked: newModelValue, originalEvent: event });
    }

    handleChange(event) {
        if (!this.readonly()) {
            this.updateModel(event);
        }
    }

    onInputFocus(event) {
        this.focused = true;
        this.onFocus.emit(event);
    }

    onInputBlur(event) {
        this.focused = false;
        this.onBlur.emit(event);
        this.onModelTouched();
    }

    focus() {
        this.inputViewChild().nativeElement.focus();
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
            invalid: this.invalid(),
            checked: this.checked,
            disabled: this.$disabled(),
            filled: this.$variant() === 'filled',
            [this.size() as string]: this.size()
        });
    }
}

@NgModule({
    imports: [Checkbox, SharedModule],
    exports: [Checkbox, SharedModule]
})
export class CheckboxModule {}
