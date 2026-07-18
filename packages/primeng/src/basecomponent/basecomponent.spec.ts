import { ChangeDetectionStrategy, Component, Input, input, model, provideZonelessChangeDetection, signal, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseComponent } from './basecomponent';

@Component({
    selector: 'test-signal-changes',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `<span>{{ label() }}</span>`
})
class TestSignalChangesComponent extends BaseComponent {
    label = input<string>('initial');

    counter = model<number>(0);

    flag = model<boolean>(false);

    /** Local non-input signal, registered late in some tests. */
    extra = signal<string>('a');

    /**
     * Decorator input kept on purpose: verifies that the legacy ngOnChanges path
     * and the signal path coexist on the same component.
     */
    @Input() legacyProp: string | undefined;

    receivedChanges: SimpleChanges[] = [];

    _componentStyle = {
        // no `name` on purpose - keeps the style loaders from engaging for this stub
        classes: {
            root: 'p-test-root'
        },
        load: () => ({}),
        getPresetTheme: () => ({ css: '' })
    };

    constructor() {
        super();

        this.trackSignalChanges({ label: this.label, counter: this.counter, flag: this.flag });
    }

    onChanges(changes: SimpleChanges) {
        this.receivedChanges.push(changes);
    }
}

describe('BaseComponent', () => {
    describe('Signal input change tracking (#16)', () => {
        let fixture: ComponentFixture<TestSignalChangesComponent>;
        let component: TestSignalChangesComponent;

        beforeEach(async () => {
            TestBed.configureTestingModule({
                imports: [TestSignalChangesComponent],
                providers: [provideZonelessChangeDetection()]
            });

            fixture = TestBed.createComponent(TestSignalChangesComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
            await fixture.whenStable();
        });

        it('should not emit onChanges for initial signal input values', () => {
            expect(component.receivedChanges.length).toBe(0);
        });

        it('should deliver a setInput() write on a signal input exactly once (legacy ngOnChanges path)', async () => {
            fixture.componentRef.setInput('label', 'updated');
            await fixture.whenStable();

            expect(component.receivedChanges.length).toBe(1);

            const change = component.receivedChanges[0]['label'];
            expect(change).toBeDefined();
            expect(change.currentValue).toBe('updated');
            // first write through the input system keeps Angular's firstChange semantics
            expect(change.firstChange).toBe(true);
        });

        it('should deliver a programmatic model() write exactly once via the signal path', async () => {
            component.counter.set(5);
            await fixture.whenStable();

            expect(component.receivedChanges.length).toBe(1);

            const change = component.receivedChanges[0]['counter'];
            expect(change).toBeDefined();
            expect(change.previousValue).toBe(0);
            expect(change.currentValue).toBe(5);
            expect(change.firstChange).toBe(false);
            expect(change.isFirstChange()).toBe(false);
        });

        it('should coalesce multiple signal writes of the same tick into one onChanges call', async () => {
            component.counter.set(7);
            component.flag.set(true);
            await fixture.whenStable();

            expect(component.receivedChanges.length).toBe(1);
            expect(component.receivedChanges[0]['counter'].currentValue).toBe(7);
            expect(component.receivedChanges[0]['flag'].currentValue).toBe(true);
        });

        it('should not emit onChanges when a tracked signal is set to the same value', async () => {
            component.counter.set(0);
            await fixture.whenStable();

            expect(component.receivedChanges.length).toBe(0);
        });

        it('should emit a separate change entry for each subsequent signal write', async () => {
            component.counter.set(1);
            await fixture.whenStable();
            component.counter.set(2);
            await fixture.whenStable();

            expect(component.receivedChanges.length).toBe(2);
            expect(component.receivedChanges[0]['counter'].previousValue).toBe(0);
            expect(component.receivedChanges[0]['counter'].currentValue).toBe(1);
            expect(component.receivedChanges[1]['counter'].previousValue).toBe(1);
            expect(component.receivedChanges[1]['counter'].currentValue).toBe(2);
        });

        it('should not double-deliver a change reported by ngOnChanges for a tracked signal input', async () => {
            fixture.componentRef.setInput('label', 'once');
            await fixture.whenStable();
            // give the signal-path effect an extra flush opportunity
            fixture.detectChanges();
            await fixture.whenStable();

            const labelCalls = component.receivedChanges.filter((changes) => !!changes['label']);
            expect(labelCalls.length).toBe(1);
        });

        it('should notify onChanges when the base pt signal input changes', async () => {
            const nextPt = { root: { 'data-testid': 'custom' } };
            fixture.componentRef.setInput('pt', nextPt);
            await fixture.whenStable();

            expect(component.receivedChanges.length).toBe(1);
            expect(component.receivedChanges[0]['pt'].currentValue).toBe(nextPt);
        });

        it('should notify onChanges when the base dt signal input changes', async () => {
            const tokens = { primitive: {} };
            fixture.componentRef.setInput('dt', tokens);
            await fixture.whenStable();

            expect(component.receivedChanges.length).toBe(1);
            expect(component.receivedChanges[0]['dt'].currentValue).toBe(tokens);
        });

        it('should fire the pt hooks.onChanges passthrough exactly once per change on either path', async () => {
            const hookSpy = vi.fn().mockName('onChangesHook');
            fixture.componentRef.setInput('pt', { hooks: { onChanges: hookSpy } });
            await fixture.whenStable();

            hookSpy.mockClear();

            // legacy ngOnChanges path (setInput on a signal input)
            fixture.componentRef.setInput('label', 'hooked');
            await fixture.whenStable();
            fixture.detectChanges();
            await fixture.whenStable();

            expect(hookSpy).toHaveBeenCalledTimes(1);

            hookSpy.mockClear();

            // signal path (programmatic model() write bypasses ngOnChanges)
            component.counter.set(99);
            await fixture.whenStable();

            expect(hookSpy).toHaveBeenCalledTimes(1);
        });

        it('should update unstyled rendering and notify onChanges when the unstyled signal input changes', async () => {
            expect(component.$unstyled()).toBe(false);
            expect(component.cx('root')).toBe('p-test-root');

            fixture.componentRef.setInput('unstyled', true);
            await fixture.whenStable();

            expect(component.$unstyled()).toBe(true);
            expect(component.cx('root')).toBeUndefined();
            expect(component.receivedChanges.length).toBe(1);
            expect(component.receivedChanges[0]['unstyled'].currentValue).toBe(true);
        });

        it('should keep the decorator @Input ngOnChanges path working alongside the signal path', async () => {
            fixture.componentRef.setInput('legacyProp', 'legacy');
            fixture.detectChanges();
            await fixture.whenStable();

            const legacyCall = component.receivedChanges.find((changes) => !!changes['legacyProp']);
            expect(legacyCall).toBeDefined();
            expect(legacyCall!['legacyProp'].currentValue).toBe('legacy');
            expect(legacyCall!['legacyProp'].firstChange).toBe(true);

            component.receivedChanges = [];

            fixture.componentRef.setInput('legacyProp', 'legacy-2');
            fixture.detectChanges();
            await fixture.whenStable();

            const secondCall = component.receivedChanges.find((changes) => !!changes['legacyProp']);
            expect(secondCall).toBeDefined();
            expect(secondCall!['legacyProp'].previousValue).toBe('legacy');
            expect(secondCall!['legacyProp'].currentValue).toBe('legacy-2');
            expect(secondCall!['legacyProp'].firstChange).toBe(false);
        });

        it('should allow late registration of tracked signals without emitting a baseline notification', async () => {
            component.trackSignalChanges({ extra: component.extra });
            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.receivedChanges.length).toBe(0);

            component.extra.set('b');
            await fixture.whenStable();

            expect(component.receivedChanges.length).toBe(1);
            expect(component.receivedChanges[0]['extra'].previousValue).toBe('a');
            expect(component.receivedChanges[0]['extra'].currentValue).toBe('b');
        });
    });
});
