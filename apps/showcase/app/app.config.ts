import { routes } from '@/router/app.routes';
import { DemoCodeService } from '@/service/democodeservice';
import { DesignerService } from '@/service/designerservice';
import Noir from '@/themes/app-theme';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { ConfirmationService, MessageService } from 'voxx-ui/api';
import { provideVoxxUI } from 'voxx-ui/config';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZonelessChangeDetection(),
        provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })), // withEnabledBlockingInitialNavigation()
        provideHttpClient(withFetch()),
        provideVoxxUI({
            theme: Noir,
            ripple: false
        }),
        MessageService,
        DesignerService,
        ConfirmationService,
        provideAppInitializer(() => inject(DemoCodeService).loadDemos())
    ]
};
