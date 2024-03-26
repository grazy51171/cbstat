import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { DateTime } from 'luxon';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseChartDirective } from 'ng2-charts';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

import { StatTokenService } from '../stat-token.service';

@Component({
  standalone: true,
  selector: 'app-tip-by-size',
  templateUrl: './tip-by-size.component.html',
  styleUrls: ['./tip-by-size.component.scss'],
  imports: [
    CommonModule,
    BaseChartDirective,
    MatCardModule,
    MatDividerModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
  ],
})
export class TipBySizeComponent implements OnInit {
  public maxSum = 1000;
  public chartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        offset: true,
        ticks: {
          callback: (value, index, values) => {
            return this.chartLabels[index] as string;
          },
        },
      },
    },

    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            if (label) {
              return label + ' Nb ' + context.parsed.y || '';
            } else {
              return '';
            }
          },
        },
      },
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
  public chartType: ChartType = 'bubble';
  public chartLegend = true;

  public dateLimits: Observable<{ first: Date; last: Date }>;

  public graphOptions = new FormGroup({
    typeUser: new FormControl('tipper'),
    chartType: new FormControl('bubble' as ChartType),
    dateMin: new FormControl(null as DateTime),
    dateMax: new FormControl(null as DateTime),
  });

  constructor(private statToken: StatTokenService) {}

  ngOnInit() {
    this.dateLimits = from(this.statToken.limits());
    this.updateGraph(this.graphOptions.value);
    this.graphOptions.valueChanges
      .pipe(
        map((v) =>
          Object.assign({}, v, {
            dateMax: v?.dateMax?.plus({ day: 1 }),
          })
        )
      )
      .subscribe((val) => this.updateGraph(val));
  }

  private updateGraph(val: Partial<{ chartType: ChartType; typeUser: string; dateMin: DateTime; dateMax: DateTime }>) {
    const sizes = [1, 10, 20, 50, 100, 200, 500, 1000, 1000000];
    this.chartType = val.chartType;
    this.statToken.tipBySize(val.typeUser !== 'tipper', val.dateMin, val.dateMax, sizes).then((tipBySize) => {
      const sizeList = Array.from(tipBySize.keys()).sort((a, b) => a - b);

      const maxSum = Array.from(tipBySize.values())
        .map((v) => v.sum)
        .reduce((a, b) => (a > b ? a : b));

      const maxNb = Array.from(tipBySize.values())
        .map((v) => v.number)
        .reduce((a, b) => (a > b ? a : b));
      this.chartLabels = sizeList.map((v) => `moins de ${v} tk`);

      this.chartDataSets = sizeList.map((u, index) => {
        const s = tipBySize.get(u);
        return {
          label: `<= ${u} tk, total ${s.sum} tk`,

          data: [
            {
              x: index,
              y: s.number,
              r: 2 + (60 * s.sum) / maxSum,
            },
          ],
        };
      });
    });
  }
}
