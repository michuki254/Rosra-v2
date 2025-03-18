'use client';

import React from 'react';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface LongTermGapAnalysisChartProps {
  complianceGap: number;
  rateGap: number;
  combinedGaps: number;
  actualRevenue: number;
  totalPotentialRevenue: number;
  totalGapLongTermFees: number;
  percentage: number;
  chartOptions: any;
  formatCurrency: (amount: number) => string;
}

const LongTermGapAnalysisChart: React.FC<LongTermGapAnalysisChartProps> = ({
  actualRevenue,
  complianceGap,
  rateGap,
  combinedGaps,
  chartOptions
}) => {
  const data = {
    labels: ['Revenue Breakdown'],
    datasets: [
      {
        label: 'Actual Revenue',
        data: [actualRevenue],
        backgroundColor: 'rgb(66, 133, 244)', // Google blue
        borderWidth: 0
      },
      {
        label: 'Compliance Gap',
        data: [Math.abs(complianceGap)],
        backgroundColor: 'rgb(52, 211, 153)', // emerald-400
        borderWidth: 0
      },
      {
        label: 'Rate Gap',
        data: [Math.abs(rateGap)],
        backgroundColor: 'rgb(167, 139, 250)', // violet-400
        borderWidth: 0
      },
      {
        label: 'Combined Gaps',
        data: [Math.abs(combinedGaps)],
        backgroundColor: 'rgb(251, 113, 133)', // rose-400
        borderWidth: 0
      }
    ]
  };

  const { selectedCountry } = useCurrency();
  const currencySymbol = selectedCountry?.currency_symbol || 'KSh';

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
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
        beginAtZero: true,
        border: {
          display: false
        },
        grid: {
          color: 'rgb(229, 231, 235)', // gray-200
          drawBorder: false
        },
        ticks: {
          font: {
            size: 12
          },
          callback: function(value) {
            if (typeof value === 'number') {
              return currencySymbol + ' ' + value.toLocaleString();
            }
            return value;
          }
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'Gap Analysis',
        font: {
          size: 14,
          weight: '500'
        },
        padding: {
          bottom: 15
        },
        color: 'rgb(59, 130, 246)' // blue-500
      },
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        titleFont: {
          size: 12
        },
        bodyFont: {
          size: 12
        },
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += currencySymbol + ' ' + context.parsed.y.toLocaleString();
            }
            return label;
          }
        }
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mt-6">
      <div className="h-[400px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default LongTermGapAnalysisChart;
