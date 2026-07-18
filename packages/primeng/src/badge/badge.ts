import { isPlatformServer } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, Directive, effect, inject, InjectionToken, input, NgModule, untracked, ViewEncapsulation } from '@angular/core';
import { addClass, createElement, hasClass, isNotEmpty, removeClass, uuid } from '@primeuix/utils';
import { SharedModule } from 'voxx-ui/api';
import { BaseComponent, PARENT_INSTANCE } from 'voxx-ui/basecomponent';
import { Bind, BindModule } from 'voxx-ui/bind';
import type { BadgePassThrough } from 'voxx-ui/types/badge';
import { BadgeStyle } from './style/badgestyle';

const BADGE_INSTANCE = new InjectionToken<Badge>('BADGE_INSTANCE');

const BADGE_DIRECTIVE_INSTANCE = new InjectionToken<BadgeDirective>('BADGE_DIRECTIVE_INSTANCE');

/**
 * Badge Directive is directive usage of badge component.
 * @group Components
 */
@Directive({
    selector: '[vxBadge]',
    providers: [BadgeStyle, { provide: BADGE_DIRECTIVE_INSTANCE, useExisting: BadgeDirective }, { provide: PARENT_INSTANCE, useExisting: BadgeDirective }]
})
export class BadgeDirective extends BaseComponent {
    $pcBadgeDirective: BadgeDirective | undefined = inject(BADGE_DIRECTIVE_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    /**
     * Used to pass attributes to DOM elements inside the Badge component.
     * @defaultValue undefined
     * @deprecated use vxBadgePT instead.
     * @group Props
     */
    ptBadgeDirective = input<BadgePassThrough | undefined>();
    /**
     * Used to pass attributes to DOM elements inside the Badge component.
     * @defaultValue undefined
     * @group Props
     */
    vxBadgePT = input<BadgePassThrough | undefined>();
    /**
     * Indicates whether the component should be rendered without styles.
     * @defaultValue undefined
     * @group Props
     */
    vxBadgeUnstyled = input<boolean | undefined>();
    /**
     * When specified, disables the component.
     * @group Props
     */
    disabled = input<boolean | undefined>(undefined, { alias: 'badgeDisabled' });
    /**
     * Size of the badge, valid options are "large" and "xlarge".
     * @group Props
     */
    badgeSize = input<'large' | 'xlarge' | 'small' | null | undefined>();
    /**
     * Size of the badge, valid options are "large" and "xlarge".
     * @group Props
     * @deprecated use badgeSize instead.
     */
    size = input<'large' | 'xlarge' | 'small' | null | undefined>();
    /**
     * Severity type of the badge.
     * @group Props
     */
    severity = input<'secondary' | 'info' | 'success' | 'warn' | 'danger' | 'contrast' | 'help' | 'primary' | 'warning' | null | undefined>();
    /**
     * Value to display inside the badge.
     * @group Props
     */
    value = input<string | number | undefined>();
    /**
     * Inline style of the element.
     * @group Props
     */
    badgeStyle = input<{ [klass: string]: any } | null | undefined>();
    /**
     * Class of the element.
     * @group Props
     */
    badgeStyleClass = input<string | undefined>();

    private id!: string;

    badgeEl: HTMLElement;

    _componentStyle = inject(BadgeStyle);

    private get activeElement(): HTMLElement {
        return this.el.nativeElement.nodeName.indexOf('-') != -1 ? this.el.nativeElement.firstChild : this.el.nativeElement;
    }

    private get canUpdateBadge(): boolean {
        return isNotEmpty(this.id) && !this.disabled();
    }

    private _previousSeverity: string | null | undefined;

    constructor() {
        super();
        effect(() => {
            const pt = this.ptBadgeDirective() || this.vxBadgePT();
            pt && this.directivePT.set(pt);
        });

        effect(() => {
            this.vxBadgeUnstyled() && this.directiveUnstyled.set(this.vxBadgeUnstyled());
        });

        // Signal-native replacements for the former onChanges branches (#16).
        // Every input is a pure input(), so no trackSignalChanges() registration is
        // needed; the initial effect runs are no-ops because the badge element is
        // only created in onAfterViewInit (canUpdateBadge is false until then).
        effect(() => {
            if (this.size()) {
                console.log('size property is deprecated and will removed in v18, use badgeSize instead.');
            }
        });

        effect(() => {
            this.disabled();
            untracked(() => this.toggleDisableState());
        });

        effect(() => {
            const severity = this.severity();
            untracked(() => {
                if (this.canUpdateBadge && !Object.is(this._previousSeverity, severity)) {
                    this.setSeverity(this._previousSeverity as any);
                }
                this._previousSeverity = severity;
            });
        });

        effect(() => {
            this.badgeSize();
            this.size();
            untracked(() => this.canUpdateBadge && this.setSizeClasses());
        });

        effect(() => {
            this.value();
            untracked(() => this.canUpdateBadge && this.setValue());
        });

        effect(() => {
            this.badgeStyle();
            this.badgeStyleClass();
            untracked(() => this.canUpdateBadge && this.applyStyles());
        });
    }

    onAfterViewInit(): void {
        // the badge decoration is created with direct DOM APIs; skip on the
        // server and let the browser render it after bootstrap
        if (isPlatformServer(this.platformId)) {
            return;
        }
        this.id = uuid('pn_id_') + '_badge';
        this._previousSeverity = this.severity();
        this.renderBadgeContent();
    }

    private setValue(element?: HTMLElement): void {
        const badge = element ?? this.document.getElementById(this.id);

        if (!badge) {
            return;
        }

        const value = this.value();

        if (value != null) {
            if (hasClass(badge, 'p-badge-dot')) {
                removeClass(badge, 'p-badge-dot');
            }

            if (value && String(value).length === 1) {
                addClass(badge, 'p-badge-circle');
            } else {
                removeClass(badge, 'p-badge-circle');
            }
        } else {
            if (!hasClass(badge, 'p-badge-dot')) {
                addClass(badge, 'p-badge-dot');
            }

            removeClass(badge, 'p-badge-circle');
        }

        badge.textContent = '';
        const badgeValue = value != null ? String(value) : '';
        this.renderer.appendChild(badge, this.document.createTextNode(badgeValue));
    }

    private setSizeClasses(element?: HTMLElement): void {
        const badge = element ?? this.document.getElementById(this.id);

        if (!badge) {
            return;
        }

        const badgeSize = this.badgeSize();
        const size = this.size();

        if (badgeSize) {
            if (badgeSize === 'large') {
                addClass(badge, 'p-badge-lg');
                removeClass(badge, 'p-badge-xl');
            }

            if (badgeSize === 'xlarge') {
                addClass(badge, 'p-badge-xl');
                removeClass(badge, 'p-badge-lg');
            }
        } else if (size && !badgeSize) {
            if (size === 'large') {
                addClass(badge, 'p-badge-lg');
                removeClass(badge, 'p-badge-xl');
            }

            if (size === 'xlarge') {
                addClass(badge, 'p-badge-xl');
                removeClass(badge, 'p-badge-lg');
            }
        } else {
            removeClass(badge, 'p-badge-lg');
            removeClass(badge, 'p-badge-xl');
        }
    }

    private renderBadgeContent(): void {
        if (this.disabled()) {
            return;
        }

        const el = this.activeElement;
        const badge = <HTMLElement>createElement('span', { class: this.cx('root'), id: this.id, 'p-bind': this.ptm('root') });
        this.setSeverity(null, badge);
        this.setSizeClasses(badge);
        this.setValue(badge);
        addClass(el, 'p-overlay-badge');
        this.renderer.appendChild(el, badge);
        this.badgeEl = badge;
        this.applyStyles();
    }

    private applyStyles(): void {
        const badgeStyle = this.badgeStyle();
        const badgeStyleClass = this.badgeStyleClass();

        if (this.badgeEl && badgeStyle && typeof badgeStyle === 'object') {
            for (const [key, value] of Object.entries(badgeStyle)) {
                this.renderer.setStyle(this.badgeEl, key, value);
            }
        }
        if (this.badgeEl && badgeStyleClass) {
            this.badgeEl.classList.add(...badgeStyleClass.split(' '));
        }
    }

    private setSeverity(oldSeverity?: 'success' | 'info' | 'warn' | 'danger' | null, element?: HTMLElement): void {
        const badge = element ?? this.document.getElementById(this.id);

        if (!badge) {
            return;
        }

        if (this.severity()) {
            addClass(badge, `p-badge-${this.severity()}`);
        }

        if (oldSeverity) {
            removeClass(badge, `p-badge-${oldSeverity}`);
        }
    }

    private toggleDisableState(): void {
        if (!this.id) {
            return;
        }

        if (this.disabled()) {
            const badge = this.activeElement?.querySelector(`#${this.id}`);

            if (badge) {
                this.renderer.removeChild(this.activeElement, badge);
            }
        } else {
            this.renderBadgeContent();
        }
    }
}
/**
 * Badge is a small status indicator for another element.
 * @group Components
 */
@Component({
    selector: 'vx-badge',
    template: `{{ value() }}`,
    imports: [SharedModule, BindModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [BadgeStyle, { provide: BADGE_INSTANCE, useExisting: Badge }, { provide: PARENT_INSTANCE, useExisting: Badge }],
    host: {
        '[class]': "cn(cx('root'), styleClass())",
        '[style.display]': 'badgeDisabled() ? "none" : null',
        '[attr.data-p]': 'dataP'
    },
    hostDirectives: [Bind]
})
export class Badge extends BaseComponent<BadgePassThrough> {
    componentName = 'Badge';

    $pcBadge: Badge | undefined = inject(BADGE_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }
    /**
     * Class of the element.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    styleClass = input<string>();
    /**
     * Size of the badge, valid options are "large" and "xlarge".
     * @group Props
     */
    badgeSize = input<'small' | 'large' | 'xlarge' | null>();
    /**
     * Size of the badge, valid options are "large" and "xlarge".
     * @group Props
     */
    size = input<'small' | 'large' | 'xlarge' | null>();
    /**
     * Severity type of the badge.
     * @group Props
     */
    severity = input<'secondary' | 'info' | 'success' | 'warn' | 'danger' | 'contrast' | 'help' | 'primary' | 'warning' | null>();
    /**
     * Value to display inside the badge.
     * @group Props
     */
    value = input<string | number | null>();
    /**
     * When specified, disables the component.
     * @group Props
     */
    badgeDisabled = input<boolean, boolean>(false, { transform: booleanAttribute });

    _componentStyle = inject(BadgeStyle);

    get dataP() {
        return this.cn({
            circle: this.value() != null && String(this.value()).length === 1,
            empty: this.value() == null,
            disabled: this.badgeDisabled(),
            [this.severity() as string]: this.severity(),
            [this.size() as string]: this.size()
        });
    }
}

@NgModule({
    imports: [Badge, BadgeDirective, SharedModule],
    exports: [Badge, BadgeDirective, SharedModule]
})
export class BadgeModule {}
