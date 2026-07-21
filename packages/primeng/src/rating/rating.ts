import { NgTemplateOutlet } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, contentChild, contentChildren, forwardRef, inject, InjectionToken, input, NgModule, numberAttribute, output, signal, TemplateRef, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { focus, getFirstFocusableElement, uuid } from '@primeuix/utils';
import { PrimeTemplate, SharedModule } from 'voxx-ui/api';
import { AutoFocus } from 'voxx-ui/autofocus';
import { PARENT_INSTANCE } from 'voxx-ui/basecomponent';
import { BaseEditableHolder } from 'voxx-ui/baseeditableholder';
import { Bind } from 'voxx-ui/bind';
import { BindModule } from 'voxx-ui/bind';
import { StarFillIcon, StarIcon } from 'voxx-ui/icons';
import { Nullable } from 'voxx-ui/ts-helpers';
import { RatingIconTemplateContext, RatingPassThrough } from 'voxx-ui/types/rating';
import type { RatingRateEvent } from 'voxx-ui/types/rating';
import { RatingStyle } from './style/ratingstyle';

const RATING_INSTANCE = new InjectionToken<Rating>('RATING_INSTANCE');

export const RATING_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Rating),
    multi: true
};
/**
 * Rating is an extension to standard radio button element with theming.
 * @group Components
 */
@Component({
    selector: 'vx-rating',
    imports: [NgTemplateOutlet, AutoFocus, StarFillIcon, StarIcon, SharedModule, BindModule],
    template: `
        @for (star of starsArray(); track star; let i = $index) {
            <div [class]="cx('option', { star, value })" (click)="onOptionClick($event, star + 1)" [vxBind]="ptm('option')">
                <span class="p-hidden-accessible" [attr.data-p-hidden-accessible]="true" [vxBind]="ptm('hiddenOptionInputContainer')">
                    <input
                        type="radio"
                        [value]="star + 1"
                        [attr.name]="name() || nameattr + '_name'"
                        [attr.value]="modelValue()"
                        [attr.required]="required() ? '' : undefined"
                        [attr.readonly]="readonly() ? '' : undefined"
                        [attr.disabled]="$disabled() ? '' : undefined"
                        [checked]="value === star + 1"
                        [attr.aria-label]="starAriaLabel(star + 1)"
                        (focus)="onInputFocus($event, star + 1)"
                        (blur)="onInputBlur($event)"
                        (change)="onChange($event, star + 1)"
                        [vxAutoFocus]="autofocus()"
                        [vxBind]="ptm('hiddenOptionInput')"
                    />
                </span>
                @if (star + 1 <= (value ?? 0)) {
                    @if (onIconTemplate() || _onIconTemplate()) {
                        <ng-container *ngTemplateOutlet="onIconTemplate() || _onIconTemplate() || null; context: { $implicit: star + 1, class: cx('onIcon') }"></ng-container>
                    } @else {
                        @if (iconOnClass()) {
                            <span [class]="cn(cx('onIcon'), iconOnClass())" [style]="iconOnStyle()" [vxBind]="ptm('onIcon')"></span>
                        }
                        @if (!iconOnClass()) {
                            <svg data-p-icon="star-fill" [style]="iconOnStyle()" [class]="cx('onIcon')" [vxBind]="ptm('onIcon')" />
                        }
                    }
                } @else {
                    @if (offIconTemplate() || _offIconTemplate()) {
                        <ng-container *ngTemplateOutlet="offIconTemplate() || _offIconTemplate() || null; context: { $implicit: star + 1, class: cx('offIcon') }"></ng-container>
                    } @else {
                        @if (iconOffClass()) {
                            <span [class]="cn(cx('offIcon'), iconOffClass())" [style]="iconOffStyle()" [vxBind]="ptm('offIcon')"></span>
                        }
                        @if (!iconOffClass()) {
                            <svg data-p-icon="star" [style]="iconOffStyle()" [class]="cx('offIcon')" [vxBind]="ptm('offIcon')" />
                        }
                    }
                }
            </div>
        }
    `,
    providers: [RATING_VALUE_ACCESSOR, RatingStyle, { provide: RATING_INSTANCE, useExisting: Rating }, { provide: PARENT_INSTANCE, useExisting: Rating }],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': "cx('root')",
        '[attr.data-p]': 'dataP'
    },
    hostDirectives: [Bind]
})
export class Rating extends BaseEditableHolder<RatingPassThrough> {
    componentName = 'Rating';

    $pcRating: Rating | undefined = inject(RATING_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }

