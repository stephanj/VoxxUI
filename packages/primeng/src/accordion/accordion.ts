import { AccordionGroup as AriaAccordionGroup, AccordionPanel as AriaAccordionPanel, AccordionTrigger as AriaAccordionTrigger } from '@angular/aria/accordion';
import { ChangeDetectionStrategy, Component, computed, contentChild, DestroyRef, Directive, forwardRef, inject, InjectionToken, input, InputSignalWithTransform, model, NgModule, output, Signal, signal, TemplateRef, ViewEncapsulation } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { MotionOptions } from '@primeuix/motion';
import { uuid } from '@primeuix/utils';
import { BlockableUI, SharedModule } from 'voxx-ui/api';
import { BaseComponent, PARENT_INSTANCE } from 'voxx-ui/basecomponent';
import { Bind, BindModule, withoutAriaOwnedAttrs } from 'voxx-ui/bind';
import { ChevronDownIcon, ChevronUpIcon } from 'voxx-ui/icons';
import { MotionModule } from 'voxx-ui/motion';
import { Ripple } from 'voxx-ui/ripple';
import { AccordionContentPassThrough, AccordionHeaderPassThrough, AccordionPanelPassThrough, AccordionPassThrough } from 'voxx-ui/types/accordion';
import { transformToBoolean } from 'voxx-ui/utils';
import { AccordionStyle } from './style/accordionstyle';

/**
 * Custom tab open event.
 * @see {@link onOpen}
 * @group Interface
 */
export interface AccordionTabOpenEvent {
    /**
     * Browser event.
     */
    originalEvent: Event;
    /**
     * Opened tab index.
     */
    index: number;
}

/**
 * Custom tab close event.
 * @see {@link onClose}
 * @extends {AccordionTabOpenEvent}
 * @group Interface
 */
export interface AccordionTabCloseEvent extends AccordionTabOpenEvent {}

/**
 * Toggle icon template context.
 * @group Interface
 */
export interface AccordionToggleIconTemplateContext {
    /**
     * Represents the active status of the panel.
     */
    active: boolean;
}
const ACCORDION_PANEL_INSTANCE = new InjectionToken<AccordionPanel>('ACCORDION_PANEL_INSTANCE');
const ACCORDION_HEADER_INSTANCE = new InjectionToken<AccordionHeader>('ACCORDION_HEADER_INSTANCE');
const ACCORDION_CONTENT_INSTANCE = new InjectionToken<AccordionContent>('ACCORDION_CONTENT_INSTANCE');
const ACCORDION_INSTANCE = new InjectionToken<Accordion>('ACCORDION_INSTANCE');

/**
 * AccordionPanel is a helper component for Accordion component.
 * @group Components
 */
@Component({
    selector: 'vx-accordion-panel, vx-accordionpanel',
    imports: [BindModule],
    template: `<ng-content />`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': 'cx("panel")',
        '[attr.data-p-disabled]': 'disabled()',
        '[attr.data-p-active]': 'active()'
    },
    hostDirectives: [Bind],
    providers: [AccordionStyle, { provide: ACCORDION_PANEL_INSTANCE, useExisting: AccordionPanel }, { provide: PARENT_INSTANCE, useExisting: AccordionPanel }]
})
export class AccordionPanel extends BaseComponent<AccordionPanelPassThrough> {
    $pcAccordionPanel: AccordionPanel | undefined = inject(ACCORDION_PANEL_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    componentName = 'AccordionPanel';

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptm('root'));
    }

    pcAccordion = inject(forwardRef(() => Accordion));
    /**
     * Value of the active tab.
     * @defaultValue undefined
     * @group Props
     */
    value = model<undefined | null | string | number | string[] | number[]>(undefined);
    /**
     * Disables the tab when enabled.
     * @defaultValue false
     * @group Props
     */
    disabled: InputSignalWithTransform<any, boolean> = input(false, { transform: (v: any) => transformToBoolean(v) });

    active = computed(() => (this.pcAccordion.multiple() ? this.valueEquals(this.pcAccordion.value(), this.value()) : this.pcAccordion.value() === this.value()));

    valueEquals(currentValue: any, value: any): boolean {
        if (Array.isArray(currentValue)) {
            return currentValue.includes(value);
        }
        return currentValue === value;
    }

    /**
     * The panel's {@link AccordionContent}, registered by the content itself. The header
     * hands it to its `@angular/aria` trigger as the controlled panel (`aria-controls`).
     * @group Props
     */
    content = signal<AccordionContent | undefined>(undefined);

    _componentStyle = inject(AccordionStyle);
}
/**
 * `@angular/aria`'s `AccordionTrigger` with its `panel` input redeclared as optional.
 *
 * Upstream, `panel` is `input.required`, and Angular requires a host directive's required
 * inputs to be exposed on the host (NG2019) — which would make it a required input of
 * `vx-accordion-header` for every consumer. The value is never bound from a template:
 * {@link AccordionHeader} re-points it to the sibling {@link AccordionContent}.
 * Internal; not part of the public API.
 */
