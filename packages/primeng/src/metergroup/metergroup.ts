import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, contentChild, contentChildren, forwardRef, inject, InjectionToken, input, NgModule, TemplateRef, ViewEncapsulation } from '@angular/core';
import { getOuterHeight } from '@primeuix/utils';
import { PrimeTemplate, SharedModule } from 'voxx-ui/api';
import { BaseComponent, PARENT_INSTANCE } from 'voxx-ui/basecomponent';
import { Bind } from 'voxx-ui/bind';
import { MeterGroupIconTemplateContext, MeterGroupLabelTemplateContext, MeterGroupMeterTemplateContext, MeterGroupPassThrough, MeterItem } from 'voxx-ui/types/metergroup';
import { MeterGroupStyle } from './style/metergroupstyle';

const METERGROUP_INSTANCE = new InjectionToken<MeterGroup>('METERGROUP_INSTANCE');

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'vx-meterGroupLabel, vx-metergrouplabel',
    imports: [CommonModule, SharedModule, Bind],
    template: `
        <ol [class]="cx('labelList')" [vxBind]="ptm('labelList')" [attr.data-p]="dataP">
            @for (labelItem of value(); track parentInstance.trackByFn(index); let index = $index) {
                <li [class]="cx('label')" [vxBind]="ptm('label')">
                    @if (!iconTemplate()) {
                        @if (labelItem.icon) {
                            <i [class]="cn(labelItem.icon, cx('labelIcon'))" [vxBind]="ptm('labelIcon')" [style.color]="labelItem.color"></i>
                        }
                        @if (!labelItem.icon) {
                            <span [class]="cx('labelMarker')" [vxBind]="ptm('labelMarker')" [style.backgroundColor]="labelItem.color"></span>
                        }
                    }
                    <ng-container *ngTemplateOutlet="iconTemplate(); context: { $implicit: labelItem, icon: labelItem.icon }"></ng-container>
                    <span [class]="cx('labelText')" [vxBind]="ptm('labelText')">{{ labelItem.label }} ({{ parentInstance.percentValue(labelItem.value) }})</span>
                </li>
            }
        </ol>
    `
})
export class MeterGroupLabel extends BaseComponent<MeterGroupPassThrough> {
    value = input<any[] | undefined>([]);

    labelPosition = input<'start' | 'end'>('end');

    labelOrientation = input<'horizontal' | 'vertical' | undefined>('horizontal');

    min = input<number>();

    max = input<number>();

    iconTemplate = input<TemplateRef<MeterGroupIconTemplateContext> | undefined>();

    parentInstance: MeterGroup = inject(forwardRef(() => MeterGroup));

    _componentStyle = inject(MeterGroupStyle);

    get dataP() {
        return this.cn({
            [this.labelOrientation() ?? 'horizontal']: this.labelOrientation()
        });
    }
}
/**
 * MeterGroup displays scalar measurements within a known range.
 * @group Components
 */
