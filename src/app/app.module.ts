import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ImportDataComponent } from './import-data/import-data.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainNavComponent } from './main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { TipTableComponent } from './tip-table/tip-table.component';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatSortModule } from '@angular/material/sort';
import { TipByUserComponent } from './tip-by-user/tip-by-user.component';
import { ChartsModule } from 'ng2-charts';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyCheckbox as MatCheckbox, MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { ReactiveFormsModule } from '@angular/forms';
import { TipByDateComponent } from './tip-by-date/tip-by-date.component';
import { TipByWeekdayComponent } from './tip-by-weekday/tip-by-weekday.component';
import { TipBySizeComponent } from './tip-by-size/tip-by-size.component';
import { LiveStatsComponent } from './live-stats/live-stats.component';
import { HttpClientModule } from '@angular/common/http';
import { LiveNbViewerComponent } from './live-nb-viewer/live-nb-viewer.component';
import { LiveNbFollowersComponent } from './live-nb-followers/live-nb-followers.component';
import { AboutComponent } from './about/about.component';

registerLocaleData(localeFr, 'fr');

@NgModule({
  declarations: [
    AppComponent,
    ImportDataComponent,
    MainNavComponent,
    TipTableComponent,
    TipByUserComponent,
    TipByDateComponent,
    TipByWeekdayComponent,
    TipBySizeComponent,
    LiveStatsComponent,
    LiveNbViewerComponent,
    LiveNbFollowersComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatExpansionModule,
    HttpClientModule,
    ChartsModule,
    MaterialFileInputModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'fr' }],
  bootstrap: [AppComponent]
})
export class AppModule {}
