import { NgTemplateOutlet } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, contentChild, contentChildren, inject, InjectionToken, input, NgModule, numberAttribute, TemplateRef, ViewEncapsulation } from '@angular/core';
import { PrimeTemplate, SharedModule } from 'voxx-ui/api';
import { BaseComponent, PARENT_INSTANCE } from 'voxx-ui/basecomponent';
import { Bind } from 'voxx-ui/bind';
import { ProgressBarContentTemplateContext, ProgressBarPassThrough } from 'voxx-ui/types/progressbar';
import { ProgressBarStyle } from './style/progressbarstyle';

const PROGRESSBAR_INSTANCE = new InjectionToken<ProgressBar>('PROGRESSBAR_INSTANCE');

/**
 * ProgressBar is a process status indicator.
 * @group Components
 */
@Component({
    selector: 'vx-progressBar, vx-progressbar, vx-progress-bar',
    imports: [NgTemplateOutlet, SharedModule, Bind],
    template: `
        @if (mode() === 'determinate') {
            <div [class]="cn(cx('value'), valueStyleClass())" [vxBind]="ptm('value')" [style.width]="value() + '%'" [style.display]="'flex'" [style.background]="color()" [attr.data-p]="dataP">
                <div [class]="cx('label')" [vxBind]="ptm('label')" [attr.data-p]="dataP">
                    @if (showValue() && !contentTemplate() && !_contentTemplate()) {
                        <div [style.display]="value() != null && value() !== 0 ? 'flex' : 'none'">{{ value() }}{{ unit() }}</div>
                    }
                    <ng-container *ngTemplateOutlet="contentTemplate() || _contentTemplate() || null; context: { $implicit: value() }"></ng-container>
                </div>
            </div>
        }
        @if (mode() === 'indeterminate') {
            <div [class]="cn(cx('value'), valueStyleClass())" [vxBind]="ptm('value')" [style.background]="color()" [attr.data-p]="dataP"></div>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [ProgressBarStyle, { provide: PROGRESSBAR_INSTANCE, useExisting: ProgressBar }, { provide: PARENT_INSTANCE, useExisting: ProgressBar }],
    host: {
        role: 'progressbar',
        '[attr.aria-valuemin]': '0',
        '[attr.aria-valuenow]': 'value()',
        '[attr.aria-valuemax]': '100',
        '[attr.aria-level]': 'value() + unit()',
        '[class]': "cn(cx('root'), styleClass())",
        '[attr.data-p]': 'dataP'
    },
    hostDirectives: [Bind]
})
export class ProgressBar extends BaseComponent<ProgressBarPassThrough> {
    componentName = 'ProgressBar';

    $pcProgressBar: ProgressBar | undefined = inject(PROGRESSBAR_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    /**
     * Current value of the progress.
     * @group Props
     */
    value = input<number | undefined, unknown>(undefined, { transform: numberAttribute });
    /**
     * Whether to display the progress bar value.
     * @group Props
     */
    showValue = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Style class of the element.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    styleClass = input<string | undefined>();
    /**
     * Style class of the value element.
     * @group Props
     */
    valueStyleClass = input<string | undefined>();
    /**
     * Unit sign appended to the value.
     * @group Props
     */
    unit = input<string>('%');
    /**
     * Defines the mode of the progress
     * @defaultValue 'determinate'
     * @group Props
     */
    mode = input<'determinate' | 'indeterminate'>('determinate');
    /**
     * Color for the background of the progress.
     * @group Props
     */
    color = input<string | undefined>();
    /**
     * Template of the content.
     * @param {ProgressBarContentTemplateContext} context - content context.
     * @see {@link ProgressBarContentTemplateContext}
     * @group Templates
     */
    contentTemplate = contentChild<TemplateRef<ProgressBarContentTemplateContext>>('content', { descendants: false });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }

    _componentStyle = inject(ProgressBarStyle);

    templates = contentChildren(PrimeTemplate);

    _contentTemplate = computed<TemplateRef<ProgressBarContentTemplateContext> | undefined>(() => {
        const templates = this.templates();
        return (templates.find((item) => item.getType() === 'content') ?? templates[templates.length - 1])?.template;
    });

    get dataP() {
        return this.cn({
            determinate: this.mode() === 'determinate',
            indeterminate: this.mode() === 'indeterminate'
        });
    }
}

@NgModule({
    imports: [ProgressBar, SharedModule],
    exports: [ProgressBar, SharedModule]
})
export class ProgressBarModule {}
