import type { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, DoCheck, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

export interface Lifecycle {
    /**
     * Simulates Angular's ngOnInit hook.
     * @see {@link OnInit#ngOnInit}
     */
    onInit(): void;
    /**
     * Simulates Angular's ngOnChanges hook.
     *
     * Delivered exactly once per change through two coexisting paths (see the design
     * note in `basecomponent.ts`, #16):
     * - Inputs written through template bindings or `setInput()` — decorator `@Input()`
     *   AND signal inputs alike — arrive via Angular's `ngOnChanges` (including the
     *   initial call with `firstChange === true`).
     * - Signal writes that bypass the input system (programmatic `model()` writes,
     *   tracked non-input signals) are delivered by the signal path for signals
     *   registered via `BaseComponent.trackSignalChanges()`, with the same
     *   `SimpleChanges` payload shape, but only for actual changes after
     *   initialization — `firstChange` is always `false` on that path.
     * @see {@link OnChanges#ngOnChanges}
     */
    onChanges(changes: SimpleChanges): void;
    /**
     * Simulates Angular's ngDoCheck hook.
     *
     * Runs on every change-detection cycle and is hostile to OnPush/zoneless apps.
     * Do not use it to detect input changes — use signal inputs together with
     * `effect()`/`computed()` or `BaseComponent.trackSignalChanges()` instead (#16).
     * @see {@link DoCheck#ngDoCheck}
     */
    onDoCheck(): void;
    /**
     * Simulates Angular's ngOnDestroy hook.
     * @see {@link OnDestroy#ngOnDestroy}
     */
    onDestroy(): void;
    /**
     * Simulates Angular's ngAfterContentInit hook.
     * @see {@link AfterContentInit#ngAfterContentInit}
     */
    onAfterContentInit(): void;
    /**
     * Simulates Angular's ngAfterContentChecked hook.
     * @see {@link AfterContentChecked#ngAfterContentChecked}
     */
    onAfterContentChecked(): void;
    /**
     * Simulates Angular's ngAfterViewInit hook.
     * @see {@link AfterViewInit#ngAfterViewInit}
     */
    onAfterViewInit(): void;
    /**
     * Simulates Angular's ngAfterViewChecked hook.
     * @see {@link AfterViewChecked#ngAfterViewChecked}
     */
    onAfterViewChecked(): void;
}

export interface LifecycleHooks extends Partial<Lifecycle> {
    /**
     * Defines a function to be called before the component's initialization (constructor phase).
     */
    onBeforeInit?(): void;
}
