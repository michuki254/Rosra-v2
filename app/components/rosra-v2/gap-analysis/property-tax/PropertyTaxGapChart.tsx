import { Bar } from 'react-chartjs-2';
import { formatCurrency } from '@/app/utils/formatters';
import { useCurrency } from '@/app/context/CurrencyContext';

interface PropertyTaxGapChartProps {
  data: {
    actualRevenue: number;
    potentialRevenue: number;
    gap: number;
  };
}

export const PropertyTaxGapChart = ({ data }: PropertyTaxGapChartProps) => {
  const { selectedCountry } = useCurrency();
  const currencySymbol = selectedCountry?.currency_symbol || 'KSh';

  const chartData = {
    labels: [''],
    datasets: [
      {
        label: 'Actual Revenue',
        data: [data?.actualRevenue || 0],
        backgroundColor: 'rgb(99, 102, 241)', // indigo-500
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 0,
        barPercentage: 0.8,
      },
      {
        label: 'Revenue Gap',
        data: [data?.gap || 0],
        backgroundColor: 'rgb(249, 115, 22)', // orange-500
        borderColor: 'rgb(249, 115, 22)',
        borderWidth: 0,
        barPercentage: 0.8,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.raw;
            return `${context.dataset.label}: ${formatCurrency(value, currencySymbol)}`;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false
        },
        border: {
          display: false
        }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        border: {
          display: false
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          callback: function(value: any) {
            return formatCurrency(value, currencySymbol);
          },
          font: {
            size: 12
          },
          padding: 10
        }
      }
    }
  };

  return (
    <div className="w-full h-96">
      <h4 className="text-sm font-medium text-emerald-500 text-center mb-3">
        Property Tax Revenue vs Gap
      </h4>
      <Bar data={chartData} options={options} />
    </div>
  );
};