@Directive({
    selector: '[vxAccordionTrigger]'
})
export class VxAccordionTrigger extends AriaAccordionTrigger {
    override readonly panel = input<AriaAccordionPanel>(undefined as unknown as AriaAccordionPanel);
}

/**
 * AccordionHeader is a helper component for Accordion component.
 * @group Components
 */
@Component({
    selector: 'vx-accordion-header, vx-accordionheader',
    imports: [NgTemplateOutlet, ChevronDownIcon, ChevronUpIcon, BindModule],
    template: `
        <ng-content />
        @if (toggleicon()) {
            <ng-template *ngTemplateOutlet="toggleicon() || null; context: { active: active() }"></ng-template>
        } @else {
            @if (active()) {
                @if (pcAccordion.collapseIcon()) {
                    <span [class]="cn(cx('toggleicon'), pcAccordion.collapseIcon())" [attr.aria-hidden]="true" [vxBind]="ptm('toggleicon')"></span>
                }
                @if (!pcAccordion.collapseIcon()) {
                    <svg data-p-icon="chevron-up" [class]="cx('toggleicon')" [vxBind]="ptm('toggleicon')" [attr.aria-hidden]="true" />
                }
            }
            @if (!active()) {
                @if (pcAccordion.expandIcon()) {
                    <span [class]="cn(cx('toggleicon'), pcAccordion.expandIcon())" [attr.aria-hidden]="true" [vxBind]="ptm('toggleicon')"></span>
                }
                @if (!pcAccordion.expandIcon()) {
                    <svg data-p-icon="chevron-down" [attr.aria-hidden]="true" [vxBind]="ptm('toggleicon')" />
                }
            }
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        // aria (`AccordionTrigger`) owns role / id / tabindex / aria-expanded /
        // aria-controls / aria-disabled. VoxxUI keeps only styling data-hooks.
        // `ngAccordionTrigger` lets the aria group resolve clicks on descendants
        // (e.g. the label text) back to this trigger.
        ngAccordionTrigger: '',
        '[class]': "cx('header')",
        '[attr.data-p-active]': 'active()',
        '[attr.data-p-disabled]': 'disabled()',
        '[style.user-select]': '"none"',
        '[attr.data-p]': 'dataP',
        '(click)': 'captureTriggerEvent($event)',
        '(keydown)': 'captureTriggerEvent($event)',
        '(focus)': 'onFocus()'
    },
    // Ordering: Ripple, then the aria trigger (owns the a11y attributes and keyboard
    // toggling via its group), then Bind so pt attributes apply last.
    hostDirectives: [Ripple, VxAccordionTrigger, Bind],
    providers: [AccordionStyle, { provide: ACCORDION_HEADER_INSTANCE, useExisting: AccordionHeader }, { provide: PARENT_INSTANCE, useExisting: AccordionHeader }]
})
export class AccordionHeader extends BaseComponent<AccordionHeaderPassThrough> {
    $pcAccordionHeader: AccordionHeader | undefined = inject(ACCORDION_HEADER_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    componentName = 'AccordionHeader';

    onAfterViewChecked(): void {
        // pt/aria precedence: strip aria-owned attrs so pt can't fight the primitive.
        this.bindDirectiveInstance.setAttrs(withoutAriaOwnedAttrs(this.ptm('root')));
    }

    pcAccordion = inject(forwardRef(() => Accordion));

    pcAccordionPanel = inject(forwardRef(() => AccordionPanel));

    id = computed(() => `${this.pcAccordion.id()}_accordionheader_${this.pcAccordionPanel.value()}`);

    active = computed(() => this.pcAccordionPanel.active());

    disabled = computed(() => this.pcAccordionPanel.disabled());

    ariaControls = computed(() => `${this.pcAccordion.id()}_accordioncontent_${this.pcAccordionPanel.value()}`);
    /**
     * Toggle icon template.
     * @type {TemplateRef<AccordionToggleIconTemplateContext>} context - Context of the template
     * @example
     * ```html
     * <ng-template #toggleicon let-active="active"> </ng-template>
     * ```
     * @see {@link AccordionToggleIconTemplateContext}
     * @group Templates
     */
    toggleicon = contentChild<TemplateRef<AccordionToggleIconTemplateContext>>('toggleicon');

    /** The `@angular/aria` trigger primitive that owns this header's a11y and keyboard behavior. */
    aria = inject(VxAccordionTrigger, { self: true });

    /**
     * The DOM event (click / Enter / Space) that led to the current aria-driven toggle,
     * forwarded as `originalEvent` of `onOpen` / `onClose`.
     */
    private triggerEvent: MouseEvent | KeyboardEvent | undefined;

    constructor() {
        super();
        this.wireAriaTrigger();
    }

    /**
     * Feeds VoxxUI's state into the `@angular/aria` trigger.
     *
     * The trigger's `panel` input carries an object reference to its `ngAccordionPanel`
     * (see {@link VxAccordionTrigger} for why it is optional here), but here the header and content are separate projected sibling
     * components, so no template can bind it. Host directives are created before their
     * host component, so the trigger's `panel`, `expanded`, `disabled` and `id` fields are
     * re-pointed here — before its `ngOnInit` builds the pattern from them:
     *
     * - `panel`: this panel's {@link AccordionContent}, which already renders the region
     *   (`role="region"`, `id`, `aria-labelledby`); a stand-in keeps a content-less panel valid.
     * - `expanded`: reads VoxxUI's `active()`; aria's writes (click / Enter / Space) are routed
     *   through {@link toggle}, so Accordion `value`, single/multiple mode and the
     *   `onOpen` / `onClose` events stay VoxxUI-owned.
     * - `disabled` / `id`: VoxxUI's panel-derived values, so existing ids are unchanged.
     */
    private wireAriaTrigger() {
        const trigger = this.aria as unknown as Record<string, unknown>;

        const expanded = computed(() => this.active()) as Signal<boolean> & { set(value: boolean): void; update(fn: (value: boolean) => boolean): void };
        expanded.set = (value: boolean) => {
            if (value !== this.active()) {
                this.toggle(this.triggerEvent);
            }
        };
        expanded.update = (fn) => expanded.set(fn(this.active()));

        const standInPanel = { id: this.ariaControls, element: this.document.createElement('div'), _pattern: undefined };

        trigger['id'] = this.id;
        trigger['disabled'] = this.disabled;
        trigger['expanded'] = expanded;
        trigger['panel'] = computed(() => this.pcAccordionPanel.content() ?? standInPanel);
    }

    /** Remembers the event that may make the aria group toggle this header. */
    protected captureTriggerEvent(event: MouseEvent | KeyboardEvent) {
        this.triggerEvent = event;
    }

    /**
     * Toggles the panel. Pointer and keyboard toggling go through the aria group; this
     * stays public for programmatic use.
     * @param {MouseEvent | KeyboardEvent} event - Event forwarded to `onOpen` / `onClose`.
     * @group Method
     */
    onClick(event?: MouseEvent | KeyboardEvent) {
        this.toggle(event);
    }

    private toggle(event?: MouseEvent | KeyboardEvent) {
        if (this.disabled()) {
            return;
        }

        const wasActive = this.active();

        this.changeActiveValue();

        const isActive = this.active();
        const index = this.pcAccordionPanel.value();

        if (!wasActive && isActive) {
            this.pcAccordion.onOpen.emit({ originalEvent: event as Event, index: index as number });
        } else if (wasActive && !isActive) {
            this.pcAccordion.onClose.emit({ originalEvent: event as Event, index: index as number });
        }
    }

    onFocus() {
        if (!this.disabled() && this.pcAccordion.selectOnFocus()) {
            this.changeActiveValue();
        }
    }

    _componentStyle = inject(AccordionStyle);

    changeActiveValue() {
        this.pcAccordion.updateValue(this.pcAccordionPanel.value() as string | number);
    }

    get dataP() {
        return this.cn({
            active: this.active()
        });
    }
}

@Component({
    selector: 'vx-accordion-content, vx-accordioncontent',
    imports: [BindModule, MotionModule],
    template: `
        <vx-motion [visible]="active()" name="p-collapsible" hideStrategy="visibility" [mountOnEnter]="false" [unmountOnLeave]="false" [options]="computedMotionOptions()">
            <div [vxBind]="ptm('contentWrapper', ptParams())" [class]="cx('contentWrapper')">
                <div [vxBind]="ptm('content', ptParams())" [class]="cx('content')">
                    <ng-content />
                </div>
            </div>
        </vx-motion>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': 'cx("contentContainer")',
        '[attr.id]': 'id()',
        '[attr.role]': '"region"',
        '[attr.data-p-active]': 'active()',
        '[attr.aria-labelledby]': 'ariaLabelledby()'
    },
    hostDirectives: [Bind],
    providers: [AccordionStyle, { provide: ACCORDION_CONTENT_INSTANCE, useExisting: AccordionContent }, { provide: PARENT_INSTANCE, useExisting: AccordionContent }]
})
export class AccordionContent extends BaseComponent<AccordionContentPassThrough> {
    $pcAccordionContent: AccordionContent | undefined = inject(ACCORDION_CONTENT_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    componentName = 'AccordionContent';

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptm('root'));
    }

    pcAccordion = inject(forwardRef(() => Accordion));

    pcAccordionPanel = inject(forwardRef(() => AccordionPanel));

    active = computed(() => this.pcAccordionPanel.active());

    /**
     * `@angular/aria` panel contract: the header's trigger reads `id()` for `aria-controls`
     * and links its pattern through `element` / `_pattern`.
     */
    get element(): HTMLElement {
        return this.el.nativeElement;
    }

    _pattern: unknown;

    constructor() {
        super();
        this.pcAccordionPanel.content.set(this);
        inject(DestroyRef).onDestroy(() => {
            if (this.pcAccordionPanel.content() === this) {
                this.pcAccordionPanel.content.set(undefined);
            }
        });
    }

    ariaLabelledby = computed(() => `${this.pcAccordion.id()}_accordionheader_${this.pcAccordionPanel.value()}`);

    id = computed(() => `${this.pcAccordion.id()}_accordioncontent_${this.pcAccordionPanel.value()}`);

    _componentStyle = inject(AccordionStyle);

    ptParams = computed(() => ({ context: this.active() }));

    computedMotionOptions = computed<MotionOptions>(() => {
        return {
            ...this.ptm('motion', this.ptParams()),
            ...this.pcAccordion.computedMotionOptions()
        };
    });
}

