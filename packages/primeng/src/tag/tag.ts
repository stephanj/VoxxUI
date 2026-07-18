import { NgTemplateOutlet } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, contentChild, contentChildren, inject, InjectionToken, input, NgModule, TemplateRef, ViewEncapsulation } from '@angular/core';
import { PrimeTemplate, SharedModule } from 'voxx-ui/api';
import { BaseComponent, PARENT_INSTANCE } from 'voxx-ui/basecomponent';
import { Bind } from 'voxx-ui/bind';
import { TagPassThrough } from 'voxx-ui/types/tag';
import { TagStyle } from './style/tagstyle';

const TAG_INSTANCE = new InjectionToken<Tag>('TAG_INSTANCE');

/**
 * Tag component is used to categorize content.
 * @group Components
 */
@Component({
    selector: 'vx-tag',
    imports: [NgTemplateOutlet, SharedModule, Bind],
    template: `
        <ng-content></ng-content>
        @if (!iconTemplate() && !_iconTemplate()) {
            @if (icon()) {
                <span [class]="cn(cx('icon'), icon())" [vxBind]="ptm('icon')"></span>
            }
        }
        @if (iconTemplate() || _iconTemplate()) {
            <span [class]="cx('icon')" [vxBind]="ptm('icon')">
                <ng-template *ngTemplateOutlet="iconTemplate() || _iconTemplate() || null"></ng-template>
            </span>
        }
        <span [class]="cx('label')" [vxBind]="ptm('label')">{{ value() }}</span>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [TagStyle, { provide: TAG_INSTANCE, useExisting: Tag }, { provide: PARENT_INSTANCE, useExisting: Tag }],
    host: {
        '[class]': "cn(cx('root'), styleClass())",
        '[attr.data-p]': 'dataP'
    },
    hostDirectives: [Bind]
})
export class Tag extends BaseComponent<TagPassThrough> {
    componentName = 'Tag';
    $pcTag: Tag | undefined = inject(TAG_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

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
     * Severity type of the tag.
     * @group Props
     */
    severity = input<'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined | null>();
    /**
     * Value to display inside the tag.
     * @group Props
     */
    value = input<string | undefined>();
    /**
     * Icon of the tag to display next to the value.
     * @group Props
     */
    icon = input<string | undefined>();
    /**
     * Whether the corners of the tag are rounded.
     * @group Props
     */
    rounded = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Custom icon template.
     * @group Templates
     */
    iconTemplate = contentChild<TemplateRef<void>>('icon', { descendants: false });

    templates = contentChildren(PrimeTemplate);

    _iconTemplate = computed<TemplateRef<void> | undefined>(() => this.templates().find((item) => item.getType() === 'icon')?.template);

    _componentStyle = inject(TagStyle);

    get dataP() {
        return this.cn({
            rounded: this.rounded(),
            [this.severity() as string]: this.severity()
        });
    }
}

@NgModule({
    imports: [Tag, SharedModule],
    exports: [Tag, SharedModule]
})
export class TagModule {}
