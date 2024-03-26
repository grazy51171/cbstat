import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import { UntypedFormGroup, UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DateTime } from 'luxon';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { StatTokenService } from '../stat-token.service';
import { BaseChartDirective } from 'ng2-charts';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

@Component({
  standalone: true,
  selector: 'app-tip-by-date',
  templateUrl: './tip-by-date.component.html',
  styleUrls: ['./tip-by-date.component.scss'],
  imports: [
    CommonModule,
    BaseChartDirective,
    MatCardModule,
    MatDividerModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
  ],
})
export class TipByDateComponent implements OnInit {
  public chartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
    },
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };
  public chartLabels = [];
  public chartDataSets: ChartDataset[] = [
    {
      label: '',
      stack: '',
      data: [],
    },
  ];
  public chartType: ChartType = 'bar';
  public chartLegend = true;

  public graphOptions: UntypedFormGroup;

  public dateLimits: Observable<{ first: Date; last: Date }>;

  private readonly defaultOptions = {
    typeUser: 'tipper',
    chartType: 'bar' as ChartType,
    dateMin: null as DateTime,
    dateMax: null as DateTime,
  };
  constructor(private statToken: StatTokenService, private formBuilder: UntypedFormBuilder) {
    this.graphOptions = formBuilder.group(this.defaultOptions);
  }

  ngOnInit() {
    this.dateLimits = from(this.statToken.limits());
    this.updateGraph(this.defaultOptions);
    this.graphOptions.valueChanges
      .pipe(
        map((v) =>
          Object.assign({}, v, {
            dateMax: DateTime.fromJSDate(v.dateMax).plus({ day: 1 }).toJSDate(),
          })
        )
      )
      .subscribe((val) => this.updateGraph(val));
  }

  private updateGraph(val: { chartType: ChartType; typeUser: string; dateMin: DateTime; dateMax: DateTime }) {
    this.chartType = val.chartType;
    this.statToken.sumByDay(val.typeUser !== 'tipper', val.dateMin, val.dateMax).then((tipByDate) => {
      const dateList = Array.from(tipByDate.keys());

      const listUser = Array.from(
        dateList
          .reduce((prev, cur) => {
            const tipsDay = tipByDate.get(cur);
            Array.from(tipsDay.keys()).forEach((name) => prev.add(name));
            return prev;
          }, new Set<string>())
          .keys()
      );
      this.chartDataSets = listUser.map((u) => {
        return {
          label: u,
          data: dateList.map((d) => {
            const tipDate = tipByDate.get(d);
            return tipDate.has(u) ? tipDate.get(u) : 0;
          }),
        };
      });
      this.chartLabels = dateList.map((d) => DateTime.fromISO(d).toLocaleString());
    });
  }
}
