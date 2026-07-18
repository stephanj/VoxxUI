import { CommonModule } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, contentChild, contentChildren, forwardRef, inject, InjectionToken, input, NgModule, numberAttribute, output, TemplateRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { PrimeTemplate, SharedModule } from 'voxx-ui/api';
import { PARENT_INSTANCE } from 'voxx-ui/basecomponent';
import { BaseEditableHolder } from 'voxx-ui/baseeditableholder';
import { Bind } from 'voxx-ui/bind';
import { BindModule } from 'voxx-ui/bind';
import { Ripple } from 'voxx-ui/ripple';
import { ToggleButtonChangeEvent, ToggleButtonContentTemplateContext, ToggleButtonIconTemplateContext, ToggleButtonPassThrough } from 'voxx-ui/types/togglebutton';
import { ToggleButtonStyle } from './style/togglebuttonstyle';

const TOGGLEBUTTON_INSTANCE = new InjectionToken<ToggleButton>('TOGGLEBUTTON_INSTANCE');

export const TOGGLEBUTTON_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ToggleButton),
    multi: true
};
/**
 * ToggleButton is used to select a boolean value using a button.
 * @group Components
 */
@Component({
    selector: 'vx-toggleButton, vx-togglebutton, vx-toggle-button',
    imports: [CommonModule, SharedModule, BindModule],
    hostDirectives: [{ directive: Ripple }, Bind],
    host: {
        '[class]': "cn(cx('root'), styleClass())",
        '[attr.aria-labelledby]': 'ariaLabelledBy()',
        '[attr.aria-label]': 'ariaLabel()',
        '[attr.aria-pressed]': 'checked ? "true" : "false"',
        '[attr.role]': '"button"',
        '[attr.tabindex]': 'tabindex() !== undefined ? tabindex() : (!$disabled() ? 0 : -1)',
        '[attr.data-pc-name]': "'togglebutton'",
        '[attr.data-p-checked]': 'active',
        '[attr.data-p-disabled]': '$disabled()',
        '[attr.data-p]': 'dataP',
        '(keydown)': 'onKeyDown($event)',
        '(click)': 'toggle($event)'
    },
    template: `<span [class]="cx('content')" [vxBind]="ptm('content')" [attr.data-p]="dataP">
        <ng-container *ngTemplateOutlet="contentTemplate() || _contentTemplate(); context: { $implicit: checked }"></ng-container>
        @if (!contentTemplate()) {
            @if (!iconTemplate()) {
                @if (onIcon() || offIcon()) {
                    <span [class]="cn(cx('icon'), checked ? onIcon() : offIcon(), iconPos() === 'left' ? cx('iconLeft') : cx('iconRight'))" [vxBind]="ptm('icon')"></span>
                }
            } @else {
                <ng-container *ngTemplateOutlet="iconTemplate() || _iconTemplate(); context: { $implicit: checked }"></ng-container>
            }
            <span [class]="cx('label')" [vxBind]="ptm('label')">{{ checked ? (hasOnLabel ? onLabel() : ' ') : hasOffLabel ? offLabel() : ' ' }}</span>
        }
    </span>`,
    providers: [TOGGLEBUTTON_VALUE_ACCESSOR, ToggleButtonStyle, { provide: TOGGLEBUTTON_INSTANCE, useExisting: ToggleButton }, { provide: PARENT_INSTANCE, useExisting: ToggleButton }],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToggleButton extends BaseEditableHolder<ToggleButtonPassThrough> {
    componentName = 'ToggleButton';

    $pcToggleButton: ToggleButton | undefined = inject(TOGGLEBUTTON_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }

    onKeyDown(event: KeyboardEvent) {
        switch (event.code) {
            case 'Enter':
                this.toggle(event);
                event.preventDefault();
                break;
            case 'Space':
                this.toggle(event);
                event.preventDefault();
                break;
        }
    }

    toggle(event: Event) {
        if (!this.$disabled() && !(this.allowEmpty() === false && this.checked)) {
            this.checked = !this.checked;
            this.writeModelValue(this.checked);
            this.onModelChange(this.checked);
            this.onModelTouched();
            this.onChange.emit({
                originalEvent: event,
                checked: this.checked
            });

            this.cd.markForCheck();
        }
    }
    /**
     * Label for the on state.
     * @group Props
     */
    onLabel = input<string>('Yes');
    /**
     * Label for the off state.
     * @group Props
     */
    offLabel = input<string>('No');
    /**
     * Icon for the on state.
     * @group Props
     */
    onIcon = input<string | undefined>();
    /**
     * Icon for the off state.
     * @group Props
     */
    offIcon = input<string | undefined>();
    /**
     * Defines a string that labels the input for accessibility.
     * @group Props
     */
    ariaLabel = input<string | undefined>();
    /**
     * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
     * @group Props
     */
    ariaLabelledBy = input<string | undefined>();
    /**
     * Style class of the element.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    styleClass = input<string | undefined>();
    /**
     * Identifier of the focus input to match a label defined for the component.
     * @group Props
     */
    inputId = input<string | undefined>();
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    tabindex = input<number | undefined, unknown>(0, { transform: numberAttribute });
    /**
     * Position of the icon.
     * @group Props
     */
    iconPos = input<'left' | 'right'>('left');
    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    autofocus = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Defines the size of the component.
     * @group Props
     */
    size = input<'large' | 'small' | undefined>();
    /**
     * Whether selection can not be cleared.
     * @group Props
     */
    allowEmpty = input<boolean | undefined>();
    /**
     * Spans 100% width of the container when enabled.
     * @defaultValue undefined
     * @group Props
     */
    fluid = input(undefined, { transform: booleanAttribute });
    /**
     * Callback to invoke on value change.
     * @param {ToggleButtonChangeEvent} event - Custom change event.
     * @group Emits
     */
    onChange = output<ToggleButtonChangeEvent>();
    /**
     * Custom icon template.
     * @param {ToggleButtonIconTemplateContext} context - icon context.
     * @see {@link ToggleButtonIconTemplateContext}
     * @group Templates
     */
    iconTemplate = contentChild<TemplateRef<ToggleButtonIconTemplateContext>>('icon', { descendants: false });
    /**
     * Custom content template.
     * @param {ToggleButtonContentTemplateContext} context - content context.
     * @see {@link ToggleButtonContentTemplateContext}
     * @group Templates
     */
    contentTemplate = contentChild<TemplateRef<ToggleButtonContentTemplateContext>>('content', { descendants: false });

    templates = contentChildren(PrimeTemplate);

    checked: boolean = false;

    onInit() {
        if (this.checked === null || this.checked === undefined) {
            this.checked = false;
        }
    }

    _componentStyle = inject(ToggleButtonStyle);

    onBlur() {
        this.onModelTouched();
    }

    get hasOnLabel(): boolean {
        return (this.onLabel() && this.onLabel().length > 0) as boolean;
    }

    get hasOffLabel(): boolean {
        return (this.offLabel() && this.offLabel().length > 0) as boolean;
    }

    get active() {
        return this.checked === true;
    }

    _iconTemplate = computed<TemplateRef<ToggleButtonIconTemplateContext> | undefined>(() => this.templates().find((item) => item.getType() === 'icon')?.template);

    _contentTemplate = computed<TemplateRef<ToggleButtonContentTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() !== 'icon')
                .at(-1)?.template
    );

    /**
     * @override
     *
     * @see {@link BaseEditableHolder.writeControlValue}
     * Writes the value to the control.
     */
    writeControlValue(value: any, setModelValue: (value: any) => void): void {
        this.checked = value;
        setModelValue(value);
        this.cd.markForCheck();
    }

    get dataP() {
        return this.cn({
            checked: this.active,
            invalid: this.invalid(),
            [this.size() as string]: this.size()
        });
    }
}

@NgModule({
    imports: [ToggleButton, SharedModule],
    exports: [ToggleButton, SharedModule]
})
export class ToggleButtonModule {}
