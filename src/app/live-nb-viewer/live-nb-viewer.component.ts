import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChartOptions, ChartType, ChartDataset, ScatterDataPoint } from 'chart.js';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { ShowStatisticsService } from '../show-statistics.service';
import { map, flatMap, takeUntil, filter, skip } from 'rxjs/operators';
import { DateTime } from 'luxon';

type DateTimePoint = { t: Date; y: number };
type DateTimePointArray = Array<DateTimePoint>;

@Component({
  selector: 'app-live-nb-viewer',
  templateUrl: './live-nb-viewer.component.html',
  styleUrls: ['./live-nb-viewer.component.scss'],
})
export class LiveNbViewerComponent implements OnInit, OnDestroy {
  public chartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        type: 'time',
      },
      viewer: {
        type: 'linear',
        display: true,
        position: 'left',
      },
      tip: {
        type: 'linear',
        display: true,
        position: 'right',
        /*    gridLines: {
            drawOnChartArea: false // only want the grid lines for one axis to show up
          }*/
      },
    },
    plugins: {
      legend: {
        position: 'right',
      },
      /* colorschemes: {
        scheme: 'brewer.Paired12',
        override: true
      }*/
    },
  };

  public viewerData = new Array<DateTimePoint>();
  public viewerRegistredData = new Array<DateTimePoint>();
  public viewerWithTokenData = new Array<DateTimePoint>();
  public tipLastHoursData = new Array<DateTimePoint>();
  public viewerDataSet: ChartDataset<'line', DateTimePointArray> = {
    label: 'Viewer',
    data: this.viewerData,
    yAxisID: 'viewer',
  };
  public viewerRegistredDataSet: ChartDataset<'line', DateTimePointArray> = {
    label: 'Viewer enregistré',
    data: this.viewerRegistredData,
    yAxisID: 'viewer',
  };

  public viewerWithTokenDataSet: ChartDataset<'line', DateTimePointArray> = {
    label: 'Viewer avec token',
    data: this.viewerWithTokenData,
    yAxisID: 'viewer',
  };

  public tipLastHoursDataSet: ChartDataset<'line', DateTimePointArray> = {
    label: 'Tips last hours',
    data: this.tipLastHoursData,
    yAxisID: 'tip',
  };
  public chartDataSets = [
    this.viewerDataSet,
    this.viewerRegistredDataSet,
    this.viewerWithTokenDataSet,
    this.tipLastHoursDataSet,
  ];

  public chartType: ChartType = 'line';
  public chartLegend = true;

  public graphOptions: UntypedFormGroup;

  public dateLimits: Observable<{ first: Date; last: Date }>;

  private readonly defaultOptions = {
    typeView: '24h',
    dateMin: null as Date,
    dateMax: null as Date,
  };

  private unsubscribe = new Subject<void>();

  constructor(private showStatistics: ShowStatisticsService, formBuilder: UntypedFormBuilder) {
    this.graphOptions = formBuilder.group(this.defaultOptions);
  }

  public ngOnInit() {
    this.dateLimits = this.showStatistics.limits();
    this.updateGraph(this.defaultOptions);
    this.graphOptions.valueChanges
      .pipe(
        takeUntil(this.unsubscribe),
        map((v) =>
          Object.assign({}, v, {
            dateMax: DateTime.fromJSDate(v.dateMax).plus({ day: 1 }).toJSDate(),
          })
        )
      )
      .subscribe((val) => this.updateGraph(val));
    this.showStatistics.currentValue
      .pipe(
        takeUntil(this.unsubscribe),
        skip(1),
        filter((v) => !!v),
        map((stat) => ({
          viewer: { t: stat.date, y: stat.numViewers },
          viewerRegistred: { t: stat.date, y: stat.numRegisteredViewers },
          viewerWithToken: { t: stat.date, y: stat.numTokenedViewers },
          tiplasthours: { t: stat.date, y: stat.tipsInLastHour },
        }))
      )
      .subscribe((d) => {
        this.viewerData.push(d.viewer);
        this.viewerRegistredData.push(d.viewerRegistred);
        this.viewerWithTokenData.push(d.viewerWithToken);
        this.tipLastHoursData.push(d.tiplasthours);
      });
  }

  public ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private updateGraph(val: { typeView: string; dateMin: Date; dateMax: Date }) {
    const firstDate = val.typeView === '24h' ? DateTime.local().plus({ day: -1 }).toJSDate() : val.dateMin;
    const lastDate = val.typeView === '24h' ? new Date() : val.dateMax;

    this.viewerData.length = 0;
    this.viewerRegistredData.length = 0;
    this.viewerWithTokenData.length = 0;
    this.tipLastHoursData.length = 0;

    this.showStatistics
      .interval(firstDate, lastDate)
      .pipe(
        flatMap((list) => list),
        map((stat) => ({
          viewer: { t: stat.date, y: stat.numViewers },
          viewerRegistred: { t: stat.date, y: stat.numRegisteredViewers },
          viewerWithToken: { t: stat.date, y: stat.numTokenedViewers },
          tiplasthours: { t: stat.date, y: stat.tipsInLastHour },
        }))
      )

      .subscribe((d) => {
        this.viewerData.push(d.viewer);
        this.viewerRegistredData.push(d.viewerRegistred);
        this.viewerWithTokenData.push(d.viewerWithToken);
        this.tipLastHoursData.push(d.tiplasthours);
      });
  }
}
