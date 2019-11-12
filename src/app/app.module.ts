import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ImportDataComponent } from './import-data/import-data.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainNavComponent } from './main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { TipTableComponent } from './tip-table/tip-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { TipByUserComponent } from './tip-by-user/tip-by-user.component';
import { ChartsModule } from 'ng2-charts';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import {
  MatFormFieldModule,
  MatCheckbox,
  MatCheckboxModule,
  MatRadioModule,
  MatCardModule,
  MatProgressSpinnerModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TipByDateComponent } from './tip-by-date/tip-by-date.component';

registerLocaleData(localeFr, 'fr');

@NgModule({
  declarations: [
    AppComponent,
    ImportDataComponent,
    MainNavComponent,
    TipTableComponent,
    TipByUserComponent,
    TipByDateComponent
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
    ChartsModule,
    MaterialFileInputModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'fr' }],
  bootstrap: [AppComponent]
})
export class AppModule {}
