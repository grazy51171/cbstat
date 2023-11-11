import { Component, OnInit } from '@angular/core';
import { ApplicationConfigurationService } from '../application-configuration.service';
import { ShowStatisticsService } from '../show-statistics.service';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { IShowStatistic } from '../database/show-statistic';
import { first, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-live-stats',
  templateUrl: './live-stats.component.html',
  styleUrls: ['./live-stats.component.scss']
})
export class LiveStatsComponent implements OnInit {
  public configurations: UntypedFormGroup;

  public currentStatValue = new Observable<IShowStatistic>();

  private readonly defaultConfig = {
    statUrl: ''
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
          statUrl: v.urlStatistic
        });
      });
  }

  public ngOnInit() {
    this.configurations.valueChanges.subscribe((val) => this.updateConfig(val));
  }

  public updateConfig(config: { statUrl: string }) {
    this.appConfigService.save({
      id: 0,
      urlStatistic: config.statUrl
    });
  }
}
