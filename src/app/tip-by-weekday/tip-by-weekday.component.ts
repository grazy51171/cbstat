import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { FormGroup, FormBuilder } from '@angular/forms';
import { StatTokenService } from '../stat-token.service';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-tip-by-weekday',
  templateUrl: './tip-by-weekday.component.html',
  styleUrls: ['./tip-by-weekday.component.scss']
})
export class TipByWeekdayComponent implements OnInit {
  public chartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'right'
    },
    scales: {
      xAxes: [
        {
          stacked: true
        }
      ],
      yAxes: [
        {
          stacked: true
        }
      ]
    },
    plugins: {
      colorschemes: {
        scheme: 'brewer.Paired12',
        override: true
      }
    }
  };
  public chartLabels: Label[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  public chartDataSets: ChartDataSets[] = [
    {
      label: '',
      stack: '',
      data: []
    }
  ];
  public chartType: ChartType = 'bar';
  public chartLegend = true;

  public graphOptions: FormGroup;

  private readonly defaultOptions = {
    typeUser: 'tipper',
    chartType: 'bar' as ChartType
  };
  constructor(private statToken: StatTokenService, formBuilder: FormBuilder) {
    this.graphOptions = formBuilder.group(this.defaultOptions);
  }

  ngOnInit() {
    this.updateGraph(this.defaultOptions);
    this.graphOptions.valueChanges.subscribe((val) => this.updateGraph(val));
  }

  private updateGraph(val: { chartType: ChartType; typeUser: string }) {
    this.chartType = val.chartType;
    this.statToken.sumByDayOfWeek(val.typeUser !== 'tipper').then((tipByDate) => {
      const dateList = [1, 2, 3, 4, 5, 6, 7];

      const listUser = Array.from(
        dateList
          .reduce((prev, cur) => {
            if (tipByDate.has(cur)) {
              const tipsDay = tipByDate.get(cur);
              Array.from(tipsDay.keys()).forEach((name) => prev.add(name));
            }
            return prev;
          }, new Set<string>())
          .keys()
      );
      this.chartDataSets = listUser.map((u) => {
        return {
          label: u,
          data: dateList.map((d) => {
            if (tipByDate.has(d)) {
              const tipDate = tipByDate.get(d);
              return tipDate.has(u) ? tipDate.get(u) : 0;
            }
            return 0;
          })
        };
      });
    });
  }
}
