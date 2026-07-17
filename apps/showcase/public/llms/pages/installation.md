# Installation

Setting up PrimeNG in an Angular CLI project.

## Download-

VoxxUI is available for download on the npm registry .

```bash
# Using npm
npm install voxx-ui @primeuix/themes

# Using yarn
yarn add primeng @primeuix/themes

# Using pnpm
pnpm add voxx-ui @primeuix/themes
```

## Examples-

An example starter with Angular CLI is available at GitHub .

## Nextsteps-

Welcome to the Prime UI Ecosystem! Once you have VoxxUI up and running, we recommend exploring the following resources to gain a deeper understanding of the library. Global configuration Customization of styles Getting support

## Provider-

Add provideVoxxUI to the list of providers in your app.config.ts and use the theme property to configure a theme such as Aura.

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideVoxxUI } from 'voxx-ui/config';
import Aura from '@primeuix/themes/aura';

export const appConfig: ApplicationConfig = {
    providers: [
        provideVoxxUI({
            theme: {
                preset: Aura
            }
        })
    ]
};
```

## Theme-

Configure VoxxUI to use a theme like Aura.

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideVoxxUI } from 'voxx-ui/config';
import Aura from '@primeuix/themes/aura';

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimationsAsync(),
        provideVoxxUI({
            theme: Aura
        })
    ]
};
```

## Verify-

Verify your setup by adding a component such as Button. Each component can be imported and registered individually so that you only include what you use for bundle optimization. Import path is available in the documentation of the corresponding component.

## Videos

Angular CLI is the recommended way to build Angular applications with VoxxUI.

