import { NgTemplateOutlet } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, contentChild, contentChildren, inject, InjectionToken, input, NgModule, output, TemplateRef, ViewEncapsulation } from '@angular/core';
import { PrimeTemplate, SharedModule, TranslationKeys } from 'voxx-ui/api';
import { BaseComponent, PARENT_INSTANCE } from 'voxx-ui/basecomponent';
import { Bind } from 'voxx-ui/bind';
import { TimesCircleIcon } from 'voxx-ui/icons';
import { ChipProps, ChipPassThrough } from 'voxx-ui/types/chip';
import { ChipStyle } from './style/chipstyle';

const CHIP_INSTANCE = new InjectionToken<Chip>('CHIP_INSTANCE');

/**
 * Chip represents people using icons, labels and images.
 * @group Components
 */
@Component({
    selector: 'vx-chip',
    imports: [NgTemplateOutlet, TimesCircleIcon, SharedModule, Bind],
    template: `
        <ng-content></ng-content>
        @if ($image()) {
            <img [vxBind]="ptm('image')" [class]="cx('image')" [src]="$image()" (error)="imageError($event)" [alt]="$alt()" />
        } @else {
            @if ($icon()) {
                <span [vxBind]="ptm('icon')" [class]="cn(cx('icon'), $icon())"></span>
            }
        }
        @if ($label()) {
            <div [vxBind]="ptm('label')" [class]="cx('label')">{{ $label() }}</div>
        }
        @if ($removable()) {
            @if (!removeIconTemplate() && !_removeIconTemplate()) {
                @if ($removeIcon()) {
                    <span [vxBind]="ptm('removeIcon')" [class]="cn(cx('removeIcon'), $removeIcon())" (click)="close($event)" (keydown)="onKeydown($event)" [attr.tabindex]="disabled() ? -1 : 0" [attr.aria-label]="removeAriaLabel" role="button"></span>
                }
                @if (!$removeIcon()) {
                    <svg
                        [vxBind]="ptm('removeIcon')"
                        data-p-icon="times-circle"
                        [class]="cx('removeIcon')"
                        (click)="close($event)"
                        (keydown)="onKeydown($event)"
                        [attr.tabindex]="disabled() ? -1 : 0"
                        [attr.aria-label]="removeAriaLabel"
                        role="button"
                    />
                }
            }
            @if (removeIconTemplate() || _removeIconTemplate()) {
                <span [vxBind]="ptm('removeIcon')" [attr.tabindex]="disabled() ? -1 : 0" [class]="cx('removeIcon')" (click)="close($event)" (keydown)="onKeydown($event)" [attr.aria-label]="removeAriaLabel" role="button">
                    <ng-template *ngTemplateOutlet="removeIconTemplate() || _removeIconTemplate() || null"></ng-template>
                </span>
            }
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [ChipStyle, { provide: CHIP_INSTANCE, useExisting: Chip }, { provide: PARENT_INSTANCE, useExisting: Chip }],
    host: {
        '[class]': "cn(cx('root'), $styleClass())",
        '[style]': "sx('root')",
        '[attr.aria-label]': '$label()',
        '[attr.data-p]': 'dataP'
    },
    hostDirectives: [Bind]
})
export class Chip extends BaseComponent<ChipPassThrough> {
    componentName = 'Chip';

    $pcChip: Chip | undefined = inject(CHIP_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }
    /**
     * Defines the text to display.
     * @group Props
     */
    label = input<string | undefined>();
    /**
     * Defines the icon to display.
     * @group Props
     */
    icon = input<string | undefined>();
    /**
     * Defines the image to display.
     * @group Props
     */
    image = input<string | undefined>();
    /**
     * Alt attribute of the image.
     * @group Props
     */
    alt = input<string | undefined>();
    /**
     * Class of the element.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    styleClass = input<string | undefined>();
    /**
     * When present, it specifies that the element should be disabled.
     * @group Props
     */
    disabled = input<boolean | undefined, unknown>(false, { transform: booleanAttribute });
    /**
     * Whether to display a remove icon.
     * @group Props
     */
    removable = input<boolean | undefined, unknown>(false, { transform: booleanAttribute });
    /**
     * Icon of the remove element.
     * @group Props
     */
    removeIcon = input<string | undefined>();
    /**
     * Used to pass all properties of the chipProps to the Chip component.
     * @group Props
     */
    chipProps = input<ChipProps | undefined>();
    /**
     * Callback to invoke when a chip is removed.
     * @param {MouseEvent} event - Mouse event.
     * @group Emits
     */
    onRemove = output<MouseEvent>();
    /**
     * This event is triggered if an error occurs while loading an image file.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    onImageError = output<Event>();

    visible: boolean = true;

    get removeAriaLabel() {
        return this.config.getTranslation(TranslationKeys.ARIA)['removeLabel'];
    }

    // chipProps values override the individual inputs (#16/#17): the former
    // onChanges fan-out that copied chipProps into the decorator inputs is
    // replaced by these resolved computeds.
    $label = computed(() => this.chipProps()?.label ?? this.label());

    $icon = computed(() => this.chipProps()?.icon ?? this.icon());

    $image = computed(() => this.chipProps()?.image ?? this.image());

    $alt = computed(() => this.chipProps()?.alt ?? this.alt());

    $styleClass = computed(() => this.chipProps()?.styleClass ?? this.styleClass());

    $removable = computed(() => this.chipProps()?.removable ?? this.removable());

    $removeIcon = computed(() => this.chipProps()?.removeIcon ?? this.removeIcon());

    _componentStyle = inject(ChipStyle);

    /**
     * Custom remove icon template.
     * @group Templates
     */
    removeIconTemplate = contentChild<TemplateRef<void>>('removeicon', { descendants: false });

    templates = contentChildren(PrimeTemplate);

    _removeIconTemplate = computed<TemplateRef<void> | undefined>(() => {
        const templates = this.templates();
        return (templates.find((item) => item.getType() === 'removeicon') ?? templates[templates.length - 1])?.template;
    });

    close(event: MouseEvent) {
        this.visible = false;
        this.onRemove.emit(event);
    }

    onKeydown(event) {
        if (event.key === 'Enter' || event.key === 'Backspace') {
            this.close(event);
        }
    }

    imageError(event: Event) {
        this.onImageError.emit(event);
    }

    get dataP() {
        return this.cn({
            removable: this.$removable()
        });
    }
}

@NgModule({
    imports: [Chip, SharedModule],
    exports: [Chip, SharedModule]
})
export class ChipModule {}
