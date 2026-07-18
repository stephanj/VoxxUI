import { CommonModule } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, contentChild, contentChildren, inject, InjectionToken, input, NgModule, output, signal, TemplateRef, ViewEncapsulation } from '@angular/core';
import { MotionOptions } from '@primeuix/motion';
import { PrimeTemplate, SharedModule } from 'voxx-ui/api';
import { BaseComponent, PARENT_INSTANCE } from 'voxx-ui/basecomponent';
import { Bind } from 'voxx-ui/bind';
import { TimesIcon } from 'voxx-ui/icons';
import { MotionModule } from 'voxx-ui/motion';
import { Ripple } from 'voxx-ui/ripple';
import { MessageContainerTemplateContext, MessagePassThrough } from 'voxx-ui/types/message';
import { MessageStyle } from './style/messagestyle';

const MESSAGE_INSTANCE = new InjectionToken<Message>('MESSAGE_INSTANCE');

/**
 * Message groups a collection of contents in tabs.
 * @group Components
 */
@Component({
    selector: 'vx-message',
    imports: [CommonModule, TimesIcon, Ripple, SharedModule, Bind, MotionModule],
    template: `
        <div [vxBind]="ptm('contentWrapper')" [class]="cx('contentWrapper')" [attr.data-p]="dataP">
            <div [vxBind]="ptm('content')" [class]="cx('content')" [attr.data-p]="dataP">
                @if (iconTemplate() || _iconTemplate()) {
                    <ng-container *ngTemplateOutlet="iconTemplate() || _iconTemplate()"></ng-container>
                }
                @if (icon()) {
                    <i [vxBind]="ptm('icon')" [class]="cn(cx('icon'), icon())" [attr.data-p]="dataP"></i>
                }

                @if (containerTemplate() || _containerTemplate()) {
                    <ng-container *ngTemplateOutlet="containerTemplate() || _containerTemplate(); context: { closeCallback: closeCallback }"></ng-container>
                } @else {
                    @if (!escape()) {
                        <div>
                            @if (!escape()) {
                                <span [vxBind]="ptm('text')" [class]="cx('text')" [innerHTML]="text()" [attr.data-p]="dataP"></span>
                            }
                        </div>
                    } @else {
                        @if (escape() && text()) {
                            <span [vxBind]="ptm('text')" [class]="cx('text')" [attr.data-p]="dataP">{{ text() }}</span>
                        }
                    }

                    <span [vxBind]="ptm('text')" [class]="cx('text')" [attr.data-p]="dataP">
                        <ng-content></ng-content>
                    </span>
                }
                @if (closable()) {
                    <button [vxBind]="ptm('closeButton')" vxRipple type="button" [class]="cx('closeButton')" (click)="close($event)" [attr.aria-label]="closeAriaLabel" [attr.data-p]="dataP">
                        @if (closeIcon()) {
                            <i [vxBind]="ptm('closeIcon')" [class]="cn(cx('closeIcon'), closeIcon()) ?? ''" [attr.data-p]="dataP"></i>
                        }
                        @if (closeIconTemplate() || _closeIconTemplate()) {
                            <ng-container *ngTemplateOutlet="closeIconTemplate() || _closeIconTemplate()"></ng-container>
                        }
                        @if (!closeIconTemplate() && !_closeIconTemplate() && !closeIcon()) {
                            <svg [vxBind]="ptm('closeIcon')" data-p-icon="times" [class]="cx('closeIcon')" [attr.data-p]="dataP" />
                        }
                    </button>
                }
            </div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [MessageStyle, { provide: MESSAGE_INSTANCE, useExisting: Message }, { provide: PARENT_INSTANCE, useExisting: Message }],
    hostDirectives: [Bind],
    host: {
        '[attr.data-p]': 'dataP',
        role: 'alert',
        'aria-live': 'polite',
        '[class]': 'cn(cx("root"), styleClass())',
        '[animate.enter]': '"p-message-enter-active"',
        '[animate.leave]': '"p-message-leave-active"',
        '[class.p-message-leave-active]': '!visible()'
    }
})
export class Message extends BaseComponent<MessagePassThrough> {
    componentName = 'Message';

    _componentStyle = inject(MessageStyle);

    bindDirectiveInstance = inject(Bind, { self: true });

    $pcMessage: Message | undefined = inject(MESSAGE_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }

    /**
     * Severity level of the message.
     * @defaultValue 'info'
     * @group Props
     */
    severity = input<'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast' | undefined | null>('info');
    /**
     * Text content.
     * @deprecated since v20.0.0. Use content projection instead '<vx-message>Content</vx-message>'.
     * @group Props
     */
    text = input<string | undefined>();
    /**
     * Whether displaying messages would be escaped or not.
     * @deprecated since v20.0.0. Use content projection instead '<vx-message>Content</vx-message>'.
     * @group Props
     */
    escape = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Inline style of the component.
     * @group Props
     */
    style = input<{ [klass: string]: any } | null | undefined>();
    /**
     * Style class of the component.
     * @group Props
     */
    styleClass = input<string | undefined>();
    /**
     * Whether the message can be closed manually using the close icon.
     * @group Props
     * @defaultValue false
     */
    closable = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Icon to display in the message.
     * @group Props
     * @defaultValue undefined
     */
    icon = input<string | undefined>();
    /**
     * Icon to display in the message close button.
     * @group Props
     * @defaultValue undefined
     */
    closeIcon = input<string | undefined>();
    /**
     * Delay in milliseconds to close the message automatically.
     * @defaultValue undefined
     */
    life = input<number | undefined>();
    /**
     * Transition options of the show animation.
     * @defaultValue '300ms ease-out'
     * @group Props
     * @deprecated since v21.0.0, use `motionOptions` instead.
     */
    showTransitionOptions = input<string>('300ms ease-out');
    /**
     * Transition options of the hide animation.
     * @defaultValue '200ms cubic-bezier(0.86, 0, 0.07, 1)'
     * @group Props
     * @deprecated since v21.0.0, use `motionOptions` instead.
     */
    hideTransitionOptions = input<string>('200ms cubic-bezier(0.86, 0, 0.07, 1)');
    /**
     * Defines the size of the component.
     * @group Props
     */
    size = input<'large' | 'small' | undefined>();
    /**
     * Specifies the input variant of the component.
     * @group Props
     */
    variant = input<'outlined' | 'text' | 'simple' | undefined>();
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
     * Emits when the message is closed.
     * @param {{ originalEvent: Event }} event - The event object containing the original event.
     * @group Emits
     */
    onClose = output<{ originalEvent: Event }>();

    get closeAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria.close : undefined;
    }

    visible = signal<boolean>(true);

    /**
     * Custom template of the message container.
     * @param {MessageContainerTemplateContext} context - container context.
     * @see {@link MessageContainerTemplateContext}
     * @group Templates
     */
    containerTemplate = contentChild<TemplateRef<MessageContainerTemplateContext>>('container', { descendants: false });

    /**
     * Custom template of the message icon.
     * @group Templates
     */
    iconTemplate = contentChild<TemplateRef<void>>('icon', { descendants: false });

    /**
     * Custom template of the close icon.
     * @group Templates
     */
    closeIconTemplate = contentChild<TemplateRef<void>>('closeicon', { descendants: false });

    templates = contentChildren(PrimeTemplate);

    _containerTemplate = computed<TemplateRef<MessageContainerTemplateContext> | undefined>(() => this.templates().find((item) => item.getType() === 'container')?.template);

    _iconTemplate = computed<TemplateRef<void> | undefined>(() => this.templates().find((item) => item.getType() === 'icon')?.template);

    _closeIconTemplate = computed<TemplateRef<void> | undefined>(() => this.templates().find((item) => item.getType() === 'closeicon')?.template);

    closeCallback = (event: Event) => {
        this.close(event);
    };

    onInit() {
        if (this.life()) {
            setTimeout(() => {
                this.visible.set(false);
            }, this.life());
        }
    }

    /**
     * Closes the message.
     * @param {Event} event - Browser event.
     * @group Method
     */
    public close(event: Event) {
        this.visible.set(false);
        this.onClose.emit({ originalEvent: event });
    }

    get dataP() {
        return this.cn({
            outlined: this.variant() === 'outlined',
            simple: this.variant() === 'simple',
            [this.severity() as string]: this.severity(),
            [this.size() as string]: this.size()
        });
    }
}

@NgModule({
    imports: [Message, SharedModule],
    exports: [Message, SharedModule]
})
export class MessageModule {}
