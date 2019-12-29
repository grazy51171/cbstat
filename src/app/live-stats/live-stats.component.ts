import { Component, OnInit } from '@angular/core';
import { ApplicationConfigurationService } from '../application-configuration.service';
import { ShowStatisticsService } from '../show-statistics.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { IShowStatistic } from '../database/show-statistic';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-live-stats',
  templateUrl: './live-stats.component.html',
  styleUrls: ['./live-stats.component.scss']
})
export class LiveStatsComponent implements OnInit {
  public configurations: FormGroup;

  public currentStatValue = new Observable<IShowStatistic>();

  private readonly defaultConfig = {
    statUrl: ''
  };

  constructor(
    formBuilder: FormBuilder,
    private appConfigService: ApplicationConfigurationService,
    showStatisticsService: ShowStatisticsService
  ) {
    this.configurations = formBuilder.group(this.defaultConfig);
    this.currentStatValue = showStatisticsService.currentValue;
    this.appConfigService
      .get()
      .pipe(first())
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
