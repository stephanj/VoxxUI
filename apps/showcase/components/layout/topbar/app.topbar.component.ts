import Versions from '@/assets/data/versions.json';
import { AppConfiguratorComponent } from '@/components/layout/configurator/app.configurator.component';
import { AppConfigService } from '@/service/appconfigservice';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, afterNextRender, booleanAttribute, Component, computed, ElementRef, Inject, Input, OnDestroy, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DomHandler } from 'voxx-ui/dom';
import { StyleClass } from 'voxx-ui/styleclass';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'app-topbar',
    standalone: true,
    imports: [CommonModule, FormsModule, StyleClass, RouterModule, AppConfiguratorComponent],
    template: `<div class="layout-topbar">
        <div class="layout-topbar-inner">
            <div class="layout-topbar-logo-container">
                <a [routerLink]="['/']" class="layout-topbar-logo" aria-label="VoxxUI Home" style="font-size: 1.5rem; font-weight: 700; letter-spacing: -0.025em; text-decoration: none; color: var(--high-contrast-text-color)">
                    Voxx<span style="color: var(--p-primary-color)">UI</span>
                </a>
                <a [routerLink]="['/']" class="layout-topbar-icon" aria-label="VoxxUI Home" style="font-size: 1.25rem; font-weight: 700; text-decoration: none; color: var(--p-primary-color)"> Vx </a>
            </div>

            <ul class="topbar-items">
                <li>
                    <a href="https://github.com/stephanj/VoxxUI" target="_blank" rel="noopener noreferrer" class="topbar-item">
                        <i class="pi pi-github text-surface-700 dark:text-surface-100"></i>
                    </a>
                </li>
                <li>
                    <button type="button" class="topbar-item" (click)="toggleDarkMode()">
                        <i class="pi" [ngClass]="{ 'pi-moon': isDarkMode(), 'pi-sun': !isDarkMode() }"></i>
                    </button>
                </li>
                @if (showConfigurator) {
                    <li class="relative">
                        <button
                            type="button"
                            class="topbar-item config-item"
                            enterActiveClass="px-overlay-enter-active"
                            enterFromClass="hidden"
                            leaveActiveClass="px-overlay-leave-active"
                            leaveToClass="hidden"
                            vxStyleClass="@next"
                            [hideOnOutsideClick]="true"
                        >
                            <i class="pi pi-palette"></i>
                        </button>
                        <app-configurator />
                    </li>
                }
                <li>
                    <button
                        vxStyleClass="@next"
                        enterFromClass="hidden"
                        enterActiveClass="px-overlay-enter-active"
                        leaveToClass="hidden"
                        leaveActiveClass="px-overlay-leave-active"
                        [hideOnOutsideClick]="true"
                        type="button"
                        class="topbar-item version-item"
                    >
                        <span class="version-text">{{ versions ? versions[0].name : 'Latest' }}</span>
                        <span class="version-icon pi pi-angle-down"></span>
                    </button>
                    <div class="versions-panel hidden">
                        <ul>
                            @for (v of versions; track v) {
                                <li role="none">
                                    <a [href]="v.url">
                                        <span>{{ v.version }}</span>
                                    </a>
                                </li>
                            }
                        </ul>
                    </div>
                </li>
                @if (showMenuButton) {
                    <li class="menu-button">
                        <button type="button" class="topbar-item menu-button" (click)="toggleMenu()" aria-label="Menu">
                            <i class="pi pi-bars"></i>
                        </button>
                    </li>
                }
            </ul>
        </div>
    </div>`
})
export class AppTopBarComponent implements OnDestroy {
    @Input({ transform: booleanAttribute }) showConfigurator = true;

    @Input({ transform: booleanAttribute }) showMenuButton = true;

    versions: any[] = Versions;

    scrollListener: VoidFunction | null;

    private window: Window;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private el: ElementRef,
        private renderer: Renderer2,
        private configService: AppConfigService
    ) {
        this.window = this.document.defaultView as Window;

        afterNextRender(() => {
            this.bindScrollListener();
        });
    }

    isDarkMode = computed(() => this.configService.appState().darkTheme);

    isMenuActive = computed(() => this.configService.appState().menuActive);

    toggleMenu() {
        if (this.isMenuActive()) {
            this.configService.hideMenu();
            DomHandler.unblockBodyScroll('blocked-scroll');
        } else {
            this.configService.showMenu();
            DomHandler.blockBodyScroll('blocked-scroll');
        }
    }

    toggleDarkMode() {
        this.configService.appState.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    bindScrollListener() {
        if (!this.scrollListener) {
            this.scrollListener = this.renderer.listen(this.window, 'scroll', () => {
                if (this.window.scrollY > 0) {
                    this.el.nativeElement.children[0].classList.add('layout-topbar-sticky');
                } else {
                    this.el.nativeElement.children[0].classList.remove('layout-topbar-sticky');
                }
            });
        }
    }

    unbindScrollListener() {
        if (this.scrollListener) {
            this.scrollListener();
            this.scrollListener = null;
        }
    }

    ngOnDestroy() {
        this.unbindScrollListener();
    }
}