/**
 * Accordion groups a collection of contents in tabs.
 * @group Components
 */
@Component({
    selector: 'vx-accordion',
    imports: [SharedModule, BindModule],
    template: ` <ng-content />`,
    host: {
        '[class]': "cn(cx('root'), styleClass())"
    },
    // The aria group handles keyboard navigation (ArrowUp/Down, Home/End), toggling
    // (Enter/Space), click toggling and focus tracking for its triggers.
    hostDirectives: [Bind, AriaAccordionGroup],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [AccordionStyle, { provide: ACCORDION_INSTANCE, useExisting: Accordion }, { provide: PARENT_INSTANCE, useExisting: Accordion }]
})
export class Accordion extends BaseComponent<AccordionPassThrough> implements BlockableUI {
    componentName = 'Accordion';

    $pcAccordion: Accordion | undefined = inject(ACCORDION_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptm('root'));
    }

    /**
     * Value of the active tab.
     * @defaultValue undefined
     * @group Props
     */
    value = model<undefined | null | string | number | string[] | number[]>(undefined);
    /**
     * When enabled, multiple tabs can be activated at the same time.
     * @defaultValue false
     * @group Props
     */
    multiple = input(false, { transform: (v: any) => transformToBoolean(v) });
    /**
     * Class of the element.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    styleClass = input<string | undefined>();
    /**
     * Icon of a collapsed tab.
     * @group Props
     */
    expandIcon = input<string | undefined>();
    /**
     * Icon of an expanded tab.
     * @group Props
     */
    collapseIcon = input<string | undefined>();
    /**
     * When enabled, the focused tab is activated.
     * @defaultValue false
     * @group Props
     */
    selectOnFocus = input(false, { transform: (v: any) => transformToBoolean(v) });
    /**
     * Transition options of the animation.
     * @group Props
     * @deprecated since v21.0.0, use `motionOptions` instead.
     */
    transitionOptions = input<string>('400ms cubic-bezier(0.86, 0, 0.07, 1)');

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
     * Callback to invoke when an active tab is collapsed by clicking on the header.
     * @param {AccordionTabCloseEvent} event - Custom tab close event.
     * @group Emits
     */
    onClose = output<AccordionTabCloseEvent>();
    /**
     * Callback to invoke when a tab gets expanded.
     * @param {AccordionTabOpenEvent} event - Custom tab open event.
     * @group Emits
     */
    onOpen = output<AccordionTabOpenEvent>();

    id = signal(uuid('pn_id_'));

    _componentStyle = inject(AccordionStyle);

    /** The `@angular/aria` group primitive driving keyboard navigation and toggling. */
    aria = inject(AriaAccordionGroup, { self: true });

    constructor() {
        super();
        // Pattern-layer escape hatch (see docs/ARIA-ADOPTION.md): host directive inputs
        // can't be set from host metadata, so the two non-default behaviors VoxxUI keeps
        // are configured on the group pattern's behaviors directly.
        const pattern = this.aria._pattern as unknown as { navigationBehavior: { inputs: Record<string, unknown> }; focusBehavior: { inputs: Record<string, unknown> } };
        // Arrow keys wrap from the last header to the first and back.
        pattern.navigationBehavior.inputs['wrap'] = () => true;
        // Disabled headers are skipped by navigation and are not focusable.
        pattern.focusBehavior.inputs['softDisabled'] = () => false;
    }

    getBlockableElement(): HTMLElement {
        return this.el.nativeElement.children[0];
    }

    updateValue(value: string | number) {
        const currentValue = this.value();
        if (this.multiple()) {
            const newValue = Array.isArray(currentValue) ? [...currentValue] : [];
            const index = newValue.indexOf(value);

            if (index !== -1) {
                newValue.splice(index, 1);
            } else {
                newValue.push(value);
            }

            this.value.set(newValue as typeof this.value extends (...args: any) => infer R ? R : never);
        } else {
            if (currentValue === value) {
                this.value.set(undefined);
            } else {
                this.value.set(value);
            }
        }
    }
}

@NgModule({
    imports: [Accordion, SharedModule, AccordionPanel, AccordionHeader, AccordionContent, BindModule],
    exports: [Accordion, SharedModule, AccordionPanel, AccordionHeader, AccordionContent, BindModule]
})
export class AccordionModule {}
