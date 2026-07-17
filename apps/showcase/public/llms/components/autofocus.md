# Angular AutoFocus Directive

AutoFocus manages focus on focusable element on load.

## Basic

AutoFocus is applied to any focusable input element with the vxAutoFocus directive.

```typescript
import { Component } from '@angular/core';

@Component({
    template: `
        <div class="card flex justify-center">
            <input type="text" vxInputText [vxAutoFocus]="true" placeholder="Automatically focused" />
        </div>
    `,
    standalone: true,
    imports: []
})
export class AutofocusBasicDemo {}
```

## Auto Focus

AutoFocus manages focus on focusable element on load.

### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| autofocus | boolean | false | When present, it specifies that the component should automatically get focus on load. |
| dt | InputSignal<Object> | undefined | Defines scoped design tokens of the component. |
| unstyled | InputSignal<boolean> | undefined | Indicates whether the component should be rendered without styles. |
| pt | InputSignal<any> | undefined | Used to pass attributes to DOM elements inside the component. |
| ptOptions | InputSignal<PassThroughOptions> | undefined | Used to configure passthrough(pt) options of the component. |

