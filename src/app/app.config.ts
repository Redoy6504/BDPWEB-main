import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [ 
    provideZoneChangeDetection({ eventCoalescing: true }),  // Optimizes zone-based change detection
    provideRouter(routes,
      withComponentInputBinding(),  // Enables component input binding in routing
      withHashLocation()  // Enables HashLocationStrategy for hash-based routing
    ),  // Provides the routing configuration
    provideClientHydration(),  // Enables server-side rendering (if applicable)
    provideHttpClient(withFetch()),  // Use fetch API for HTTP requests
    provideAnimations(),  // Required for animations in the app
    provideToastr({
      timeOut: 3000,  // Toast duration
      positionClass: 'toast-bottom-right',  // Position of toast notifications
      preventDuplicates: true,  // Prevent duplicate toasts
    })  // Provides Toastr for showing notifications
    ]
};
