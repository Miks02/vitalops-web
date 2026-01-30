import { Component, computed, Input, signal, Signal } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import {
    ChartConfiguration,
    ChartOptions,
    Chart, registerables
} from 'chart.js';
import { WeightChartDto } from '../../weight/models/WeightChartDto';

Chart.register(...registerables);

@Component({
    selector: 'app-weight-chart',
    imports: [BaseChartDirective],
    templateUrl: './weight-chart.html',
    styleUrl: './weight-chart.css',
})
export class WeightChart {
    public chartType: 'line' = 'line';

    @Input()
    weightDataSource: Signal<WeightChartDto | null> = signal(null);

    public chartData = computed<ChartConfiguration<'line'>['data']>(() => {
        const data = this.weightDataSource();

        if (!data || !data.entries || data.entries.length === 0) {
            return {
                labels: [],
                datasets: []
            };
        }

        const sortedEntries = [...data.entries].sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        const labels = sortedEntries.map(entry => {
            const date = new Date(entry.createdAt);
            return date.toLocaleDateString('sr-RS', { day: '2-digit', month: 'short', year: '2-digit' });
        });

        const weights = sortedEntries.map(entry => entry.weight);

        const datasets: ChartConfiguration<'line'>['data']['datasets'] = [
            {
                label: 'Weight (kg)',
                data: weights,
                borderColor: 'rgba(139, 92, 246, 1)',
                backgroundColor: 'rgba(139, 92, 246, 0.2)',
                fill: true,
                tension: 0.35,
                pointRadius: 3,
                pointHoverRadius: 5
            }
        ];

        datasets.push({
            label: 'Target Weight (kg)',
            data: Array(weights.length).fill(data.targetWeight),
            borderColor: 'rgba(34, 197, 94, 1)',
            backgroundColor: 'transparent',
            borderDash: [5, 5],
            fill: false,
            tension: 0,
            pointRadius: 0,
            pointHoverRadius: 0
        });


        return {
            labels,
            datasets
        };
    });

    public chartOptions = computed<ChartOptions<'line'>>(() => {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                },
                tooltip: {
                    enabled: true
                }
            },
            scales: {
                x: {
                    ticks: {
                        display: true,
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: false,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        };
    });
}
