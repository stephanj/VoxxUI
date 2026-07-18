import { booleanAttribute, computed, Directive, effect, inject, InjectionToken, input, Input, NgModule } from '@angular/core';
import { NgControl } from '@angular/forms';
import { PARENT_INSTANCE } from 'voxx-ui/basecomponent';
import { BaseModelHolder } from 'voxx-ui/basemodelholder';
import { Bind } from 'voxx-ui/bind';
import { Fluid } from 'voxx-ui/fluid';
import { InputTextPassThrough } from 'voxx-ui/types/inputtext';
import { InputTextStyle } from './style/inputtextstyle';

const INPUTTEXT_INSTANCE = new InjectionToken<InputText>('INPUTTEXT_INSTANCE');

/**
 * InputText directive is an extension to standard input element with theming.
 * @group Components
 */
@Directive({
    selector: '[vxInputText]',
    host: {
        '[class]': "cx('root')",
        '[attr.data-p]': 'dataP',
        '(input)': 'onInput()'
    },
    providers: [InputTextStyle, { provide: INPUTTEXT_INSTANCE, useExisting: InputText }, { provide: PARENT_INSTANCE, useExisting: InputText }],
    hostDirectives: [Bind]
})
export class InputText extends BaseModelHolder<InputTextPassThrough> {
    componentName = 'InputText';

    @Input() hostName: any = '';

    /**
     * Used to pass attributes to DOM elements inside the InputText component.
     * @defaultValue undefined
     * @deprecated use vxInputTextPT instead.
     * @group Props
     */
    ptInputText = input<InputTextPassThrough>();
    /**
     * Used to pass attributes to DOM elements inside the InputText component.
     * @defaultValue undefined
     * @group Props
     */
    vxInputTextPT = input<InputTextPassThrough>();
    /**
     * Indicates whether the component should be rendered without styles.
     * @defaultValue undefined
     * @group Props
     */
    vxInputTextUnstyled = input<boolean | undefined>();

    bindDirectiveInstance = inject(Bind, { self: true });

    $pcInputText: InputText | undefined = inject(INPUTTEXT_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    ngControl = inject(NgControl, { optional: true, self: true });

    pcFluid: Fluid | null = inject(Fluid, { optional: true, host: true, skipSelf: true });

    /**
     * Defines the size of the component.
     * @group Props
     */
    @Input('vxSize') vxSize: 'large' | 'small' | undefined;
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
     * When present, it specifies that the component should have invalid state style.
     * @defaultValue false
     * @group Props
     */
    invalid = input(undefined, { transform: booleanAttribute });

    $variant = computed(() => this.variant() || this.config.inputStyle() || this.config.inputVariant() || undefined);

    _componentStyle = inject(InputTextStyle);

    constructor() {
        super();
        effect(() => {
            const pt = this.ptInputText() || this.vxInputTextPT();
            pt && this.directivePT.set(pt);
        });

        effect(() => {
            this.vxInputTextUnstyled() && this.directiveUnstyled.set(this.vxInputTextUnstyled());
        });
    }

    onAfterViewInit() {
        this.writeModelValue(this.ngControl?.value ?? this.el.nativeElement.value);
        this.cd.detectChanges();
    }

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptm('root'));
    }

    onDoCheck() {
        this.writeModelValue(this.ngControl?.value ?? this.el.nativeElement.value);
    }

    onInput() {
        this.writeModelValue(this.ngControl?.value ?? this.el.nativeElement.value);
    }

    get hasFluid() {
        return this.fluid() ?? !!this.pcFluid;
    }

    get dataP() {
        return this.cn({
            invalid: this.invalid(),
            fluid: this.hasFluid,
            filled: this.$variant() === 'filled',
            [this.vxSize as string]: this.vxSize
        });
    }
}

@NgModule({
    imports: [InputText],
    exports: [InputText]
})
export class InputTextModule {}
