# Angular InputGroup Component

Text, icon, buttons and other content can be grouped next to an input.

## Accessibility

Screen Reader InputGroup and InputGroupAddon does not require any roles and attributes. Keyboard Support Component does not include any interactive elements.

## Basic

A group is created by wrapping the input and add-ons with the p-inputgroup component. Each add-on element is defined as a child of p-inputgroup-addon component.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface City {
    name: string;
    code: string;
}

@Component({
    template: `
        <div class="card grid grid-cols-1 md:grid-cols-2 gap-4">
            <vx-inputgroup>
                <vx-inputgroup-addon>
                    <i class="pi pi-user"></i>
                </vx-inputgroup-addon>
                <input vxInputText [(ngModel)]="text1" placeholder="Username" />
            </vx-inputgroup>
            <vx-inputgroup>
                <vx-inputgroup-addon>$</vx-inputgroup-addon>
                <vx-inputnumber [(ngModel)]="number" placeholder="Price" />
                <vx-inputgroup-addon>.00</vx-inputgroup-addon>
            </vx-inputgroup>
            <vx-inputgroup>
                <vx-inputgroup-addon>www</vx-inputgroup-addon>
                <input vxInputText [(ngModel)]="text2" placeholder="Website" />
            </vx-inputgroup>
            <vx-inputgroup>
                <vx-inputgroup-addon>
                    <i class="pi pi-map"></i>
                </vx-inputgroup-addon>
                <vx-select [(ngModel)]="selectedCity" [options]="cities" optionLabel="name" placeholder="City" />
            </vx-inputgroup>
        </div>
    `,
    standalone: true,
    imports: [FormsModule]
})
export class InputgroupBasicDemo {
    text1: string | undefined;
    text2: string | undefined;
    number: string | undefined;
    selectedCity: City | undefined;
    cities: City[];
}
```

## Button

Buttons can be placed at either side of an input element.

```typescript
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'voxx-ui/api';

@Component({
    template: `
        <div class="card flex flex-col md:flex-row gap-4">
            <vx-inputgroup>
                <vx-button label="Search" />
                <input vxInputText placeholder="Keyword" />
            </vx-inputgroup>
            <vx-inputgroup>
                <input vxInputText placeholder="Keyword" />
                <vx-inputgroup-addon>
                    <vx-button icon="pi pi-search" severity="secondary" variant="text" (click)="menu.toggle($event)" />
                </vx-inputgroup-addon>
            </vx-inputgroup>
            <vx-menu #menu [model]="items" popup styleClass="!min-w-fit" />
            <vx-inputgroup>
                <vx-inputgroup-addon>
                    <vx-button icon="pi pi-check" severity="secondary" />
                </vx-inputgroup-addon>
                <input vxInputText placeholder="Vote" />
                <vx-inputgroup-addon>
                    <vx-button icon="pi pi-times" severity="secondary" />
                </vx-inputgroup-addon>
            </vx-inputgroup>
        </div>
    `,
    standalone: true,
    imports: []
})
export class InputgroupButtonDemo implements OnInit {
    items: MenuItem[] | undefined;

    ngOnInit() {
        this.items = [{ label: 'Web Search' }, { label: 'AI Assistant' }, { label: 'History' }];
    }
}
```

## Checkbox & Radio

Checkbox and RadioButton components can be combined with an input element under the same group.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    template: `
        <div class="card flex flex-col md:flex-row gap-4">
            <vx-inputgroup>
                <input type="text" vxInputText placeholder="Price" />
                <vx-inputgroup-addon><vx-radiobutton [(ngModel)]="radioValue1" name="rb1" value="rb1" /></vx-inputgroup-addon>
            </vx-inputgroup>
            <vx-inputgroup>
                <vx-inputgroup-addon><vx-checkbox [(ngModel)]="checked1" [binary]="true" /></vx-inputgroup-addon>
                <input type="text" vxInputText placeholder="Username" />
            </vx-inputgroup>
            <vx-inputgroup>
                <vx-inputgroup-addon><vx-checkbox [(ngModel)]="checked2" [binary]="true" /></vx-inputgroup-addon>
                <input type="text" vxInputText placeholder="Website" />
                <vx-inputgroup-addon><vx-radiobutton name="rb2" value="rb2" [(ngModel)]="category" /></vx-inputgroup-addon>
            </vx-inputgroup>
        </div>
    `,
    standalone: true,
    imports: [FormsModule]
})
export class InputgroupCheckboxDemo {
    radioValue1: boolean = false;
    checked1: boolean = false;
    checked2: boolean = false;
    category: string | undefined;
}
```

