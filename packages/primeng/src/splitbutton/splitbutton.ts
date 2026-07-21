import { CommonModule } from '@angular/common';
import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild,
    contentChildren,
    ElementRef,
    inject,
    InjectionToken,
    input,
    NgModule,
    numberAttribute,
    output,
    signal,
    TemplateRef,
    viewChild,
    ViewEncapsulation
} from '@angular/core';
import { MotionOptions } from '@primeuix/motion';
import { uuid } from '@primeuix/utils';
import { MenuItem, PrimeTemplate, SharedModule, TooltipOptions } from 'voxx-ui/api';
import { AutoFocus } from 'voxx-ui/autofocus';
import { BaseComponent, PARENT_INSTANCE } from 'voxx-ui/basecomponent';
import { Bind } from 'voxx-ui/bind';
import { ButtonDirective } from 'voxx-ui/button';
import { ChevronDownIcon } from 'voxx-ui/icons';
import { Ripple } from 'voxx-ui/ripple';
import { TieredMenu } from 'voxx-ui/tieredmenu';
import { TooltipModule } from 'voxx-ui/tooltip';
import { ButtonProps, MenuButtonProps, SplitButtonPassThrough } from 'voxx-ui/types/splitbutton';
import { SplitButtonStyle } from './style/splitbuttonstyle';

const SPLITBUTTON_INSTANCE = new InjectionToken<SplitButton>('SPLITBUTTON_INSTANCE');

type SplitButtonIconPosition = 'left' | 'right';
/**
 * SplitButton groups a set of commands in an overlay with a default command.
 * @group Components
 */
