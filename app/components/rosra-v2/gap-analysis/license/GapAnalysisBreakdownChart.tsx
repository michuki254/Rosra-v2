'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
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

interface GapAnalysisBreakdownChartProps {
  registrationGap: number;
  complianceGap: number;
  assessmentGap: number;
  combinedGaps: number;
}

export const GapAnalysisBreakdownChart: React.FC<GapAnalysisBreakdownChartProps> = ({
  registrationGap,
  complianceGap,
  assessmentGap,
  combinedGaps,
}) => {
  const { selectedCountry } = useCurrency();
  const currencySymbol = selectedCountry?.currency_symbol || 'L';

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
        text: 'Gap Analysis Breakdown',
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
          label: (context: any) => {
            return `${context.dataset.label}: ${formatCurrency(context.raw, currencySymbol)}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        stacked: true,
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12
          }
        }
      },
      y: {
        stacked: true,
        grid: {
          color: '#f3f4f6',
          drawBorder: false
        },
        ticks: {
          callback: (value: any) => formatCurrency(value, currencySymbol),
          font: {
            size: 12
          }
        }
      },
    },
  };

  const data = {
    labels: ['Revenue Gaps'],
    datasets: [
      {
        label: 'Registration Gap',
        data: [registrationGap],
        backgroundColor: '#4F46E5',
        borderColor: '#4F46E5',
        borderWidth: 0,
        borderRadius: 4,
        barPercentage: 0.5,
      },
      {
        label: 'Compliance Gap',
        data: [complianceGap],
        backgroundColor: '#F97316',
        borderColor: '#F97316',
        borderWidth: 0,
        borderRadius: 4,
        barPercentage: 0.5,
      },
      {
        label: 'Assessment Gap',
        data: [assessmentGap],
        backgroundColor: '#10B981',
        borderColor: '#10B981',
        borderWidth: 0,
        borderRadius: 4,
        barPercentage: 0.5,
      },
      {
        label: 'Combined Gaps',
        data: [combinedGaps],
        backgroundColor: '#6366F1',
        borderColor: '#6366F1',
        borderWidth: 0,
        borderRadius: 4,
        barPercentage: 0.5,
      },
    ],
  };

  // Add console.log to help debug data issues
  console.log('Gap Analysis Chart Data:', {
    registrationGap,
    complianceGap,
    assessmentGap,
    combinedGaps
  });

  return (
    <div>
      <div className="h-[400px]">
        <Bar options={options} data={data} />
      </div>
    </div>
  );
};

export default GapAnalysisBreakdownChart;
