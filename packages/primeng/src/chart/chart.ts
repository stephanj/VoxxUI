import { isPlatformBrowser } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, effect, inject, InjectionToken, input, NgModule, NgZone, output, untracked, ViewEncapsulation } from '@angular/core';
import Chart from 'chart.js/auto';
import { SharedModule } from 'voxx-ui/api';
import { BaseComponent } from 'voxx-ui/basecomponent';
import { ChartStyle } from './style/chartstyle';
import { Bind, BindModule } from 'voxx-ui/bind';
import type { ChartPassThrough } from 'voxx-ui/types/chart';

const CHART_INSTANCE = new InjectionToken<UIChart>('CHART_INSTANCE');

/**
 * Chart groups a collection of contents in tabs.
 * @group Components
 */
@Component({
    selector: 'vx-chart',
    imports: [SharedModule, BindModule],
    template: `
        <canvas
            role="img"
            [attr.aria-label]="ariaLabel()"
            [attr.aria-labelledby]="ariaLabelledBy()"
            [attr.width]="responsive() && !width() ? null : width()"
            [attr.height]="responsive() && !height() ? null : height()"
            (click)="onCanvasClick($event)"
            [vxBind]="ptm('canvas')"
        ></canvas>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': "cx('root')",
        '[style]': "sx('root')"
    },
    providers: [ChartStyle, { provide: CHART_INSTANCE, useExisting: UIChart }],
    hostDirectives: [Bind]
})
export class UIChart extends BaseComponent<ChartPassThrough> {
    componentName = 'Chart';

    $pcChart: UIChart | undefined = inject(CHART_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }

    /**
     * Type of the chart.
     * @group Props
     */
    type = input<'bar' | 'line' | 'scatter' | 'bubble' | 'pie' | 'doughnut' | 'polarArea' | 'radar' | undefined>();
    /**
     * Array of per-chart plugins to customize the chart behaviour.
     * @group Props
     */
    plugins = input<any[]>([]);
    /**
     * Width of the chart.
     * @group Props
     */
    width = input<string | undefined>();
    /**
     * Height of the chart.
     * @group Props
     */
    height = input<string | undefined>();
    /**
     * Whether the chart is redrawn on screen size change.
     * @group Props
     */
    responsive = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Used to define a string that autocomplete attribute the current element.
     * @group Props
     */
    ariaLabel = input<string | undefined>();
    /**
     * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
     * @group Props
     */
    ariaLabelledBy = input<string | undefined>();
    /**
     * Data to display.
     * @group Props
     */
    data = input<any>();
    /**
     * Options to customize the chart.
     * @group Props
     */
    options = input<any>({});
    /**
     * Callback to execute when an element on chart is clicked.
     * @group Emits
     */
    onDataSelect = output<any>();

    isBrowser: boolean = false;

    initialized: boolean | undefined;

    chart: any;

    _componentStyle = inject(ChartStyle);

    private zone: NgZone = inject(NgZone);

    constructor() {
        super();

        // Signal-native replacement for the former data/options setters (#16):
        // re-create the chart whenever either changes after initialization.
        effect(() => {
            this.data();
            this.options();
            untracked(() => this.reinit());
        });
    }

    onAfterViewInit() {
        this.initChart();
        this.initialized = true;
    }

    onCanvasClick(event: Event) {
        if (this.chart) {
            const element = this.chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);
            const dataset = this.chart.getElementsAtEventForMode(event, 'dataset', { intersect: true }, false);

            if (element && element[0] && dataset) {
                this.onDataSelect.emit({ originalEvent: event, element: element[0], dataset: dataset });
            }
        }
    }

    initChart() {
        if (isPlatformBrowser(this.platformId)) {
            let opts = this.options() || {};
            opts.responsive = this.responsive();

            // allows chart to resize in responsive mode
            if (opts.responsive && (this.height() || this.width())) {
                opts.maintainAspectRatio = false;
            }

            this.zone.runOutsideAngular(() => {
                this.chart = new Chart(this.el.nativeElement.children[0], {
                    type: this.type(),
                    data: this.data(),
                    options: this.options(),
                    plugins: this.plugins()
                });
            });
        }
    }

    getCanvas() {
        return this.el.nativeElement.children[0];
    }

    getBase64Image() {
        return this.chart.toBase64Image();
    }

    generateLegend() {
        if (this.chart) {
            return this.chart.generateLegend();
        }
    }

    refresh() {
        if (this.chart) {
            this.chart.update();
        }
    }

    reinit() {
        if (this.chart) {
            this.chart.destroy();
            this.initChart();
        }
    }

    onDestroy() {
        if (this.chart) {
            this.chart.destroy();
            this.initialized = false;
            this.chart = null;
        }
    }
}

@NgModule({
    imports: [UIChart, SharedModule],
    exports: [UIChart, SharedModule]
})
export class ChartModule {}
