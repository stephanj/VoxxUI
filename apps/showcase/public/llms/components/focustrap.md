# Angular Focus Trap Component

Focus Trap keeps focus within a certain DOM element while tabbing.

## Basic

FocusTrap is applied to a container element with the pFocusTrap directive.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'voxx-ui/button';
import { CheckboxModule } from 'voxx-ui/checkbox';
import { IconFieldModule } from 'voxx-ui/iconfield';
import { InputIconModule } from 'voxx-ui/inputicon';
import { InputTextModule } from 'voxx-ui/inputtext';

@Component({
    template: `
        <div class="card flex justify-center">
            <div pFocusTrap class="w-full sm:w-80 flex flex-col gap-6">
                <vx-iconfield>
                    <vx-inputicon>
                        <i class="pi pi-user"></i>
                    </vx-inputicon>
                    <input type="text" pInputText id="input" [(ngModel)]="name" type="text" placeholder="Name" [pAutoFocus]="true" [fluid]="true" />
                </vx-iconfield>
                <vx-iconfield>
                    <vx-inputicon>
                        <i class="pi pi-envelope"> </i>
                    </vx-inputicon>
                    <input type="text" pInputText id="email" [(ngModel)]="email" type="email" placeholder="Email" [fluid]="true" />
                </vx-iconfield>
                <div class="flex items-center gap-2">
                    <vx-checkbox id="accept" [(ngModel)]="accept" name="accept" value="Accept" />
                    <label for="accept">I agree to the terms and conditions.</label>
                </div>
                <vx-button type="submit" label="Submit" class="mt-2" styleClass="w-full" />
            </div>
        </div>
    `,
    standalone: true,
    imports: [ButtonModule, CheckboxModule, IconFieldModule, InputIconModule, InputTextModule, FormsModule]
})
export class FocustrapBasicDemo {
    name: string = '';
    email: string = '';
    accept: boolean = false;
}
```

## Focus Trap

Focus Trap keeps focus within a certain DOM element while tabbing.

### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| dt | InputSignal<Object> | undefined | Defines scoped design tokens of the component. |
| unstyled | InputSignal<boolean> | undefined | Indicates whether the component should be rendered without styles. |
| pt | InputSignal<any> | undefined | Used to pass attributes to DOM elements inside the component. |
| ptOptions | InputSignal<PassThroughOptions> | undefined | Used to configure passthrough(pt) options of the component. |
| pFocusTrapDisabled | boolean | false | When set as true, focus wouldn't be managed. |

