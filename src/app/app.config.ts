import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpInterceptor_ } from './interceptor/http.interceptor';
import { API_CONFIG } from './config/api.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([])
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptor_,
      multi: true
    },
    {
      provide: 'API_CONFIG',
      useValue: API_CONFIG
    },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)
  ]
};
