import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import { UntypedFormGroup, UntypedFormBuilder, ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { StatTokenService } from '../stat-token.service';
import { BaseChartDirective } from 'ng2-charts';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-tip-by-weekday',
  templateUrl: './tip-by-weekday.component.html',
  styleUrls: ['./tip-by-weekday.component.scss'],
  imports: [BaseChartDirective, MatCardModule, MatDividerModule, MatRadioModule, ReactiveFormsModule],
})
export class TipByWeekdayComponent implements OnInit {
  public chartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };
  public chartLabels = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  public chartDataSets: ChartDataset[] = [
    {
      label: '',
      stack: '',
      data: [],
    },
  ];
  public chartType: ChartType = 'bar';
  public chartLegend = true;

  public graphOptions = new FormGroup({
    typeUser: new FormControl('tipper'),
    chartType: new FormControl('bar' as ChartType),
  });

  constructor(private statToken: StatTokenService) {}

  ngOnInit() {
    this.updateGraph(this.graphOptions.value);
    this.graphOptions.valueChanges.subscribe((val) => this.updateGraph(val));
  }

  private updateGraph(val: { chartType?: ChartType; typeUser?: string }) {
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
          }),
        };
      });
    });
  }
}