## Float Label

FloatLabel visually integrates a label with its form element. Visit FloatLabel documentation for more information.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    template: `
        <div class="card flex flex-col md:items-end md:flex-row gap-4">
            <vx-inputgroup>
                <vx-inputgroup-addon>
                    <i class="pi pi-user"></i>
                </vx-inputgroup-addon>
                <vx-floatlabel>
                    <input vxInputText id="over_label" [(ngModel)]="value1" />
                    <label for="over_label">Over Label</label>
                </vx-floatlabel>
            </vx-inputgroup>
            <vx-inputgroup>
                <vx-inputgroup-addon>$</vx-inputgroup-addon>
                <vx-floatlabel variant="in">
                    <input vxInputText id="in_label" [(ngModel)]="value2" />
                    <label for="in_label">In Label</label>
                </vx-floatlabel>
                <vx-inputgroup-addon>.00</vx-inputgroup-addon>
            </vx-inputgroup>
            <vx-inputgroup>
                <vx-inputgroup-addon>www</vx-inputgroup-addon>
                <vx-floatlabel variant="on">
                    <input vxInputText id="on_label" [(ngModel)]="value3" />
                    <label for="on_label">On Label</label>
                </vx-floatlabel>
            </vx-inputgroup>
        </div>
    `,
    standalone: true,
    imports: [FormsModule]
})
export class InputgroupFloatlabelDemo {
    value1: string | undefined;
    value2: string | undefined;
    value3: string | undefined;
}
```

## Multiple

Multiple add-ons can be placed inside the same group.

```typescript
import { Component } from '@angular/core';

@Component({
    template: `
        <div class="card flex justify-center">
            <vx-inputgroup class="w-full md:!w-[30rem]">
                <vx-inputgroup-addon>
                    <i class="pi pi-clock"></i>
                </vx-inputgroup-addon>
                <vx-inputgroup-addon>
                    <i class="pi pi-star-fill"></i>
                </vx-inputgroup-addon>
                <input type="text" vxInputText placeholder="Price" />
                <vx-inputgroup-addon>$</vx-inputgroup-addon>
                <vx-inputgroup-addon>.00</vx-inputgroup-addon>
            </vx-inputgroup>
        </div>
    `,
    standalone: true,
    imports: []
})
export class InputgroupMultipleDemo {}
```

## Input Group

InputGroup displays text, icon, buttons and other content can be grouped next to an input.

### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| dt | InputSignal<Object> | undefined | Defines scoped design tokens of the component. |
| unstyled | InputSignal<boolean> | undefined | Indicates whether the component should be rendered without styles. |
| pt | InputSignal<InputGroupPassThrough> | undefined | Used to pass attributes to DOM elements inside the component. |
| ptOptions | InputSignal<PassThroughOptions> | undefined | Used to configure passthrough(pt) options of the component. |
| styleClass | string | - | Class of the element. **(Deprecated)** |

## Pass Through Options

| Name | Type | Description |
|------|------|-------------|
| host | PassThroughOption<HTMLElement, I> | Used to pass attributes to the host's DOM element. |
| root | PassThroughOption<HTMLElement, I> | Used to pass attributes to the root's DOM element. |

## Theming

### CSS Classes

| Class | Description |
|-------|-------------|
| p-inputgroup | Class name of the root element |

### Design Tokens

| Token | CSS Variable | Description |
|-------|--------------|-------------|
| inputgroup.addon.background | --p-inputgroup-addon-background | Background of addon |
| inputgroup.addon.border.color | --p-inputgroup-addon-border-color | Border color of addon |
| inputgroup.addon.color | --p-inputgroup-addon-color | Color of addon |
| inputgroup.addon.border.radius | --p-inputgroup-addon-border-radius | Border radius of addon |
| inputgroup.addon.padding | --p-inputgroup-addon-padding | Padding of addon |
| inputgroup.addon.min.width | --p-inputgroup-addon-min-width | Min width of addon |

