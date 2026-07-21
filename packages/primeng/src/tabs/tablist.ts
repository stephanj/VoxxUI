import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, contentChild, contentChildren, effect, ElementRef, forwardRef, inject, InjectionToken, signal, TemplateRef, untracked, viewChild, ViewEncapsulation } from '@angular/core';
import { TabList as AriaTabList } from '@angular/aria/tabs';
import { findSingle, getOffset, getOuterWidth, getWidth, isRTL } from '@primeuix/utils';
import { PrimeTemplate, SharedModule } from 'voxx-ui/api';
import { BaseComponent, PARENT_INSTANCE } from 'voxx-ui/basecomponent';
import { Bind, BindModule, withoutAriaOwnedAttrs } from 'voxx-ui/bind';
import { ChevronLeftIcon, ChevronRightIcon } from 'voxx-ui/icons';
import { RippleModule } from 'voxx-ui/ripple';
import { TabListStyle } from './style/tabliststyle';
import { Tabs } from './tabs';
import { TabListPassThrough } from 'voxx-ui/types/tabs';

const TABLIST_INSTANCE = new InjectionToken<TabList>('TABLIST_INSTANCE');

/**
 * TabList is a helper component for Tabs component.
 * @group Components
 */
@Component({
    selector: 'vx-tablist',
    imports: [CommonModule, ChevronLeftIcon, ChevronRightIcon, RippleModule, SharedModule, BindModule],
    template: `
        @if (showNavigators() && isPrevButtonEnabled()) {
            <button
                type="button"
                #prevButton
                vxRipple
                [vxBind]="ptm('prevButton')"
                [class]="cx('prevButton')"
                [attr.aria-label]="prevButtonAriaLabel"
                [attr.tabindex]="tabindex()"
                [attr.data-pc-group-section]="'navigator'"
                (click)="onPrevButtonClick()"
            >
                @if (prevIconTemplate() || _prevIconTemplate()) {
                    <ng-container *ngTemplateOutlet="prevIconTemplate() || _prevIconTemplate()" />
                } @else {
                    <svg data-p-icon="chevron-left" />
                }
            </button>
        }
        <div #content [vxBind]="ptm('content')" [class]="cx('content')" (scroll)="onScroll($event)">
            <!-- role="tablist" is now owned by the aria [ngTabList] host directive on the
                 vx-tablist host (see hostDirectives), so it is intentionally NOT set here. -->
            <div #tabs [vxBind]="ptm('tabList')" [class]="cx('tabList')">
                <ng-content />
                <span #inkbar [vxBind]="ptm('activeBar')" role="presentation" [class]="cx('activeBar')"></span>
            </div>
        </div>
        @if (showNavigators() && isNextButtonEnabled()) {
            <button
                type="button"
                #nextButton
                vxRipple
                [vxBind]="ptm('nextButton')"
                [class]="cx('nextButton')"
                [attr.aria-label]="nextButtonAriaLabel"
                [attr.tabindex]="tabindex()"
                [attr.data-pc-group-section]="'navigator'"
                (click)="onNextButtonClick()"
            >
                @if (nextIconTemplate() || _nextIconTemplate()) {
                    <ng-container *ngTemplateOutlet="nextIconTemplate() || _nextIconTemplate()" />
                } @else {
                    <svg data-p-icon="chevron-right" />
                }
            </button>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': 'cx("root")'
    },
    providers: [TabListStyle, { provide: TABLIST_INSTANCE, useExisting: TabList }, { provide: PARENT_INSTANCE, useExisting: TabList }],
    // aria `[ngTabList]` owns role="tablist", roving tabindex, aria-orientation,
    // aria-activedescendant and the arrow/Home/End/Enter/Space keyboard engine on
    // the vx-tablist host. VoxxUI keeps the scroll buttons + ink-bar below.
    hostDirectives: [AriaTabList, Bind]
})
export class TabList extends BaseComponent<TabListPassThrough> {
    componentName = 'TabList';

    $pcTabList: TabList | undefined = inject(TABLIST_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    /** The `@angular/aria` tablist primitive driving keyboard nav + roving focus. */
    aria = inject(AriaTabList, { self: true });

    onAfterViewChecked(): void {
        // pt/aria precedence: aria owns role/tabindex/aria-* on this host, so strip
        // any pt attempt to override them (see voxx-ui/bind aria-precedence.ts).
        this.bindDirectiveInstance.setAttrs(withoutAriaOwnedAttrs(this.ptms(['host', 'root'])));
    }

    /**
     * A template reference variable that represents the previous icon in a UI component.
     * @type {TemplateRef<any> | undefined}
     * @group Templates
     */
    prevIconTemplate = contentChild<TemplateRef<any>>('previcon', { descendants: false });
    /**
     * A template reference variable that represents the next icon in a UI component.
     * @type {TemplateRef<any> | undefined}
     * @group Templates
     */
    nextIconTemplate = contentChild<TemplateRef<any>>('nexticon', { descendants: false });

    templates = contentChildren(PrimeTemplate);

    content = viewChild<ElementRef<HTMLDivElement>>('content');

    prevButton = viewChild<ElementRef<HTMLButtonElement>>('prevButton');

    nextButton = viewChild<ElementRef<HTMLButtonElement>>('nextButton');

    inkbar = viewChild<ElementRef<HTMLSpanElement>>('inkbar');

    tabs = viewChild<ElementRef<HTMLDivElement>>('tabs');

    pcTabs = inject(forwardRef(() => Tabs));

    isPrevButtonEnabled = signal<boolean>(false);

    isNextButtonEnabled = signal<boolean>(false);

    resizeObserver!: ResizeObserver;

    showNavigators = computed(() => this.pcTabs.showNavigators());

    tabindex = computed(() => this.pcTabs.tabindex());

    scrollable = computed(() => this.pcTabs.scrollable());

    _componentStyle = inject(TabListStyle);

    constructor() {
        super();

        // Force "explicit" selection semantics regardless of the aria default
        // ('follow'): arrow keys move roving focus only, they never auto-select.
        // VoxxUI's `selectOnFocus` is driven by Tab.onFocus instead (it must also
        // fire on plain focus / Tab key, which `follow` does not cover). The
        // `selectionMode` input can't be set on a host-applied hostDirective, so
        // we neutralise it through the exposed pattern layer.
        (this.aria._pattern as any).followFocus = signal(false);

        // Two-way sync: VoxxUI Tabs.value <-> aria selectedTab model.
        // Tabs.value is the source of truth; re-run when tabs (de)register so the
        // initial/late selection lands once the collection is populated.
        effect(() => {
            const v = this.pcTabs.value();
            this.aria._collection.orderedItems();
            untracked(() => {
                if (v != null && this.aria.findTab(v as any) && this.aria.selectedTab() !== (v as any)) {
                    this.aria.selectedTab.set(v as any);
                }
            });
        });
        // User interaction (click / Enter / Space) updates aria selectedTab; mirror
        // it back to Tabs.value. Ignore aria's undefined resets (non-existent value).
        effect(() => {
            const v = this.aria.selectedTab();
            untracked(() => {
                if (v != null && this.pcTabs.value() !== (v as any)) {
                    this.pcTabs.value.set(v as any);
                }
            });
        });

        effect(() => {
            this.pcTabs.value();
            if (isPlatformBrowser(this.platformId)) {
                setTimeout(() => {
                    this.updateInkBar();
                });
            }
        });
    }

    get prevButtonAriaLabel() {
        return this.config?.translation?.aria?.previous;
    }

    get nextButtonAriaLabel() {
        return this.config?.translation?.aria?.next;
    }

    onAfterViewInit() {
        if (this.showNavigators() && isPlatformBrowser(this.platformId)) {
            this.updateButtonState();
            this.bindResizeObserver();
        }
    }

    /**
     * Map of the `vxTemplate`-declared icon templates, keyed by template type. Mirrors the
     * pre-signal `ngAfterContentInit` population of `_prevIconTemplate`/`_nextIconTemplate`.
     */
    private _templateMap = computed(() => {
        const map: Record<string, TemplateRef<any> | undefined> = {};

        for (const t of this.templates()) {
            switch (t.getType()) {
                case 'previcon':
                    map['previcon'] = t.template;
                    break;
                case 'nexticon':
                    map['nexticon'] = t.template;
                    break;
            }
        }

        return map;
    });

    _prevIconTemplate = computed(() => this._templateMap()['previcon']);

    _nextIconTemplate = computed(() => this._templateMap()['nexticon']);

    onDestroy() {
        this.unbindResizeObserver();
    }

    onScroll(event: Event) {
        this.showNavigators() && this.updateButtonState();

        event.preventDefault();
    }

    onPrevButtonClick() {
        const _content = this.content()!.nativeElement;
        const width = getWidth(_content);
        const pos = Math.abs(_content.scrollLeft) - width;
        const scrollLeft = pos <= 0 ? 0 : pos;

        _content.scrollLeft = isRTL(_content) ? -1 * scrollLeft : scrollLeft;
    }

    onNextButtonClick() {
        const _content = this.content()!.nativeElement;
        const width = getWidth(_content) - this.getVisibleButtonWidths();
        const pos = _content.scrollLeft + width;
        const lastPos = _content.scrollWidth - width;
        const scrollLeft = pos >= lastPos ? lastPos : pos;

        _content.scrollLeft = isRTL(_content) ? -1 * scrollLeft : scrollLeft;
    }

    updateButtonState() {
        const _content = this.content()!.nativeElement;
        const _list = this.el?.nativeElement;

        const { scrollWidth, offsetWidth } = _content;
        const scrollLeft = Math.abs(_content.scrollLeft);
        const width = getWidth(_content);

        this.isPrevButtonEnabled.set(scrollLeft !== 0);
        this.isNextButtonEnabled.set(_list.offsetWidth >= offsetWidth && Math.abs(scrollLeft - scrollWidth + width) > 1);
    }

    updateInkBar() {
        const _content = this.content()?.nativeElement;
        const _inkbar = this.inkbar()?.nativeElement;
        const _tabs = this.tabs()?.nativeElement;

        if (_inkbar && _content && _tabs) {
            const activeTab = findSingle(_content, '[data-pc-name="tab"][data-p-active="true"]');
            _inkbar.style.width = getOuterWidth(activeTab) + 'px';
            _inkbar.style.left = <any>getOffset(activeTab).left - <any>getOffset(_tabs).left + 'px';
        }
    }

    getVisibleButtonWidths() {
        const _prevBtn = this.prevButton()?.nativeElement;
        const _nextBtn = this.nextButton()?.nativeElement;

        return [_prevBtn, _nextBtn].reduce((acc, el) => (el ? acc + getWidth(el) : acc), 0);
    }

    bindResizeObserver() {
        this.resizeObserver = new ResizeObserver(() => this.updateButtonState());
        this.resizeObserver.observe(this.el.nativeElement);
    }

    unbindResizeObserver() {
        if (this.resizeObserver) {
            this.resizeObserver.unobserve(this.el.nativeElement);
            this.resizeObserver = null!;
        }
    }
}
