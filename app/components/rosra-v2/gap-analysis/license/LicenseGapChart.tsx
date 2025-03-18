'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useCurrency } from '@/app/context/CurrencyContext';
import { formatCurrency } from '@/app/utils/formatters';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface LicenseGapChartProps {
  actual: number;
  gap: number;
}

export const LicenseGapChart = ({ actual, gap }: LicenseGapChartProps) => {
  const { selectedCountry } = useCurrency();
  const currencySymbol = selectedCountry?.currency_symbol || 'L';

  // Add more detailed debug logging
  console.log('LicenseGapChart rendering with:', { 
    actual, 
    gap, 
    currencySymbol,
    actualType: typeof actual,
    gapType: typeof gap,
    isActualValid: !isNaN(actual) && actual !== null && actual !== undefined,
    isGapValid: !isNaN(gap) && gap !== null && gap !== undefined
  });

  // Ensure values are valid numbers
  const safeActual = typeof actual === 'number' && !isNaN(actual) ? actual : 0;
  const safeGap = typeof gap === 'number' && !isNaN(gap) ? gap : 0;

  const chartData = {
    labels: [''],
    datasets: [
      {
        label: 'Actual Revenue',
        data: [safeActual],
        backgroundColor: '#4F46E5',
        borderColor: '#4F46E5',
        borderWidth: 0,
        barPercentage: 0.8,
      },
      {
        label: 'Total Gap',
        data: [safeGap],
        backgroundColor: '#F97316',
        borderColor: '#F97316',
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
        display: true,
        color: '#4F46E5',
        font: {
          size: 16
        },
        padding: {
          bottom: 30
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${formatCurrency(context.raw, currencySymbol)}`;
          }
        }
      }
    },
    scales: {
      x: {
        display: false,
        grid: {
          display: false
        },
        stacked: true
      },
      y: {
        grid: {
          color: '#f3f4f6'
        },
        ticks: {
          callback: function(value: any) {
            return formatCurrency(value, currencySymbol);
          },
          font: {
            size: 12
          }
        },
        stacked: true,
        beginAtZero: true
      }
    }
  };

  return (
    <div>
      <h4 className="text-sm font-medium text-blue-500 text-center mb-3">License Gaps Analysis</h4>
      <div className="h-96">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default LicenseGapChart;
