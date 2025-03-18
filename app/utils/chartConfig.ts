import { ChartData, ChartOptions, LicenseMetrics, GapBreakdown } from '@/app/types/license';

const formatCurrency = (value: number, currencySymbol: string = 'KSh'): string => {
  return `${currencySymbol} ${new Intl.NumberFormat('en-US').format(Math.abs(Math.round(value)))}`;
};

export const baseChartOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
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
        label: (context: any) => formatCurrency(context.raw)
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
        callback: (value: any) => formatCurrency(value),
        font: {
          size: 12
        }
      },
      stacked: true,
      beginAtZero: true
    }
  }
};

export const getRevenueChartData = (metrics: LicenseMetrics): ChartData => ({
  labels: [''],
  datasets: [
    {
      label: 'Actual Revenue',
      data: [metrics.actual],
      backgroundColor: '#4F46E5',
      borderColor: '#4F46E5',
      borderWidth: 0
    },
    {
      label: 'Total Gap',
      data: [metrics.gap],
      backgroundColor: '#F97316',
      borderColor: '#F97316',
      borderWidth: 0
    }
  ]
});

export const getGapBreakdownChartData = (gapBreakdown: GapBreakdown): ChartData => ({
  labels: ['Gap Analysis'],
  datasets: [
    {
      label: 'Registration Gap',
      data: [gapBreakdown.registrationGap],
      backgroundColor: '#3B82F6',
      borderColor: '#3B82F6',
      borderWidth: 0
    },
    {
      label: 'Compliance Gap',
      data: [gapBreakdown.complianceGap],
      backgroundColor: '#F97316',
      borderColor: '#F97316',
      borderWidth: 0
    },
    {
      label: 'Assessment Gap',
      data: [gapBreakdown.assessmentGap],
      backgroundColor: '#6B7280',
      borderColor: '#6B7280',
      borderWidth: 0
    },
    {
      label: 'Rate Gap',
      data: [gapBreakdown.rateGap],
      backgroundColor: '#10B981',
      borderColor: '#10B981',
      borderWidth: 0
    },
    {
      label: 'Combined Gaps',
      data: [gapBreakdown.combinedGaps],
      backgroundColor: '#EAB308',
      borderColor: '#EAB308',
      borderWidth: 0
    }
  ]
});