    /**
     * When present, changing the value is not possible.
     * @group Props
     */
    readonly = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Number of stars.
     * @group Props
     */
    stars = input<number, unknown>(5, { transform: numberAttribute });
    /**
     * Style class of the on icon.
     * @group Props
     */
    iconOnClass = input<string | undefined>();
    /**
     * Inline style of the on icon.
     * @group Props
     */
    iconOnStyle = input<{ [klass: string]: any } | null | undefined>();
    /**
     * Style class of the off icon.
     * @group Props
     */
    iconOffClass = input<string | undefined>();
    /**
     * Inline style of the off icon.
     * @group Props
     */
    iconOffStyle = input<{ [klass: string]: any } | null | undefined>();
    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    autofocus = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Emitted on value change.
     * @param {RatingRateEvent} value - Custom rate event.
     * @group Emits
     */
    onRate = output<RatingRateEvent>();
    /**
     * Emitted when the rating receives focus.
     * @param {Event} value - Browser event.
     * @group Emits
     */
    onFocus = output<FocusEvent>();
    /**
     * Emitted when the rating loses focus.
     * @param {Event} value - Browser event.
     * @group Emits
     */
    onBlur = output<FocusEvent>();
    /**
     * Custom on icon template.
     * @param {RatingIconTemplateContext} context - icon context.
     * @see {@link RatingIconTemplateContext}
     * @group Templates
     */
    onIconTemplate = contentChild<TemplateRef<RatingIconTemplateContext>>('onicon', { descendants: false });
    /**
     * Custom off icon template.
     * @param {RatingIconTemplateContext} context - icon context.
     * @see {@link RatingIconTemplateContext}
     * @group Templates
     */
    offIconTemplate = contentChild<TemplateRef<RatingIconTemplateContext>>('officon', { descendants: false });

    templates = contentChildren(PrimeTemplate);

    value: Nullable<number>;

    starsArray = computed<number[]>(() => Array.from({ length: this.stars() }, (_, i) => i));

    isFocusVisibleItem: boolean = true;

    focusedOptionIndex = signal<number>(-1);

    nameattr: string | undefined;

    _componentStyle = inject(RatingStyle);

    _onIconTemplate = computed<TemplateRef<RatingIconTemplateContext> | undefined>(() => this.templates().find((item) => item.getType() === 'onicon')?.template);

    _offIconTemplate = computed<TemplateRef<RatingIconTemplateContext> | undefined>(() => this.templates().find((item) => item.getType() === 'officon')?.template);

    onInit() {
        this.nameattr = this.nameattr || uuid('pn_id_');
    }

    onOptionClick(event, value) {
        if (!this.readonly() && !this.$disabled()) {
            this.onOptionSelect(event, value);
            this.isFocusVisibleItem = false;
            const firstFocusableEl = <any>getFirstFocusableElement(event.currentTarget, '');

            firstFocusableEl && focus(firstFocusableEl);
        }
    }

    onOptionSelect(event, value) {
        if (!this.readonly() && !this.$disabled()) {
            if (this.focusedOptionIndex() === value || value === this.value) {
                this.focusedOptionIndex.set(-1);
                this.updateModel(event, null);
            } else {
                this.focusedOptionIndex.set(value);
                this.updateModel(event, value || null);
            }
        }
    }

    onChange(event, value) {
        this.onOptionSelect(event, value);
        this.isFocusVisibleItem = true;
    }

    onInputBlur(event) {
        this.focusedOptionIndex.set(-1);
        this.onBlur.emit(event);
    }

    onInputFocus(event, value) {
        if (!this.readonly() && !this.$disabled()) {
            this.focusedOptionIndex.set(value);
            this.isFocusVisibleItem = event.sourceCapabilities?.firesTouchEvents === false;

            this.onFocus.emit(event);
        }
    }

    updateModel(event, value) {
        this.writeValue(value);
        this.onModelChange(this.value);
        this.onModelTouched();

        this.onRate.emit({
            originalEvent: event,
            value
        });
    }

    starAriaLabel(value) {
        return value === 1 ? this.config.translation.aria?.star : this.config.translation.aria?.stars?.replace(/{star}/g, value);
    }

    getIconTemplate(i: number): Nullable<TemplateRef<RatingIconTemplateContext>> {
        return !this.value || i >= this.value ? this.offIconTemplate() || this._offIconTemplate() : this.onIconTemplate() || this.offIconTemplate();
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
    }

    get isCustomIcon(): boolean {
        return !!(this.onIconTemplate() || this._onIconTemplate() || this.offIconTemplate() || this._offIconTemplate());
    }

    get dataP() {
        return this.cn({
            readonly: this.readonly(),
            disabled: this.$disabled()
        });
    }
}

@NgModule({
    imports: [Rating, SharedModule],
    exports: [Rating, SharedModule]
})
export class RatingModule {}
