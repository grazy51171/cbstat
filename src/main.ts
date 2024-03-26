import { LOCALE_ID, enableProdMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter';
import { provideHttpClient } from '@angular/common/http';
import 'chartjs-adapter-luxon';

import routeConfig from './app/app-routing.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

registerLocaleData(localeFr, 'fr');

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideRouter(routeConfig),
    { provide: LOCALE_ID, useValue: 'fr' },
    provideCharts(withDefaultRegisterables()),
    provideLuxonDateAdapter(),
    provideHttpClient(),
  ],
}).catch((err) => console.error(err));