@Component({
    selector: 'vx-meterGroup, vx-metergroup, vx-meter-group',
    imports: [CommonModule, MeterGroupLabel, SharedModule, Bind],
    template: `
        @if (labelPosition() === 'start') {
            @if (!labelTemplate() && !_labelTemplate()) {
                <vx-meterGroupLabel [value]="value()" [labelPosition]="labelPosition()" [labelOrientation]="labelOrientation()" [min]="min()" [max]="max()" [iconTemplate]="iconTemplate() || _iconTemplate()" [pt]="pt()" [unstyled]="unstyled()" />
            }
            <ng-container *ngTemplateOutlet="labelTemplate() || labelTemplate(); context: { $implicit: value(), totalPercent: totalPercent(), percentages: percentages() }"></ng-container>
        }
        <ng-container *ngTemplateOutlet="startTemplate() || _startTemplate(); context: { $implicit: value(), totalPercent: totalPercent(), percentages: percentages() }"></ng-container>
        <div [class]="cx('meters')" [vxBind]="ptm('meters')" [attr.data-p]="dataP">
            @for (meterItem of value(); track trackByFn(index); let index = $index) {
                <ng-container
                    *ngTemplateOutlet="
                        meterTemplate() || _meterTemplate();
                        context: {
                            $implicit: meterItem,
                            index: index,
                            orientation: this.orientation(),
                            class: cx('meter'),
                            size: percentValue(meterItem.value ?? 0),
                            totalPercent: totalPercent(),
                            dataP: dataP
                        }
                    "
                >
                </ng-container>
                @if (!meterTemplate() && !_meterTemplate() && (meterItem.value ?? 0) > 0) {
                    <span [class]="cx('meter')" [attr.data-p]="dataP" [vxBind]="ptm('meter')" [style]="meterStyle(meterItem)"></span>
                }
            }
        </div>
        <ng-container *ngTemplateOutlet="endTemplate() || _endTemplate(); context: { $implicit: value(), totalPercent: totalPercent(), percentages: percentages() }"></ng-container>
        @if (labelPosition() === 'end') {
            @if (!labelTemplate() && !_labelTemplate()) {
                <vx-meterGroupLabel [value]="value()" [labelPosition]="labelPosition()" [labelOrientation]="labelOrientation()" [min]="min()" [max]="max()" [iconTemplate]="iconTemplate() || _iconTemplate()" [pt]="pt()" [unstyled]="unstyled()" />
            }
            <ng-container *ngTemplateOutlet="labelTemplate() || _labelTemplate(); context: { $implicit: value(), totalPercent: totalPercent(), percentages: percentages() }"></ng-container>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [MeterGroupStyle, { provide: METERGROUP_INSTANCE, useExisting: MeterGroup }, { provide: PARENT_INSTANCE, useExisting: MeterGroup }],
    host: {
        '[attr.aria-valuemin]': 'min()',
        '[attr.role]': '"meter"',
        '[attr.aria-valuemax]': 'max()',
        '[attr.aria-valuenow]': 'totalPercent()',
        '[attr.data-p]': 'dataP',
        '[class]': "cn(cx('root'), styleClass())"
    },
    hostDirectives: [Bind]
})
export class MeterGroup extends BaseComponent<MeterGroupPassThrough> {
    componentName = 'MeterGroup';

    $pcMeterGroup: MeterGroup | undefined = inject(METERGROUP_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    /**
     * Current value of the metergroup.
     * @group Props
     */
    value = input<MeterItem[] | undefined>();
    /**
     * Mininum boundary value.
     * @group Props
     */
    min = input<number>(0);
    /**
     * Maximum boundary value.
     * @group Props
     */
    max = input<number>(100);
    /**
     * Specifies the layout of the component, valid values are 'horizontal' and 'vertical'.
     * @group Props
     */
    orientation = input<'horizontal' | 'vertical'>('horizontal');
    /**
     * Specifies the label position of the component, valid values are 'start' and 'end'.
     * @group Props
     */
    labelPosition = input<'start' | 'end'>('end');
    /**
     * Specifies the label orientation of the component, valid values are 'horizontal' and 'vertical'.
     * @group Props
     */
    labelOrientation = input<'horizontal' | 'vertical' | undefined>('horizontal');
    /**
     * Style class of the element.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    styleClass = input<string | undefined>();

    get vertical(): boolean {
        return this.orientation() === 'vertical';
    }

    /**
     * Custom label template.
     * @param {MeterGroupLabelTemplateContext} context - label context.
     * @see {@link MeterGroupLabelTemplateContext}
     * @group Templates
     */
    labelTemplate = contentChild<TemplateRef<MeterGroupLabelTemplateContext>>('label', { descendants: false });

    /**
     * Custom meter template.
     * @param {MeterGroupMeterTemplateContext} context - meter context.
     * @see {@link MeterGroupMeterTemplateContext}
     * @group Templates
     */
    meterTemplate = contentChild<TemplateRef<MeterGroupMeterTemplateContext>>('meter', { descendants: false });

    /**
     * Custom end template.
     * @param {MeterGroupLabelTemplateContext} context - end context.
     * @see {@link MeterGroupLabelTemplateContext}
     * @group Templates
     */
    endTemplate = contentChild<TemplateRef<MeterGroupLabelTemplateContext>>('end', { descendants: false });

    /**
     * Custom start template.
     * @param {MeterGroupLabelTemplateContext} context - start context.
     * @see {@link MeterGroupLabelTemplateContext}
     * @group Templates
     */
    startTemplate = contentChild<TemplateRef<MeterGroupLabelTemplateContext>>('start', { descendants: false });

    /**
     * Custom icon template.
     * @param {MeterGroupIconTemplateContext} context - icon context.
     * @see {@link MeterGroupIconTemplateContext}
     * @group Templates
     */
    iconTemplate = contentChild<TemplateRef<MeterGroupIconTemplateContext>>('icon', { descendants: false });

    templates = contentChildren(PrimeTemplate);

    _labelTemplate = computed<TemplateRef<MeterGroupLabelTemplateContext> | undefined>(() => this.templates().find((item) => item.getType() === 'label')?.template);

    _meterTemplate = computed<TemplateRef<MeterGroupMeterTemplateContext> | undefined>(() => this.templates().find((item) => item.getType() === 'meter')?.template);

    _endTemplate = computed<TemplateRef<MeterGroupLabelTemplateContext> | undefined>(() => this.templates().find((item) => item.getType() === 'end')?.template);

    _startTemplate = computed<TemplateRef<MeterGroupLabelTemplateContext> | undefined>(() => this.templates().find((item) => item.getType() === 'start')?.template);

    _iconTemplate = computed<TemplateRef<MeterGroupIconTemplateContext> | undefined>(() => this.templates().find((item) => item.getType() === 'icon')?.template);

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }

    _componentStyle = inject(MeterGroupStyle);

    onAfterViewInit() {
        const _container = this.el.nativeElement;
        const height = getOuterHeight(_container);
        this.vertical && (_container.style.height = height + 'px');
    }

    percent(meter = 0) {
        if (this.max() === this.min()) {
            return 100; // When min = max, any value should be 100%
        }
        const percentOfItem = ((meter - this.min()) / (this.max() - this.min())) * 100;

        return Math.round(Math.max(0, Math.min(100, percentOfItem)));
    }

    percentValue(meter: number) {
        return this.percent(meter) + '%';
    }

    meterStyle(val: MeterItem) {
        return {
            backgroundColor: val.color,
            width: this.orientation() === 'horizontal' ? this.percentValue(val.value || 0) : undefined,
            height: this.orientation() === 'vertical' ? this.percentValue(val.value || 0) : undefined
        };
    }

    totalPercent() {
        if (!this.value()) {
            return 0;
        }
        return this.percent(this.value()!.reduce((total, val) => total + (val.value || 0), 0));
    }

    percentages() {
        if (!this.value()) {
            return [];
        }

        let sum = 0;
        const sumsArray: number[] = [];

        this.value()!.forEach((item) => {
            sum += item.value || 0;
            sumsArray.push(sum);
        });

        return sumsArray;
    }

    trackByFn(index: number): number {
        return index;
    }

    get dataP() {
        return this.cn({
            [this.orientation()]: this.orientation()
        });
    }
}

@NgModule({
    imports: [MeterGroup, SharedModule],
    exports: [MeterGroup, SharedModule]
})
export class MeterGroupModule {}
