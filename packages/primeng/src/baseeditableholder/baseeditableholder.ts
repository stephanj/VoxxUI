import { booleanAttribute, computed, Directive, effect, input, output, signal, untracked, WritableSignal } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { ValidationError } from '@angular/forms/signals';
import { BaseModelHolder } from 'voxx-ui/basemodelholder';

/**
 * Base class for editable VoxxUI controls.
 *
 * ## Forms integration
 *
 * `BaseEditableHolder` works with **both** forms systems that ship with Angular:
 *
 * 1. **Classic forms** (`ReactiveFormsModule` / `ngModel`) via `ControlValueAccessor`.
 *    Each concrete control still registers itself with `NG_VALUE_ACCESSOR`, so
 *    `[(ngModel)]`, `formControlName` and `formControl` keep working unchanged.
 *
 * 2. **Signal Forms** (Angular v22, `FormValueControl` / `FormCheckboxControl`)
 *    via the `[formField]` directive. A concrete control opts in by exposing a
 *    `value` (or `checked`) `model()` and calling {@link bindFormValue} from its
 *    constructor. The shared FormUiControl members below (`disabled`, `required`,
 *    `invalid`, `name`, `readonly`, `touched`, `touch`, `errors`) are then bound
 *    automatically by `[formField]` — no per-control wiring required.
 *
 * The two paths are independent (CVA is consulted by `NgModel`/`FormControlName`,
 * the control contract is consulted by `[formField]`), so implementing one never
 * disturbs the other. This keeps every existing usage backward compatible.
 */
@Directive()
export class BaseEditableHolder<PT = any> extends BaseModelHolder<PT> implements ControlValueAccessor {
    /**
     * There must be a value (if set).
     * @defaultValue false
     * @group Props
     */
    required = input(undefined, { transform: booleanAttribute });
    /**
     * When present, it specifies that the component should have invalid state style.
     * @defaultValue false
     * @group Props
     */
    invalid = input(undefined, { transform: booleanAttribute });
    /**
     * When present, it specifies that the component should have disabled state style.
     * @defaultValue false
     * @group Props
     */
    disabled = input(undefined, { transform: booleanAttribute });
    /**
     * When present, it specifies that the name of the input.
     * @defaultValue undefined
     * @group Props
     */
    name = input<string | undefined>();
    /**
     * Signal Forms: validation errors pushed by the bound `FieldTree`.
     *
     * Part of the `FormUiControl` contract. Bound automatically by `[formField]`
     * for controls that opt into a Signal Form; ignored by classic forms.
     * @group Props
     */
    errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
    /**
     * Signal Forms: touched state pushed by the bound `FieldTree`.
     *
     * Part of the `FormUiControl` contract (v22 made `touched` an input paired
     * with the {@link touch} output). Bound automatically by `[formField]`.
     * @group Props
     */
    touched = input<boolean>(false);
    /**
     * Signal Forms: emitted when the user finishes interacting with the control
     * (native `blur`), marking the bound field as touched. Prefer {@link markTouched}
     * from subclasses so the classic `onModelTouched` callback fires as well.
     * @group Emits
     */
    touch = output<void>();

    _disabled = signal<boolean>(false);

    $disabled = computed(() => this.disabled() || this._disabled());

    onModelChange: Function = () => {};

    onModelTouched: Function = () => {};

    /**
     * The `value`/`checked` model of a subclass that opted into a Signal Form,
     * registered through {@link bindFormValue}. Left undefined for controls used
     * only with classic forms.
     */
    private _formValueModel?: WritableSignal<any>;

    writeDisabledState(value: boolean) {
        this._disabled.set(value);
    }

    writeControlValue(value: any, setModelValue?: (value: any) => void) {
        // NOOP - this method should be overridden in the derived classes
    }

    /**
     * Wire a subclass' Signal Forms `value` (or `checked`) `model()` to the shared
     * `modelValue` used for rendering and the `ControlValueAccessor` path.
     *
     * Call once from the concrete control's constructor. The binding is two-way:
     * - **field → view**: when `[formField]` writes a new value into the model, the
     *   control's own `writeControlValue` is reused (identical to the CVA path).
     * - **view → field**: user edits routed through `writeModelValue` are reflected
     *   back into the model so the `FieldTree` stays in sync.
     */
    protected bindFormValue(valueModel: WritableSignal<any>): void {
        this._formValueModel = valueModel;
        effect(
            () => {
                const value = valueModel();
                untracked(() => {
                    if (this.modelValue() !== value) {
                        this.writeControlValue(value, this.writeModelValue.bind(this));
                        this.cd.markForCheck();
                    }
                });
            },
            { injector: this.injector }
        );
    }

    /**
     * Sets the model value and, when the control participates in a Signal Form,
     * reflects the change back into the bound `value`/`checked` model. This is the
     * single write path shared by user interaction and the CVA `writeValue`.
     */
    override writeModelValue(value: any): void {
        super.writeModelValue(value);
        if (this._formValueModel && this._formValueModel() !== value) {
            this._formValueModel.set(value);
        }
    }

    /**
     * Marks the control as touched for both forms systems: fires the classic
     * `onModelTouched` callback and emits the Signal Forms {@link touch} output.
     * Subclasses should call this from their `blur` handler.
     */
    protected markTouched(): void {
        this.onModelTouched();
        this.touch.emit();
    }

    /**
     * Signal Forms `FormUiControl.reset()` hook. `[formField]` pushes the reset
     * value back through the bound model, so the default implementation only needs
     * to be a no-op; subclasses override to clear transient UI state (e.g. an input
     * mask's raw buffer). Safe to call outside a Signal Form.
     */
    reset(): void {
        // NOOP by default - value restoration is driven by the bound FieldTree.
    }

    /**** Angular ControlValueAccessors ****/
    writeValue(value: any) {
        this.writeControlValue(value, this.writeModelValue.bind(this));
    }

    registerOnChange(fn: Function) {
        this.onModelChange = fn;
    }

    registerOnTouched(fn: Function) {
        this.onModelTouched = fn;
    }

    setDisabledState(val: boolean) {
        this.writeDisabledState(val);
        this.cd.markForCheck();
    }
}
