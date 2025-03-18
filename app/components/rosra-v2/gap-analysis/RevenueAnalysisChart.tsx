import { Bar } from 'react-chartjs-2';
import { DocumentTextIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { RevenueGapMessage } from './RevenueGapMessage';

interface RevenueAnalysisChartProps {
  actualRevenue: number;
  totalGapShortTermFees: number;
  totalPotentialRevenue: number;
  percentage: number;
  chartOptions: any;
  showFormulas: boolean;
  setShowFormulas: (show: boolean) => void;
  formatCurrency: (value: number) => string;
}

export const RevenueAnalysisChart: React.FC<RevenueAnalysisChartProps> = ({
  actualRevenue,
  totalGapShortTermFees,
  totalPotentialRevenue,
  percentage,
  chartOptions,
  showFormulas,
  setShowFormulas,
  formatCurrency,
}) => {
  // Log props for debugging
  console.log('RevenueAnalysisChart props:', {
    actualRevenue,
    totalGapShortTermFees,
    totalPotentialRevenue,
    percentage
  });

  return (
    <div>
      <h4 className="text-sm font-medium text-blue-500 text-center mb-6">Short-term User Charge Gap Analysis</h4>
      <div className="h-96">
        <Bar
          data={{
            labels: ['Revenue Breakdown'],
            datasets: [
              {
                label: 'Actual Revenue',
                data: [actualRevenue],
                backgroundColor: 'rgb(59, 130, 246)', // blue
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 0,
                stack: 'stack1',
              },
              {
                label: 'Revenue Gap',
                data: [totalGapShortTermFees],
                backgroundColor: 'rgb(249, 115, 22)', // orange
                borderColor: 'rgb(249, 115, 22)',
                borderWidth: 0,
                stack: 'stack1',
              }
            ],
          }}
          options={{
            ...chartOptions,
            scales: {
              x: {
                stacked: true,
                grid: {
                  display: false,
                },
              },
              y: {
                stacked: true,
                beginAtZero: true,
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)',
                },
                ticks: {
                  callback: (value) => formatCurrency(Number(value)),
                },
              },
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: (context) => {
                    return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
                  },
                },
              },
              legend: {
                position: 'bottom' as const,
                labels: {
                  padding: 20,
                  usePointStyle: true,
                  pointStyle: 'circle',
                },
              },
            },
          }}
        />
      </div>

      {/* Formulas Section */}
      <div className="mb-6 cursor-pointer">
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <DocumentTextIcon className="w-5 h-5 text-gray-500 mr-2" />
            <h3 className="text-sm font-medium text-gray-900">Short Term User Charge Revenue Analysis Formulas</h3>
          </div>
          <ChevronDownIcon
            className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
              showFormulas ? 'transform rotate-180' : ''
            }`}
            onClick={() => setShowFormulas(!showFormulas)}
          />
        </div>

        {showFormulas && (
          <div className="px-4 py-3 text-sm text-gray-600 border-t space-y-6">
            <div>
              <h5 className="font-semibold text-gray-900 mb-2">Actual Revenue</h5>
              <div className="pl-4 font-mono text-sm">
                = <span className="text-blue-600">Actual Daily Fees</span> × <span className="text-blue-600">Actual Rate</span> × 365
              </div>
            </div>

            <div>
              <h5 className="font-semibold text-gray-900 mb-2">Total Potential Revenue</h5>
              <div className="pl-4 font-mono text-sm">
                = <span className="text-emerald-600">Estimated Daily Fees</span> × <span className="text-emerald-600">Potential Rate</span> × 365
              </div>
            </div>

            <div>
              <h5 className="font-semibold text-gray-900 mb-2">Total Gap Short-term Fees</h5>
              <div className="pl-4 font-mono text-sm">
                = <span className="text-purple-600">Total Potential Revenue</span> - <span className="text-red-600">Actual Revenue</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Analysis Message */}
      <RevenueGapMessage
        percentage={percentage}
        actualRevenue={actualRevenue}
        totalPotentialRevenue={totalPotentialRevenue}
        formatCurrency={formatCurrency}
      />
    </div>
  );
};
