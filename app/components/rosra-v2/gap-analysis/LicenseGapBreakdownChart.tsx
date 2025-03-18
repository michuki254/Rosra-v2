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

interface LicenseGapBreakdownChartProps {
  registrationGap: number;
  complianceGap: number;
  assessmentGap: number;
  combinedGaps: number;
}

export const LicenseGapBreakdownChart = ({ 
  registrationGap,
  complianceGap,
  assessmentGap,
  combinedGaps
}: LicenseGapBreakdownChartProps) => {
  const { selectedCountry } = useCurrency();
  const currencySymbol = selectedCountry?.currency_symbol || 'L';

  const chartData = {
    labels: ['Gap Analysis'],
    datasets: [
      {
        label: 'Registration Gap',
        data: [registrationGap],
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
        borderWidth: 0,
        barPercentage: 0.8,
      },
      {
        label: 'Compliance Gap',
        data: [complianceGap],
        backgroundColor: '#F97316',
        borderColor: '#F97316',
        borderWidth: 0,
        barPercentage: 0.8,
      },
      {
        label: 'Assessment Gap',
        data: [assessmentGap],
        backgroundColor: '#6B7280',
        borderColor: '#6B7280',
        borderWidth: 0,
        barPercentage: 0.8,
      },
      {
        label: 'Combined Gaps',
        data: [combinedGaps],
        backgroundColor: '#EAB308',
        borderColor: '#EAB308',
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
        stacked: true,
        grid: {
          display: false
        }
      },
      y: {
        stacked: true,
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
        }
      }
    }
  };

  return (
    <div>
      <h4 className="text-sm font-medium text-blue-500 text-center mb-3">License Gap Breakdown Analysis</h4>
      <div className="h-96">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};