@Component({
    selector: 'vx-splitbutton, vx-splitButton, vx-split-button',
    imports: [CommonModule, ButtonDirective, TieredMenu, AutoFocus, ChevronDownIcon, Ripple, TooltipModule, SharedModule],
    template: `
        @if (contentTemplate() || _contentTemplate()) {
            <button
                [class]="cx('pcButton')"
                type="button"
                vxButton
                vxRipple
                [severity]="severity()"
                [text]="text()"
                [outlined]="outlined()"
                [size]="size()"
                [icon]="icon()"
                [iconPos]="iconPos()"
                (click)="onDefaultButtonClick($event)"
                [disabled]="disabled()"
                [attr.tabindex]="tabindex()"
                [attr.aria-label]="buttonProps()?.['ariaLabel'] || label()"
                [vxAutoFocus]="autofocus()"
                [vxTooltip]="tooltip()"
                [vxTooltipUnstyled]="unstyled()"
                [tooltipOptions]="tooltipOptions()"
                [pt]="ptm('pcButton')"
                [unstyled]="unstyled()"
            >
                <ng-container *ngTemplateOutlet="contentTemplate() || _contentTemplate()"></ng-container>
            </button>
        } @else {
            <button
                #defaultbtn
                [class]="cx('pcButton')"
                type="button"
                vxButton
                vxRipple
                [severity]="severity()"
                [text]="text()"
                [outlined]="outlined()"
                [size]="size()"
                [icon]="icon()"
                [iconPos]="iconPos()"
                [label]="label()"
                (click)="onDefaultButtonClick($event)"
                [disabled]="$buttonDisabled()"
                [attr.tabindex]="tabindex()"
                [attr.aria-label]="buttonProps()?.['ariaLabel']"
                [vxAutoFocus]="autofocus()"
                [vxTooltip]="tooltip()"
                [vxTooltipUnstyled]="unstyled()"
                [tooltipOptions]="tooltipOptions()"
                [pt]="ptm('pcButton')"
                [unstyled]="unstyled()"
            ></button>
        }
        <button
            type="button"
            vxButton
            vxRipple
            [size]="size()"
            [severity]="severity()"
            [text]="text()"
            [outlined]="outlined()"
            [class]="cx('pcDropdown')"
            (click)="onDropdownButtonClick($event)"
            (keydown)="onDropdownButtonKeydown($event)"
            [disabled]="$menuButtonDisabled()"
            [attr.aria-label]="menuButtonProps()?.['ariaLabel'] || expandAriaLabel()"
            [attr.aria-haspopup]="menuButtonProps()?.['ariaHasPopup'] || true"
            [attr.aria-expanded]="menuButtonProps()?.['ariaExpanded'] || isExpanded()"
            [attr.aria-controls]="menuButtonProps()?.['ariaControls'] || ariaId"
            [pt]="ptm('pcDropdown')"
            [unstyled]="unstyled()"
        >
            @if (dropdownIcon()) {
                <span [class]="dropdownIcon()"></span>
            }
            @if (!dropdownIcon()) {
                @if (!dropdownIconTemplate() && !_dropdownIconTemplate()) {
                    <svg data-p-icon="chevron-down" />
                }
                <ng-template *ngTemplateOutlet="dropdownIconTemplate() || _dropdownIconTemplate()"></ng-template>
            }
        </button>
        <vx-tieredmenu
            [id]="ariaId"
            #menu
            [popup]="true"
            [model]="model()"
            [style]="menuStyle()"
            [styleClass]="menuStyleClass()"
            [appendTo]="$appendTo()"
            [motionOptions]="computedMotionOptions()"
            (onHide)="onHide()"
            (onShow)="onShow()"
            [pt]="ptm('pcMenu')"
            [unstyled]="unstyled()"
        ></vx-tieredmenu>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [SplitButtonStyle, { provide: SPLITBUTTON_INSTANCE, useExisting: SplitButton }, { provide: PARENT_INSTANCE, useExisting: SplitButton }],
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': "cn(cx('root'), styleClass())",
        '[attr.data-p-severity]': 'severity()'
    },
    hostDirectives: [Bind]
})
export class SplitButton extends BaseComponent<SplitButtonPassThrough> {
    componentName = 'SplitButton';
    $pcSplitButton: SplitButton | undefined = inject(SPLITBUTTON_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }
    /**
     * MenuModel instance to define the overlay items.
     * @group Props
     */
    model = input<MenuItem[] | undefined>();
    /**
     * Defines the style of the button.
     * @group Props
     */
    severity = input<'success' | 'info' | 'warn' | 'danger' | 'help' | 'primary' | 'secondary' | 'contrast' | null | undefined>();
    /**
     * Add a shadow to indicate elevation.
     * @group Props
     */
    raised = input(false, { transform: booleanAttribute });
    /**
     * Add a circular border radius to the button.
     * @group Props
     */
    rounded = input(false, { transform: booleanAttribute });
    /**
     * Add a textual class to the button without a background initially.
     * @group Props
     */
    text = input(false, { transform: booleanAttribute });
    /**
     * Add a border class without a background initially.
     * @group Props
     */
    outlined = input(false, { transform: booleanAttribute });
    /**
     * Defines the size of the button.
     * @group Props
     */
    size = input<'small' | 'large' | undefined | null>(null);
    /**
     * Add a plain textual class to the button without a background initially.
     * @group Props
     */
    plain = input(false, { transform: booleanAttribute });
    /**
     * Name of the icon.
     * @group Props
     */
    icon = input<string | undefined>();
    /**
     * Position of the icon.
     * @group Props
     */
    iconPos = input<SplitButtonIconPosition>('left');
    /**
     * Text of the button.
     * @group Props
     */
    label = input<string | undefined>();
    /**
     * Tooltip for the main button.
     * @group Props
     */
    tooltip = input<string | undefined>();
    /**
     * Tooltip options for the main button.
     * @group Props
     */
    tooltipOptions = input<TooltipOptions | undefined>();
    /**
     * Class of the element.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    styleClass = input<string | undefined>();
    /**
     * Inline style of the overlay menu.
     * @group Props
     */
    menuStyle = input<{ [klass: string]: any } | null | undefined>();
    /**
     * Style class of the overlay menu.
     * @group Props
     */
    menuStyleClass = input<string | undefined>();
    /**
     * Name of the dropdown icon.
     * @group Props
     */
    dropdownIcon = input<string | undefined>();
    /**
     * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @defaultValue 'body'
     * @group Props
     */
    appendTo = input<HTMLElement | ElementRef | TemplateRef<any> | 'self' | 'body' | null | undefined | any>('body');
    /**
     * Indicates the direction of the element.
     * @group Props
     */
    dir = input<string | undefined>();
    /**
     * Defines a string that labels the expand button for accessibility.
     * @group Props
     */
    expandAriaLabel = input<string | undefined>();
    /**
     * Transition options of the show animation.
     * @group Props
     * @deprecated since v21.0.0. Use `motionOptions` instead.
     */
    showTransitionOptions = input<string>('.12s cubic-bezier(0, 0, 0.2, 1)');
    /**
     * Transition options of the hide animation.
     * @group Props
     * @deprecated since v21.0.0. Use `motionOptions` instead.
     */
    hideTransitionOptions = input<string>('.1s linear');
    /**
     * The motion options.
     * @group Props
     */
    motionOptions = input<MotionOptions | undefined>(undefined);

    computedMotionOptions = computed<MotionOptions>(() => {
        return {
            ...this.ptm('motion'),
            ...this.motionOptions()
        };
    });
    /**
     * Button Props
     */
    buttonProps = input<ButtonProps | undefined>();
    /**
     * Menu Button Props
     */
    menuButtonProps = input<MenuButtonProps | undefined>();
    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    autofocus = input(undefined, { transform: booleanAttribute });
    /**
     * When present, it specifies that the element should be disabled.
     * @group Props
     */
    disabled = input(undefined, { transform: booleanAttribute });
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    tabindex = input<number | undefined, unknown>(undefined, { transform: numberAttribute });
    /**
     * When present, it specifies that the menu button element should be disabled.
     * @group Props
     */
    menuButtonDisabled = input(false, { transform: booleanAttribute });
    /**
     * When present, it specifies that the button element should be disabled.
     * @group Props
     */
    buttonDisabled = input(false, { transform: booleanAttribute });

    // The former `disabled` setter forced both sub-buttons disabled; resolved here (#18).
    $buttonDisabled = computed(() => this.disabled() || this.buttonDisabled());

    $menuButtonDisabled = computed(() => this.disabled() || this.menuButtonDisabled());

    /**
     * Callback to invoke when default command button is clicked.
     * @param {MouseEvent} event - Mouse event.
     * @group Emits
     */
    onClick = output<MouseEvent>();
    /**
     * Callback to invoke when overlay menu is hidden.
     * @group Emits
     */
    onMenuHide = output<any>();
    /**
     * Callback to invoke when overlay menu is shown.
     * @group Emits
     */
    onMenuShow = output<any>();
    /**
     * Callback to invoke when dropdown button is clicked.
     * @param {MouseEvent} event - Mouse event.
     * @group Emits
     */
    onDropdownClick = output<MouseEvent | undefined>();

    buttonViewChild = viewChild<ElementRef>('defaultbtn');

    menu = viewChild<TieredMenu>('menu');
    /**
     * Custom content template.
     * @group Templates
     */
    contentTemplate = contentChild<TemplateRef<void>>('content', { descendants: false });
    /**
     * Custom dropdown icon template.
     * @group Templates
     **/
    dropdownIconTemplate = contentChild<TemplateRef<void>>('dropdownicon', { descendants: false });

    templates = contentChildren(PrimeTemplate);

    ariaId: string | undefined;

    isExpanded = signal<boolean>(false);

    _componentStyle = inject(SplitButtonStyle);

    _contentTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() !== 'dropdownicon')
                .at(-1)?.template
    );

    _dropdownIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'dropdownicon')
                .at(-1)?.template
    );

    $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo());

    onInit() {
        this.ariaId = uuid('pn_id_');
    }

    onDefaultButtonClick(event: MouseEvent) {
        this.onClick.emit(event);
        this.menu()?.hide();
    }

    onDropdownButtonClick(event?: MouseEvent) {
        this.onDropdownClick.emit(event);
        this.menu()?.toggle({ currentTarget: this.el?.nativeElement, relativeAlign: this.$appendTo() == 'self' });
    }

    onDropdownButtonKeydown(event: KeyboardEvent) {
        if (event.code === 'ArrowDown' || event.code === 'ArrowUp') {
            this.onDropdownButtonClick();
            event.preventDefault();
        }
    }

    onHide() {
        this.isExpanded.set(false);
        this.onMenuHide.emit(undefined);
    }

    onShow() {
        this.isExpanded.set(true);
        this.onMenuShow.emit(undefined);
    }
}

@NgModule({
    imports: [SplitButton, SharedModule],
    exports: [SplitButton, SharedModule]
})
export class SplitButtonModule {}
