import { ChangeDetectionStrategy, Component, inject, InjectionToken, input, NgModule } from '@angular/core';
import { SharedModule } from 'voxx-ui/api';
import { BaseComponent, PARENT_INSTANCE } from 'voxx-ui/basecomponent';
import { Bind, BindModule } from 'voxx-ui/bind';
import { InputGroupPassThrough } from 'voxx-ui/types/inputgroup';
import { InputGroupStyle } from './style/inputgroupstyle';

const INPUTGROUP_INSTANCE = new InjectionToken<InputGroup>('INPUTGROUP_INSTANCE');

/**
 * InputGroup displays text, icon, buttons and other content can be grouped next to an input.
 * @group Components
 */
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'vx-inputgroup, vx-inputGroup, vx-input-group',
    imports: [BindModule],
    template: ` <ng-content></ng-content> `,
    providers: [InputGroupStyle, { provide: INPUTGROUP_INSTANCE, useExisting: InputGroup }, { provide: PARENT_INSTANCE, useExisting: InputGroup }],
    hostDirectives: [Bind],
    host: {
        '[class]': "cn(cx('root'), styleClass())"
    }
})
export class InputGroup extends BaseComponent<InputGroupPassThrough> {
    componentName = 'InputGroup';

    _componentStyle = inject(InputGroupStyle);

    $pcInputGroup: InputGroup | undefined = inject(INPUTGROUP_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }

    /**
     * Class of the element.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    styleClass = input<string | undefined>();
}

@NgModule({
    imports: [InputGroup, SharedModule],
    exports: [InputGroup, SharedModule]
})
export class InputGroupModule {}
