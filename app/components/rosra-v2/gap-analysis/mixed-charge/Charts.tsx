import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useMixedCharge } from '@/app/context/MixedChargeContext';
import { MixedChargeAnalysisService } from '@/app/services/mixed-charge-analysis.service';
import { useCurrency } from '@/app/context/CurrencyContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function MixedRevenueAnalysisChart() {
  const { data, chartOptions } = useMixedCharge();
  const { selectedCountry } = useCurrency();
  const currencySymbol = selectedCountry?.currency_symbol || '$';
  
  const chartData = MixedChargeAnalysisService.getChartData(data);

  const options = {
    ...chartOptions,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            size: 12
          },
          padding: 15
        }
      },
      title: {
        display: true,
        text: 'Revenue Analysis',
        font: {
          size: 14,
          weight: '500'
        },
        padding: {
          bottom: 15
        }
      },
      tooltip: {
        titleFont: { size: 12 },
        bodyFont: { size: 12 },
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += currencySymbol + context.parsed.y.toLocaleString();
            }
            return label;
          }
        }
      }
    },
    scales: {
      ...chartOptions.scales,
      y: {
        ...chartOptions.scales.y,
        ticks: {
          font: { size: 12 },
          callback: function(value: any) {
            return currencySymbol + value.toLocaleString();
          }
        }
      },
      x: {
        ...chartOptions.scales.x,
        ticks: {
          font: { size: 12 }
        }
      }
    }
  };

  return (
    <div className="h-[400px] w-full">
      <Bar data={chartData} options={options} />
    </div>
  );
}

export function MixedGapAnalysisChart() {
  const { data, chartOptions } = useMixedCharge();
  const { selectedCountry } = useCurrency();
  const currencySymbol = selectedCountry?.currency_symbol || '$';
  
  const chartData = MixedChargeAnalysisService.getGapChartData(data);

  const options = {
    ...chartOptions,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            size: 12
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      title: {
        display: true,
        text: 'Gap Analysis',
        font: {
          size: 14,
          weight: '500'
        },
        padding: {
          bottom: 15
        }
      },
      tooltip: {
        titleFont: { size: 12 },
        bodyFont: { size: 12 },
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += currencySymbol + context.parsed.y.toLocaleString();
            }
            return label;
          }
        }
      }
    },
    scales: {
      ...chartOptions.scales,
      y: {
        ...chartOptions.scales.y,
        ticks: {
          font: { size: 12 },
          callback: function(value: any) {
            return currencySymbol + value.toLocaleString();
          }
        }
      },
      x: {
        ...chartOptions.scales.x,
        ticks: {
          font: { size: 12 }
        }
      }
    }
  };

  return (
    <div className="h-[400px] w-full">
      <Bar data={chartData} options={options} />
    </div>
  );
}
