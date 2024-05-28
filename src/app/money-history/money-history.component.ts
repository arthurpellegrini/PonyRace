// money-history.component.ts
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';

@Component({
  selector: 'app-money-history',
  templateUrl: './money-history.component.html',
  styleUrls: ['./money-history.component.css']
})
export class MoneyHistoryComponent implements OnInit, AfterViewInit {
  moneyHistory: { instant: string, money: number }[] = [];
  public chart: any;

  constructor(private apiService: ApiService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.apiService.listMoneyHistory().subscribe(data => {
      this.moneyHistory = data;
      this.renderChart();
    });
  }

  ngAfterViewInit(): void {
    this.renderChart();
  }

  renderChart(): void {
    if (!this.moneyHistory.length) { return; }

    const chartElement = document.getElementById('MoneyChart') as HTMLCanvasElement;

    if (chartElement) {
      this.chart = new Chart(chartElement, {
        type: 'line',
        data: {
          labels: this.moneyHistory.map(entry => {
            const date = new Date(entry.instant);
            return isNaN(date.getTime()) ? entry.instant : date;
          }),
          datasets: [ { data: this.moneyHistory.map(entry => entry.money), fill: true } ]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              type: 'time',
              time: { unit: 'hour'},
              title: { display: true, text: 'Date' },
              ticks: { maxRotation: 0, maxTicksLimit: 25 },
              grid: { display: true, drawOnChartArea: true }
            },
            y: {
              beginAtZero: false,
              title: { display: true, text: 'Money Amount' },
              grid: { display: true, drawOnChartArea: true }
            }
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function(context) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  label += new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(Number(context.raw));
                  return label;
                }
              }
            }
          }
        }
      });
    } else {
      console.error('Cannot find canvas element with id MoneyChart');
    }
  }
}
