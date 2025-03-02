import { ApplicationConfig, APP_ID, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { authInterceptor } from './interceptor/auth.interceptor';
import { provideNativeDateAdapter } from '@angular/material/core';

export const appConfig: ApplicationConfig = {
  providers: [ 
    provideHttpClient(withInterceptors([authInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }),
     provideRouter(routes),
     provideAnimations(),
     provideNativeDateAdapter(),
     provideHttpClient(withInterceptorsFromDi()),
     { provide: APP_ID, useValue: 'todo-task' } ]
};
