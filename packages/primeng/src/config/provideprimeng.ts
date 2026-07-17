import { EnvironmentProviders, inject, InjectionToken, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';
import { VoxxUI } from './primeng';
import type { VoxxUIConfigType } from './primeng.types';

export const VOXX_UI_CONFIG = new InjectionToken<VoxxUIConfigType>('VOXX_UI_CONFIG');

export function provideVoxxUI(...features: VoxxUIConfigType[]): EnvironmentProviders {
    const providers = features?.map((feature) => ({
        provide: VOXX_UI_CONFIG,
        useValue: feature,
        multi: false
    }));

    const initializer = provideAppInitializer(() => {
        const VoxxUIConfig = inject(VoxxUI);
        features?.forEach((feature) => VoxxUIConfig.setConfig(feature));
        return;
    });

    return makeEnvironmentProviders([...providers, initializer]);
}
