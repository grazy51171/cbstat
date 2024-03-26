import { Component, OnInit } from '@angular/core';
import { ApplicationConfigurationService } from '../application-configuration.service';
import { ShowStatisticsService } from '../show-statistics.service';
import { UntypedFormGroup, UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { IShowStatistic } from '../database/show-statistic';
import { distinctUntilChanged } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  standalone: true,
  selector: 'app-live-stats',
  templateUrl: './live-stats.component.html',
  styleUrls: ['./live-stats.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatCardModule, MatListModule],
})
export class LiveStatsComponent implements OnInit {
  public configurations: UntypedFormGroup;

  public currentStatValue = new Observable<IShowStatistic>();

  private readonly defaultConfig = {
    statUrl: '',
  };

  constructor(
    formBuilder: UntypedFormBuilder,
    private appConfigService: ApplicationConfigurationService,
    showStatisticsService: ShowStatisticsService
  ) {
    this.configurations = formBuilder.group(this.defaultConfig);
    this.currentStatValue = showStatisticsService.currentValue;
    this.appConfigService
      .get()
      .pipe(
        distinctUntilChanged((a, b) => {
          if (!a || !b) {
            return false;
          }
          return a.urlStatistic === b.urlStatistic;
        })
      )
      .subscribe((v) => {
        this.configurations.setValue({
          statUrl: v.urlStatistic,
        });
      });
  }

  public ngOnInit() {
    this.configurations.valueChanges.subscribe((val) => this.updateConfig(val));
  }

  public updateConfig(config: { statUrl: string }) {
    this.appConfigService.save({
      id: 0,
      urlStatistic: config.statUrl,
    });
  }
}
