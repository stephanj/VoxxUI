import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, contentChild, contentChildren, inject, InjectionToken, input, NgModule, TemplateRef, ViewEncapsulation } from '@angular/core';
import { BlockableUI, Footer, Header, PrimeTemplate, SharedModule } from 'voxx-ui/api';
import { BaseComponent, PARENT_INSTANCE } from 'voxx-ui/basecomponent';
import { Bind, BindModule } from 'voxx-ui/bind';
import { CardStyle } from './style/cardstyle';
import { CardPassThrough } from 'voxx-ui/types/card';

const CARD_INSTANCE = new InjectionToken<Card>('CARD_INSTANCE');

/**
 * Card is a flexible container component.
 * @group Components
 */
@Component({
    selector: 'vx-card',
    imports: [NgTemplateOutlet, SharedModule, BindModule],
    template: `
        @if (headerFacet() || headerTemplate() || _headerTemplate()) {
            <div [vxBind]="ptm('header')" [class]="cx('header')">
                <ng-content select="vx-header"></ng-content>
                <ng-container *ngTemplateOutlet="headerTemplate() || _headerTemplate() || null"></ng-container>
            </div>
        }
        <div [vxBind]="ptm('body')" [class]="cx('body')">
            @if (header() || titleTemplate() || _titleTemplate()) {
                <div [vxBind]="ptm('title')" [class]="cx('title')">
                    @if (header() && !_titleTemplate() && !titleTemplate()) {
                        {{ header() }}
                    }
                    <ng-container *ngTemplateOutlet="titleTemplate() || _titleTemplate() || null"></ng-container>
                </div>
            }
            @if (subheader() || subtitleTemplate() || _subtitleTemplate()) {
                <div [vxBind]="ptm('subtitle')" [class]="cx('subtitle')">
                    @if (subheader() && !_subtitleTemplate() && !subtitleTemplate()) {
                        {{ subheader() }}
                    }
                    <ng-container *ngTemplateOutlet="subtitleTemplate() || _subtitleTemplate() || null"></ng-container>
                </div>
            }
            <div [vxBind]="ptm('content')" [class]="cx('content')">
                <ng-content></ng-content>
                <ng-container *ngTemplateOutlet="contentTemplate() || _contentTemplate() || null"></ng-container>
            </div>
            @if (footerFacet() || footerTemplate() || _footerTemplate()) {
                <div [vxBind]="ptm('footer')" [class]="cx('footer')">
                    <ng-content select="vx-footer"></ng-content>
                    <ng-container *ngTemplateOutlet="footerTemplate() || _footerTemplate() || null"></ng-container>
                </div>
            }
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [CardStyle, { provide: CARD_INSTANCE, useExisting: Card }, { provide: PARENT_INSTANCE, useExisting: Card }],
    host: {
        '[class]': "cn(cx('root'), styleClass())",
        '[style]': 'style()'
    },
    hostDirectives: [Bind]
})
export class Card extends BaseComponent<CardPassThrough> implements BlockableUI {
    componentName = 'Card';

    $pcCard: Card | undefined = inject(CARD_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(CardStyle);

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }
    /**
     * Header of the card.
     * @group Props
     */
    header = input<string | undefined>();
    /**
     * Subheader of the card.
     * @group Props
     */
    subheader = input<string | undefined>();
    /**
     * Inline style of the element.
     * @group Props
     */
    style = input<{ [klass: string]: any } | null | undefined>(null);
    /**
     * Class of the element.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    styleClass = input<string | undefined>();

    headerFacet = contentChild(Header);

    footerFacet = contentChild(Footer);

    /**
     * Custom header template.
     * @group Templates
     */
    headerTemplate = contentChild<TemplateRef<void>>('header', { descendants: false });

    /**
     * Custom title template.
     * @group Templates
     */
    titleTemplate = contentChild<TemplateRef<void>>('title', { descendants: false });

    /**
     * Custom subtitle template.
     * @group Templates
     */
    subtitleTemplate = contentChild<TemplateRef<void>>('subtitle', { descendants: false });

    /**
     * Custom content template.
     * @group Templates
     */
    contentTemplate = contentChild<TemplateRef<void>>('content', { descendants: false });

    /**
     * Custom footer template.
     * @group Templates
     */
    footerTemplate = contentChild<TemplateRef<void>>('footer', { descendants: false });

    templates = contentChildren(PrimeTemplate);

    _headerTemplate = computed<TemplateRef<void> | undefined>(() => this.templates().find((item) => item.getType() === 'header')?.template);

    _titleTemplate = computed<TemplateRef<void> | undefined>(() => this.templates().find((item) => item.getType() === 'title')?.template);

    _subtitleTemplate = computed<TemplateRef<void> | undefined>(() => this.templates().find((item) => item.getType() === 'subtitle')?.template);

    _contentTemplate = computed<TemplateRef<void> | undefined>(() => {
        const templates = this.templates();
        const known = ['header', 'title', 'subtitle', 'footer'];
        return (templates.find((item) => item.getType() === 'content') ?? templates.filter((item) => !known.includes(item.getType())).pop())?.template;
    });

    _footerTemplate = computed<TemplateRef<void> | undefined>(() => this.templates().find((item) => item.getType() === 'footer')?.template);

    getBlockableElement(): HTMLElement {
        return this.el.nativeElement;
    }
}

@NgModule({
    imports: [Card, SharedModule, BindModule],
    exports: [Card, SharedModule, BindModule]
})
export class CardModule {}
