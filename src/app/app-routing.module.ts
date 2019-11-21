import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImportDataComponent } from './import-data/import-data.component';
import { TipByUserComponent } from './tip-by-user/tip-by-user.component';
import { TipByDateComponent } from './tip-by-date/tip-by-date.component';
import { TipByWeekdayComponent } from './tip-by-weekday/tip-by-weekday.component';
import { TipBySizeComponent } from './tip-by-size/tip-by-size.component';

const routes: Routes = [
  { path: 'import', component: ImportDataComponent },
  { path: 'byuser', component: TipByUserComponent },
  { path: 'bydate', component: TipByDateComponent },
  { path: 'byweekday', component: TipByWeekdayComponent },
  { path: 'bytipsize', component: TipBySizeComponent },
  { path: '**', redirectTo: 'import' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
