import { Bar } from 'react-chartjs-2';
import { GapBreakdown } from '@/app/types/propertyTax';
import { formatCurrency } from '@/app/utils/formatters';
import { useCurrency } from '@/app/context/CurrencyContext';

interface GapBreakdownChartProps {
  gapBreakdown: GapBreakdown;
  currencySymbol: string;
}

export const GapBreakdownChart = ({ gapBreakdown, currencySymbol }: GapBreakdownChartProps) => {
  const chartData = {
    labels: [''],
    datasets: [
      {
        label: 'Registration Gap',
        data: [gapBreakdown?.registrationGap || 0],
        backgroundColor: 'rgb(99, 102, 241)', // indigo-500
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 0,
        barPercentage: 0.8,
      },
      {
        label: 'Compliance Gap',
        data: [gapBreakdown?.complianceGap || 0],
        backgroundColor: 'rgb(249, 115, 22)', // orange-500
        borderColor: 'rgb(249, 115, 22)',
        borderWidth: 0,
        barPercentage: 0.8,
      },
      {
        label: 'Assessment Gap',
        data: [gapBreakdown?.assessmentGap || 0],
        backgroundColor: 'rgb(16, 185, 129)', // emerald-500
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 0,
        barPercentage: 0.8,
      },
      {
        label: 'Combined Gaps',
        data: [gapBreakdown?.combinedGaps || 0],
        backgroundColor: 'rgb(234, 179, 8)', // yellow-500
        borderColor: 'rgb(234, 179, 8)',
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
      <Bar data={chartData} options={options} />
    </div>
  );
};