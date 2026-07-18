import { ChangeDetectionStrategy, Component, inject, InjectionToken, input, NgModule, output, ViewEncapsulation } from '@angular/core';
import { SharedModule } from 'voxx-ui/api';
import { BaseComponent, PARENT_INSTANCE } from 'voxx-ui/basecomponent';
import { Bind } from 'voxx-ui/bind';
import { AvatarPassThrough } from 'voxx-ui/types/avatar';
import { AvatarStyle } from './style/avatarstyle';

const AVATAR_INSTANCE = new InjectionToken<Avatar>('AVATAR_INSTANCE');

/**
 * Avatar represents people using icons, labels and images.
 * @group Components
 */
@Component({
    selector: 'vx-avatar',
    imports: [SharedModule, Bind],
    template: `
        <ng-content></ng-content>
        @if (label()) {
            <span [vxBind]="ptm('label')" [class]="cx('label')" [attr.data-p]="dataP">{{ label() }}</span>
        } @else {
            @if (icon()) {
                <span [vxBind]="ptm('icon')" [class]="cn(cx('icon'), icon())" [attr.data-p]="dataP"></span>
            } @else {
                @if (image()) {
                    <img [vxBind]="ptm('image')" [src]="image()" (error)="imageError($event)" [attr.aria-label]="ariaLabel()" [attr.data-p]="dataP" />
                }
            }
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': "cn(cx('root'), styleClass())",
        '[attr.aria-label]': 'ariaLabel()',
        '[attr.aria-labelledby]': 'ariaLabelledBy()',
        '[attr.data-p]': 'dataP'
    },
    providers: [AvatarStyle, { provide: AVATAR_INSTANCE, useExisting: Avatar }, { provide: PARENT_INSTANCE, useExisting: Avatar }],
    hostDirectives: [Bind]
})
export class Avatar extends BaseComponent<AvatarPassThrough> {
    componentName = 'Avatar';

    $pcAvatar: Avatar | undefined = inject(AVATAR_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

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
     * Size of the element.
     * @group Props
     */
    size = input<'normal' | 'large' | 'xlarge' | undefined>('normal');
    /**
     * Shape of the element.
     * @group Props
     */
    shape = input<'square' | 'circle' | undefined>('square');
    /**
     * Class of the element.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    styleClass = input<string | undefined>();
    /**
     * Establishes a string value that labels the component.
     * @group Props
     */
    ariaLabel = input<string | undefined>();
    /**
     * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
     * @group Props
     */
    ariaLabelledBy = input<string | undefined>();
    /**
     * This event is triggered if an error occurs while loading an image file.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    onImageError = output<Event>();

    _componentStyle = inject(AvatarStyle);

    imageError(event: Event) {
        this.onImageError.emit(event);
    }

    get dataP() {
        return this.cn({
            [this.shape() as string]: this.shape(),
            [this.size() as string]: this.size()
        });
    }
}

@NgModule({
    imports: [Avatar, SharedModule],
    exports: [Avatar, SharedModule]
})
export class AvatarModule {}
